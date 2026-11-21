function UnitCard({
  unit,
  showValue = false,
  onOpen,
  formatNumber,
  activeVersion = 'normal'
}) {
  const version =
    activeVersion === 'shiny' && unit.shiny
      ? unit.shiny
      : unit;

  const maxLevel = version.max_level ?? version.maxLevel ?? 'Unknown';

  const rawDemand = Number(version.demand);
  const demand = Number.isFinite(rawDemand) && rawDemand > 0
    ? Math.min(10, Math.max(1, rawDemand))
    : 5;

  return (
    <article
      className="unit-card"
      onClick={() => onOpen(unit)}
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
        <small>Maximum level: {maxLevel}</small>
      </div>

      {showValue ? (
        <>
          <div className="unit-value">
            <small>VALUE</small>
            <strong>
              {formatNumber(version.value ?? 0)}
            </strong>
          </div>

          <div className="unit-demand">
            <small>DEMAND</small>

            <div className="demand-display">
              <div className="demand-bars">
                {Array.from({ length: 10 }, (_, i) => (
                  <span
                    key={i}
                    className={i < demand ? 'filled' : ''}
                  />
                ))}
              </div>

              <strong>{demand}/10</strong>
            </div>
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
}

export default UnitCard;
