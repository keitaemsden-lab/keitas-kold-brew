import React, { useEffect, useState } from 'react';

/** Clamp a typed string to the range. Returns null when it is not a number. */
export function parseExact(str, min, max) {
  const v = parseFloat(String(str).replace(',', '.'));
  if (!Number.isFinite(v)) return null;
  return Math.min(max, Math.max(min, v));
}

/**
 * Typed value for exact entry. Updates the batch as you type when the number
 * is in range, and clamps and tidies on blur or Enter. Wide enough for four
 * digits plus a decimal.
 */
export default function ExactInput({ id, label, value, min, max, step, unit, onCommit }) {
  const shown = String(+value.toFixed(1));
  const [str, setStr] = useState(shown);
  const [editing, setEditing] = useState(false);

  useEffect(() => { if (!editing) setStr(shown); }, [shown, editing]);

  const commit = () => {
    const v = parseExact(str, min, max);
    if (v !== null) onCommit(v);
    setEditing(false);
  };

  return (
    <div className="exact">
      <label className="exact__label" htmlFor={id}>{label}</label>
      <input
        id={id}
        className="exact__in"
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={editing ? str : shown}
        onFocus={() => { setEditing(true); setStr(shown); }}
        onChange={(e) => {
          setStr(e.target.value);
          const v = parseFloat(e.target.value);
          if (Number.isFinite(v) && v >= min && v <= max) onCommit(v);
        }}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
      />
      <span className="exact__unit">{unit}</span>
    </div>
  );
}
