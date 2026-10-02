import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CALC_LIST, formatInput } from '../calc/config';
import { readAmount, readParts } from '../state/calcStore';
import { useUnit } from '../state/unit';
import { layerHeights } from '../components/Vessel';
import { toBase } from '../calc/config';

const MINI_H = 100;

/** A small static vessel: the saved batch drawn to the same scale as its calculator. */
function MiniVessel({ calc, unit, value, parts }) {
  const jar = calc.jar(value, parts, toBase(calc, unit, calc[unit].max));
  const { layers } = layerHeights(jar, MINI_H);
  return (
    <span className="mini" aria-hidden="true">
      <span className="mini__fill">
        {layers.map((l, i) => <i key={i} className={`l-${l.kind}`} style={{ height: `${(l.h / MINI_H) * 100}%` }} />)}
      </span>
    </span>
  );
}

export default function Home() {
  const { unit } = useUnit();
  useEffect(() => { document.title = "Keita's Kold Brew"; }, []);
  return (
    <>
      <section className="home" aria-labelledby="home-title">
        <div className="home__head">
          <h1 className="home__title" id="home-title">Keita's Kold Brew</h1>
          <p className="home__dek">Cold brew maths drawn to scale. Pick a stage, pour the batch, read the numbers.</p>
        </div>
        <ol className="stages">
          {CALC_LIST.map((c, i) => {
            const value = readAmount(c);
            const parts = readParts(c);
            const lead = c.out(value, parts, unit)[0];
            return (
              <li key={c.key}>
                <Link className="stage" to={c.path}>
                  <MiniVessel calc={c} unit={unit} value={value} parts={parts} />
                  <span className="stage__body">
                    <span className="stage__no">{String(i + 1).padStart(2, '0')}</span>
                    <span className="stage__title">{c.title}</span>
                    <span className="stage__dek">{c.dek}</span>
                    <span className="stage__fig">
                      <span>{formatInput(c, unit, value)} {c.label.toLowerCase()}</span>
                      <span>{lead.value} {lead.label.toLowerCase()}</span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
      <section className="method" aria-labelledby="routine-title">
        <h2 className="method__title" id="routine-title">The routine</h2>
        <ol className="method__list">
          <li>Weigh extra coarse coffee and add four parts filtered water by weight</li>
          <li>Start the steep timer below; 16 to 18 hours in the fridge is the sweet spot. It keeps counting if you close the app</li>
          <li>Strain, then dilute 4 : 5 : 1 with water and sugar syrup to drink</li>
          <li>Top with cold foam, made fresh just before serving</li>
        </ol>
      </section>
    </>
  );
}
