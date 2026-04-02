import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GlassWater, Sparkles, Droplets, Gauge } from 'lucide-react';

import { calculateColdFoam, DEFAULTS } from '../utils/calculations';
import { formatVolume, flOzToMl, mlToFlOz } from '../utils/unitConversions';
import { useLocalStorage, STORAGE_KEYS } from '../hooks/useLocalStorage';

import UnitToggle from '../components/UnitToggle';
import SliderInput from '../components/SliderInput';
import ResultCard from '../components/ResultCard';
import TipCard from '../components/TipCard';
import SaveRatioButton from '../components/SaveRatioButton';

const TIPS = [
  'Ingredients must be very cold before frothing',
  'Froth for 15–25 seconds — stop at soft, pourable peaks',
  'Make fresh — foam separates after ~15 minutes',
  'Use a handheld milk frother for best results',
  "Don't over-whip — you want pourable foam, not stiff cream",
];

const DEFAULT_RATIO = DEFAULTS.foamRatio; // { cream: 8, syrup: 2, milk: 1 }

export default function ColdFoamCalculator() {
  const [unit, setUnit] = useLocalStorage(STORAGE_KEYS.UNIT, 'metric');
  const [ratio, setRatio] = useLocalStorage(STORAGE_KEYS.FOAM_RATIO, DEFAULT_RATIO);
  const [totalMl, setTotalMl] = useState(DEFAULTS.foamTotalMl);

  const { creamMl, syrupMl, milkMl } = calculateColdFoam(totalMl, ratio);

  const handlePartChange = (part) => (val) => {
    setRatio((prev) => ({ ...prev, [part]: val }));
  };

  const handleResetRatio = () => {
    setRatio(DEFAULT_RATIO);
  };

  // Preset quick-select pills — imperial values rounded to 1 decimal for comparison
  const imperialPresets = [1.7, 3.4, 5.1, 6.8];
  const metricPresets   = [50, 100, 150, 200];

  const isPresetActive = (preset) => {
    if (unit === 'imperial') {
      return Math.round(mlToFlOz(totalMl) * 10) / 10 === preset;
    }
    return Math.round(totalMl) === preset;
  };

  const resultRows = [
    {
      icon: <GlassWater size={18} />,
      label: 'Heavy Cream',
      value: formatVolume(creamMl, unit),
      highlight: true,
    },
    {
      icon: <Sparkles size={18} />,
      label: 'Sugar Syrup',
      value: formatVolume(syrupMl, unit),
    },
    {
      icon: <Droplets size={18} />,
      label: 'Full Cream Milk',
      value: formatVolume(milkMl, unit),
    },
    {
      icon: <Gauge size={18} />,
      label: 'Total Volume',
      value: formatVolume(totalMl, unit),
      highlight: true,
    },
  ];

  return (
    <div className="bg-brew-bg min-h-screen pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-brew-muted hover:text-brew-text transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-brew-text text-xl font-bold">Cold Foam</h1>
        </div>
        <UnitToggle unit={unit} onChange={setUnit} />
      </header>

      {/* Scrollable content */}
      <div className="px-6 space-y-4">

        {/* Ratio section */}
        <div className="bg-brew-surface rounded-card p-4 space-y-3">
          {/* Ratio display heading */}
          <div className="flex items-center justify-between">
            <span className="text-brew-muted text-sm font-body">Cream : Syrup : Milk</span>
            <span className="text-brew-cream font-body font-semibold">
              {ratio.cream} : {ratio.syrup} : {ratio.milk}
            </span>
          </div>

          {/* Three part sliders */}
          <SliderInput
            label="Cream Parts"
            value={ratio.cream}
            onChange={handlePartChange('cream')}
            min={1}
            max={10}
            step={1}
            unit=" parts"
          />

          <SliderInput
            label="Syrup Parts"
            value={ratio.syrup}
            onChange={handlePartChange('syrup')}
            min={1}
            max={10}
            step={1}
            unit=" parts"
          />

          <SliderInput
            label="Milk Parts"
            value={ratio.milk}
            onChange={handlePartChange('milk')}
            min={1}
            max={10}
            step={1}
            unit=" parts"
          />

          {/* Reset + Save row */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleResetRatio}
              className="text-brew-accent text-sm font-body underline underline-offset-2"
            >
              Reset to Keita's (8:2:1)
            </button>
            <SaveRatioButton
              onSave={() => setRatio(ratio)}
              label="Save foam ratio"
            />
          </div>
        </div>

        {/* Total volume section */}
        <div className="bg-brew-surface rounded-card p-4 space-y-3">
          <span className="text-brew-muted text-sm font-body block">Total Foam Volume</span>

          {/* Preset quick-select pills */}
          <div className="flex gap-2">
            {(unit === 'imperial' ? imperialPresets : metricPresets).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() =>
                  setTotalMl(unit === 'imperial' ? flOzToMl(preset) : preset)
                }
                className={`flex-1 py-2 rounded-full text-sm font-body transition-colors min-h-[40px] ${
                  isPresetActive(preset)
                    ? 'bg-brew-accent text-brew-bg font-medium'
                    : 'bg-brew-mid text-brew-muted hover:text-brew-text'
                }`}
              >
                {preset}{unit === 'imperial' ? 'oz' : 'ml'}
              </button>
            ))}
          </div>

          <SliderInput
            label="Total Foam Volume"
            value={
              unit === 'imperial'
                ? parseFloat(mlToFlOz(totalMl).toFixed(1))
                : totalMl
            }
            onChange={(val) =>
              setTotalMl(unit === 'imperial' ? flOzToMl(val) : val)
            }
            min={unit === 'imperial' ? 0.5 : 20}
            max={unit === 'imperial' ? 14 : 400}
            step={unit === 'imperial' ? 0.5 : 10}
            unit={unit === 'imperial' ? ' fl oz' : ' ml'}
          />
        </div>

        {/* Results */}
        <ResultCard rows={resultRows} />

        {/* Tips */}
        <TipCard tips={TIPS} collapsible title="Technique Tips" />

      </div>
    </div>
  );
}
