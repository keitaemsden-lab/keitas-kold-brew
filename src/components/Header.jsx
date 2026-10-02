import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CALC_LIST } from '../calc/config';
import { useUnit } from '../state/unit';

export default function Header() {
  const { unit, setUnit } = useUnit();
  return (
    <header className="bar">
      <Link className="mark" to="/"><span className="mark__sq" aria-hidden="true" />Kold Brew</Link>
      <nav className="seg" aria-label="Calculators">
        {CALC_LIST.map((c) => (
          <NavLink key={c.key} to={c.path}>{c.title}</NavLink>
        ))}
      </nav>
      <div className="units" role="group" aria-label="Units">
        {['metric', 'imperial'].map((u) => (
          <button key={u} type="button" aria-pressed={unit === u} onClick={() => setUnit(u)}>
            {u === 'metric' ? 'Metric' : 'Imperial'}
          </button>
        ))}
      </div>
    </header>
  );
}
