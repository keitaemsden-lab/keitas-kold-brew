import { useState, useEffect, useRef, useCallback } from 'react';

export const TIMER_STATE_KEY = 'kkb_timer_state';

/**
 * Pure: turn saved state into a live state at time `now` (ms).
 * Running timers store an absolute `endsAt`, so time spent closed or
 * reloaded still counts. Returns null if there is nothing usable.
 */
export function rehydrate(saved, now) {
  if (!saved || !Number.isFinite(saved.totalSeconds) || saved.totalSeconds <= 0) return null;
  const base = { targetHours: saved.targetHours, totalSeconds: saved.totalSeconds };
  if (saved.endsAt) {
    const left = Math.ceil((saved.endsAt - now) / 1000);
    if (left <= 0) return { ...base, remaining: 0, endsAt: null, finished: true };
    return { ...base, remaining: left, endsAt: saved.endsAt, finished: false };
  }
  const remaining = Math.min(Math.max(0, saved.remaining ?? saved.totalSeconds), saved.totalSeconds);
  return { ...base, remaining, endsAt: null, finished: !!saved.finished && remaining === 0 };
}

function load(defaultHours) {
  let saved = null;
  try { saved = JSON.parse(window.localStorage.getItem(TIMER_STATE_KEY)); } catch { /* ignore */ }
  const live = rehydrate(saved, Date.now());
  if (live) return live;
  let hours = defaultHours;
  try {
    const h = JSON.parse(window.localStorage.getItem('kkb_timer_hours'));
    if (Number.isFinite(h) && h > 0) hours = h;
  } catch { /* ignore */ }
  return { targetHours: hours, totalSeconds: hours * 3600, remaining: hours * 3600, endsAt: null, finished: false };
}

/**
 * Countdown timer that survives reloads. State is rehydrated once, on first
 * render, and nothing on mount resets it. `onComplete` fires when the
 * countdown reaches zero while the page is open.
 */
export function useTimer(defaultHours = 18, { onComplete } = {}) {
  const [state, setState] = useState(() => load(defaultHours));
  const [now, setNow] = useState(() => Date.now());
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const isRunning = state.endsAt !== null;
  const remaining = isRunning ? Math.max(0, Math.ceil((state.endsAt - now) / 1000)) : state.remaining;

  useEffect(() => {
    try { window.localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  useEffect(() => {
    if (!isRunning) return undefined;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && remaining <= 0) {
      setState((s) => ({ ...s, remaining: 0, endsAt: null, finished: true }));
      try { onCompleteRef.current?.(); } catch { /* ignore */ }
    }
  }, [isRunning, remaining]);

  const start = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setState((s) => {
      const left = s.remaining > 0 ? s.remaining : s.totalSeconds;
      return { ...s, remaining: left, endsAt: t + left * 1000, finished: false };
    });
  }, []);
  const pause = useCallback(() => {
    setState((s) => {
      if (s.endsAt === null) return s;
      return { ...s, remaining: Math.max(0, Math.ceil((s.endsAt - Date.now()) / 1000)), endsAt: null };
    });
  }, []);
  const reset = useCallback(() => {
    setState((s) => ({ ...s, remaining: s.totalSeconds, endsAt: null, finished: false }));
  }, []);
  const setHours = useCallback((hours) => {
    const secs = hours * 3600;
    setState({ targetHours: hours, totalSeconds: secs, remaining: secs, endsAt: null, finished: false });
    try { window.localStorage.setItem('kkb_timer_hours', JSON.stringify(hours)); } catch { /* ignore */ }
  }, []);

  const { totalSeconds, targetHours, finished } = state;
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0;

  return { hours, minutes, seconds, remaining, totalSeconds, targetHours, isRunning, finished, progress, start, pause, reset, setHours };
}
