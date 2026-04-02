import React from 'react';

/**
 * Dark surface card displaying labelled result values.
 * Used by all three calculators to show live-updating results.
 *
 * @param {{ rows: Array<{ icon: React.ReactNode, label: string, value: string, highlight?: boolean }> }} props
 *   - rows: Array of result rows, each with icon, label, value, and optional highlight flag
 */
export default function ResultCard({ rows }) {
  return (
    <div className="bg-brew-surface rounded-card overflow-hidden">
      {rows.map((row, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center justify-between py-4 px-5">
            <div className="flex items-center">
              <span className="text-brew-accent mr-3 flex-shrink-0">
                {row.icon}
              </span>
              <span className="text-brew-muted text-sm font-body">{row.label}</span>
            </div>
            <span
              className={`text-xl font-semibold font-body value-transition ${
                row.highlight ? 'text-brew-cream' : 'text-brew-text'
              }`}
            >
              {row.value}
            </span>
          </div>
          {index < rows.length - 1 && (
            <div className="border-t border-brew-border" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
