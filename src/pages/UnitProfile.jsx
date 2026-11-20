import SiteHeader from '../components/SiteHeader.jsx';
import Footer from '../components/Footer.jsx';

function UnitProfile({ unit, onBack, formatNumber }) {
  const levels = unit.levels || [];
  const abilities = unit.abilities || [];
  const maxLevel = Number(unit.maxLevel);

  const hasMaxLevel = levels.some((level, index) =>
    Number(level.level ?? index + 1) === maxLevel
  );

  return (
    <div className="app">
      <SiteHeader />

      <main>
        <button className="back-button" onClick={onBack}>
          ← BACK
        </button>

        <div className="hero">
          <div className="tag">UNIT PROFILE</div>
          <h1>{unit.name}</h1>
          <p>Complete unit statistics and information.</p>
        </div>

        <div className="unit-profile">
          <div className="unit-profile-top">
            <div className="unit-profile-image">
              {unit.image ? (
                <img src={unit.image} alt={unit.name} />
              ) : (
                <span>⚔️</span>
              )}
            </div>

            <div className="unit-profile-info">
              <h2>{unit.name}</h2>

              <span className="unit-profile-rarity">
                {unit.rarity || 'Unknown rarity'}
              </span>

              <p>
                {unit.description || 'No description available yet.'}
              </p>
            </div>
          </div>

          <div className="unit-profile-stats">
            <div className="profile-stat">
              <small>MAX LEVEL</small>
              <strong>{unit.maxLevel ?? 'Unknown'}</strong>
            </div>

            <div className="profile-stat">
              <small>VALUE</small>
              <strong>
                {unit.value !== undefined
                  ? formatNumber(unit.value)
                  : 'Unknown'}
              </strong>
            </div>

            <div className="profile-stat">
              <small>DEMAND</small>
              <strong>{unit.demand || 'Unknown'}</strong>
            </div>
          </div>

          <div className="unit-profile-section">
            <h3>ATTACK INFORMATION</h3>

            <div className="unit-profile-stats">
              <div className="profile-stat">
                <small>ATTACK TYPE</small>
                <strong>{unit.attackType || 'Unknown'}</strong>
              </div>
            </div>
          </div>

          <div className="unit-profile-section">
            <h3>ABILITIES</h3>

            {abilities.length > 0 ? (
              <div className="ability-list">
                {abilities.map((ability, index) => (
                  <div className="ability-card" key={index}>
                    <div className="ability-card-top">
                      <h4>{ability.name || 'Unnamed ability'}</h4>

                      <span className="ability-type">
                        {ability.type || 'Unknown'}
                      </span>
                    </div>

                    <p>
                      {ability.description || 'No description available.'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profile-empty">
                No abilities added yet.
              </div>
            )}
          </div>

          <div className="unit-profile-section">
            <h3>LEVEL STATISTICS</h3>

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
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UnitProfile;
