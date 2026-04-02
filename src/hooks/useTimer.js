import { useState, useEffect, useRef } from 'react';

const TIMER_STATE_KEY = 'kkb_timer_state';

export function useTimer(defaultHours = 18) {
  // Rehydrate from localStorage on mount
  const getInitialState = () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(TIMER_STATE_KEY));
      if (saved && saved.startedAt && saved.remaining > 0) {
        const elapsed = Math.floor((Date.now() - saved.startedAt) / 1000);
        const rehydrated = Math.max(0, saved.remaining - (saved.isRunning ? elapsed : 0));
        return {
          targetHours: saved.targetHours || defaultHours,
          totalSeconds: saved.totalSeconds || defaultHours * 3600,
          remaining: rehydrated,
          isRunning: saved.isRunning && rehydrated > 0,
        };
      }
    } catch {}
    return {
      targetHours: defaultHours,
      totalSeconds: defaultHours * 3600,
      remaining: defaultHours * 3600,
      isRunning: false,
    };
  };

  const initial = getInitialState();
  const [targetHours, setTargetHoursState] = useState(initial.targetHours);
  const [totalSeconds, setTotalSeconds] = useState(initial.totalSeconds);
  const [remaining, setRemaining] = useState(initial.remaining);
  const [isRunning, setIsRunning] = useState(initial.isRunning);
  const intervalRef = useRef(null);
  const startedAtRef = useRef(isRunning ? Date.now() - ((initial.totalSeconds - initial.remaining) * 1000) : null);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem(TIMER_STATE_KEY, JSON.stringify({
        targetHours,
        totalSeconds,
        remaining,
        isRunning,
        startedAt: isRunning ? (startedAtRef.current || Date.now()) : null,
      }));
    } catch {}
  }, [remaining, isRunning, targetHours, totalSeconds]);

  // Countdown interval
  useEffect(() => {
    if (isRunning) {
      if (!startedAtRef.current) startedAtRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            startedAtRef.current = null;
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

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const start = () => {
    startedAtRef.current = Date.now();
    setIsRunning(true);
  };
  const pause = () => {
    startedAtRef.current = null;
    setIsRunning(false);
  };
  const reset = () => {
    startedAtRef.current = null;
    setIsRunning(false);
    setRemaining(totalSeconds);
  };
  const setHours = (hours) => {
    const secs = hours * 3600;
    startedAtRef.current = null;
    setTargetHoursState(hours);
    setTotalSeconds(secs);
    setRemaining(secs);
    setIsRunning(false);
  };

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0;

  return { hours, minutes, seconds, remaining, totalSeconds, targetHours, isRunning, progress, start, pause, reset, setHours };
}
