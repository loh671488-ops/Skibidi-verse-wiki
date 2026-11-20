
import SiteHeader from '../components/SiteHeader.jsx';
import Footer from '../components/Footer.jsx';
import UnitCard from '../components/UnitCard.jsx';

function UnitsPage({
  search,
  setSearch,
  sort,
  setSort,
  rarity,
  setRarity,
  rarities,
  filteredUnits,
  onOpenUnit,
  formatNumber,
  onBack
}) {
  return (
    <div className="app">
      <SiteHeader />

      <main>
        <button
          className="back-button"
          onClick={onBack}
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

export default UnitsPage;
