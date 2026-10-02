import { useEffect, useState } from 'react';

function read(key) {
  try { return JSON.parse(window.localStorage.getItem(key)); } catch { return null; }
}
function write(key, v) {
  try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
}

export const amountKey = (calc) => `kkb_${calc.key}_amount`;

/** Saved ratio parts for a calculator, in the shape the first release stored. */
export function readParts(calc) {
  return calc.fromStore(read(calc.storeKey)) || { ...calc.partsDef };
}
/** Saved batch amount (base units: g or ml), clamped to the metric range. */
export function readAmount(calc) {
  const v = read(amountKey(calc));
  if (!Number.isFinite(v)) return calc.def;
  return Math.min(calc.metric.max, Math.max(1, v));
}

export function useParts(calc) {
  const [parts, setParts] = useState(() => readParts(calc));
  useEffect(() => { write(calc.storeKey, calc.toStore(parts)); }, [calc, parts]);
  return [parts, setParts];
}

/** The amount persists after the value settles, not on every drag frame. */
export function useAmount(calc) {
  const [value, setValue] = useState(() => readAmount(calc));
  useEffect(() => {
    const id = setTimeout(() => write(amountKey(calc), value), 250);
    return () => clearTimeout(id);
  }, [calc, value]);
  return [value, setValue];
}
