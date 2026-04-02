import { useState, useEffect, useRef } from 'react';

/**
 * Countdown timer hook.
 * @param {number} defaultHours - initial hours to count down from
 */
export function useTimer(defaultHours = 18) {
  const [targetHours, setTargetHours] = useState(defaultHours);
  const [totalSeconds, setTotalSeconds] = useState(defaultHours * 3600);
  const [remaining, setRemaining] = useState(defaultHours * 3600);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Run countdown
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setRemaining(totalSeconds);
  };

  const setHours = (hours) => {
    const secs = hours * 3600;
    setTargetHours(hours);
    setTotalSeconds(secs);
    setRemaining(secs);
    setIsRunning(false);
  };

  // Derive HH, MM, SS from remaining seconds
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  // Progress 0–1
  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0;

  return {
    hours,
    minutes,
    seconds,
    remaining,
    totalSeconds,
    targetHours,
    isRunning,
    progress,
    start,
    pause,
    reset,
    setHours,
  };
}
