import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import units from './data/units.json';

function App() {
  const [page, setPage] = useState('HOME');
  const [previousPage, setPreviousPage] = useState('UNITS');
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
            <strong>{formatNumber(unit.value || 0)}</strong>
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

    const maxLevel = Number(selectedUnit.maxLevel);

    const hasMaxLevel = levels.some((level, index) =>
      Number(level.level ?? index + 1) === maxLevel
    );

    return (
      <div className="app">
        <SiteHeader />

        <main>
          <button
            className="back-button"
            onClick={() => setPage(previousPage)}
          >
            ← BACK
          </button>

          <div className="hero">
            <div className="tag">UNIT PROFILE</div>
            <h1>{selectedUnit.name}</h1>
            <p>Complete unit statistics and information.</p>
          </div>

          <div className="unit-profile">

            <div className="unit-profile-top">
              <div className="unit-profile-image">
                {selectedUnit.image ? (
                  <img src={selectedUnit.image} alt={selectedUnit.name} />
                ) : (
                  <span>⚔️</span>
                )}
              </div>

              <div className="unit-profile-info">
                <h2>{selectedUnit.name}</h2>

                <span className="unit-profile-rarity">
                  {selectedUnit.rarity || 'Unknown rarity'}
                </span>

                <p>
                  Information about this unit in Skibidi Verse TD.
                </p>
              </div>
            </div>

            <div className="unit-profile-stats">

              <div className="profile-stat">
                <small>MAX LEVEL</small>
                <strong>{selectedUnit.maxLevel ?? 'Unknown'}</strong>
              </div>

              <div className="profile-stat">
                <small>VALUE</small>
                <strong>
                  {selectedUnit.value !== undefined
                    ? formatNumber(selectedUnit.value)
                    : 'Unknown'}
                </strong>
              </div>

              <div className="profile-stat">
                <small>DEMAND</small>
                <strong>{selectedUnit.demand || 'Unknown'}</strong>
              </div>

            </div>

            <div className="unit-profile-section">
              <h3>UNIT STATISTICS</h3>

              {levels.length > 0 ? (
                <div className="unit-levels-wrap">
                  <table className="unit-levels-table">
                    <thead>
                      <tr>
                        <th>LEVEL</th>
                        <th>DAMAGE</th>
                        <th>COOLDOWN</th>
                        <th>DPS</th>
                        <th>RANGE</th>
                        <th>UPGRADE COST</th>
                      </tr>
                    </thead>

                    <tbody>
                      {levels.map((level, index) => {
                        const currentLevel = Number(
                          level.level ?? index + 1
                        );

                        const damage = Number(level.damage);
                        const cooldown = Number(level.cooldown);

                        const dps =
                          Number.isFinite(damage) &&
                          Number.isFinite(cooldown) &&
                          cooldown > 0
                            ? damage / cooldown
                            : null;

                        const isMaxLevel = hasMaxLevel
                          ? currentLevel === maxLevel
                          : index === levels.length - 1;

                        return (
                          <tr
                            key={level.level ?? index}
                            className={isMaxLevel ? 'max-level-row' : ''}
                          >
                            <td>
                              {currentLevel}
                              {isMaxLevel ? ' ★' : ''}
                            </td>

                            <td>{formatNumber(level.damage)}</td>

                            <td>{formatNumber(level.cooldown)}</td>

                            <td>
                              {dps !== null
                                ? formatNumber(dps)
                                : '—'}
                            </td>

                            <td>{formatNumber(level.range)}</td>

                            <td>
                              {level.upgradeCost !== undefined
                                ? formatNumber(level.upgradeCost)
                                : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="profile-empty">
                  Statistics for this unit have not been added yet.
                </div>
              )}

              <p className="profile-note">
                DPS is calculated as damage divided by cooldown.
                Information may be updated as new game data becomes available.
              </p>
            </div>

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
