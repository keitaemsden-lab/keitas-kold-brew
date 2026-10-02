import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Entrance motion only when the visitor has not asked for reduced motion.
if (window.matchMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
