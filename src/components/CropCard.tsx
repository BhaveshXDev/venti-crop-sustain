
import React from "react";
import { CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CropInfo } from "@/utils/cropData";

interface CropCardProps {
  crop: CropInfo;
  isSelected: boolean;
  onClick: () => void;
}

const CropCard: React.FC<CropCardProps> = ({ crop, isSelected, onClick }) => {
  return (
    <div
      className={`venti-glass dark:venti-glass-dark rounded-xl p-4 flex items-center cursor-pointer transition-all ${
        isSelected
          ? "ring-2 ring-venti-green-500 bg-venti-green-50/50 dark:bg-venti-green-900/20"
          : "hover:bg-white/60 dark:hover:bg-white/5"
      }`}
      onClick={onClick}
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
  );
};

export default CropCard;
