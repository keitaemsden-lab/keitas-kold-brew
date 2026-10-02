import React, { useLayoutEffect, useRef, useState } from 'react';
import { formatVolume, ML_PER_CUP } from '../utils/unitConversions';
import { snapDisplay, toBase, toDisplay } from '../calc/config';

const STEPS = [0.25, 0.5, 1, 2, 2.5, 5, 10, 20];

/** Litre (or cup) graduations for a vessel holding `capMl`, at most seven marks. */
export function graduations(capMl, unit, height) {
  const imp = unit === 'imperial';
  const capU = capMl / (imp ? ML_PER_CUP : 1000);
  let st = STEPS[STEPS.length - 1];
  for (const s of STEPS) { if (capU / s <= 7) { st = s; break; } }
  const marks = [];
  for (let u = st; u <= capU + 1e-9; u += st) {
    marks.push({ y: (u / capU) * height, label: `${+u.toFixed(2)} ${imp ? 'cups' : 'L'}` });
  }
  const px = (st / capU) * height;
  return { marks, minor: px / 2 >= 8 ? px / 2 : px };
}

/** Layer heights in px for a batch drawn to scale in a vessel `height` px tall. */
export function layerHeights(jar, height) {
  const fh = jar.cap > 0 ? (jar.total / jar.cap) * height : 0;
  return { fill: fh, layers: jar.layers.map(([kind, ml]) => ({ kind, h: jar.total > 0 ? (ml / jar.total) * fh : 0 })) };
}

/**
 * The batch drawn to scale. Drag the red fill line (or anywhere in the glass)
 * to set the batch; the line is also a keyboard slider.
 */
export default function Vessel({ calc, unit, parts, shown, value, onSet, onKeySet, settle }) {
  const range = calc[unit];
  const glassRef = useRef(null);
  const [h, setH] = useState(0);
  const [drag, setDrag] = useState(false);

  useLayoutEffect(() => {
    const el = glassRef.current;
    if (!el) return undefined;
    const measure = () => setH(el.clientHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const maxBase = toBase(calc, unit, range.max);
  const jar = calc.jar(shown, parts, maxBase);
  const { fill, layers } = layerHeights(jar, h);
  const grad = graduations(jar.cap, unit, h);
  const d = toDisplay(calc, unit, value);

  const fromY = (y) => {
    const r = glassRef.current.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (r.bottom - y) / (r.height || 1)));
    return toBase(calc, unit, snapDisplay(range, f * range.max));
  };
  const onPointerDown = (e) => {
    setDrag(true);
    try { glassRef.current.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    onSet(fromY(e.clientY));
  };
  const onPointerMove = (e) => { if (drag) onSet(fromY(e.clientY)); };
  const end = () => setDrag(false);

  const onKeyDown = (e) => {
    const cur = snapDisplay(range, d);
    const big = range.step * range.every;
    const map = {
      ArrowUp: cur + range.step, ArrowRight: cur + range.step,
      ArrowDown: cur - range.step, ArrowLeft: cur - range.step,
      PageUp: cur + big, PageDown: cur - big, Home: range.min, End: range.max,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    onKeySet(toBase(calc, unit, snapDisplay(range, map[e.key])));
  };

  const cls = ['jar', drag ? 'is-drag' : '', settle ? 'is-settle' : ''].filter(Boolean).join(' ');
  return (
    <figure className={cls} style={{ '--minor': `${grad.minor.toFixed(2)}px` }}>
      <div className="jar__scale" aria-hidden="true">
        {grad.marks.map((m) => <span key={m.label} style={{ bottom: `${m.y.toFixed(1)}px` }}>{m.label}</span>)}
      </div>
      <div
        className="jar__glass"
        ref={glassRef}
        data-testid="vessel-glass"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div className="jar__fill">
          {layers.map((l, i) => <i key={`${l.kind}-${i}`} className={`l-${l.kind}`} style={{ height: `${l.h.toFixed(2)}px` }} />)}
        </div>
        <div
          className={`jar__line${fill > h - 40 ? ' is-high' : ''}`}
          style={{ bottom: `${fill.toFixed(2)}px` }}
          role="slider"
          tabIndex={0}
          aria-label={`${calc.label} fill line`}
          aria-valuemin={range.min}
          aria-valuemax={range.max}
          aria-valuenow={+d.toFixed(1)}
          aria-valuetext={`${+d.toFixed(1)} ${range.u}`}
          onKeyDown={onKeyDown}
        >
          <span className="jar__tab">{formatVolume(jar.total, unit)} {jar.tab}</span>
        </div>
      </div>
      <figcaption className="jar__cap">Drawn to scale. Drag the red line or use the arrow keys.</figcaption>
    </figure>
  );
}
