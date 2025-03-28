
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { CropInfo, getCropList } from "@/utils/cropData";
import CropCard from "@/components/CropCard";
import CropDetails from "@/components/CropDetails";
import CropDatePicker from "@/components/CropDatePicker";
import { Plus } from "lucide-react";
import Footer from "@/components/Footer";

const Crops = () => {
  const [selectedCrop, setSelectedCrop] = useState<CropInfo | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showAddCrop, setShowAddCrop] = useState(false);

  const cropList = getCropList();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-950 dark:to-venti-green-950/40 p-4 pt-6 pb-24 flex flex-col">
      <h1 className="text-2xl font-semibold mb-6 text-center">Crops Management</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {cropList.map((crop) => (
          <CropCard
            key={crop.id}
            crop={crop}
            isSelected={selectedCrop?.id === crop.id}
            onClick={() => setSelectedCrop(crop)}
          />
        ))}
        
        <Button
          variant="outline"
          className="flex items-center justify-center p-4 h-auto border-dashed border-2 hover:border-venti-green-500 hover:bg-venti-green-50/30 dark:hover:bg-venti-green-900/20 transition-all"
          onClick={() => setShowAddCrop(true)}
        >
          <Plus size={16} className="mr-2" />
          <span>Add Crop</span>
        </Button>
      </div>

      {selectedCrop && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">2025 Calendar</h3>
            <CropDatePicker
              date={date}
              setDate={setDate}
              open={calendarOpen}
              setOpen={setCalendarOpen}
              selectedCrop={selectedCrop}
            />
          </div>
          
          <CropDetails crop={selectedCrop} selectedDate={date} />
        </div>
      )}

      {showAddCrop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="venti-glass dark:venti-glass-dark rounded-2xl p-5 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Crop</h2>
            <p className="text-sm text-venti-gray-600 dark:text-venti-gray-400 mb-4">
              This feature will be implemented in the next version.
            </p>
            <Button 
              className="w-full" 
              onClick={() => setShowAddCrop(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="flex-grow"></div>
      <Footer />
      <Navigation />
    </div>
  );
};

export default Crops;
