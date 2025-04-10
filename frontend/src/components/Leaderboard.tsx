import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

// Helper to format time
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

function getRankIcon(rank: number) {
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
  // Store all users
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Live search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Fetch all users from backend
  const fetchAllUsers = async () => {
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
      setAllUsers(data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  // 1) On mount, load user list
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // 2) Recompute top 5 if there's no searchTerm
  useEffect(() => {
    if (!searchTerm) {
      const sorted = [...allUsers].sort((a, b) => (b.dailyTime || 0) - (a.dailyTime || 0));
      setLeaderboard(sorted.slice(0, 5));
    }
  }, [allUsers, searchTerm]);

  // 3) Optionally refresh every 60s
  useEffect(() => {
    const interval = setInterval(fetchAllUsers, 60_000);
    return () => clearInterval(interval);
  }, []);

  // 4) Live search
  useEffect(() => {
    // If empty, revert to top 5
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    // Otherwise, call trie-based endpoint
    const doSearch = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/search_garden_name?prefix=${encodeURIComponent(searchTerm)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Error searching garden name:", err);
      }
    };
    doSearch();
  }, [searchTerm]);

  // 5) Filter allUsers to only those whose gardenName (lowercased) is in searchResults
  useEffect(() => {
    if (searchTerm && searchResults.length > 0) {
      const filtered = allUsers.filter((user) =>
        searchResults.includes(user.gardenName?.toLowerCase())
      );
      filtered.sort((a, b) => (b.dailyTime || 0) - (a.dailyTime || 0));
      setLeaderboard(filtered);
    } else if (searchTerm && searchResults.length === 0) {
      setLeaderboard([]);
    }
    // If searchTerm is empty, we already handled that above (top 5).
  }, [searchTerm, searchResults, allUsers]);

  // If searching, we hide rank icons
  const isSearching = Boolean(searchTerm);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Search Gardens*/}
      <div className="border p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Search Garden Name</h2>
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Type to search (no button)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Leaderboard Heading */}
      <h2 className="text-2xl font-semibold text-emerald-800 mb-6">
        {isSearching ? "Search Results" : "Leaderboard (Top 5 by Daily Time)"}
      </h2>

      {/* If no results */}
      {leaderboard.length === 0 && (
        <p className="text-gray-500">
          {isSearching ? "No matching garden names." : "No users found."}
        </p>
      )}

      {/* The actual leaderboard rows */}
      <div className="space-y-4">
        {leaderboard.map((user, index) => {
          // We only show rank icons if not searching:
          // If searching, hide them.
          const showRankIcon = !isSearching;
          const rank = index + 1;

          const gardenName = user.gardenName || "Unknown Garden";
          const dailyTime = user.dailyTime || 0;
          const lifetimeTime = user.lifetimeTime || 0;

          return (
            <div
              key={`${gardenName}-${rank}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              {/* Always render this fixed-size container: */}
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {showRankIcon ? getRankIcon(rank) : null}
              </div>
          
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{gardenName}</h3>
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
