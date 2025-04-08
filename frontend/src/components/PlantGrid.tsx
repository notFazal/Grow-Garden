import React from 'react';
import { Plant } from './Plant';
import { Calendar, Clock } from 'lucide-react';

interface PlantGridProps {
  lifetimeSeconds: number;
  dailySeconds: number;
}

export const PlantGrid: React.FC<PlantGridProps> = ({ lifetimeSeconds, dailySeconds }) => {
  const rows = 3;
  const cols = 7;
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = new Date().getDay();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
  };

  // Calculate which lifetime plants are unlocked based on previous plant completion
  const getUnlockStatus = (index: number) => {
    if (index === 0) return true;
    const previousPlantGrowth = Math.min(100, (lifetimeSeconds / 180) * (index === 1 ? 1 : 0.5));
    return previousPlantGrowth >= 100;
  };

  const calculateGrowth = (index: number, isUnlocked: boolean) => {
    if (!isUnlocked) return 0;
    return Math.min(100, (lifetimeSeconds / 180) * (index === 0 ? 1 : 0.5));
  };

  return (
    <div className="grid gap-8">
      {/* Lifetime grid */}
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: cols * rows }).map((_, index) => {
          const isUnlocked = getUnlockStatus(index);
          const growth = calculateGrowth(index, isUnlocked);
          return (
            <Plant 
              key={`lifetime-${index}`}
              growth={growth}
              isWeekly={false}
              isLocked={!isUnlocked}
              dayLabel=""
            />
          );
        })}
      </div>

      {/* Daily Timer */}
      <div className="flex items-center justify-center gap-2 text-emerald-600 border-t border-emerald-100 pt-4">
        <Calendar className="w-5 h-5" />
        <span>Daily Progress: {formatTime(dailySeconds)}</span>
      </div>

      {/* Weekly row */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <Plant 
            key={`weekly-${index}`}
            growth={index === currentDay ? Math.min(100, dailySeconds / 180) : 0}
            isWeekly={true}
            isLocked={false}
            dayLabel={day}
          />
        ))}
      </div>
    </div>
  );
}