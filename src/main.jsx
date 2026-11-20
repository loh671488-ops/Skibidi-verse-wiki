import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

import { supabase } from './lib/supabase.js';
import updates from './data/updates.js';

import UnitProfile from './pages/UnitProfile.jsx';
import UpdatesPage from './pages/UpdatesPage.jsx';
import UpdateDetail from './pages/UpdateDetail.jsx';
import ValuesPage from './pages/ValuesPage.jsx';
import UnitsPage from './pages/UnitsPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AdminPage from './pages/AdminPage.jsx';

function App() {
  const [page, setPage] = useState('HOME');
  const [previousPage, setPreviousPage] = useState('UNITS');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [rarity, setRarity] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function loadUnits() {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('units')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const formattedUnits = data.map(unit => ({
        ...unit,
        maxLevel: unit.max_level,
        attackType: unit.attack_type,
        damageType: unit.damage_type
      }));

      setUnits(formattedUnits);
      setLoading(false);
    }

    loadUnits();
  }, [reloadKey]);

  const refreshUnits = async () => {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      window.alert('Could not refresh units: ' + error.message);
      return;
    }

    const formattedUnits = data.map(unit => ({
      ...unit,
      maxLevel: unit.max_level,
      attackType: unit.attack_type,
      damageType: unit.damage_type
    }));

    setUnits(formattedUnits);
  };

  const sections = [
    ['💎', 'VALUES', 'Unit prices and trading values'],
    ['⚔️', 'UNITS', 'Explore all available units'],
    ['📖', 'WIKI', 'Game information and guides'],
    ['👹', 'BOSSES', 'Bosses and their statistics'],
    ['🔔', 'UPDATES', 'Latest game updates'],
    ['🛠️', 'TOOLS', 'Useful community tools'],
    ['🔐', 'ADMIN', 'Manage the unit database']
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
    } else if (title === 'ADMIN') {
      setPage('ADMIN');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        background: '#101116',
        fontSize: '18px'
      }}>
        Loading units...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        color: 'white',
        background: '#101116',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2>Failed to load units</h2>
        <p>{error}</p>
        <button onClick={() => setReloadKey(key => key + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (page === 'ADMIN') {
    return (
      <AdminPage
        units={units}
        onBack={() => setPage('HOME')}
        onReload={refreshUnits}
      />
    );
  }

  if (page === 'UNIT' && selectedUnit) {
    return (
      <UnitProfile
        unit={selectedUnit}
        onBack={() => setPage(previousPage)}
        formatNumber={formatNumber}
      />
    );
  }

  if (page === 'UPDATE_DETAIL' && selectedUpdate) {
    return (
      <UpdateDetail
        update={selectedUpdate}
        onBack={() => setPage('UPDATES')}
      />
    );
  }

  if (page === 'UPDATES') {
    return (
      <UpdatesPage
        updates={updates}
        onBack={() => setPage('HOME')}
        onOpenUpdate={openUpdate}
      />
    );
  }

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

  return (
    <HomePage
      sections={sections}
      onNavigate={navigate}
    />
  );
}

createRoot(document.getElementById('root')).render(<App />);
