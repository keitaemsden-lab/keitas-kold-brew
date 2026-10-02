import React, { useLayoutEffect, useRef, useState } from 'react';
import { snapDisplay } from '../calc/config';

export const TICK = 14;

/** Strip translation that puts display value `d` under the centre needle. */
export function rulerOffset(width, d, step) {
  return width / 2 - (d / step) * TICK;
}

/**
 * Horizontal scrub scale with a fixed red needle: drag it sideways or use the
 * arrow keys. Paired with a typed input for exact entry.
 * `pos` is the displayed value to position at (may be fractional mid-glide).
 */
export default function Ruler({ range, pos, label, valueText, onScrub, onKeySet, settle }) {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  const [drag, setDrag] = useState(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => setW(el.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const at = drag ? drag.d : pos;
  const n = Math.round(range.max / range.step);
  const tx = rulerOffset(w, at, range.step);
  const nums = [];
  for (let i = 0; i <= n; i += range.every) {
    const x = tx + i * TICK;
    const visible = x > 36 && x < w - 36 && Math.abs(x - w / 2) > 24;
    nums.push(
      <span key={i} className="ruler__num" style={{ left: `${i * TICK}px`, visibility: visible ? 'visible' : 'hidden' }}>
        {+(i * range.step).toFixed(1)}
      </span>,
    );
  }

  const onPointerDown = (e) => {
    try { ref.current.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    setDrag({ x: e.clientX, from: pos, d: pos });
  };
  const onPointerMove = (e) => {
    if (!drag) return;
    const d = Math.min(range.max, Math.max(range.min, drag.from - ((e.clientX - drag.x) / TICK) * range.step));
    setDrag({ ...drag, d });
    onScrub(snapDisplay(range, d));
  };
  const end = () => setDrag(null);

  const onKeyDown = (e) => {
    const cur = snapDisplay(range, pos);
    const big = range.step * range.every;
    const map = {
      ArrowRight: cur + range.step, ArrowUp: cur + range.step,
      ArrowLeft: cur - range.step, ArrowDown: cur - range.step,
      PageUp: cur + big, PageDown: cur - big, Home: range.min, End: range.max,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    onKeySet(snapDisplay(range, map[e.key]));
  };

  const cls = ['ruler', drag ? 'is-drag' : '', settle && !drag ? 'is-settle' : ''].filter(Boolean).join(' ');
  return (
    <div
      ref={ref}
      className={cls}
      role="slider"
      tabIndex={0}
      aria-label={`${label} scale`}
      aria-valuemin={range.min}
      aria-valuemax={range.max}
      aria-valuenow={+snapDisplay(range, at).toFixed(1)}
      aria-valuetext={valueText}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      onKeyDown={onKeyDown}
    >
      <div
        className="ruler__strip"
        aria-hidden="true"
        style={{ width: `${n * TICK + 1}px`, transform: `translate3d(${tx.toFixed(2)}px,0,0)`, backgroundSize: `${TICK}px 14px, ${TICK * range.every}px 28px` }}
      >
        {nums}
      </div>
      <span className="ruler__needle" aria-hidden="true" />
    </div>
  );
}
