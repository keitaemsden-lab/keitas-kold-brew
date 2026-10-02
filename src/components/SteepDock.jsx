import React from 'react';
import { useTimer } from '../hooks/useTimer';
import { fireBrewAlert, requestNotificationPermission } from '../utils/alarm';
import { DEFAULTS } from '../utils/calculations';

export const MIN_HOURS = 12;
export const MAX_HOURS = 24;

const pad = (n) => String(n).padStart(2, '0');

/** "Sat 4:30 pm" for a moment `secs` from `now`. */
export function readyAt(now, secs) {
  return new Date(now + secs * 1000)
    .toLocaleString('en-AU', { weekday: 'short', hour: 'numeric', minute: '2-digit' })
    .replace(',', '');
}

/**
 * The steep timer, docked to the bottom of every screen like a scale display.
 * State lives in useTimer: a running steep survives reloads and closing the app,
 * and the brew alert fires at zero.
 */
export default function SteepDock() {
  const t = useTimer(DEFAULTS.timerHours, { onComplete: fireBrewAlert });
  const idle = !t.isRunning && !t.finished && t.remaining === t.totalSeconds;
  const midway = !t.isRunning && t.remaining > 0 && t.remaining < t.totalSeconds;
  const clock = `${pad(t.hours)}:${pad(t.minutes)}:${pad(t.seconds)}`;
  const when = readyAt(Date.now(), t.remaining);

  let pre = 'Start now. ';
  let state = `Ready ${when}`;
  if (t.isRunning) pre = 'Steeping. ';
  else if (t.finished) { pre = ''; state = 'Done. Strain it now'; }
  else if (midway) pre = 'Paused. ';

  const go = () => {
    if (t.isRunning) { t.pause(); return; }
    requestNotificationPermission();
    t.start();
  };
  const setHours = (dir) => {
    const h = Math.min(MAX_HOURS, Math.max(MIN_HOURS, t.targetHours + dir));
    if (h !== t.targetHours) t.setHours(h);
  };
  const elapsed = t.totalSeconds - t.remaining;

  return (
    <section className="dock" data-phase={idle ? 'idle' : 'active'} data-done={t.finished || undefined} aria-labelledby="steep-title">
      <div className="dock__in">
        <h2 className="dock__title" id="steep-title">Steep</h2>
        <div className="dock__read">
          <p className="dock__clock" role="timer" aria-label="Time remaining">
            <time dateTime={`PT${t.remaining}S`}>{clock}</time>
          </p>
          <p className="dock__ready"><span className="dock__pre">{pre}</span><b>{state}</b></p>
        </div>
        <div className="day" aria-hidden="true">
          <div className="day__track">
            <span className="day__sweet" />
            <span className="day__done" style={{ width: `${((elapsed / 86400) * 100).toFixed(3)}%` }} />
            <span className="day__pin" style={{ left: `${(t.targetHours / 24) * 100}%` }} />
          </div>
          <div className="day__nums"><span>now</span><span>12 h</span><span>16</span><span>18</span><span>24 h</span></div>
        </div>
        <div className="dock__hrs" role="group" aria-label="Target steep hours">
          <button className="step" type="button" aria-label="One hour less" disabled={t.isRunning || t.targetHours <= MIN_HOURS} onClick={() => setHours(-1)}>−</button>
          <span className="dock__h">{t.targetHours} h</span>
          <button className="step" type="button" aria-label="One hour more" disabled={t.isRunning || t.targetHours >= MAX_HOURS} onClick={() => setHours(1)}>+</button>
        </div>
        <div className="dock__act">
          <button className={`go${t.isRunning ? ' is-pause' : ''}`} type="button" onClick={go}>
            {t.isRunning ? 'Pause' : midway ? 'Resume' : 'Start'}
          </button>
          <button className="reset" type="button" onClick={t.reset} disabled={idle}>Reset</button>
        </div>
        <p className="sr-only" role="status">{t.finished ? 'Brew complete. Time to strain.' : ''}</p>
      </div>
    </section>
  );
}
