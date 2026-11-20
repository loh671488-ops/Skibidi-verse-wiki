import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import units from './data/units.json';

function App() {
  const [page, setPage] = useState('HOME');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [rarity, setRarity] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState(null);

  const sections = [
    ['💎', 'VALUES', 'Unit prices and trading values'],
    ['⚔️', 'UNITS', 'Explore all available units'],
    ['📖', 'WIKI', 'Game information and guides'],
    ['👹', 'BOSSES', 'Bosses and their statistics'],
    ['🔔', 'UPDATES', 'Latest game updates'],
    ['🛠️', 'TOOLS', 'Useful community tools']
  ];

  const SiteHeader = () => (
    <header className="site-header">
      <div className="site-brand">
        <img src="/logo.png" alt="Skibidi Verse TD" />
        <span>WIKI</span>
      </div>
    </header>
  );

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
    setSelectedUnit(unit);
    setPage('UNIT');
  };

  const UnitCard = ({ unit, showValue = false }) => (
    <article
      className="unit-card"
      key={unit.id}
      onClick={() => openUnit(unit)}
      style={{ cursor: 'pointer' }}
    >
      <div className="unit-image">
        {unit.image ? (
          <img src={unit.image} alt={unit.name} />
        ) : (
          <span>⚔️</span>
        )}
      </div>

      <div className="unit-info">
        <h3>{unit.name}</h3>
        <span className="unit-rarity">
          {unit.rarity || 'Unknown rarity'}
        </span>
        <small>Maximum level: {unit.maxLevel ?? 'Unknown'}</small>
      </div>

      {showValue ? (
        <>
          <div className="unit-value">
            <small>VALUE</small>
            <strong>{(unit.value || 0).toLocaleString('en-US')}</strong>
          </div>

          <div className="unit-demand">
            <small>DEMAND</small>
            <span className={`demand-${(unit.demand || 'low').toLowerCase()}`}>
              {unit.demand || 'Unknown'}
            </span>
          </div>
        </>
      ) : (
        <div className="unit-value">
          <small>UNIT TYPE</small>
          <strong>{unit.rarity || 'Unknown'}</strong>
        </div>
      )}
    </article>
  );

  // UNIT PROFILE
  if (page === 'UNIT' && selectedUnit) {
    const levels = selectedUnit.levels || [];

    return (
      <div className="app">
        <SiteHeader />

        <main>
          <button
            className="back-button"
            onClick={() => setPage('UNITS')}
          >
            ← BACK TO UNITS
          </button>

          <div className="hero">
            <div className="tag">UNIT PROFILE</div>
            <h1>{selectedUnit.name}</h1>
            <p>{selectedUnit.rarity || 'Unknown rarity'}</p>
          </div>

          <div className="values-panel">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              marginBottom: '30px'
            }}>
              <div className="unit-image" style={{
                width: '130px',
                height: '130px',
                flexShrink: 0
              }}>
                {selectedUnit.image ? (
                  <img src={selectedUnit.image} alt={selectedUnit.name} />
                ) : (
                  <span style={{ fontSize: '48px' }}>⚔️</span>
                )}
              </div>

              <div>
                <h2>{selectedUnit.name}</h2>
                <p style={{ marginTop: '8px' }}>
                  Rarity: {selectedUnit.rarity || 'Unknown'}
                </p>
                <p style={{ marginTop: '5px' }}>
                  Maximum level: {selectedUnit.maxLevel ?? 'Unknown'}
                </p>
                {selectedUnit.value !== undefined && (
                  <p style={{ marginTop: '5px' }}>
                    Value: {selectedUnit.value.toLocaleString('en-US')}
                  </p>
                )}
              </div>
            </div>

            <div className="values-toolbar">
              <span>UNIT STATISTICS</span>
            </div>

            {levels.length > 0 ? (
              <div style={{ overflowX: 'auto', marginTop: '15px' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '520px',
                  textAlign: 'center'
                }}>
                  <thead>
                    <tr>
                      {['LEVEL', 'DAMAGE', 'COOLDOWN', 'RANGE', 'UPGRADE COST'].map(label => (
                        <th key={label} style={{
                          padding: '14px 10px',
                          borderBottom: '1px solid #444',
                          color: '#d6ad55',
                          fontSize: '12px'
                        }}>
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {levels.map((level, index) => (
                      <tr key={level.level ?? index}>
                        <td style={{ padding: '14px 10px', borderBottom: '1px solid #292929' }}>
                          {level.level ?? index + 1}
                        </td>
                        <td style={{ padding: '14px 10px', borderBottom: '1px solid #292929' }}>
                          {level.damage ?? '—'}
                        </td>
                        <td style={{ padding: '14px 10px', borderBottom: '1px solid #292929' }}>
                          {level.cooldown ?? '—'}
                        </td>
                        <td style={{ padding: '14px 10px', borderBottom: '1px solid #292929' }}>
                          {level.range ?? '—'}
                        </td>
                        <td style={{ padding: '14px 10px', borderBottom: '1px solid #292929' }}>
                          {level.upgradeCost !== undefined
                            ? level.upgradeCost.toLocaleString('en-US')
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ padding: '25px 0', color: '#aaa' }}>
                Statistics for this unit have not been added yet.
              </p>
            )}

            <p style={{
              marginTop: '25px',
              color: '#888',
              fontSize: '12px'
            }}>
              Information may be updated as new game data becomes available.
            </p>
          </div>
        </main>

        <footer>
          UNOFFICIAL COMMUNITY PROJECT · NOT AFFILIATED WITH THE GAME DEVELOPERS
        </footer>
      </div>
    );
  }

  // VALUES PAGE
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
                <UnitCard key={unit.id} unit={unit} showValue />
              ))}

              {filteredUnits.length === 0 && (
                <div className="no-units">No units found.</div>
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

  // UNITS PAGE
  if (page === 'UNITS') {
    return (
      <div className="app">
        <SiteHeader />

        <main>
          <button className="back-button" onClick={() => setPage('HOME')}>
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

              <select value={rarity} onChange={e => setRarity(e.target.value)}>
                <option value="all">All rarities</option>
                {rarities.map(item => (
                  <option value={item} key={item}>{item}</option>
                ))}
              </select>

              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="name">Sort: Name</option>
                <option value="value">Sort: Value</option>
              </select>
            </div>

            <div className="unit-cards">
              {filteredUnits.map(unit => (
                <UnitCard key={unit.id} unit={unit} />
              ))}

              {filteredUnits.length === 0 && (
                <div className="no-units">No units found.</div>
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

      <footer>
        UNOFFICIAL COMMUNITY PROJECT · NOT AFFILIATED WITH THE GAME DEVELOPERS
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
