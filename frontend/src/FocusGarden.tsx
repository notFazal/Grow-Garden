import React, { useState, useEffect } from 'react';
import { Flower2, Trophy, Clock, Calendar } from 'lucide-react';
import { PlantGrid } from './components/PlantGrid.tsx';
import { Leaderboard } from './components/Leaderboard.tsx';

function FocusGarden() {
  const [lifetimeSeconds, setLifetimeSeconds] = useState(0);
  const [dailySeconds, setDailySeconds] = useState(0);
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // let interval: number | undefined;
	let interval: NodeJS.Timeout | undefined;

    if (isVisible) {
		interval = setInterval(() => {
        setLifetimeSeconds(prev => prev + 1);
        setDailySeconds(prev => prev + 1);
      }, 1000);
    }

    // Reset daily timer at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightReset = setTimeout(() => {
      setDailySeconds(0);
    }, timeUntilMidnight);

    return () => {
      if (interval) clearInterval(interval);
      clearTimeout(midnightReset);
    };
  }, [isVisible]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flower2 className="w-8 h-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-emerald-800">GrowTime</h1>
          </div>
          <p className="text-emerald-600">Grow your garden while staying focused</p>
          {!isVisible && (
            <p className="mt-2 text-red-500">Timer paused - Return to this tab to continue growing your garden!</p>
          )}
        </header>

        <div className="flex gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-emerald-800 flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Your Garden
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Clock className="w-5 h-5" />
                    <span>Lifetime: {formatTime(lifetimeSeconds)}</span>
                  </div>
                </div>
              </div>
              <PlantGrid lifetimeSeconds={lifetimeSeconds} dailySeconds={dailySeconds} />
            </div>
          </div>

          <div className="w-80">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusGarden;