// PlantGrid.tsx
import React from 'react';
import { Plant } from './Plant';
import { Calendar } from 'lucide-react';

interface PlantGridProps {
  lifetimeSeconds: number;
  dailySeconds: number;
  weeklyTimes: number[];
}

export const PlantGrid: React.FC<PlantGridProps> = ({ lifetimeSeconds, dailySeconds, weeklyTimes }) => {
  const rows = 3;
  const cols = 7;
  const totalCells = cols * rows;
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = new Date().getDay();
  
  // Lifetime thresholds for the first 6 cells:
  // Plant 1: 180 sec (3 mins)
  // Plant 2: 480 sec (5 mins total)
  // Plant 3: 1080 sec (10 mins total)
  // Plant 4: 2880 sec (30 mins total)
  // Plant 5: 6480 sec (1 hr total)
  // Plant 6: 20880 sec (4 hrs total)
  const baseThresholds = [180, 480, 1080, 2880, 6480, 20880];
  const getThresholdForIndex = (index: number): number => {
    if (index < baseThresholds.length) {
      return baseThresholds[index];
    } else {
      const extraIndex = index - baseThresholds.length + 1;
      return baseThresholds[baseThresholds.length - 1] + extraIndex * 14400;
    }
  };
  
  // Determine the first lifetime cell that is not yet fully unlocked.
  let currentUnlockIndex = totalCells;
  for (let i = 0; i < totalCells; i++) {
    const threshold = getThresholdForIndex(i);
    if (lifetimeSeconds < threshold) {
      currentUnlockIndex = i;
      break;
    }
  }
  
  // Compute progress for a lifetime cell.
  const getLifetimeProgress = (index: number): number => {
    if (index < currentUnlockIndex) return 100;
    if (index > currentUnlockIndex) return 0;
    const prevThreshold = index === 0 ? 0 : getThresholdForIndex(index - 1);
    const currentThreshold = getThresholdForIndex(index);
    const progress = ((lifetimeSeconds - prevThreshold) / (currentThreshold - prevThreshold)) * 100;
    return Math.min(100, Math.max(0, progress));
  };
  
  // Weekly threshold: 300 seconds (5 minutes)
  const weeklyThreshold = 300;
  
  return (
    <div className="grid gap-8">
      {/* Lifetime Grid */}
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: totalCells }).map((_, index) => {
          const progress = getLifetimeProgress(index);
          const isUnlocked = progress === 100;
          return (
            <Plant 
              key={`lifetime-${index}`}
              growth={progress}
              isWeekly={false}
              isLocked={!(index === currentUnlockIndex) && !isUnlocked}
              dayLabel={`Plant ${index + 1}`}
            />
          );
        })}
      </div>
      
      {/* Daily Timer */}
      <div className="flex items-center justify-center gap-2 text-emerald-600 border-t border-emerald-100 pt-4">
        <Calendar className="w-5 h-5" />
        <span> Daily: {(() => {
            const hrs = Math.floor(dailySeconds / 3600);
            const mins = Math.floor((dailySeconds % 3600) / 60);
            const secs = dailySeconds % 60;
            return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs}s`;
          })()}
        </span>
      </div>
      
      {/* Weekly Row */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          // Use the weeklyTimes array to compute progress for each day.
          // For the current day, this value is in progress.
          const progress = weeklyTimes[index] 
            ? Math.min(100, (weeklyTimes[index] / weeklyThreshold) * 100)
            : 0;
          return (
            <Plant 
              key={`weekly-${index}`}
              growth={progress}
              isWeekly={true}
              // Always set isLocked to false for weekly plants so the progress bar is shown.
              isLocked={false}
              dayLabel={day}
            />
          );
        })}
      </div>
    </div>
  );
};