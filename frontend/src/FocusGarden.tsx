// FocusGarden.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Flower2, Trophy, Clock, Calendar } from 'lucide-react';
import { PlantGrid } from './components/PlantGrid';
import { Leaderboard } from './components/Leaderboard';
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "./components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const db = getFirestore();

function FocusGarden() {
  const navigate = useNavigate();

  // Timer state variables
  const [lifetimeSeconds, setLifetimeSeconds] = useState(0);
  const [dailySeconds, setDailySeconds] = useState(0);
  const [weeklyTimes, setWeeklyTimes] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(!document.hidden);
  const [initialized, setInitialized] = useState(false);

  // Refs for the current timer values (for Firebase sync)
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

  // Listen for authentication state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // On mount, fetch user data from Firestore.
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setDailySeconds(data.dailyTime || 0);
          setLifetimeSeconds(data.lifetimeTime || 0);
          setWeeklyTimes(data.weeklyTimes || [0, 0, 0, 0, 0, 0, 0]);
        }
      }
      setInitialized(true);
    };
    fetchUserData();
  }, []);

  // Listen for page visibility changes.
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Update timers every second when page is visible.
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible && initialized) {
      timer = setInterval(() => {
        setDailySeconds(prev => prev + 1);
        setLifetimeSeconds(prev => prev + 1);
        setWeeklyTimes(prev => {
          const newWeekly = [...prev];
          newWeekly[currentDayIndex] = newWeekly[currentDayIndex] + 1;
          return newWeekly;
        });
      }, 1000);
    }
    return () => timer && clearInterval(timer);
  }, [isVisible, initialized, currentDayIndex]);

  // Reset daily timer at midnight (when the current day changes).
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    const resetTimeout = setTimeout(() => {
      setDailySeconds(0);
      // Note: weeklyTimes for previous days remain unchanged.
    }, timeUntilMidnight);
    return () => clearTimeout(resetTimeout);
  }, [currentDayIndex]);

  // Update Firebase every 30 seconds with the latest timer values.
  useEffect(() => {
    const halfMinInterval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const currentWeek = getWeekNumber(new Date());
        await updateDoc(userRef, {
          dailyTime: dailyRef.current,
          lifetimeTime: lifetimeRef.current,
          weeklyTimes: weeklyRef.current,
          lastUpdated: new Date().toISOString(),
          lastWeek: currentWeek
        });
      }
    }, 30 * 1000);
    return () => clearInterval(halfMinInterval);
  }, []);

  // Helper: format seconds as "xh ym zs"
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
              {/* Pass weeklyTimes as an extra prop */}
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

// Helper: get week number (used for weekly reset)
function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export default FocusGarden;