import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coffee, Droplets, Sparkles, Gauge, ChevronDown, ChevronUp } from 'lucide-react';

import { calculateDilution, DEFAULTS } from '../utils/calculations';
import { formatVolume, flOzToMl, mlToFlOz } from '../utils/unitConversions';
import { useLocalStorage, STORAGE_KEYS } from '../hooks/useLocalStorage';

import UnitToggle from '../components/UnitToggle';
import SliderInput from '../components/SliderInput';
import ResultCard from '../components/ResultCard';
import TipCard from '../components/TipCard';

const TIPS = [
  "Keita's ratio makes 5L from 2L concentrate, perfect for a big batch",
  'Adjust sweetness by tweaking the sugar syrup ratio',
  'Ready-to-drink cold brew keeps 5-7 days in the fridge',
  'Serve over ice, cold brew dilutes as ice melts',
];

const RATIO_SLIDERS = [
  { key: 'concentrate', label: 'Concentrate', },
  { key: 'water',       label: 'Water',       },
  { key: 'syrup',       label: 'Sugar Syrup', },
];

export default function DilutionCalculator() {
  const [unit, setUnit] = useLocalStorage(STORAGE_KEYS.UNIT, 'metric');
  const [ratio, setRatio] = useLocalStorage(STORAGE_KEYS.DILUTION_RATIO, DEFAULTS.dilutionRatio);
  const [concentrateMl, setConcentrateMl] = useState(DEFAULTS.dilutionConcentrateMl);
  const [ratioOpen, setRatioOpen] = useState(false);

  const { waterMl, syrupMl, totalMl } = calculateDilution(concentrateMl, ratio);

  const rows = [
    { icon: <Coffee size={18} />,   label: 'Concentrate',  value: formatVolume(concentrateMl, unit) },
    { icon: <Droplets size={18} />, label: 'Water to Add', value: formatVolume(waterMl, unit),       highlight: true },
    { icon: <Sparkles size={18} />, label: 'Sugar Syrup',  value: formatVolume(syrupMl, unit) },
    { icon: <Gauge size={18} />,    label: 'Total Volume', value: formatVolume(totalMl, unit),       highlight: true },
  ];

  return (
    <div className="min-h-screen bg-brew-bg pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-brew-muted hover:text-brew-text transition-colors" aria-label="Back to home">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-brew-text text-xl font-bold">Dilution</h1>
        </div>
        <UnitToggle unit={unit} onChange={setUnit} />
      </header>

      {/* Content */}
      <div className="px-6 space-y-4">

        {/* Ratio section */}
        <div className="bg-brew-surface rounded-card overflow-hidden">
          <button
            type="button"
            onClick={() => setRatioOpen(prev => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-brew-mid transition-colors"
            aria-expanded={ratioOpen}
            aria-label={`Dilution ratio ${ratioOpen ? 'collapse' : 'expand'}`}
          >
            <span className="text-brew-muted text-sm font-body">Dilution Ratio</span>
            <div className="flex items-center gap-2">
              <span className="text-brew-cream font-body font-semibold text-sm">
                {ratio.concentrate} : {ratio.water} : {ratio.syrup}
              </span>
              {ratioOpen
                ? <ChevronUp size={16} className="text-brew-muted flex-shrink-0" />
                : <ChevronDown size={16} className="text-brew-muted flex-shrink-0" />}
            </div>
          </button>

          {ratioOpen && (
            <div className="px-4 pb-4 space-y-4">
              {RATIO_SLIDERS.map(({ key, label }) => {
                const fillPercent = ((ratio[key] - 1) / 9) * 100;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-brew-muted font-body">{label}</span>
                      <span className="text-brew-text font-body font-medium">{ratio[key]} parts</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={ratio[key]}
                      onChange={e => setRatio(prev => ({ ...prev, [key]: parseInt(e.target.value, 10) }))}
                      style={{
                        background: `linear-gradient(to right, #C8956C ${fillPercent}%, #3D2B14 ${fillPercent}%)`,
                      }}
                      className="w-full h-2 rounded-full cursor-pointer appearance-none"
                      aria-label={`${label} ratio parts`}
                    />
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-2 border-t border-brew-border">
                <button
                  type="button"
                  onClick={() => setRatio(DEFAULTS.dilutionRatio)}
                  className="text-brew-accent text-sm font-body underline underline-offset-2"
                >
                  Reset to Keita's (4:5:1)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Concentrate volume input */}
        <SliderInput
          label="Concentrate Volume"
          value={
            unit === 'imperial'
              ? parseFloat(mlToFlOz(concentrateMl).toFixed(1))
              : concentrateMl
          }
          onChange={val =>
            setConcentrateMl(unit === 'imperial' ? flOzToMl(val) : val)
          }
          min={unit === 'imperial' ? 3 : 100}
          max={unit === 'imperial' ? 100 : 3000}
          step={unit === 'imperial' ? 1 : 50}
          unit={unit === 'imperial' ? ' fl oz' : ' ml'}
        />

        {/* Results */}
        <ResultCard rows={rows} />

        {/* Tips */}
        <TipCard tips={TIPS} collapsible title="Serving Tips" />

      </div>
    </div>
  );
}
