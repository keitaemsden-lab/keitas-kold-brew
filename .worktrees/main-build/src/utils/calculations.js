/**
 * Concentrate Calculator
 * @param {number} coffeeGrams - weight of coffee grounds in grams
 * @param {number} ratio - water multiplier (e.g. 4 means 1:4 coffee:water)
 * @returns {{ waterMl: number, expectedYieldMl: number }}
 */
export function calculateConcentrate(coffeeGrams, ratio) {
  const waterMl = coffeeGrams * ratio;
  const expectedYieldMl = waterMl * 0.8; // grounds absorb ~20% of water
  return { waterMl, expectedYieldMl };
}

/**
 * Dilution Calculator
 * @param {number} concentrateMl - volume of concentrate in ml
 * @param {{ concentrate: number, water: number, syrup: number }} ratio
 * @returns {{ waterMl: number, syrupMl: number, totalMl: number }}
 */
export function calculateDilution(concentrateMl, ratio) {
  const waterMl = (concentrateMl / ratio.concentrate) * ratio.water;
  const syrupMl = (concentrateMl / ratio.concentrate) * ratio.syrup;
  const totalMl = concentrateMl + waterMl + syrupMl;
  return { waterMl, syrupMl, totalMl };
}

/**
 * Cold Foam Calculator
 * @param {number} totalMl - desired total volume of cold foam in ml
 * @param {{ cream: number, syrup: number, milk: number }} ratio
 * @returns {{ creamMl: number, syrupMl: number, milkMl: number }}
 */
export function calculateColdFoam(totalMl, ratio) {
  const parts = ratio.cream + ratio.syrup + ratio.milk;
  const creamMl = (totalMl / parts) * ratio.cream;
  const syrupMl = (totalMl / parts) * ratio.syrup;
  const milkMl = (totalMl / parts) * ratio.milk;
  return { creamMl, syrupMl, milkMl };
}

// Default ratios (exported for use in components)
export const DEFAULTS = {
  concentrateRatio: 4,           // 1:4 coffee:water
  concentrateCoffeeG: 3000,      // commercial Toddy brewer batch
  dilutionRatio: { concentrate: 4, water: 5, syrup: 1 },
  dilutionConcentrateMl: 2000,   // 2000ml default input
  foamRatio: { cream: 8, syrup: 2, milk: 1 },
  foamTotalMl: 2200,             // 1600ml cream + 400ml syrup + 200ml milk
  timerHours: 18,                // default steep time
};
