import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SteepDock from './components/SteepDock';
import Home from './pages/Home';
import ConcentrateCalculator from './pages/ConcentrateCalculator';
import DilutionCalculator from './pages/DilutionCalculator';
import ColdFoamCalculator from './pages/ColdFoamCalculator';
import { UnitProvider } from './state/unit';

// `/` is always the Home landing page. Calculators are reached from the bar or
// by direct link; there is no auto-redirect to a "last tab".
function AppInner() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concentrate" element={<ConcentrateCalculator />} />
          <Route path="/dilution" element={<DilutionCalculator />} />
          <Route path="/foam" element={<ColdFoamCalculator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="foot">
        <p>Keita's Kold Brew. Yield allows about 20% held back by the grounds.</p>
        <a href="https://keitaemsden.com" rel="noopener">keitaemsden.com</a>
      </footer>
      <SteepDock />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UnitProvider>
        <AppInner />
      </UnitProvider>
    </BrowserRouter>
  );
}
