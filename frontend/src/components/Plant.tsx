// Plant.tsx
import React from 'react';
import { Sprout, Flower, Lock, Flower2Icon } from 'lucide-react';

interface PlantProps {
  growth: number;
  isWeekly: boolean;
  isLocked: boolean;
  dayLabel: string;
  showProgress: boolean;
}

export const Plant: React.FC<PlantProps> = ({ growth, isWeekly, isLocked, dayLabel, showProgress }) => {
  const getPlantStage = () => {
    if (isWeekly) {
      if (growth < 100) {
        return { icon: Sprout, color: 'text-emerald-400' };
      } else {
        return { icon: Flower2Icon, color: 'text-emerald-600' };
      }
    }
    if (isLocked) {
      return { icon: Lock, color: 'text-gray-400' };
    }
    if (growth < 100) {
      return { icon: Sprout, color: 'text-emerald-400' };
    }
    if (growth < 200) {
      return { icon: Flower, color: 'text-emerald-400' };
    }
    return { icon: Flower2Icon, color: 'text-emerald-500' };
  };

  const { icon: PlantIcon, color } = getPlantStage();

  return (
    <div className={`aspect-square rounded-lg p-2 flex flex-col items-center justify-center
      ${isWeekly ? 'bg-emerald-50' : 'bg-emerald-100'} 
      ${isLocked ? 'opacity-50' : 'hover:scale-105'}
      transition-all duration-300`}
    >
      <PlantIcon className={`w-8 h-8 ${color}`} />
      {showProgress && (
        <div className="w-full bg-emerald-200 rounded-full h-1 mt-2">
          <div 
            className="bg-emerald-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${growth < 100 ? growth : growth - 100}%` }}
          />
        </div>
      )}
      {dayLabel && (
        <div className="mt-2 text-xs text-emerald-600 font-medium">
          {dayLabel}
        </div>
      )}
    </div>
  );
};