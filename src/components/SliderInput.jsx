import React, { useState } from 'react';

/**
 * Labelled numeric input with a synced range slider.
 * Used for coffee grams, concentrate volume, ratio settings, etc.
 *
 * @param {{
 *   label: string,
 *   value: number,
 *   onChange: (n: number) => void,
 *   min: number,
 *   max: number,
 *   step: number,
 *   unit: string
 * }} props
 */
export default function SliderInput({ label, value, onChange, min, max, step, unit }) {
  const [inputStr, setInputStr] = useState(String(value));

  // Keep the text input in sync when value changes externally (e.g. unit conversion)
  React.useEffect(() => {
    setInputStr(String(value));
  }, [value]);

  const handleInputChange = (e) => setInputStr(e.target.value);

  const handleInputCommit = () => {
    const parsed = parseFloat(inputStr);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    } else {
      // Revert to last known good value if the string is unparseable
      setInputStr(String(value));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleInputCommit();
  };

  const handleStep = (dir) => {
    const newVal = Math.min(max, Math.max(min, value + dir * step));
    onChange(newVal);
  };

  // Inline style for cross-browser filled-track colour since Tailwind cannot target
  // the range pseudo-elements natively. Hex values match brew-accent and brew-mid tokens.
  const fillPercent = ((value - min) / (max - min)) * 100;
  const sliderStyle = {
    background: `linear-gradient(to right, #C8956C ${fillPercent}%, #3D2B14 ${fillPercent}%)`,
  };

  return (
    <div className="bg-brew-surface rounded-card p-4 space-y-3">
      {/* Row 1: label left, stepper + numeric input right */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-brew-muted text-sm font-body">{label}</span>

        <div className="flex items-center gap-2">
          {/* Decrement button */}
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="w-11 h-11 flex items-center justify-center bg-brew-mid rounded-input text-brew-text text-lg hover:bg-brew-border transition-colors"
            aria-label={`Decrease ${label}`}
          >
            {/* Unicode minus sign — visually heavier than a hyphen */}
            −
          </button>

          {/* Numeric text input + unit label */}
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={inputStr}
              onChange={handleInputChange}
              onBlur={handleInputCommit}
              onKeyDown={handleKeyDown}
              inputMode="decimal"
              aria-label={label}
              className="w-20 text-center text-brew-text text-2xl font-semibold font-body bg-brew-mid rounded-input p-1 border border-brew-border focus:outline-none focus:border-brew-accent"
            />
            <span className="text-brew-muted text-sm font-body">{unit}</span>
          </div>

          {/* Increment button */}
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="w-11 h-11 flex items-center justify-center bg-brew-mid rounded-input text-brew-text text-lg hover:bg-brew-border transition-colors"
            aria-label={`Increase ${label}`}
          >
            +
          </button>
        </div>
      </div>

      {/* Row 2: range slider — appearance reset handled globally in index.css */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={sliderStyle}
        className="w-full h-2 rounded-full cursor-pointer appearance-none"
        aria-label={label}
      />

      {/* Row 3: min / max end labels */}
      <div className="flex justify-between text-brew-muted text-xs font-body">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
