import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Coffee, Droplets, Wind } from 'lucide-react';

/**
 * Fixed bottom navigation bar for the PWA.
 * Provides quick navigation to Home, Concentrate, Dilution, and Cold Foam calculators.
 * Includes safe area padding for devices with notches (iPhone X+).
 *
 * @component
 */

const NAV_ITEMS = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/concentrate', label: 'Concentrate', Icon: Coffee },
  { to: '/dilution', label: 'Dilution', Icon: Droplets },
  { to: '/foam', label: 'Cold Foam', Icon: Wind },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-brew-surface border-t border-brew-border flex z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[64px] transition-colors duration-150 font-body text-xs ${
              isActive
                ? 'text-brew-accent'
                : 'text-brew-muted hover:text-brew-text'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brew-accent rounded-full" />
              )}
              <Icon size={22} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
