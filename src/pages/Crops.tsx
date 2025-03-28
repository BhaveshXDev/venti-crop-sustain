
import React, { useState } from "react";
import { Calendar, CalendarCheckIcon, CalendarIcon, ArrowRight, Calendar as CalendarIcon2, Apple } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface CropInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  image: string;
  color: string;
  sowingTime: string;
  harvestTime: string;
  description: string;
  calendar: {
    sowing: Date[];
    growing: Date[];
    harvesting: Date[];
  };
}

const Crops = () => {
  const [selectedCrop, setSelectedCrop] = useState<CropInfo | null>(null);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const cropList: CropInfo[] = [
    {
      id: "tomatoes",
      name: "Tomatoes",
      icon: <div className="w-4 h-4 bg-red-500 rounded-full"></div>,
      image: "https://images.unsplash.com/photo-1592924357229-fee9be4d732a?q=80&w=500&auto=format&fit=crop",
      color: "bg-red-500",
      sowingTime: "March - April",
      harvestTime: "July - September",
      description: "Tomatoes are a warm-season crop that prefer full sun and well-drained, fertile soil. They should be planted after all danger of frost has passed.",
      calendar: {
        sowing: [new Date(2025, 2, 15), new Date(2025, 3, 15)], // March 15 - April 15
        growing: [new Date(2025, 3, 16), new Date(2025, 6, 14)], // April 16 - July 14
        harvesting: [new Date(2025, 6, 15), new Date(2025, 8, 30)], // July 15 - September 30
      }
    },
    {
      id: "cucumbers",
      name: "Cucumbers",
      icon: <div className="w-4 h-4 bg-green-500 rounded-full"></div>,
      image: "https://images.unsplash.com/photo-1558560629-b4cb5372d2a6?q=80&w=500&auto=format&fit=crop",
      color: "bg-green-500",
      sowingTime: "April - May",
      harvestTime: "June - August",
      description: "Cucumbers are warm-season vegetables that thrive in temperatures between 65-75°F. They require consistent moisture and benefit from trellising.",
      calendar: {
        sowing: [new Date(2025, 3, 1), new Date(2025, 4, 15)], // April 1 - May 15
        growing: [new Date(2025, 4, 16), new Date(2025, 5, 14)], // May 16 - June 14
        harvesting: [new Date(2025, 5, 15), new Date(2025, 7, 31)], // June 15 - August 31
      }
    },
    {
      id: "peppers",
      name: "Peppers",
      icon: <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>,
      image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=500&auto=format&fit=crop",
      color: "bg-yellow-500",
      sowingTime: "February - March",
      harvestTime: "July - October",
      description: "Peppers prefer warm conditions and should be started indoors 8-10 weeks before the last frost date. They require well-drained soil rich in organic matter.",
      calendar: {
        sowing: [new Date(2025, 1, 1), new Date(2025, 2, 31)], // February 1 - March 31
        growing: [new Date(2025, 3, 1), new Date(2025, 6, 14)], // April 1 - July 14
        harvesting: [new Date(2025, 6, 15), new Date(2025, 9, 31)], // July 15 - October 31
      }
    },
    {
      id: "strawberries",
      name: "Strawberries",
      icon: <Apple size={16} className="text-red-500" />,
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=500&auto=format&fit=crop",
      color: "bg-red-400",
      sowingTime: "April - May",
      harvestTime: "June - July",
      description: "Strawberries prefer full sun and fertile, well-drained soil. They should be planted in early spring as soon as the ground can be worked.",
      calendar: {
        sowing: [new Date(2025, 3, 1), new Date(2025, 4, 15)], // April 1 - May 15
        growing: [new Date(2025, 4, 16), new Date(2025, 5, 14)], // May 16 - June 14
        harvesting: [new Date(2025, 5, 15), new Date(2025, 6, 31)], // June 15 - July 31
      }
    }
  ];

  const isDateInRange = (date: Date, start: Date, end: Date) => {
    return date >= start && date <= end;
  };

  const getDateStatus = (date: Date) => {
    if (!selectedCrop) return null;
    
    const { sowing, growing, harvesting } = selectedCrop.calendar;
    
    if (isDateInRange(date, sowing[0], sowing[1])) {
      return "sowing";
    }
    if (isDateInRange(date, growing[0], growing[1])) {
      return "growing";
    }
    if (isDateInRange(date, harvesting[0], harvesting[1])) {
      return "harvesting";
    }
    
    return null;
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "sowing":
        return "bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "growing":
        return "bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "harvesting":
        return "bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-950 dark:to-venti-green-950/40 p-4 pt-6 pb-24">
      <h1 className="text-2xl font-semibold mb-6 text-center">Crops Management</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {cropList.map((crop) => (
          <div
            key={crop.id}
            className={`venti-glass dark:venti-glass-dark rounded-xl p-4 flex items-center cursor-pointer transition-all ${
              selectedCrop?.id === crop.id
                ? "ring-2 ring-venti-green-500 bg-venti-green-50/50 dark:bg-venti-green-900/20"
                : "hover:bg-white/60 dark:hover:bg-white/5"
            }`}
            onClick={() => setSelectedCrop(crop)}
          >
            <Avatar className="h-12 w-12 mr-3">
              <AvatarImage src={crop.image} alt={crop.name} />
              <AvatarFallback className={`${crop.color} text-white`}>
                {crop.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{crop.name}</h3>
              <div className="flex items-center text-xs text-venti-gray-500 dark:text-venti-gray-400">
                <CalendarIcon size={12} className="mr-1" />
                {crop.harvestTime}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCrop && (
        <div className="venti-glass dark:venti-glass-dark rounded-2xl p-5 mb-6">
          <div className="flex items-center mb-4">
            <Avatar className="h-14 w-14 mr-4">
              <AvatarImage src={selectedCrop.image} alt={selectedCrop.name} />
              <AvatarFallback className={`${selectedCrop.color} text-white`}>
                {selectedCrop.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{selectedCrop.name}</h2>
              <div className="flex space-x-4 text-sm text-venti-gray-600 dark:text-venti-gray-400">
                <div className="flex items-center">
                  <CalendarCheckIcon size={14} className="mr-1 text-blue-500" />
                  <span>Sow: {selectedCrop.sowingTime}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1 text-amber-500" />
                  <span>Harvest: {selectedCrop.harvestTime}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-venti-gray-600 dark:text-venti-gray-400 mb-4">
            {selectedCrop.description}
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
          
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">2025 Calendar</h3>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-8 px-3 text-xs"
                >
                  <CalendarIcon2 className="mr-2 h-3 w-3" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setCalendarOpen(false);
                  }}
                  initialFocus
                  modifiers={{
                    sowing: selectedCrop.calendar.sowing,
                    growing: selectedCrop.calendar.growing,
                    harvesting: selectedCrop.calendar.harvesting,
                  }}
                  modifiersClassNames={{
                    sowing: "bg-blue-100 text-blue-800",
                    growing: "bg-green-100 text-green-800",
                    harvesting: "bg-amber-100 text-amber-800",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {date && (
            <div className={`p-3 rounded-lg text-sm mb-2 ${getStatusColor(getDateStatus(date))}`}>
              <div className="font-medium">{format(date, "MMMM d, yyyy")}</div>
              <div>
                {getDateStatus(date) 
                  ? `Status: ${getDateStatus(date)?.charAt(0).toUpperCase()}${getDateStatus(date)?.slice(1)}` 
                  : "No scheduled activities for this date"}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-2 rounded">
              <div className="font-medium">Sowing</div>
              <div>{selectedCrop.sowingTime}</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-2 rounded">
              <div className="font-medium">Growing</div>
              <div>{format(selectedCrop.calendar.growing[0], "MMM d")} - {format(selectedCrop.calendar.growing[1], "MMM d")}</div>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 p-2 rounded">
              <div className="font-medium">Harvesting</div>
              <div>{selectedCrop.harvestTime}</div>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default Crops;
