
import React from "react";
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
          modifiers={selectedCrop ? {
            sowing: selectedCrop.calendar.sowing,
            growing: selectedCrop.calendar.growing,
            harvesting: selectedCrop.calendar.harvesting,
          } : undefined}
          modifiersClassNames={{
            sowing: "bg-blue-100 text-blue-800",
            growing: "bg-green-100 text-green-800",
            harvesting: "bg-amber-100 text-amber-800",
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CropDatePicker;
