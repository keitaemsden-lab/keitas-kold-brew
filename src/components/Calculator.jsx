import React, { useCallback, useEffect, useRef, useState } from 'react';
import Vessel from './Vessel';
import Ruler from './Ruler';
import ExactInput from './ExactInput';
import { SWATCH, formatInput, snapDisplay, stepPart, toBase, toDisplay } from '../calc/config';
import { useAmount, useParts } from '../state/calcStore';
import { useUnit } from '../state/unit';
import { useReducedMotion } from '../hooks/useReducedMotion';

const GLIDE_MS = 1000;
const expoOut = (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

/** Split "12.00 L" into figure and unit so the unit can sit smaller. */
function Figure({ text }) {
  const m = /^([\d.]+)\s(.+)$/.exec(text);
  if (!m) return <span className="n">{text}</span>;
  return <><span className="n">{m[1]}</span><span className="u">{` ${m[2]}`}</span></>;
}

export default function Calculator({ calc }) {
  const { unit } = useUnit();
  const reduce = useReducedMotion();
  const range = calc[unit];
  const [value, setValue] = useAmount(calc);
  const [parts, setParts] = useParts(calc);
  const [pour, setPour] = useState(null); // continuous value while a preset glides
  const [settle, setSettle] = useState(false);
  const raf = useRef(0);

  const stopGlide = useCallback(() => { cancelAnimationFrame(raf.current); raf.current = 0; setPour(null); }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  useEffect(() => { document.title = `${calc.title} · Keita's Kold Brew`; }, [calc]);

  const setDirect = (base) => { stopGlide(); setSettle(false); setValue(base); };
  const setStepped = (base) => { stopGlide(); setSettle(!reduce); setValue(base); };

  const glideTo = (target) => {
    stopGlide();
    setSettle(false);
    if (reduce) { setValue(target); return; }
    const from = pour ?? value;
    const t0 = performance.now();
    const frame = (now) => {
      const t = Math.min(1, (now - t0) / GLIDE_MS);
      const b = from + (target - from) * expoOut(t);
      if (t < 1) {
        setPour(b);
        setValue(toBase(calc, unit, snapDisplay(range, toDisplay(calc, unit, b))));
        raf.current = requestAnimationFrame(frame);
      } else {
        raf.current = 0;
        setPour(null);
        setValue(target);
      }
    };
    raf.current = requestAnimationFrame(frame);
  };

  const shown = pour ?? value;
  const d = toDisplay(calc, unit, value);
  const rows = calc.out(value, parts, unit);
  const lead = rows[0];
  const spec = [{ label: calc.label, value: formatInput(calc, unit, value), note: calc.kind === 'w' ? 'Extra coarse grind' : '' }, ...rows];

  const changePart = (part, dir) => setParts((p) => ({ ...p, [part.key]: stepPart(part, p[part.key], dir) }));
  const isDefault = calc.parts.every((pt) => parts[pt.key] === calc.partsDef[pt.key]);

  return (
    <>
      <section className="bench" aria-labelledby="calc-title">
        <div className="sheet__head">
          <h1 className="sheet__title" id="calc-title">{calc.title}</h1>
          <p className="sheet__dek">{calc.dek}</p>
        </div>

        <div className="pour">
          <Vessel
            calc={calc}
            unit={unit}
            parts={parts}
            shown={shown}
            value={value}
            settle={settle}
            onSet={setDirect}
            onKeySet={setStepped}
          />
          <div className="ctl">
            <ExactInput
              id={`exact-${calc.key}`}
              label={calc.label}
              value={d}
              min={range.min}
              max={range.max}
              step={range.step}
              unit={range.u}
              onCommit={(v) => setDirect(toBase(calc, unit, v))}
            />
            <Ruler
              range={range}
              pos={toDisplay(calc, unit, shown)}
              label={calc.label}
              valueText={formatInput(calc, unit, value)}
              settle={settle}
              onScrub={(v) => setDirect(toBase(calc, unit, v))}
              onKeySet={(v) => setStepped(toBase(calc, unit, v))}
            />
            <div className="presets" role="group" aria-label="Batch presets">
              {calc.presets.map(([name, base]) => (
                <button
                  key={name}
                  type="button"
                  className="preset"
                  aria-pressed={Math.abs(base - value) < 1}
                  onClick={() => glideTo(base)}
                >
                  {name}<span>{formatInput(calc, unit, base)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="read">
          <div className="lead">
            <p className="lead__label">{lead.label}</p>
            <p className="lead__value" data-testid="lead-value"><Figure text={lead.value} /></p>
          </div>

          <table className="spec">
            <caption className="sr-only">Batch specification</caption>
            <tbody>
              {spec.map((r, i) => (
                <tr key={r.label} className="is-enter" style={{ '--i': i }}>
                  <th scope="row">
                    <i aria-hidden="true" style={r.swatch ? { background: SWATCH[r.swatch] } : { borderColor: 'transparent' }} />
                    <span>{r.label}{r.note ? <small>{r.note}</small> : null}</span>
                  </th>
                  <td>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="parts" role="group" aria-label={`Ratio ${calc.summary(parts)}`}>
            {calc.parts.map((pt) => (
              <div className="part" key={pt.key}>
                <span className="part__name" id={`pn-${pt.key}`}>{pt.name}</span>
                <button type="button" className="step" aria-label={`Fewer ${pt.short} parts`} disabled={parts[pt.key] <= pt.min} onClick={() => changePart(pt, -1)}>−</button>
                <output className="part__val" aria-labelledby={`pn-${pt.key}`}>{pt.fixed ? parts[pt.key].toFixed(pt.fixed) : parts[pt.key]}</output>
                <button type="button" className="step" aria-label={`More ${pt.short} parts`} disabled={parts[pt.key] >= pt.max} onClick={() => changePart(pt, 1)}>+</button>
              </div>
            ))}
            <button type="button" className="part__reset" disabled={isDefault} onClick={() => setParts({ ...calc.partsDef })}>{calc.resetLabel}</button>
          </div>
        </div>
      </section>

      <section className="method" aria-labelledby="method-title">
        <h2 className="method__title" id="method-title">Method</h2>
        <ol className="method__list">
          {calc.method.map((m) => <li key={m}>{m}</li>)}
        </ol>
      </section>
    </>
  );
}
