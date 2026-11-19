import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

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

  if (page === 'VALUES') {
    return (
      <div className="app">
        <header>
          <div className="logo">SKIBIDI <span>VERSE</span></div>
          <div className="subtitle">TOWER DEFENSE DATABASE</div>
        </header>

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
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="values-toolbar">
              <span>UNIT DATABASE</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="name">Sort: Name</option>
                <option value="value">Sort: Value</option>
                <option value="demand">Sort: Demand</option>
              </select>
            </div>

            <div className="values-table">
              <div className="values-row values-heading">
                <span>UNIT</span>
                <span>VALUE</span>
                <span>DEMAND</span>
              </div>
              <div className="empty-values">
                <span>💎</span>
                <p>No units added yet</p>
                <small>Unit values will appear here soon.</small>
              </div>
            </div>
          </div>
        </main>

        <footer>UNOFFICIAL COMMUNITY PROJECT · NOT AFFILIATED WITH THE GAME DEVELOPERS</footer>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <div className="logo">SKIBIDI <span>VERSE</span></div>
        <div className="subtitle">TOWER DEFENSE DATABASE</div>
      </header>

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

      <footer>UNOFFICIAL COMMUNITY PROJECT · NOT AFFILIATED WITH THE GAME DEVELOPERS</footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
