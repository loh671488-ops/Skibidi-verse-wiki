import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import Footer from '../components/Footer.jsx';
import UnitCard from '../components/UnitCard.jsx';

function ValuesPage({
  search,
  setSearch,
  sort,
  setSort,
  filteredUnits,
  onOpenUnit,
  formatNumber,
  onBack
}) {
  return (
    <div className="app">
      <SiteHeader />

      <main>
        <button className="back-button" onClick={onBack}>
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
                onOpen={onOpenUnit}
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

export default ValuesPage;
