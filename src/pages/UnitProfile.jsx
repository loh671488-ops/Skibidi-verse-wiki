import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import SiteHeader from '../components/SiteHeader.jsx';
import Footer from '../components/Footer.jsx';

function UnitProfile({
  unit,
  onBack,
  formatNumber,
  activeVersion,
  setActiveVersion
}) {
  const hasShiny = Boolean(unit.shiny);

  const isShiny = hasShiny && activeVersion === 'shiny';
  const version = isShiny ? unit.shiny : unit;

  const levels = version.levels || [];
  const abilities = version.abilities || [];
  const maxLevel = Number(version.max_level ?? version.maxLevel);

  const hasMaxLevel = levels.some((level, index) =>
    Number(level.level ?? index + 1) === maxLevel
  );

  // PRICE HISTORY
  const [priceHistory, setPriceHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      setHistoryLoading(true);
      setHistoryError('');
      setPriceHistory([]);

      const { data, error } = await supabase
        .from('unit_price_history')
        .select('id, value, recorded_at')
        .eq('unit_id', unit.id)
        .eq('version', isShiny ? 'shiny' : 'normal')
        .order('recorded_at', { ascending: true });

      if (cancelled) return;

      if (error) {
        setHistoryError(error.message);
      } else {
        setPriceHistory(data || []);
      }

      setHistoryLoading(false);
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [unit.id, isShiny]);

  // CHART DATA
  const chartWidth = 700;
  const chartHeight = 260;
  const chartPadding = {
    top: 25,
    right: 25,
    bottom: 45,
    left: 65
  };

  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const values = priceHistory.map(record => Number(record.value));

  const minValue = values.length
    ? Math.min(...values)
    : 0;

  const maxValue = values.length
    ? Math.max(...values)
    : 0;

  const valueDifference = maxValue - minValue;
  const chartMin = valueDifference === 0
    ? Math.max(0, minValue - (minValue * 0.1 || 1))
    : Math.max(0, minValue - valueDifference * 0.15);

  const chartMax = valueDifference === 0
    ? maxValue + (maxValue * 0.1 || 1)
    : maxValue + valueDifference * 0.15;

  const chartRange = chartMax - chartMin || 1;

  const chartPoints = priceHistory.map((record, index) => {
    const x = priceHistory.length === 1
      ? chartPadding.left + plotWidth / 2
      : chartPadding.left +
        (index / (priceHistory.length - 1)) * plotWidth;

    const y = chartPadding.top +
      (1 - (Number(record.value) - chartMin) / chartRange) * plotHeight;

    return {
      ...record,
      x,
      y
    };
  });

  const chartLine = chartPoints
    .map(point => `${point.x},${point.y}`)
    .join(' ');

  const chartArea = chartPoints.length > 1
    ? `${chartPadding.left},${chartPadding.top + plotHeight} ${chartLine} ${chartPadding.left + plotWidth},${chartPadding.top + plotHeight}`
    : '';

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  };

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

          {hasShiny && (
            <div className="version-switcher">
              <button
                className={!isShiny ? 'active' : ''}
                onClick={() => setActiveVersion('normal')}
              >
                NORMAL
              </button>

              <button
                className={isShiny ? 'active' : ''}
                onClick={() => setActiveVersion('shiny')}
              >
                SHINY
              </button>
            </div>
          )}

          <div className="unit-profile-stats">
            <div className="profile-stat">
              <small>MAX LEVEL</small>
              <strong>
                {version.max_level ?? version.maxLevel ?? 'Unknown'}
              </strong>
            </div>

            <div className="profile-stat">
              <small>VALUE</small>
              <strong>
                {version.value !== undefined && version.value !== null
                  ? formatNumber(version.value)
                  : 'Unknown'}
              </strong>
            </div>

            <div className="profile-stat">
              <small>DEMAND</small>
              <strong>{version.demand ?? 'Unknown'}</strong>
            </div>
          </div>

          {/* VALUE HISTORY */}
          <div className="unit-profile-section">
            <h3>VALUE HISTORY</h3>

            {historyLoading ? (
              <div className="profile-empty">
                Loading price history...
              </div>
            ) : historyError ? (
              <div className="profile-empty">
                Could not load price history: {historyError}
              </div>
            ) : priceHistory.length === 0 ? (
              <div className="profile-empty">
                No price history available for this version yet.
              </div>
            ) : (
              <>
                <div className="price-chart-info">
                  <span>
                    {isShiny ? 'SHINY' : 'NORMAL'} PRICE
                  </span>

                  <strong>
                    {formatNumber(priceHistory[priceHistory.length - 1].value)}
                  </strong>
                </div>

                <div className="price-chart-wrap">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="price-chart"
                    role="img"
                    aria-label="Unit price history chart"
                  >
                    {[0, 1, 2, 3, 4].map(index => {
                      const y = chartPadding.top +
                        (index / 4) * plotHeight;

                      const value = chartMax -
                        (index / 4) * chartRange;

                      return (
                        <g key={index}>
                          <line
                            x1={chartPadding.left}
                            y1={y}
                            x2={chartWidth - chartPadding.right}
                            y2={y}
                            stroke="#30313a"
                            strokeDasharray="4 5"
                          />

                          <text
                            x={chartPadding.left - 10}
                            y={y + 4}
                            fill="#999"
                            fontSize="11"
                            textAnchor="end"
                          >
                            {formatNumber(value)}
                          </text>
                        </g>
                      );
                    })}

                    {chartArea && (
                      <polygon
                        points={chartArea}
                        fill="rgba(232, 189, 101, 0.10)"
                      />
                    )}

                    {chartPoints.length > 1 && (
                      <polyline
                        points={chartLine}
                        fill="none"
                        stroke="#e8bd65"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {chartPoints.map((point, index) => (
                      <g key={point.id}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="5"
                          fill="#e8bd65"
                          stroke="#15161d"
                          strokeWidth="2"
                        >
                          <title>
                            {formatNumber(point.value)} — {new Date(point.recorded_at).toLocaleString()}
                          </title>
                        </circle>
                      </g>
                    ))}

                    {chartPoints.length > 0 && (
                      <>
                        <text
                          x={chartPadding.left}
                          y={chartHeight - 12}
                          fill="#999"
                          fontSize="11"
                          textAnchor="start"
                        >
                          {formatDate(chartPoints[0].recorded_at)}
                        </text>

                        {chartPoints.length > 1 && (
                          <text
                            x={chartWidth - chartPadding.right}
                            y={chartHeight - 12}
                            fill="#999"
                            fontSize="11"
                            textAnchor="end"
                          >
                            {formatDate(chartPoints[chartPoints.length - 1].recorded_at)}
                          </text>
                        )}
                      </>
                    )}
                  </svg>
                </div>

                <p className="profile-note">
                  {priceHistory.length} price records. Tap a chart point to see its exact value and date.
                </p>
              </>
            )}
          </div>

          <div className="unit-profile-section">
            <h3>ATTACK INFORMATION</h3>

            <div className="unit-profile-stats">
              <div className="profile-stat">
                <small>ATTACK TYPE</small>
                <strong>
                  {version.attack_type ?? version.attackType ?? 'Unknown'}
                </strong>
              </div>

              <div className="profile-stat">
                <small>DAMAGE TYPE</small>
                <strong>
                  {version.damage_type ?? version.damageType ?? 'Unknown'}
                </strong>
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
