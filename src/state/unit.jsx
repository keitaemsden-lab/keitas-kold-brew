import React, { createContext, useContext } from 'react';
import { useLocalStorage, STORAGE_KEYS } from '../hooks/useLocalStorage';

const UnitContext = createContext({ unit: 'metric', setUnit: () => {} });

/** One unit preference for the whole app, persisted under kkb_unit. */
export function UnitProvider({ children }) {
  const [unit, setUnit] = useLocalStorage(STORAGE_KEYS.UNIT, 'metric');
  const safe = unit === 'imperial' ? 'imperial' : 'metric';
  return <UnitContext.Provider value={{ unit: safe, setUnit }}>{children}</UnitContext.Provider>;
}

export function useUnit() {
  return useContext(UnitContext);
}
