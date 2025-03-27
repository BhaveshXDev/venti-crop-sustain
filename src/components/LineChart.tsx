
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
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKeys,
  title,
  className,
}) => {
  return (
    <div className={cn("venti-card p-4", className)}>
      <h3 className="text-sm font-medium text-venti-gray-600 dark:text-venti-gray-300 mb-3">
        {title}
      </h3>
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
