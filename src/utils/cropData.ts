
import { Apple, Thermometer, Droplets } from "lucide-react";
import React from "react";

export interface CropInfo {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  image: string;
  color: string;
  sowingTime: string;
  harvestTime: string;
  description: string;
  wateringSchedule: string;
  fertilizerRequirements: string;
  idealTemperature: string;
  idealHumidity: string;
  calendar: {
    sowing: Date[];
    growing: Date[];
    harvesting: Date[];
  };
}

export const getCropList = (): CropInfo[] => [
  {
    id: "tomatoes",
    name: "Tomatoes",
    icon: "circle",
    iconColor: "bg-red-500",
    image: "/lovable-uploads/tomato-image.jpg",
    color: "bg-red-500",
    sowingTime: "March - April",
    harvestTime: "July - September",
    description: "Tomatoes are a warm-season crop that prefer full sun and well-drained, fertile soil. They should be planted after all danger of frost has passed.",
    wateringSchedule: "Regular watering, 1-2 inches per week. Avoid wetting the leaves.",
    fertilizerRequirements: "Balanced fertilizer (10-10-10) at planting, then every 4-6 weeks.",
    idealTemperature: "21°C - 27°C",
    idealHumidity: "65% - 75%",
    calendar: {
      sowing: [new Date(2025, 2, 15), new Date(2025, 3, 15)], // March 15 - April 15
      growing: [new Date(2025, 3, 16), new Date(2025, 6, 14)], // April 16 - July 14
      harvesting: [new Date(2025, 6, 15), new Date(2025, 8, 30)], // July 15 - September 30
    }
  },
  {
    id: "cucumbers",
    name: "Cucumbers",
    icon: "circle",
    iconColor: "bg-green-500",
    image: "https://images.unsplash.com/photo-1558560629-b4cb5372d2a6?q=80&w=500&auto=format&fit=crop",
    color: "bg-green-500",
    sowingTime: "April - May",
    harvestTime: "June - August",
    description: "Cucumbers are warm-season vegetables that thrive in temperatures between 65-75°F. They require consistent moisture and benefit from trellising.",
    wateringSchedule: "Consistent moisture, about 1 inch per week. More during hot weather.",
    fertilizerRequirements: "Nitrogen-rich fertilizer before planting, then every 3 weeks.",
    idealTemperature: "18°C - 24°C",
    idealHumidity: "70% - 90%",
    calendar: {
      sowing: [new Date(2025, 3, 1), new Date(2025, 4, 15)], // April 1 - May 15
      growing: [new Date(2025, 4, 16), new Date(2025, 5, 14)], // May 16 - June 14
      harvesting: [new Date(2025, 5, 15), new Date(2025, 7, 31)], // June 15 - August 31
    }
  },
  {
    id: "peppers",
    name: "Peppers",
    icon: "circle",
    iconColor: "bg-yellow-500",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=500&auto=format&fit=crop",
    color: "bg-yellow-500",
    sowingTime: "February - March",
    harvestTime: "July - October",
    description: "Peppers prefer warm conditions and should be started indoors 8-10 weeks before the last frost date. They require well-drained soil rich in organic matter.",
    wateringSchedule: "Moderate but consistent watering, about 1-2 inches per week.",
    fertilizerRequirements: "Light fertilizer at planting, then every 4-6 weeks with low-nitrogen formula.",
    idealTemperature: "21°C - 29°C",
    idealHumidity: "50% - 70%",
    calendar: {
      sowing: [new Date(2025, 1, 1), new Date(2025, 2, 31)], // February 1 - March 31
      growing: [new Date(2025, 3, 1), new Date(2025, 6, 14)], // April 1 - July 14
      harvesting: [new Date(2025, 6, 15), new Date(2025, 9, 31)], // July 15 - October 31
    }
  },
  {
    id: "strawberries",
    name: "Strawberries",
    icon: "apple",
    iconColor: "text-red-500",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=500&auto=format&fit=crop",
    color: "bg-red-400",
    sowingTime: "April - May",
    harvestTime: "June - July",
    description: "Strawberries prefer full sun and fertile, well-drained soil. They should be planted in early spring as soon as the ground can be worked.",
    wateringSchedule: "Consistent moisture, around 1 inch per week. Mulch to retain moisture.",
    fertilizerRequirements: "Balanced fertilizer (10-10-10) at planting, then every 4-6 weeks.",
    idealTemperature: "15°C - 26°C",
    idealHumidity: "60% - 75%",
    calendar: {
      sowing: [new Date(2025, 3, 1), new Date(2025, 4, 15)], // April 1 - May 15
      growing: [new Date(2025, 4, 16), new Date(2025, 5, 14)], // May 16 - June 14
      harvesting: [new Date(2025, 5, 15), new Date(2025, 6, 31)], // June 15 - July 31
    }
  },
  {
    id: "chilies",
    name: "Chilies",
    icon: "circle",
    iconColor: "bg-red-600",
    image: "/lovable-uploads/chili-image.jpg",
    color: "bg-red-600",
    sowingTime: "February - March",
    harvestTime: "August - October",
    description: "Chilies need warm temperatures and full sun. Start seeds indoors 8-10 weeks before the last frost date.",
    wateringSchedule: "Allow soil to dry slightly between waterings, about 1 inch per week.",
    fertilizerRequirements: "Light fertilizer at planting, then low-nitrogen formula every 4-6 weeks.",
    idealTemperature: "24°C - 32°C",
    idealHumidity: "50% - 70%",
    calendar: {
      sowing: [new Date(2025, 1, 15), new Date(2025, 2, 31)], // February 15 - March 31
      growing: [new Date(2025, 3, 1), new Date(2025, 7, 14)], // April 1 - August 14
      harvesting: [new Date(2025, 7, 15), new Date(2025, 9, 30)], // August 15 - October 30
    }
  }
];

export const getStageColor = (stage: string | null) => {
  switch (stage) {
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

export const isDateInRange = (date: Date, start: Date, end: Date) => {
  return date >= start && date <= end;
};

export const getDateStatus = (date: Date, crop: CropInfo | null) => {
  if (!crop) return null;
  
  const { sowing, growing, harvesting } = crop.calendar;
  
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
