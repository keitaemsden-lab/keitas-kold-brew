import React from 'react';

const OPTIONS = [
  { value: 'metric',   label: 'Metric',   sub: 'ml / g'  },
  { value: 'imperial', label: 'Imperial', sub: 'fl oz'    },
];

/**
 * Pill-style toggle between Metric (ml/g) and Imperial (fl oz).
 * Pure controlled component — the parent owns storage via useLocalStorage(STORAGE_KEYS.UNIT).
 *
 * @param {{ unit: 'metric' | 'imperial', onChange: (unit: string) => void }} props
 */
export default function UnitToggle({ unit, onChange }) {
  return (
    <div
      role="group"
      aria-label="Unit system"
      className="inline-flex items-center bg-brew-mid rounded-full p-1 gap-1"
    >
      {OPTIONS.map(({ value, label, sub }) => {
        const isActive = unit === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={isActive}
            className={`
              px-4 py-2 rounded-full text-sm font-medium font-body
              transition-all duration-200 min-h-[48px]
              flex flex-col items-center leading-tight
              ${isActive
                ? 'bg-brew-accent text-brew-bg shadow-sm'
                : 'bg-transparent text-brew-muted hover:text-brew-text'
              }
            `}
          >
            <span>{label}</span>
            <span className={`text-xs font-normal ${isActive ? 'text-brew-bg/70' : 'text-brew-muted/60'}`}>
              {sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
