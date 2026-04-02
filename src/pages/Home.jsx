import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Droplets, Wind, ChevronRight } from 'lucide-react';
import UnitToggle from '../components/UnitToggle';
import { useLocalStorage, STORAGE_KEYS } from '../hooks/useLocalStorage';

const CARDS = [
  {
    to: '/concentrate',
    Icon: Coffee,
    title: 'Concentrate',
    desc: 'How much coffee & water do I need?',
  },
  {
    to: '/dilution',
    Icon: Droplets,
    title: 'Dilution',
    desc: 'Mix your concentrate to drinking strength',
  },
  {
    to: '/foam',
    Icon: Wind,
    title: 'Cold Foam',
    desc: 'Silky foam ratios for any batch size',
  },
];

export default function Home() {
  const [unit, setUnit] = useLocalStorage(STORAGE_KEYS.UNIT, 'metric');

  return (
    <div className="min-h-screen bg-brew-bg pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-8 pb-4">
        <div>
          <img
            src="/icons/logo-512.png"
            alt="Keita's Kold Brew"
            className="h-10 w-auto"
          />
          <p className="text-brew-muted text-xs font-body italic mt-0.5">
            Brewed to perfection. Every time.
          </p>
        </div>
        <UnitToggle unit={unit} onChange={setUnit} />
      </header>

      {/* Divider */}
      <div className="border-t border-brew-border mx-6 mb-6" />

      {/* Navigation Cards */}
      <div className="space-y-3 px-6">
        {CARDS.map(({ to, Icon, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 bg-brew-surface border border-brew-border rounded-card p-4 hover:border-brew-accent transition-colors"
          >
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-brew-mid rounded-input">
              <Icon size={22} className="text-brew-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-brew-text font-body font-semibold">{title}</p>
              <p className="text-brew-muted text-sm font-body">{desc}</p>
            </div>
            <ChevronRight size={18} className="text-brew-muted flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
