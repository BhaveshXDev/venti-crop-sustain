
import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CropInfo } from "@/utils/cropData";

interface CropDatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedCrop: CropInfo | null;
}

const CropDatePicker: React.FC<CropDatePickerProps> = ({
  date,
  setDate,
  open,
  setOpen,
  selectedCrop
}) => {
  // Predefined important dates for the calendar (manual selection)
  const [manualDates] = useState({
    "2025-01-15": "Sowing prep",
    "2025-02-01": "Early sowing",
    "2025-03-15": "Main sowing season",
    "2025-04-01": "Late sowing",
    "2025-05-01": "Growing season start",
    "2025-06-15": "First harvest (early crops)",
    "2025-07-15": "Peak harvest season",
    "2025-08-01": "Late season care",
    "2025-09-15": "End of harvest",
    "2025-10-01": "Winter prep"
  });

  // Function to manually highlight specific dates
  const getDayClass = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    
    if (manualDates[dateStr]) {
      return "bg-venti-green-100 font-bold text-venti-green-800 dark:bg-venti-green-900/30 dark:text-venti-green-300";
    }
    
    if (selectedCrop) {
      const { sowing, growing, harvesting } = selectedCrop.calendar;
      
      if (day >= sowing[0] && day <= sowing[1]) {
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      }
      if (day >= growing[0] && day <= growing[1]) {
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      }
      if (day >= harvesting[0] && day <= harvesting[1]) {
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      }
    }
    
    return "";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="h-8 px-3 text-xs"
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            setOpen(false);
          }}
          initialFocus
          className="p-3 pointer-events-auto"
          modifiersClassNames={{
            selected: "bg-venti-green-500 text-white",
            today: "bg-venti-gray-100 text-venti-gray-900 dark:bg-venti-gray-800 dark:text-white"
          }}
          components={{
            DayContent: (props) => {
              // Fix: Access the date from props correctly
              const date = props.date;
              const customClass = getDayClass(date);
              return (
                <div className={customClass ? customClass : undefined}>
                  {format(date, "d")}
                </div>
              );
            }
          }}
        />
        
        {/* Calendar key for manual dates */}
        <div className="p-3 border-t text-xs">
          <h4 className="font-medium mb-1">Calendar Key:</h4>
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
              <span>Sowing</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
              <span>Growing</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-400 mr-1"></div>
              <span>Harvesting</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-venti-green-400 mr-1"></div>
              <span>Important dates</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CropDatePicker;
