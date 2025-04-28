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

  const baseThresholds = [
    60, 240, 540, 1140, 2340, 4140, 6840, 10440, 15840, 23040,
    32040, 42840, 57240, 75240, 100440, 136440, 190440, 262440,
    348840, 449640, 564840
  ];

  const unlockDurations = baseThresholds.map((thresh, idx) =>
    idx === 0 ? thresh : thresh - baseThresholds[idx - 1]
  );

  const upgradeDurations = unlockDurations.map(duration => duration * 2);

  const upgradeThresholds = upgradeDurations.reduce<number[]>((acc, cur, idx) => {
    if (idx === 0) {
      acc.push(cur);
    } else {
      acc.push(acc[idx - 1] + cur);
    }
    return acc;
  }, []);

  const isUnlockingPhase = lifetimeSeconds < baseThresholds[baseThresholds.length - 1];

  return (
    <div className="grid gap-8">
      {/* Lifetime Grid */}
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: totalCells }).map((_, index) => {
          let growth = 0;
          let isLocked = true;
          let showProgress = false;

          if (isUnlockingPhase) {
            const prevThreshold = index === 0 ? 0 : baseThresholds[index - 1];
            const nextThreshold = baseThresholds[index];

            if (lifetimeSeconds < prevThreshold) {
              growth = 0;
            } else if (lifetimeSeconds < nextThreshold) {
              growth = ((lifetimeSeconds - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
              showProgress = true;
            } else {
              growth = 100;
              isLocked = false;
            }
          } else {
            const extraTime = lifetimeSeconds - baseThresholds[baseThresholds.length - 1];
            const prevUpgrade = index === 0 ? 0 : upgradeThresholds[index - 1];
            const nextUpgrade = upgradeThresholds[index];

            if (extraTime < prevUpgrade) {
              growth = 100;
            } else if (extraTime < nextUpgrade) {
              const upgradeDuration = upgradeDurations[index];
              growth = 100 + ((extraTime - prevUpgrade) / upgradeDuration) * 100;
              showProgress = true;
            } else {
              growth = 200;
            }
            isLocked = false;
          }

          return (
            <Plant 
              key={`lifetime-${index}`}
              growth={growth}
              isWeekly={false}
              isLocked={isLocked}
              dayLabel={`Plant ${index + 1}`}
              showProgress={showProgress}
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
          const weeklyThreshold = 300;
          const progress = weeklyTimes[index]
            ? Math.min(100, (weeklyTimes[index] / weeklyThreshold) * 100)
            : 0;
          return (
            <Plant 
              key={`weekly-${index}`}
              growth={progress}
              isWeekly={true}
              isLocked={false}
              dayLabel={day}
              showProgress={progress < 100}
            />
          );
        })}
      </div>
    </div>
  );
};
