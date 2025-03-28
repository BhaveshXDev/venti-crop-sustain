
import React, { useState } from "react";
import { Fan } from "lucide-react";
import { cn } from "@/lib/utils";
import { setFanSpeed } from "@/utils/api";
import { toast } from "sonner";

interface FanControlProps {
  className?: string;
}

const FanControl: React.FC<FanControlProps> = ({ className }) => {
  const [speed, setSpeed] = useState(50);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseInt(e.target.value));
  };

  const handleTurnOn = async () => {
    setSpeed(100);
    setIsUpdating(true);
    try {
      await setFanSpeed(100);
      toast.success("Fan turned ON");
    } catch (error) {
      toast.error("Failed to turn fan on");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTurnOff = async () => {
    setSpeed(0);
    setIsUpdating(true);
    try {
      await setFanSpeed(0);
      toast.success("Fan turned OFF");
    } catch (error) {
      toast.error("Failed to turn fan off");
    } finally {
      setIsUpdating(false);
    }
  };

  // Fan animation speed based on current setting
  const animationDuration = speed === 0 ? 0 : 3 / (speed / 25);

  return (
    <div className={cn("venti-card p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-venti-gray-600 dark:text-venti-gray-300">
          Fan Control
        </h3>
        <div 
          className={cn(
            "p-2 rounded-full bg-venti-gray-100 dark:bg-venti-gray-800 transition-all",
            speed > 0 ? "text-venti-green-500" : "text-venti-gray-400"
          )}
          style={{ animation: speed > 0 ? `spin ${animationDuration}s linear infinite` : 'none' }}
        >
          <Fan size={24} />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-venti-gray-500 dark:text-venti-gray-400">Fan Speed</span>
            <span className="text-xs font-medium">{speed}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={speed}
            onChange={handleSpeedChange}
            className="w-full h-2 bg-venti-gray-100 dark:bg-venti-gray-700 rounded-lg appearance-none cursor-pointer accent-venti-green-500"
          />
        </div>
        
        <div className="flex justify-between gap-2">
          <button
            onClick={handleTurnOff}
            className={cn(
              "venti-button-outline py-2 text-sm flex-1",
              speed === 0 ? "bg-venti-gray-200 dark:bg-venti-gray-700" : ""
            )}
            disabled={isUpdating}
          >
            OFF
          </button>
          <button
            onClick={handleTurnOn}
            className={cn(
              "venti-button-primary py-2 text-sm flex-1",
              speed > 0 ? "bg-venti-green-600" : ""
            )}
            disabled={isUpdating}
          >
            ON
          </button>
        </div>
      </div>
    </div>
  );
};

export default FanControl;
