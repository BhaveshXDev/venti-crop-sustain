
import React from "react";
import { CalendarCheckIcon, Calendar, Thermometer, Droplets } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CropInfo, getStageColor, getDateStatus } from "@/utils/cropData";
import { format } from "date-fns";

interface CropDetailsProps {
  crop: CropInfo;
  selectedDate: Date | undefined;
}

const CropDetails: React.FC<CropDetailsProps> = ({ crop, selectedDate }) => {
  return (
    <div className="venti-glass dark:venti-glass-dark rounded-2xl p-5 mb-6">
      <div className="flex items-center mb-4">
        <Avatar className="h-14 w-14 mr-4">
          <AvatarImage src={crop.image} alt={crop.name} />
          <AvatarFallback className={`${crop.color} text-white`}>
            {crop.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{crop.name}</h2>
          <div className="flex space-x-4 text-sm text-venti-gray-600 dark:text-venti-gray-400">
            <div className="flex items-center">
              <CalendarCheckIcon size={14} className="mr-1 text-blue-500" />
              <span>Sow: {crop.sowingTime}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1 text-amber-500" />
              <span>Harvest: {crop.harvestTime}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-venti-gray-600 dark:text-venti-gray-400 mb-4">
        {crop.description}
      </p>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Growing Calendar</h3>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-400 dark:bg-blue-500 mr-1"></div>
            <span>Sowing</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500 mr-1"></div>
            <span>Growing</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500 mr-1"></div>
            <span>Harvesting</span>
          </div>
        </div>
      </div>
      
      {selectedDate && (
        <div className={`p-3 rounded-lg text-sm mb-2 ${getStageColor(getDateStatus(selectedDate, crop))}`}>
          <div className="font-medium">{format(selectedDate, "MMMM d, yyyy")}</div>
          <div>
            {getDateStatus(selectedDate, crop) 
              ? `Status: ${getDateStatus(selectedDate, crop)?.charAt(0).toUpperCase()}${getDateStatus(selectedDate, crop)?.slice(1)}` 
              : "No scheduled activities for this date"}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 text-xs text-center mb-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-2 rounded">
          <div className="font-medium">Sowing</div>
          <div>{crop.sowingTime}</div>
        </div>
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-2 rounded">
          <div className="font-medium">Growing</div>
          <div>{format(crop.calendar.growing[0], "MMM d")} - {format(crop.calendar.growing[1], "MMM d")}</div>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 p-2 rounded">
          <div className="font-medium">Harvesting</div>
          <div>{crop.harvestTime}</div>
        </div>
      </div>
      
      {/* Additional crop requirements */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Care Requirements</h3>
        
        <div className="flex items-start gap-2 text-sm">
          <Droplets size={18} className="text-blue-500 mt-0.5" />
          <div>
            <p className="font-medium">Watering Schedule</p>
            <p className="text-venti-gray-600 dark:text-venti-gray-400">{crop.wateringSchedule}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2 text-sm">
          <div className="w-4.5 h-4.5 bg-green-500 rounded-full mt-0.5"></div>
          <div>
            <p className="font-medium">Fertilizer Requirements</p>
            <p className="text-venti-gray-600 dark:text-venti-gray-400">{crop.fertilizerRequirements}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2 text-sm">
          <Thermometer size={18} className="text-red-500 mt-0.5" />
          <div>
            <p className="font-medium">Ideal Climate</p>
            <p className="text-venti-gray-600 dark:text-venti-gray-400">
              Temperature: {crop.idealTemperature} | Humidity: {crop.idealHumidity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetails;
