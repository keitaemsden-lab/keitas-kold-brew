import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useTimer, rehydrate, TIMER_STATE_KEY } from '../hooks/useTimer';
import SteepDock from '../components/SteepDock';

afterEach(() => vi.useRealTimers());

describe('rehydrate', () => {
  it('counts time spent closed for a running timer', () => {
    const r = rehydrate({ totalSeconds: 100, endsAt: 100_000 }, 40_000);
    expect(r).toMatchObject({ remaining: 60, finished: false });
    expect(r.endsAt).toBe(100_000);
  });
  it('marks an expired running timer finished', () => {
    expect(rehydrate({ totalSeconds: 100, endsAt: 1000 }, 5000)).toMatchObject({ remaining: 0, endsAt: null, finished: true });
  });
  it('rejects junk', () => {
    expect(rehydrate(null, 0)).toBeNull();
    expect(rehydrate({ totalSeconds: 'x' }, 0)).toBeNull();
  });
});

describe('useTimer', () => {
  it('REGRESSION: a running timer survives a remount (reload)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
    const a = renderHook(() => useTimer(18));
    act(() => a.result.current.start());
    act(() => { vi.advanceTimersByTime(10_000); });
    a.unmount();
    vi.setSystemTime(1_000_000 + 70_000);
    const b = renderHook(() => useTimer(18));
    expect(b.result.current.isRunning).toBe(true);
    expect(b.result.current.remaining).toBe(18 * 3600 - 70);
  });

  it('REGRESSION: the steep dock does not reset persisted state on mount', () => {
    window.localStorage.setItem(TIMER_STATE_KEY, JSON.stringify({
      targetHours: 20, totalSeconds: 72000, remaining: 5000, endsAt: null, finished: false,
    }));
    render(<SteepDock />);
    expect(screen.getByRole('group', { name: 'Target steep hours' })).toHaveTextContent('20 h');
    expect(screen.getByRole('timer')).toHaveTextContent('01:23:20');
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
  });

  it('REGRESSION: fires onComplete at zero and shows the completion message', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const onComplete = vi.fn();
    window.localStorage.setItem(TIMER_STATE_KEY, JSON.stringify({
      targetHours: 12, totalSeconds: 43200, remaining: 3, endsAt: null, finished: false,
    }));
    const { result } = renderHook(() => useTimer(12, { onComplete }));
    act(() => result.current.start());
    act(() => { vi.advanceTimersByTime(3500); });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(result.current.finished).toBe(true);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.remaining).toBe(0);
  });

  it('pause keeps remaining, reset restores total', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const { result } = renderHook(() => useTimer(12));
    act(() => result.current.start());
    act(() => { vi.advanceTimersByTime(5000); });
    act(() => result.current.pause());
    expect(result.current.remaining).toBe(43200 - 5);
    act(() => result.current.reset());
    expect(result.current.remaining).toBe(43200);
  });
});
