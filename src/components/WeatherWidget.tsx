
import React from "react";
import { CloudSun, CloudRain, Sun, Cloud, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeatherData } from "@/utils/api";

interface WeatherWidgetProps {
  data: WeatherData;
  className?: string;
}

const weatherIcons: Record<string, React.ReactNode> = {
  "Sunny": <Sun className="text-amber-500" size={28} />,
  "Partly Cloudy": <CloudSun className="text-amber-400" size={28} />,
  "Cloudy": <Cloud className="text-venti-gray-400" size={28} />,
  "Rainy": <CloudRain className="text-blue-500" size={28} />,
  "Snowy": <Snowflake className="text-blue-300" size={28} />,
};

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data, className }) => {
  return (
    <div className={cn("venti-card p-4", className)}>
      <h3 className="text-sm font-medium text-venti-gray-600 dark:text-venti-gray-300 mb-3">
        Weather Forecast
      </h3>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {weatherIcons[data.condition] || <CloudSun className="text-amber-400" size={36} />}
          <div className="ml-3">
            <span className="text-2xl font-semibold">{data.temperature}°C</span>
            <p className="text-xs text-venti-gray-500 dark:text-venti-gray-400">{data.condition}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-venti-gray-500 dark:text-venti-gray-400">Humidity: {data.humidity}%</div>
          <div className="text-xs text-venti-gray-500 dark:text-venti-gray-400">Wind: {data.windSpeed} km/h</div>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-1">
        {data.forecast.map((day, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center p-2 rounded-lg bg-venti-gray-50 dark:bg-venti-gray-800/50"
          >
            <span className="text-xs font-medium mb-1">{day.day}</span>
            {weatherIcons[day.condition] || <CloudSun className="text-amber-400" size={20} />}
            <div className="flex items-center text-xs mt-1">
              <span className="font-medium">{day.high}°</span>
              <span className="text-venti-gray-400 mx-1">/</span>
              <span className="text-venti-gray-500">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
