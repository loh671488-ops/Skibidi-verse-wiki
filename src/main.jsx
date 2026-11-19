import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const sections = [
    ['💎', 'VALUES', 'Unit prices and trading values'],
    ['⚔️', 'UNITS', 'Explore all available units'],
    ['📖', 'WIKI', 'Game information and guides'],
    ['👹', 'BOSSES', 'Bosses and their statistics'],
    ['🔔', 'UPDATES', 'Latest game updates'],
    ['🛠️', 'TOOLS', 'Useful community tools']
  ];

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
            <div className="section" key={title}>
              <div className="section-icon">{icon}</div>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="arrow">↗</span>
            </div>
          ))}
        </div>
      </main>

      <footer>UNOFFICIAL COMMUNITY PROJECT · NOT AFFILIATED WITH THE GAME DEVELOPERS</footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
