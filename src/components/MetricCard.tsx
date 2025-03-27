
import React from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  icon: React.ReactNode;
  status?: "normal" | "warning" | "critical";
  description?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  status = "normal",
  description,
  className,
}) => {
  const statusColors = {
    normal: "text-venti-green-500 bg-venti-green-50 dark:bg-venti-green-900/20",
    warning: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
    critical: "text-rose-500 bg-rose-50 dark:bg-rose-900/20",
  };

  return (
    <div className={cn("venti-card p-5", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-venti-gray-600 dark:text-venti-gray-300">
          {title}
        </h3>
        <div
          className={cn(
            "rounded-full p-2",
            statusColors[status]
          )}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-end">
        <span className="text-3xl font-semibold mr-1">{value}</span>
        <span className="text-venti-gray-500 dark:text-venti-gray-400 text-sm mb-1">
          {unit}
        </span>
      </div>
      {description && (
        <p className="text-xs text-venti-gray-500 dark:text-venti-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
