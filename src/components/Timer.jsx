import React, { useState, useEffect } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { useLocalStorage, STORAGE_KEYS } from '../hooks/useLocalStorage';

/**
 * Collapsible brew steep-time countdown timer.
 * Persists the target hours to localStorage so the value survives page reloads.
 *
 * @param {{ defaultHours?: number }} props
 */
export default function Timer({ defaultHours = 18 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [storedHours, setStoredHours] = useLocalStorage(STORAGE_KEYS.TIMER_HOURS, defaultHours);
  const timer = useTimer(storedHours);

  // On mount, ensure the hook reflects whatever was last persisted to localStorage.
  // The hook initialises from the value passed to useTimer(), but localStorage may
  // have a different value from a previous session.
  useEffect(() => {
    timer.setHours(storedHours);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hh = String(timer.hours).padStart(2, '0');
  const mm = String(timer.minutes).padStart(2, '0');
  const ss = String(timer.seconds).padStart(2, '0');

  return (
    <div className="bg-brew-surface rounded-card overflow-hidden">
      {/* ── Header ── */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 text-brew-text hover:bg-brew-mid transition-colors"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-controls="timer-body"
      >
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-brew-accent" aria-hidden="true" />
          <span className="font-body font-medium">Brew Timer</span>
        </div>
        {isExpanded
          ? <ChevronUp size={16} className="text-brew-muted" aria-hidden="true" />
          : <ChevronDown size={16} className="text-brew-muted" aria-hidden="true" />}
      </button>

      {/* ── Expanded body ── */}
      {isExpanded && (
        <div id="timer-body" className="pb-4">

          {/* Hours selector */}
          <div className="flex items-center justify-center gap-2 px-4 pt-3 pb-2">
            <span className="text-brew-muted text-sm font-body">Target:</span>
            <select
              value={storedHours}
              onChange={(e) => {
                const h = parseInt(e.target.value);
                setStoredHours(h);
                timer.setHours(h);
              }}
              aria-label="Target steep hours"
              className="bg-brew-mid text-brew-text rounded-input px-2 py-1 border border-brew-border focus:outline-none focus:border-brew-accent text-sm font-body"
            >
              {Array.from({ length: 13 }, (_, i) => i + 12).map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <span className="text-brew-muted text-sm font-body">hours</span>
          </div>

          {/* Progress bar */}
          <div
            className="mx-4 h-1.5 bg-brew-mid rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(timer.progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Brew timer progress"
          >
            <div
              className="h-full bg-brew-accent transition-all duration-1000 rounded-full"
              style={{ width: `${timer.progress * 100}%` }}
            />
          </div>

          {/* Countdown display */}
          <div className="text-center py-6 px-4" aria-live="off">
            <span className="text-5xl text-brew-cream font-mono tracking-widest select-none">
              {hh}
              <span className="text-brew-muted mx-1">:</span>
              {mm}
              <span className="text-brew-muted mx-1">:</span>
              {ss}
            </span>
          </div>

          {/* Control buttons */}
          <div className="flex gap-2 justify-center px-4">
            {!timer.isRunning ? (
              <button
                type="button"
                onClick={timer.start}
                className="flex-1 bg-brew-accent text-brew-bg rounded-input py-3 min-h-[48px] font-body font-medium transition-opacity hover:opacity-90"
              >
                Start
              </button>
            ) : (
              <button
                type="button"
                onClick={timer.pause}
                className="flex-1 bg-brew-mid text-brew-text rounded-input py-3 min-h-[48px] font-body font-medium transition-colors hover:bg-brew-border"
              >
                Pause
              </button>
            )}
            <button
              type="button"
              onClick={timer.reset}
              className="bg-brew-mid text-brew-muted rounded-input px-6 py-3 min-h-[48px] font-body font-medium transition-colors hover:bg-brew-border"
            >
              Reset
            </button>
          </div>

          {/* Tip */}
          <p className="text-brew-muted text-xs text-center px-4 pt-3 font-body italic">
            Tip: Set your phone's native alarm as a backup
          </p>
        </div>
      )}
    </div>
  );
}
