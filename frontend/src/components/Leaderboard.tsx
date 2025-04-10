// Leaderboard.tsx
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const db = getFirestore();

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const fetchLeaderboard = async () => {
    const q = query(collection(db, "users"), orderBy("dailyTime", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    const lb: any[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      lb.push({
        gardenName: data.gardenName,
        dailyTime: data.dailyTime || 0,
        lifetimeTime: data.lifetimeTime || 0
      });
    });
    setLeaderboard(lb);
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    } else {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hrs}h ${mins}m`;
    }
  };

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
        {leaderboard.map((user, index) => (
          <div 
            key={user.gardenName}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <div className="flex-shrink-0">
              {getRankIcon(index + 1)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{user.gardenName}</h3>
              <p className="text-sm text-gray-500">
                Today: {convertTime(user.dailyTime)} | Lifetime: {convertTime(user.lifetimeTime)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};