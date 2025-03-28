
import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

interface LineChartProps {
  data: Array<any>;
  xKey: string;
  yKeys: Array<{
    key: string;
    color: string;
    name: string;
  }>;
  title: string;
  className?: string;
  timePeriod?: string;
  onTimePeriodChange?: (period: string) => void;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKeys,
  title,
  className,
  timePeriod = "24h",
  onTimePeriodChange,
}) => {
  return (
    <div className={cn("venti-card p-4", className)}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-venti-gray-600 dark:text-venti-gray-300">
          {title}
        </h3>
        
        {onTimePeriodChange && (
          <div className="flex text-xs bg-venti-gray-100 dark:bg-venti-gray-800 rounded-lg overflow-hidden">
            <button 
              className={cn(
                "px-2 py-1 transition-colors",
                timePeriod === "24h" 
                  ? "bg-venti-green-500 text-white" 
                  : "hover:bg-venti-gray-200 dark:hover:bg-venti-gray-700"
              )}
              onClick={() => onTimePeriodChange("24h")}
            >
              24h
            </button>
            <button 
              className={cn(
                "px-2 py-1 transition-colors",
                timePeriod === "7d" 
                  ? "bg-venti-green-500 text-white" 
                  : "hover:bg-venti-gray-200 dark:hover:bg-venti-gray-700"
              )}
              onClick={() => onTimePeriodChange("7d")}
            >
              7d
            </button>
            <button 
              className={cn(
                "px-2 py-1 transition-colors",
                timePeriod === "30d" 
                  ? "bg-venti-green-500 text-white" 
                  : "hover:bg-venti-gray-200 dark:hover:bg-venti-gray-700"
              )}
              onClick={() => onTimePeriodChange("30d")}
            >
              30d
            </button>
          </div>
        )}
      </div>
      
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                fontSize: "12px",
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
              align="center"
              verticalAlign="bottom"
            />
            {yKeys.map((item) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.name}
                stroke={item.color}
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
                dot={{ r: 0 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
