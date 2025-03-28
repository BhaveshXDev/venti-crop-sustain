
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Thermometer, Droplets, Wind, Bell, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import MetricCard from "@/components/MetricCard";
import FanControl from "@/components/FanControl";
import LineChart from "@/components/LineChart";
import WeatherWidget from "@/components/WeatherWidget";
import { 
  fetchCurrentSensorData, 
  fetchHistoricalSensorData, 
  fetchWeatherData, 
  SensorData, 
  WeatherData,
  fetchHistoricalSensorDataDaily,
  fetchHistoricalSensorDataMonthly 
} from "@/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<string>("24h");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [current, weather] = await Promise.all([
          fetchCurrentSensorData(),
          fetchWeatherData(),
        ]);
        setCurrentData(current);
        setWeatherData(weather);
        
        // Fetch historical data based on selected time period
        await fetchHistoricalDataByPeriod(timePeriod);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling for current sensor data
    const intervalId = setInterval(async () => {
      const data = await fetchCurrentSensorData();
      setCurrentData(data);
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [user, navigate, timePeriod]);

  const fetchHistoricalDataByPeriod = async (period: string) => {
    try {
      let data;
      switch (period) {
        case "24h":
          data = await fetchHistoricalSensorData();
          break;
        case "7d":
          data = await fetchHistoricalSensorDataDaily();
          break;
        case "30d":
          data = await fetchHistoricalSensorDataMonthly();
          break;
        default:
          data = await fetchHistoricalSensorData();
      }
      setHistoricalData(data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
  };

  // Transform historical data for the chart
  const chartData = historicalData.map((item) => {
    const date = new Date(item.timestamp);
    const format = (date: Date) => {
      if (timePeriod === "24h") {
        const hour = date.getHours();
        const minute = date.getMinutes();
        return `${hour}:${minute < 10 ? '0' + minute : minute}`;
      } else if (timePeriod === "7d") {
        return date.toLocaleDateString(undefined, { weekday: 'short' });
      } else {
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
    };
    
    return {
      timestamp: format(date),
      temperature: item.temperature,
      humidity: item.humidity,
      co2: item.co2 / 10, // Scale down CO2 to fit better with other metrics
    };
  });

  // Get status for metrics
  const getTemperatureStatus = (value: number) => {
    if (value < 15 || value > 30) return "critical";
    if (value < 18 || value > 28) return "warning";
    return "normal";
  };

  const getHumidityStatus = (value: number) => {
    if (value < 40 || value > 80) return "critical";
    if (value < 50 || value > 70) return "warning";
    return "normal";
  };

  const getCO2Status = (value: number) => {
    if (value > 1000) return "critical";
    if (value > 800) return "warning";
    return "normal";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-950 dark:to-venti-green-950/40 pb-20">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="w-10 h-10 mr-3">
              {user?.profileImage ? (
                <AvatarImage src={user.profileImage} alt={user.name || "User"} />
              ) : (
                <AvatarFallback className="bg-venti-green-100 dark:bg-venti-green-900/50 text-venti-green-600 dark:text-venti-green-400">
                  <User size={20} />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <p className="text-sm text-venti-gray-600 dark:text-venti-gray-400">
                Welcome back, {user?.name || "User"}
              </p>
            </div>
          </div>
          <div className="relative">
            <button 
              className="venti-button-ghost relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-venti-green-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-venti-gray-800 shadow-lg rounded-xl p-3 z-10 border border-venti-gray-200 dark:border-venti-gray-700">
                <h3 className="font-medium text-sm mb-2">Notifications</h3>
                <div className="text-xs text-venti-gray-600 dark:text-venti-gray-400 p-2 text-center">
                  No new notifications
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="p-4 space-y-5">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-venti-green-500"></div>
          </div>
        ) : (
          <>
            {/* Current metrics */}
            <div className="grid grid-cols-2 gap-3">
              {currentData && (
                <>
                  <MetricCard
                    title="Temperature"
                    value={currentData.temperature.toFixed(1)}
                    unit="°C"
                    icon={<Thermometer size={18} />}
                    status={getTemperatureStatus(currentData.temperature)}
                    description="Optimal range: 18-28°C"
                  />
                  <MetricCard
                    title="Humidity"
                    value={currentData.humidity.toFixed(0)}
                    unit="%"
                    icon={<Droplets size={18} />}
                    status={getHumidityStatus(currentData.humidity)}
                    description="Optimal range: 50-70%"
                  />
                </>
              )}
            </div>

            {/* CO2 and fan control section */}
            <div className="grid grid-cols-2 gap-3">
              {currentData && (
                <MetricCard
                  title="CO2 Level"
                  value={currentData.co2.toFixed(0)}
                  unit="ppm"
                  icon={<Wind size={18} />}
                  status={getCO2Status(currentData.co2)}
                  description="Optimal range: <800 ppm"
                />
              )}
              <FanControl />
            </div>

            {/* Historical data chart */}
            {chartData.length > 0 && (
              <LineChart
                data={timePeriod === "24h" ? chartData.slice(-12) : chartData} // Show all data for longer periods
                xKey="timestamp"
                yKeys={[
                  { key: "temperature", color: "#ef4444", name: "Temp (°C)" },
                  { key: "humidity", color: "#3b82f6", name: "Humidity (%)" },
                  { key: "co2", color: "#10b981", name: "CO2 (x10 ppm)" },
                ]}
                title="Historical Data"
                timePeriod={timePeriod}
                onTimePeriodChange={handleTimePeriodChange}
              />
            )}

            {/* Weather widget */}
            {weatherData && <WeatherWidget data={weatherData} />}

            {/* Quick links */}
            <div className="space-y-2 mt-6">
              <h3 className="text-sm font-medium text-venti-gray-600 dark:text-venti-gray-300 px-1">
                Quick Actions
              </h3>
              <div className="venti-card overflow-hidden">
                <button
                  onClick={() => navigate("/control")}
                  className="flex items-center justify-between w-full p-4 hover:bg-venti-gray-50 dark:hover:bg-venti-gray-800/30 transition-colors border-b border-border/50"
                >
                  <span className="font-medium">Control Panel</span>
                  <ChevronRight size={18} className="text-venti-gray-400" />
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center justify-between w-full p-4 hover:bg-venti-gray-50 dark:hover:bg-venti-gray-800/30 transition-colors"
                >
                  <span className="font-medium">Settings</span>
                  <ChevronRight size={18} className="text-venti-gray-400" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Navigation />
      
      <footer className="py-3 px-4 text-center text-xs text-venti-gray-500 dark:text-venti-gray-400 fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-venti-gray-900/80 backdrop-blur-sm z-10 border-t border-venti-gray-100 dark:border-venti-gray-800">
        <p>© {new Date().getFullYear()} VentriGrow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
