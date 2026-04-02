import { useState, useEffect } from 'react';

/**
 * Generic hook syncing state to localStorage.
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if key not found in storage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`useLocalStorage: failed to set "${key}"`, error);
    }
  };

  return [storedValue, setValue];
}

// localStorage key constants used across the app
export const STORAGE_KEYS = {
  UNIT:              'kkb_unit',
  CONCENTRATE_RATIO: 'kkb_concentrate_ratio',
  DILUTION_RATIO:    'kkb_dilution_ratio',
  FOAM_RATIO:        'kkb_foam_ratio',
  TIMER_HOURS:       'kkb_timer_hours',
  LAST_TAB:          'kkb_last_tab',
};
