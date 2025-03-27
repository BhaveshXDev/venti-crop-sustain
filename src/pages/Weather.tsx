
import React, { useState, useEffect } from "react";
import { ThermometerSun, Droplets, Wind, CloudRain } from "lucide-react";
import { fetchWeatherData, WeatherData } from "@/utils/api";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <ThermometerSun size={24} className="text-amber-500" />;
      case "rainy":
        return <CloudRain size={24} className="text-blue-500" />;
      case "cloudy":
      case "partly cloudy":
        return <CloudRain size={24} className="text-gray-500" opacity={0.7} />;
      default:
        return <ThermometerSun size={24} className="text-amber-500" />;
    }
  };

  if (loading) {
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
      <h1 className="text-2xl font-semibold mb-6 text-center">Weather Forecast</h1>
      
      {weather && (
        <>
          {/* Current Weather Card */}
          <div className="venti-glass dark:venti-glass-dark rounded-2xl p-6 shadow-sm mb-6 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-blue-900/20 dark:to-sky-900/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Current Weather</h2>
              <div className="flex items-center">
                {getWeatherIcon(weather.condition)}
                <span className="ml-2">{weather.condition}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <ThermometerSun size={20} className="mr-2 text-amber-500" />
                <div>
                  <p className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Temperature</p>
                  <p className="font-medium">{weather.temperature}°C</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Droplets size={20} className="mr-2 text-blue-500" />
                <div>
                  <p className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Humidity</p>
                  <p className="font-medium">{weather.humidity}%</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Wind size={20} className="mr-2 text-venti-gray-500" />
                <div>
                  <p className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Wind Speed</p>
                  <p className="font-medium">{weather.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 5-Day Forecast */}
          <div className="venti-card p-5">
            <h2 className="text-lg font-medium mb-4">5-Day Forecast</h2>
            
            <div className="space-y-4">
              {weather.forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-white/5">
                  <div className="font-medium">{day.day}</div>
                  <div className="flex items-center">
                    {getWeatherIcon(day.condition)}
                    <span className="mx-2 text-sm">{day.condition}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-amber-600 dark:text-amber-400">{day.high}°</span>
                    <span className="mx-1">/</span>
                    <span className="text-blue-600 dark:text-blue-400">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      <Navigation />
    </div>
  );
};

export default Weather;
