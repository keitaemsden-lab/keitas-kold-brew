import React, { useState } from 'react';
import { Coffee, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Warm-styled informational card showing brewing tips.
 * Can be static or collapsible with smooth expand/collapse animation.
 *
 * @param {{
 *   tips: string[],
 *   collapsible?: boolean,
 *   title?: string
 * }} props
 * - tips: array of tip strings to display
 * - collapsible: if true, shows expand/collapse toggle (default false)
 * - title: card header title (default "Tips")
 */
export default function TipCard({ tips, collapsible = false, title = 'Tips' }) {
  const [isOpen, setIsOpen] = useState(!collapsible); // open by default if not collapsible

  const handleToggle = () => {
    if (collapsible) {
      setIsOpen(prev => !prev);
    }
  };

  return (
    <div className="bg-brew-mid border-l-2 border-brew-accent rounded-card overflow-hidden">
      {/* Header */}
      <button
        type="button"
        className={`
          w-full flex items-center justify-between px-4 py-3
          ${collapsible ? 'cursor-pointer hover:bg-brew-surface transition-colors' : 'cursor-default'}
        `}
        onClick={handleToggle}
        disabled={!collapsible}
        aria-expanded={isOpen}
        aria-label={collapsible ? `${title} - click to ${isOpen ? 'collapse' : 'expand'}` : undefined}
      >
        <div className="flex items-center gap-2">
          <Coffee size={16} className="text-brew-accent flex-shrink-0" />
          <span className="text-brew-cream font-display italic text-sm">{title}</span>
        </div>
        {collapsible && (
          isOpen
            ? <ChevronUp size={16} className="text-brew-muted flex-shrink-0" />
            : <ChevronDown size={16} className="text-brew-muted flex-shrink-0" />
        )}
      </button>

      {/* Tips list */}
      {isOpen && (
        <ul className="px-4 pb-3 space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-brew-muted text-sm font-body">
              <span className="text-brew-accent mt-0.5 flex-shrink-0">·</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
