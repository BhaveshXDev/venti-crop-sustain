
import React, { useState, useEffect } from "react";
import { ThermometerSun, Droplets, Wind, CloudRain, Cloud, Sun, Snowflake, ArrowUpRight } from "lucide-react";
import { fetchWeatherData, WeatherData } from "@/utils/api";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        setLoading(true);
        const data = await fetchWeatherData();
        setWeather(data);
      } catch (error) {
        toast.error("Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();

    // Refresh weather data every 30 minutes
    const intervalId = setInterval(getWeatherData, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const getWeatherIcon = (condition: string, size: number = 24) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun size={size} className="text-amber-500" />;
      case "partly cloudy":
        return <CloudRain size={size} className="text-amber-400" opacity={0.7} />;
      case "cloudy":
        return <Cloud size={size} className="text-gray-500" />;
      case "rainy":
        return <CloudRain size={size} className="text-blue-500" />;
      case "snowy":
        return <Snowflake size={size} className="text-blue-300" />;
      default:
        return <ThermometerSun size={size} className="text-amber-500" />;
    }
  };

  const refreshWeather = async () => {
    toast.info("Refreshing weather data...");
    try {
      setLoading(true);
      const data = await fetchWeatherData();
      setWeather(data);
      toast.success("Weather data updated");
    } catch (error) {
      toast.error("Failed to refresh weather data");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-950 dark:to-venti-green-950/40 p-4 pt-6 pb-24">
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="animate-pulse text-venti-green-600">Loading weather data...</div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-950 dark:to-venti-green-950/40 p-4 pt-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Weather Forecast</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshWeather}
          disabled={loading}
          className="flex items-center gap-1"
        >
          {loading ? (
            <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-current rounded-full mr-1"></span>
          ) : (
            <ArrowUpRight size={16} />
          )}
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Weather</TabsTrigger>
          <TabsTrigger value="forecast">5-Day Forecast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="mt-4">
          {weather && (
            <div className="venti-glass dark:venti-glass-dark rounded-2xl p-6 shadow-sm bg-gradient-to-br from-sky-50 to-blue-50 dark:from-blue-900/20 dark:to-sky-900/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Current Weather</h2>
                <div className="flex items-center">
                  {getWeatherIcon(weather.condition, 32)}
                  <span className="ml-2 text-lg">{weather.condition}</span>
                </div>
              </div>
              
              <div className="flex justify-center mb-6">
                <div className="text-6xl font-bold text-center">
                  {weather.temperature}°C
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-white/40 dark:bg-white/5 rounded-xl">
                  <ThermometerSun size={24} className="text-amber-500 mb-2" />
                  <div className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Temperature</div>
                  <div className="font-medium">{weather.temperature}°C</div>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white/40 dark:bg-white/5 rounded-xl">
                  <Droplets size={24} className="text-blue-500 mb-2" />
                  <div className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Humidity</div>
                  <div className="font-medium">{weather.humidity}%</div>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white/40 dark:bg-white/5 rounded-xl">
                  <Wind size={24} className="text-venti-gray-500 mb-2" />
                  <div className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Wind</div>
                  <div className="font-medium">{weather.windSpeed} km/h</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/20 dark:border-white/10">
                <div className="text-sm text-venti-gray-600 dark:text-venti-gray-400">
                  Weather data last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="forecast" className="mt-4">
          {weather && (
            <div className="venti-card p-5">
              <h2 className="text-lg font-medium mb-4">5-Day Forecast</h2>
              
              <div className="space-y-4">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-white/5">
                    <div className="font-medium w-24">{day.day}</div>
                    <div className="flex items-center flex-1 justify-center">
                      {getWeatherIcon(day.condition)}
                      <span className="ml-2 text-sm">{day.condition}</span>
                    </div>
                    <div className="text-sm w-24 text-right">
                      <span className="text-amber-600 dark:text-amber-400 font-medium">{day.high}°</span>
                      <span className="mx-1">/</span>
                      <span className="text-blue-600 dark:text-blue-400">{day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-sm text-center text-venti-gray-500 dark:text-venti-gray-400">
                Swipe forecast cards to see more details
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Navigation />
    </div>
  );
};

export default Weather;
