// The three calculators as data. Maths comes from utils/calculations.js; this
// file only decides ranges, presets, copy and how each batch is drawn in the vessel.
import { calculateConcentrate, calculateDilution, calculateColdFoam, DEFAULTS } from '../utils/calculations';
import { formatVolume, formatWeight, G_PER_OZ, ML_PER_FLOZ } from '../utils/unitConversions';

export const SWATCH = {
  brew: '#2E1C12',
  held: '#6E4B33',
  water: '#A9C0C6',
  syrup: '#C98B3D',
  cream: '#EFE3C8',
  milk: '#FBFAF6',
};

export const CALCS = {
  concentrate: {
    key: 'concentrate',
    path: '/concentrate',
    title: 'Concentrate',
    dek: 'How much coffee and water for this batch.',
    label: 'Coffee',
    kind: 'w',
    def: DEFAULTS.concentrateCoffeeG,
    metric: { min: 10, max: 3500, step: 50, every: 10, u: 'g' },
    imperial: { min: 1, max: 124, step: 1, every: 10, u: 'oz' },
    presets: [['Jug', 500], ['Batch', 1500], ['Toddy', 3000]],
    parts: [{ key: 'ratio', name: 'Water per part coffee', short: 'water', min: 3, max: 8, step: 0.5, fixed: 1 }],
    partsDef: { ratio: DEFAULTS.concentrateRatio },
    storeKey: 'kkb_concentrate_ratio',
    // Stored as a bare number since the first release; keep that shape.
    fromStore: (v) => (Number.isFinite(v) ? { ratio: v } : null),
    toStore: (p) => p.ratio,
    resetLabel: "Reset to Keita's 1 : 4",
    summary: (p) => `1 : ${p.ratio.toFixed(1)}`,
    out(v, p, u) {
      const { waterMl, expectedYieldMl } = calculateConcentrate(v, p.ratio);
      return [
        { label: 'Water to add', value: formatVolume(waterMl, u), swatch: 'water' },
        { label: 'Expected yield', value: formatVolume(expectedYieldMl, u), note: 'Grounds hold about 20%', swatch: 'brew' },
        { label: 'Ratio', value: `1 : ${p.ratio.toFixed(1)}`, note: 'Coffee to water by weight' },
      ];
    },
    jar(v, p, maxBase) {
      const { waterMl, expectedYieldMl } = calculateConcentrate(v, p.ratio);
      return { cap: maxBase * p.ratio, total: waterMl, tab: 'water', layers: [['held', waterMl - expectedYieldMl], ['brew', expectedYieldMl]] };
    },
    method: [
      'Use an extra coarse grind, essential for cold brew',
      'Steep in the fridge for 12 to 24 hours; 16 to 18 hours is the sweet spot',
      'Use filtered water for the cleanest flavour',
      'After steeping, strain through a fine mesh or a coffee filter',
      'Expected yield accounts for about 20% absorption by the grounds',
    ],
  },
  dilution: {
    key: 'dilution',
    path: '/dilution',
    title: 'Dilution',
    dek: 'Mix concentrate down to drinking strength.',
    label: 'Concentrate',
    kind: 'v',
    def: DEFAULTS.dilutionConcentrateMl,
    metric: { min: 100, max: 3000, step: 50, every: 10, u: 'ml' },
    imperial: { min: 3, max: 100, step: 1, every: 10, u: 'fl oz' },
    presets: [['Litre', 1000], ["Keita's batch", 2000], ['Max', 3000]],
    parts: [
      { key: 'concentrate', name: 'Concentrate', short: 'concentrate', min: 1, max: 10, step: 1 },
      { key: 'water', name: 'Water', short: 'water', min: 1, max: 10, step: 1 },
      { key: 'syrup', name: 'Sugar syrup', short: 'sugar syrup', min: 1, max: 10, step: 1 },
    ],
    partsDef: { ...DEFAULTS.dilutionRatio },
    storeKey: 'kkb_dilution_ratio',
    fromStore: (v) => (v && ['concentrate', 'water', 'syrup'].every((k) => Number.isFinite(v[k])) ? v : null),
    toStore: (p) => p,
    resetLabel: "Reset to Keita's 4 : 5 : 1",
    summary: (p) => `${p.concentrate} : ${p.water} : ${p.syrup}`,
    out(v, p, u) {
      const { waterMl, syrupMl, totalMl } = calculateDilution(v, p);
      return [
        { label: 'Water to add', value: formatVolume(waterMl, u), swatch: 'water' },
        { label: 'Sugar syrup', value: formatVolume(syrupMl, u), swatch: 'syrup' },
        { label: 'Total to bottle', value: formatVolume(totalMl, u), note: 'Keeps 5 to 7 days in the fridge' },
      ];
    },
    jar(v, p, maxBase) {
      const { waterMl, syrupMl, totalMl } = calculateDilution(v, p);
      return { cap: (maxBase / p.concentrate) * (p.concentrate + p.water + p.syrup), total: totalMl, tab: 'total', layers: [['brew', v], ['water', waterMl], ['syrup', syrupMl]] };
    },
    method: [
      "Keita's ratio turns 2 L of concentrate into 5 L to drink",
      'Adjust sweetness with the sugar syrup parts',
      'Ready to drink cold brew keeps 5 to 7 days in the fridge',
      'Serve over ice; it dilutes further as the ice melts',
    ],
  },
  foam: {
    key: 'foam',
    path: '/foam',
    title: 'Cold foam',
    dek: 'Silky foam for any batch size.',
    label: 'Total foam',
    kind: 'v',
    def: DEFAULTS.foamTotalMl,
    metric: { min: 20, max: 5000, step: 50, every: 10, u: 'ml' },
    imperial: { min: 0.5, max: 170, step: 0.5, every: 20, u: 'fl oz' },
    presets: [['Half', 1100], ["Keita's batch", 2200], ['One and a half', 3300], ['Double', 4400]],
    parts: [
      { key: 'cream', name: 'Cream', short: 'cream', min: 1, max: 10, step: 1 },
      { key: 'syrup', name: 'Syrup', short: 'syrup', min: 1, max: 10, step: 1 },
      { key: 'milk', name: 'Milk', short: 'milk', min: 1, max: 10, step: 1 },
    ],
    partsDef: { ...DEFAULTS.foamRatio },
    storeKey: 'kkb_foam_ratio',
    fromStore: (v) => (v && ['cream', 'syrup', 'milk'].every((k) => Number.isFinite(v[k])) ? v : null),
    toStore: (p) => p,
    resetLabel: "Reset to Keita's 8 : 2 : 1",
    summary: (p) => `${p.cream} : ${p.syrup} : ${p.milk}`,
    out(v, p, u) {
      const { creamMl, syrupMl, milkMl } = calculateColdFoam(v, p);
      return [
        { label: 'Heavy cream', value: formatVolume(creamMl, u), swatch: 'cream' },
        { label: 'Sugar syrup', value: formatVolume(syrupMl, u), swatch: 'syrup' },
        { label: 'Full cream milk', value: formatVolume(milkMl, u), note: 'Froth 15 to 25 seconds, stop at soft peaks', swatch: 'milk' },
      ];
    },
    jar(v, p, maxBase) {
      const { creamMl, syrupMl, milkMl } = calculateColdFoam(v, p);
      return { cap: maxBase, total: v, tab: 'foam', layers: [['cream', creamMl], ['syrup', syrupMl], ['milk', milkMl]] };
    },
    method: [
      'Everything must be very cold before frothing',
      'Froth for 15 to 25 seconds and stop at soft, pourable peaks',
      'Make it fresh; foam separates after about 15 minutes',
      'A handheld frother does it best',
      'Do not over whip: you want pourable foam, not stiff cream',
    ],
  },
};

export const CALC_LIST = [CALCS.concentrate, CALCS.dilution, CALCS.foam];

/** Base unit (g or ml) to displayed unit (g, oz, ml or fl oz). */
export function toDisplay(calc, unit, base) {
  if (unit !== 'imperial') return base;
  return base / (calc.kind === 'w' ? G_PER_OZ : ML_PER_FLOZ);
}
/** Displayed unit back to base unit. */
export function toBase(calc, unit, d) {
  if (unit !== 'imperial') return d;
  return d * (calc.kind === 'w' ? G_PER_OZ : ML_PER_FLOZ);
}
/** Snap a displayed value to the range step and clamp it. */
export function snapDisplay(range, d) {
  const s = Math.round(d / range.step) * range.step;
  return Math.min(range.max, Math.max(range.min, parseFloat(s.toFixed(6))));
}
/** Format the input amount (coffee weight or a volume). */
export function formatInput(calc, unit, base) {
  return calc.kind === 'w' ? formatWeight(base, unit) : formatVolume(base, unit);
}
/** Clamp a part ratio value after a step. */
export function stepPart(part, value, dir) {
  return Math.min(part.max, Math.max(part.min, parseFloat((value + part.step * dir).toFixed(6))));
}
