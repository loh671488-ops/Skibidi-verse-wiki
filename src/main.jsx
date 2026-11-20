import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import units from './data/units.json';

function App() {
  const [page, setPage] = useState('HOME');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');

  const sections = [
    ['💎', 'VALUES', 'Unit prices and trading values'],
    ['⚔️', 'UNITS', 'Explore all available units'],
    ['📖', 'WIKI', 'Game information and guides'],
    ['👹', 'BOSSES', 'Bosses and their statistics'],
    ['🔔', 'UPDATES', 'Latest game updates'],
    ['🛠️', 'TOOLS', 'Useful community tools']
  ];

  const filteredUnits = units
    .filter(unit =>
      unit.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'value') return b.value - a.value;

      if (sort === 'demand') {
        const order = { High: 3, Medium: 2, Low: 1 };
        return (order[b.demand] || 0) - (order[a.demand] || 0);
      }

      return a.name.localeCompare(b.name);
    });

  const SiteHeader = () => (
    <header className="site-header">
      <div className="site-brand">
        <img src="/logo.png" alt="Skibidi Verse TD" />
        <span>WIKI</span>
      </div>
    </header>
  );

  if (page === 'VALUES') {
    return (
      <div className="app">
        <SiteHeader />

        <main>
          <button className="back-button" onClick={() => setPage('HOME')}>
            ← BACK TO HOME
          </button>

          <div className="hero">
            <div className="tag">TRADING DATABASE</div>
            <h1>UNIT <span>VALUES</span></h1>
            <p>Find unit prices and check their demand.</p>
          </div>

          <div className="values-panel">
            <input
              className="search"
              type="text"
              placeholder="Search for a unit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div className="values-toolbar">
              <span>UNIT DATABASE</span>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="name">Sort: Name</option>
                <option value="value">Sort: Value</option>
                <option value="demand">Sort: Demand</option>
              </select>
            </div>

            <div className="unit-cards">
              {filteredUnits.map(unit => (
                <article className="unit-card" key={unit.id}>
                  <div className="unit-image">
                    {unit.image ? (
                      <img src={unit.image} alt={unit.name} />
                    ) : (
                      <span>⚔️</span>
                    )}
                  </div>

                  <div className="unit-info">
                    <h3>{unit.name}</h3>
                    <span className="unit-rarity">{unit.rarity}</span>
                    <small>Maximum level: {unit.maxLevel}</small>
                  </div>

                  <div className="unit-value">
                    <small>VALUE</small>
                    <strong>{unit.value.toLocaleString('en-US')}</strong>
                  </div>

                  <div className="unit-demand">
                    <small>DEMAND</small>
                    <span className={`demand-${unit.demand.toLowerCase()}`}>
                      {unit.demand}
                    </span>
                  </div>
                </article>
              ))}

              {filteredUnits.length === 0 && (
                <div className="no-units">
                  No units found.
                </div>
              )}
            </div>
          </div>
        </main>

        <footer>
          UNOFFICIAL COMMUNITY PROJECT · NOT AFFILIATED WITH THE GAME DEVELOPERS
        </footer>
      </div>
    );
  }

  return (
    <div className="app">
      <SiteHeader />

      <main>
        <div className="hero">
          <div className="tag">COMMUNITY DATABASE</div>
          <h1>SKIBIDI VERSE <span>TD</span></h1>
          <p>Your ultimate guide to units, values, updates and more.</p>
        </div>

        <h2>EXPLORE DATABASE</h2>

        <div className="grid">
          {sections.map(([icon, title, description]) => (
            <button
              className="section"
              key={title}
              onClick={() => title === 'VALUES' && setPage('VALUES')}
            >
              <div className="section-icon">{icon}</div>

              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>

              <span className="arrow">↗</span>
            </button>
          ))}
        </div>
      </main>

      <footer>
        UNOFFICIAL COMMUNITY PROJECT · NOT AFFILIATED WITH THE GAME DEVELOPERS
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
