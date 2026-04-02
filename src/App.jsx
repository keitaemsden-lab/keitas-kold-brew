import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ConcentrateCalculator from './pages/ConcentrateCalculator';
import DilutionCalculator from './pages/DilutionCalculator';
import ColdFoamCalculator from './pages/ColdFoamCalculator';
import { useLocalStorage, STORAGE_KEYS } from './hooks/useLocalStorage';

// Inner component that has access to router context
function AppInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [lastTab, setLastTab] = useLocalStorage(STORAGE_KEYS.LAST_TAB, '/');

  // Persist last visited tab
  useEffect(() => {
    setLastTab(location.pathname);
  }, [location.pathname]);

  // Restore last tab on mount (only if not already on a specific path)
  useEffect(() => {
    if (location.pathname === '/' && lastTab && lastTab !== '/') {
      navigate(lastTab, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="font-body bg-brew-bg min-h-screen">
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/concentrate" element={<ConcentrateCalculator />} />
        <Route path="/dilution"   element={<DilutionCalculator />} />
        <Route path="/foam"       element={<ColdFoamCalculator />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
