import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

// Helper function to format time (seconds -> 3h 2m etc.)
function convertTime(seconds: number = 0): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  } else {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  }
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-700" />;
    default:
      return (
        <span className="w-5 h-5 flex items-center justify-center text-gray-500">
          {rank}
        </span>
      );
  }
};

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Fetch all users from the Flask backend, then pick top 5 sorted by dailyTime desc
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_all_users");
      if (!response.ok) {
        console.error("Failed to fetch leaderboard data");
        return;
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error("Invalid data format from /get_all_users");
        return;
      }
      // Sort by dailyTime descending; fallback to 0 if undefined
      data.sort((a, b) => (b.dailyTime || 0) - (a.dailyTime || 0));
      // Take top 5
      const topFive = data.slice(0, 5);
      setLeaderboard(topFive);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // Refresh leaderboard every 60 seconds
    const interval = setInterval(fetchLeaderboard, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-6">
        Leaderboard
      </h2>
      <div className="space-y-4">
        {leaderboard.map((user, index) => {
          const rank = index + 1;
          const gardenName = user.gardenName || "Unknown Garden";
          const dailyTime = user.dailyTime || 0;
          const lifetimeTime = user.lifetimeTime || 0;

          return (
            <div
              key={`${gardenName}-${rank}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <div className="flex-shrink-0">{getRankIcon(rank)}</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {gardenName}
                </h3>
                <p className="text-sm text-gray-500">
                  Today: {convertTime(dailyTime)} | Lifetime: {convertTime(lifetimeTime)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
