import { calculateConcentrate, calculateDilution, calculateColdFoam, DEFAULTS } from '../utils/calculations';
import { formatVolume, formatWeight } from '../utils/unitConversions';

describe('calculations', () => {
  it('concentrate default 3000 g at 1:4', () => {
    const r = calculateConcentrate(DEFAULTS.concentrateCoffeeG, DEFAULTS.concentrateRatio);
    expect(r.waterMl).toBe(12000);
    expect(r.expectedYieldMl).toBeCloseTo(9600);
  });
  it('dilution default', () => {
    const r = calculateDilution(2000, DEFAULTS.dilutionRatio);
    expect(r.waterMl).toBe(2500);
    expect(r.syrupMl).toBe(500);
    expect(r.totalMl).toBe(5000);
  });
  it('cold foam default', () => {
    const r = calculateColdFoam(DEFAULTS.foamTotalMl, DEFAULTS.foamRatio);
    expect(r.creamMl).toBeCloseTo(1600);
    expect(r.syrupMl).toBeCloseTo(400);
    expect(r.milkMl).toBeCloseTo(200);
  });
  it('formats units', () => {
    expect(formatVolume(12000, 'metric')).toBe('12.00 L');
    expect(formatVolume(500, 'metric')).toBe('500 ml');
    expect(formatWeight(3000, 'metric')).toBe('3000 g');
    expect(formatVolume(2000, 'imperial')).toBe('8.45 cups');
  });
});
