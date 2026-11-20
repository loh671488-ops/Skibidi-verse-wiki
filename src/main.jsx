import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

import units from './data/units.json';
import updates from './data/updates.js';

import UnitProfile from './pages/UnitProfile.jsx';
import UpdatesPage from './pages/UpdatesPage.jsx';
import UpdateDetail from './pages/UpdateDetail.jsx';
import ValuesPage from './pages/ValuesPage.jsx';
import UnitsPage from './pages/UnitsPage.jsx';
import HomePage from './pages/HomePage.jsx';

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

  const navigate = (title) => {
    if (title === 'VALUES' || title === 'UNITS') {
      setSearch('');
      setSort('name');
      setRarity('all');
      setPage(title);
    } else if (title === 'UPDATES') {
      setPage('UPDATES');
    }
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

  // UPDATE DETAILS
  if (page === 'UPDATE_DETAIL' && selectedUpdate) {
    return (
      <UpdateDetail
        update={selectedUpdate}
        onBack={() => setPage('UPDATES')}
      />
    );
  }

  // UPDATES
  if (page === 'UPDATES') {
    return (
      <UpdatesPage
        updates={updates}
        onBack={() => setPage('HOME')}
        onOpenUpdate={openUpdate}
      />
    );
  }

  // VALUES
  if (page === 'VALUES') {
    return (
      <ValuesPage
        units={units}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        filteredUnits={filteredUnits}
        onOpenUnit={openUnit}
        formatNumber={formatNumber}
        onBack={() => setPage('HOME')}
      />
    );
  }

  // UNITS
  if (page === 'UNITS') {
    return (
      <UnitsPage
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        rarity={rarity}
        setRarity={setRarity}
        rarities={rarities}
        filteredUnits={filteredUnits}
        onOpenUnit={openUnit}
        formatNumber={formatNumber}
        onBack={() => setPage('HOME')}
      />
    );
  }

  // HOME
  return (
    <HomePage
      sections={sections}
      onNavigate={navigate}
    />
  );
}

createRoot(document.getElementById('root')).render(<App />);
