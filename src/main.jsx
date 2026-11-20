import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

import units from './data/units.json';
import updates from './data/updates.js';

import SiteHeader from './components/SiteHeader.jsx';
import Footer from './components/Footer.jsx';
import UnitCard from './components/UnitCard.jsx';
import UnitProfile from './pages/UnitProfile.jsx';
import UpdatesPage from './pages/UpdatesPage.jsx';
import UpdateDetail from './pages/UpdateDetail.jsx';

function App() {
  const [page, setPage] = useState('HOME');
  const [previousPage, setPreviousPage] = useState('UNITS');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [rarity, setRarity] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  const sections = [
    ['💎', 'VALUES', 'Unit prices and trading values'],
    ['⚔️', 'UNITS', 'Explore all available units'],
    ['📖', 'WIKI', 'Game information and guides'],
    ['👹', 'BOSSES', 'Bosses and their statistics'],
    ['🔔', 'UPDATES', 'Latest game updates'],
    ['🛠️', 'TOOLS', 'Useful community tools']
  ];

  const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) return '—';

    return number.toLocaleString('en-US', {
      maximumFractionDigits: 2
    });
  };

  const filteredUnits = units
    .filter(unit =>
      unit.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(unit =>
      rarity === 'all' || unit.rarity === rarity
    )
    .sort((a, b) => {
      if (sort === 'value') {
        return (b.value || 0) - (a.value || 0);
      }

      if (sort === 'demand') {
        const order = { High: 3, Medium: 2, Low: 1 };
        return (order[b.demand] || 0) - (order[a.demand] || 0);
      }

      return a.name.localeCompare(b.name);
    });

  const rarities = [...new Set(
    units.map(unit => unit.rarity).filter(Boolean)
  )];

  const openUnit = (unit) => {
    setPreviousPage(page);
    setSelectedUnit(unit);
    setPage('UNIT');
  };

  const openUpdate = (update) => {
    setSelectedUpdate(update);
    setPage('UPDATE_DETAIL');
  };

  // UNIT PROFILE
  if (page === 'UNIT' && selectedUnit) {
    return (
      <UnitProfile
        unit={selectedUnit}
        onBack={() => setPage(previousPage)}
        formatNumber={formatNumber}
      />
    );
  }

  // UPDATE DETAILS PAGE
  if (page === 'UPDATE_DETAIL' && selectedUpdate) {
    return (
      <UpdateDetail
        update={selectedUpdate}
        onBack={() => setPage('UPDATES')}
      />
    );
  }

  // UPDATES PAGE
  if (page === 'UPDATES') {
    return (
      <UpdatesPage
        updates={updates}
        onBack={() => setPage('HOME')}
        onOpenUpdate={openUpdate}
      />
    );
  }

  // VALUES PAGE
  if (page === 'VALUES') {
    return (
      <div className="app">
        <SiteHeader />
        <main>
          <button
            className="back-button"
            onClick={() => setPage('HOME')}
          >
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
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="name">Sort: Name</option>
                <option value="value">Sort: Value</option>
                <option value="demand">Sort: Demand</option>
              </select>
            </div>

            <div className="unit-cards">
              {filteredUnits.map(unit => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  showValue
                  onOpen={openUnit}
                  formatNumber={formatNumber}
                />
              ))}

              {filteredUnits.length === 0 && (
                <div className="no-units">No units found.</div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // UNITS PAGE
  if (page === 'UNITS') {
    return (
      <div className="app">
        <SiteHeader />
        <main>
          <button
            className="back-button"
            onClick={() => setPage('HOME')}
          >
            ← BACK TO HOME
          </button>

          <div className="hero">
            <div className="tag">UNIT DATABASE</div>
            <h1>ALL <span>UNITS</span></h1>
            <p>Explore every unit available in Skibidi Verse TD.</p>
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
              <span>ALL UNITS · {filteredUnits.length}</span>

              <select
                value={rarity}
                onChange={e => setRarity(e.target.value)}
              >
                <option value="all">All rarities</option>
                {rarities.map(item => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="name">Sort: Name</option>
                <option value="value">Sort: Value</option>
              </select>
            </div>

            <div className="unit-cards">
              {filteredUnits.map(unit => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  onOpen={openUnit}
                  formatNumber={formatNumber}
                />
              ))}

              {filteredUnits.length === 0 && (
                <div className="no-units">No units found.</div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // HOME PAGE
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
              onClick={() => {
                if (title === 'VALUES' || title === 'UNITS') {
                  setSearch('');
                  setSort('name');
                  setRarity('all');
                  setPage(title);
                } else if (title === 'UPDATES') {
                  setPage('UPDATES');
                }
              }}
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

      <Footer />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
