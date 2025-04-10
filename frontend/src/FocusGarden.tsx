import React, { useState, useEffect, useRef } from 'react';
import { Flower2, Trophy, Clock } from 'lucide-react';
import { PlantGrid } from './components/PlantGrid';
import { Leaderboard } from './components/Leaderboard';
import { auth } from "./components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Helper to get the current week number (for weekly resets if you want)
function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function FocusGarden() {
  const navigate = useNavigate();

  // Timer state
  const [dailySeconds, setDailySeconds] = useState(0);
  const [lifetimeSeconds, setLifetimeSeconds] = useState(0);
  const [weeklyTimes, setWeeklyTimes] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const [initialized, setInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(!document.hidden);

  // Refs to hold current timer values (to pass to setInterval)
  const dailyRef = useRef(dailySeconds);
  const lifetimeRef = useRef(lifetimeSeconds);
  const weeklyRef = useRef(weeklyTimes);

  useEffect(() => {
    dailyRef.current = dailySeconds;
    lifetimeRef.current = lifetimeSeconds;
    weeklyRef.current = weeklyTimes;
  }, [dailySeconds, lifetimeSeconds, weeklyTimes]);

  // Get current day index (0 = Sunday, 6 = Saturday)
  const currentDayIndex = new Date().getDay();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // On mount, fetch data from the backend (Flask) for the logged-in user
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const response = await fetch(`http://localhost:5000/get_user_time/${user.uid}`);
          if (!response.ok) {
            // If user doc not found or error
            console.error("User not found or error retrieving user time");
            setInitialized(true);
            return;
          }
          const data = await response.json();
          // Adjust these fields based on how your backend returns them
          setDailySeconds(data.dailyTime || 0);
          setLifetimeSeconds(data.lifetimeTime || 0);
          setWeeklyTimes(data.weeklyTimes || [0, 0, 0, 0, 0, 0, 0]);
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }
      setInitialized(true);
    };

    fetchUserData();
  }, []);

  // Listen for page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Update timers every second (when page is visible)
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isVisible && initialized) {
      timer = setInterval(() => {
        setDailySeconds((prev) => prev + 1);
        setLifetimeSeconds((prev) => prev + 1);
        setWeeklyTimes((prev) => {
          const newWeekly = [...prev];
          newWeekly[currentDayIndex] = newWeekly[currentDayIndex] + 1;
          return newWeekly;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isVisible, initialized, currentDayIndex]);

  // Reset daily timer at midnight (optional)
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const resetTimeout = setTimeout(() => {
      setDailySeconds(0);
      // weeklyTimes remain for historical data, or you can reset one of them
    }, timeUntilMidnight);

    return () => clearTimeout(resetTimeout);
  }, [currentDayIndex]);

  // Every 30 seconds, send updated data to the backend
  useEffect(() => {
    const halfMinute = setInterval(() => {
      const user = auth.currentUser;
      if (initialized && user) {
        fetch("http://localhost:5000/update_timers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.uid,
            dailyTime: dailyRef.current,
            lifetimeTime: lifetimeRef.current,
            weeklyTimes: weeklyRef.current,
            lastWeek: getWeekNumber(new Date()),
            gardenName: "My Awesome Garden" // or however you want to set it
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.success) {
              console.error("Failed to update timers:", data);
            }
          })
          .catch((err) => console.error("Error in update_timers fetch:", err));
      }
    }, 30_000); // 30 seconds

    return () => clearInterval(halfMinute);
  }, [initialized]);

  // Helper: format seconds
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
            <p className="mt-2 text-red-500">
              Timer paused - Return to this tab to continue growing your garden!
            </p>
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
              {/* Pass weeklyTimes and dailySeconds to your PlantGrid as you wish */}
              <PlantGrid 
                lifetimeSeconds={lifetimeSeconds} 
                dailySeconds={dailySeconds}
                weeklyTimes={weeklyTimes}
              />
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
