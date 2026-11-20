function UnitCard({ unit, showValue = false, onOpen, formatNumber }) {
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
}

export default UnitCard;
