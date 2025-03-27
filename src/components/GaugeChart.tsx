
import React from "react";
import { cn } from "@/lib/utils";

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  title: string;
  unit: string;
  thresholds?: {
    warning: number;
    critical: number;
  };
  className?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min,
  max,
  title,
  unit,
  thresholds = { warning: 70, critical: 90 },
  className,
}) => {
  // Normalize value to percentage
  const percentage = ((value - min) / (max - min)) * 100;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  // Calculate color based on thresholds
  const getColor = () => {
    if (percentage >= thresholds.critical) return "text-rose-500";
    if (percentage >= thresholds.warning) return "text-amber-500";
    return "text-venti-green-500";
  };

  // Calculate rotation for gauge needle
  const rotation = (clampedPercentage / 100) * 180 - 90;

  return (
    <div className={cn("venti-card p-4 flex flex-col items-center", className)}>
      <h3 className="text-sm font-medium text-venti-gray-600 dark:text-venti-gray-300 mb-2">
        {title}
      </h3>
      
      <div className="relative w-full aspect-[2/1] mt-2">
        {/* Gauge background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full bg-venti-gray-100 dark:bg-venti-gray-800 rounded-t-full"></div>
        </div>
        
        {/* Gauge segments */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-venti-green-500 via-amber-500 to-rose-500 rounded-t-full opacity-20"></div>
        </div>
        
        {/* Gauge needle */}
        <div 
          className="absolute left-1/2 bottom-0 w-1 h-[calc(100%-10px)] bg-venti-gray-800 dark:bg-white origin-bottom rounded-t-full transition-transform duration-700"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        ></div>
        
        {/* Center point */}
        <div className="absolute left-1/2 bottom-0 w-4 h-4 rounded-full bg-venti-gray-800 dark:bg-white transform -translate-x-1/2 translate-y-1/2"></div>
        
        {/* Value display */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className={cn("text-2xl font-semibold", getColor())}>{value}</span>
          <span className="text-xs text-venti-gray-500 dark:text-venti-gray-400">{unit}</span>
        </div>
      </div>
      
      {/* Min/Max labels */}
      <div className="w-full flex justify-between mt-2 text-xs text-venti-gray-500 dark:text-venti-gray-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

export default GaugeChart;
