import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coffee, Droplets, Package } from 'lucide-react';

import { calculateConcentrate, DEFAULTS } from '../utils/calculations';
import { formatVolume, formatWeight, gToOz, ozToG } from '../utils/unitConversions';
import { useLocalStorage, STORAGE_KEYS } from '../hooks/useLocalStorage';

import UnitToggle from '../components/UnitToggle';
import SliderInput from '../components/SliderInput';
import ResultCard from '../components/ResultCard';
import TipCard from '../components/TipCard';
import SaveRatioButton from '../components/SaveRatioButton';
import Timer from '../components/Timer';

const TIPS = [
  'Use a coarse (extra coarse) grind — essential for cold brew',
  'Steep in the fridge for 12–24 hours; 16–18 hours is the sweet spot',
  'Use filtered water for the cleanest flavour',
  'After steeping, strain through a fine mesh or coffee filter',
  'Expected yield accounts for ~20% absorption by the coffee grounds',
];

export default function ConcentrateCalculator() {
  const [unit, setUnit] = useLocalStorage(STORAGE_KEYS.UNIT, 'metric');
  const [ratio, setRatio] = useLocalStorage(STORAGE_KEYS.CONCENTRATE_RATIO, DEFAULTS.concentrateRatio);
  const [coffeeGrams, setCoffeeGrams] = useState(DEFAULTS.concentrateCoffeeG);

  const { waterMl, expectedYieldMl } = calculateConcentrate(coffeeGrams, ratio);

  // Slider config switches between metric and imperial
  const coffeeSliderValue = unit === 'imperial' ? gToOz(coffeeGrams) : coffeeGrams;
  const coffeeSliderMin   = unit === 'imperial' ? 0.5  : 10;
  const coffeeSliderMax   = unit === 'imperial' ? 18   : 500;
  const coffeeSliderStep  = unit === 'imperial' ? 0.5  : 5;
  const coffeeSliderUnit  = unit === 'imperial' ? ' oz' : ' g';

  const handleCoffeeChange = (val) => {
    setCoffeeGrams(unit === 'imperial' ? ozToG(val) : val);
  };

  // Inline style for the ratio range track fill
  const ratioFillPercent = ((ratio - 3) / (8 - 3)) * 100;
  const ratioTrackStyle = {
    background: `linear-gradient(to right, #C8956C ${ratioFillPercent}%, #3D2B14 ${ratioFillPercent}%)`,
  };

  const resultRows = [
    {
      icon: <Coffee size={18} />,
      label: 'Coffee Grounds',
      value: formatWeight(coffeeGrams, unit),
    },
    {
      icon: <Droplets size={18} />,
      label: 'Water Needed',
      value: formatVolume(waterMl, unit),
      highlight: true,
    },
    {
      icon: <Package size={18} />,
      label: 'Expected Yield',
      value: formatVolume(expectedYieldMl, unit),
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
          <h1 className="font-display text-brew-text text-xl font-bold">Concentrate</h1>
        </div>
        <UnitToggle unit={unit} onChange={setUnit} />
      </header>

      {/* Scrollable content */}
      <div className="px-6 space-y-4">

        {/* Ratio section */}
        <div className="bg-brew-surface rounded-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-brew-muted text-sm font-body">Coffee : Water Ratio</span>
            <span className="text-brew-cream font-body font-semibold">1 : {ratio.toFixed(1)}</span>
          </div>

          <input
            type="range"
            min={3}
            max={8}
            step={0.5}
            value={ratio}
            onChange={(e) => setRatio(parseFloat(e.target.value))}
            style={ratioTrackStyle}
            className="w-full h-2 rounded-full cursor-pointer appearance-none"
            aria-label="Coffee to water ratio"
          />

          <div className="flex justify-between text-brew-muted text-xs font-body">
            <span>1 : 3</span>
            <span>1 : 8</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setRatio(DEFAULTS.concentrateRatio)}
              className="text-brew-accent text-sm font-body underline underline-offset-2"
            >
              Reset to Keita's (1:4)
            </button>
            <SaveRatioButton
              onSave={() => setRatio(ratio)}
              label="Save ratio"
            />
          </div>
        </div>

        {/* Coffee grounds section */}
        <SliderInput
          label="Coffee Grounds"
          value={coffeeSliderValue}
          onChange={handleCoffeeChange}
          min={coffeeSliderMin}
          max={coffeeSliderMax}
          step={coffeeSliderStep}
          unit={coffeeSliderUnit}
        />

        {/* Results */}
        <ResultCard rows={resultRows} />

        {/* Brew timer */}
        <Timer defaultHours={DEFAULTS.timerHours} />

        {/* Tips */}
        <TipCard
          tips={TIPS}
          collapsible
          title="Brew Tips"
        />
      </div>
    </div>
  );
}
