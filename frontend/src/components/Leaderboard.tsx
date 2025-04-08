import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const leaderboardData = [
    { name: "Sarah K.", time: "12h 30m", rank: 1 },
    { name: "Mike R.", time: "10h 45m", rank: 2 },
    { name: "Alex T.", time: "9h 15m", rank: 3 },
    { name: "Emma L.", time: "8h 20m", rank: 4 },
    { name: "James P.", time: "7h 55m", rank: 5 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-700" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-gray-500">{rank}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Leaderboard</h2>
      <div className="space-y-4">
        {leaderboardData.map((user) => (
          <div 
            key={user.name}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <div className="flex-shrink-0">
              {getRankIcon(user.rank)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}