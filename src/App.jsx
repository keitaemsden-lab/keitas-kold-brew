import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ConcentrateCalculator from './pages/ConcentrateCalculator';
import DilutionCalculator from './pages/DilutionCalculator';
import ColdFoamCalculator from './pages/ColdFoamCalculator';

// Inner component that has access to router context
function AppInner() {
  // `/` is always the Home landing page. Calculators are reached from there or
  // by direct link; there is no auto-redirect to a "last tab".
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
