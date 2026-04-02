// Conversion constants
export const ML_PER_FLOZ = 29.5735;
export const ML_PER_CUP = 236.588;
export const G_PER_OZ = 28.3495;

// Metric → Imperial
export function mlToFlOz(ml) { return ml / ML_PER_FLOZ; }
export function mlToCups(ml) { return ml / ML_PER_CUP; }
export function gToOz(g) { return g / G_PER_OZ; }

// Imperial → Metric
export function flOzToMl(floz) { return floz * ML_PER_FLOZ; }
export function cupsToMl(cups) { return cups * ML_PER_CUP; }
export function ozToG(oz) { return oz * G_PER_OZ; }

/**
 * Format a volume for display based on current unit preference.
 * Metric: shows ml up to 999, then switches to L (2 decimal places).
 * Imperial: shows fl oz up to 8, then switches to cups (2 decimal places).
 * @param {number} ml - volume in millilitres
 * @param {'metric' | 'imperial'} unit
 * @returns {string}
 */
export function formatVolume(ml, unit) {
  if (unit === 'imperial') {
    const floz = mlToFlOz(ml);
    if (floz >= 8) {
      return `${(floz / 8).toFixed(2)} cups`;
    }
    return `${floz.toFixed(1)} fl oz`;
  }
  // metric
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(2)} L`;
  }
  return `${Math.round(ml)} ml`;
}

/**
 * Format a weight for display based on current unit preference.
 * Metric: shows g.
 * Imperial: shows oz (1 decimal place).
 * @param {number} g - weight in grams
 * @param {'metric' | 'imperial'} unit
 * @returns {string}
 */
export function formatWeight(g, unit) {
  if (unit === 'imperial') {
    return `${gToOz(g).toFixed(1)} oz`;
  }
  return `${Math.round(g)} g`;
}
