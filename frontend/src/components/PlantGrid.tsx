// PlantGrid.tsx
import React from 'react';
import { Plant } from './Plant';
import { Calendar } from 'lucide-react';

interface PlantGridProps {
  lifetimeSeconds: number;
  dailySeconds: number;
}

export const PlantGrid: React.FC<PlantGridProps> = ({ lifetimeSeconds, dailySeconds }) => {
  const rows = 3;
  const cols = 7;
  const totalCells = cols * rows;
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = new Date().getDay();

  // Lifetime thresholds for the first 6 cells:
  // Plant 1 unlocks after 3 mins (180 sec)
  // Plant 2 unlocks after 5 mins total (480 sec)
  // Plant 3 unlocks after 10 mins (1080 sec)
  // Plant 4 unlocks after 30 mins (2880 sec)
  // Plant 5 unlocks after 1 hr (6480 sec)
  // Plant 6 unlocks after 4 hrs (20880 sec)
  const baseThresholds = [180, 480, 1080, 2880, 6480, 20880];
  const getThresholdForIndex = (index: number): number => {
    if (index < baseThresholds.length) {
      return baseThresholds[index];
    } else {
      const extraIndex = index - baseThresholds.length + 1;
      return baseThresholds[baseThresholds.length - 1] + extraIndex * 14400;
    }
  };

  // Determine the first lifetime cell not fully unlocked.
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
    // For the cell in progress:
    const prevThreshold = index === 0 ? 0 : getThresholdForIndex(index - 1);
    const currentThreshold = getThresholdForIndex(index);
    const progress = ((lifetimeSeconds - prevThreshold) / (currentThreshold - prevThreshold)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Weekly progress uses a 300-second threshold.
  const weeklyThreshold = 300;
  const getWeeklyProgress = (index: number): number => {
    if (index === currentDay) {
      return Math.min(100, (dailySeconds / weeklyThreshold) * 100);
    }
    return 0;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
  };

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
        <span>Daily Progress: {formatTime(dailySeconds)}</span>
      </div>

      {/* Weekly Row */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <Plant 
            key={`weekly-${index}`}
            growth={index === currentDay ? getWeeklyProgress(index) : 0}
            isWeekly={true}
            isLocked={false}
            dayLabel={day}
          />
        ))}
      </div>
    </div>
  );
};