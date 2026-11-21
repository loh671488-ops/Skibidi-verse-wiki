import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const ADMIN_ID = '7e3a6901-3fde-463d-ae9d-832a6c1e09d8';

const emptyUnit = {
  name: '',
  rarity: 'Mythic',
  value: '',
  demand: 5,
  image: '',
  description: '',
  max_level: '',
  attack_type: '',
  damage_type: '',
  abilities: '[]'
};

const emptyShiny = {
  value: '',
  demand: 5,
  max_level: '',
  attack_type: '',
  damage_type: '',
  abilities: '[]'
};

const createEmptyLevel = (number) => ({
  level: number,
  damage: '',
  cooldown: '',
  range: '',
  upgradeCost: ''
});

function LevelEditor({ levels, setLevels, title }) {
  const changeLevel = (index, field, value) => {
    setLevels(previous =>
      previous.map((level, i) =>
        i === index ? { ...level, [field]: value } : level
      )
    );
  };

  const addLevel = () => {
    setLevels(previous => [
      ...previous,
      createEmptyLevel(previous.length + 1)
    ]);
  };

  const removeLevel = (index) => {
    setLevels(previous =>
      previous
        .filter((_, i) => i !== index)
        .map((level, i) => ({
          ...level,
          level: i + 1
        }))
    );
  };

  return (
    <div className="admin-level-section">
      <div className="admin-level-heading">
        <h2>{title}</h2>
        <span>{levels.length} levels</span>
      </div>

      {levels.map((level, index) => (
        <div className="admin-level-card" key={index}>
          <div className="admin-level-card-heading">
            <h3>LEVEL {index + 1}</h3>

            <button
              type="button"
              className="admin-danger"
              onClick={() => removeLevel(index)}
            >
              REMOVE
            </button>
          </div>

          <div className="admin-form-grid">
            <div>
              <label>Level number</label>
              <input
                type="number"
                min="1"
                value={level.level}
                onChange={e =>
                  changeLevel(index, 'level', e.target.value)
                }
                required
              />
            </div>

            <div>
              <label>Damage</label>
              <input
                type="number"
                min="0"
                step="any"
                value={level.damage}
                onChange={e =>
                  changeLevel(index, 'damage', e.target.value)
                }
                required
              />
            </div>

            <div>
              <label>Cooldown</label>
              <input
                type="number"
                min="0.001"
                step="any"
                value={level.cooldown}
                onChange={e =>
                  changeLevel(index, 'cooldown', e.target.value)
                }
                required
              />
            </div>

            <div>
              <label>Range</label>
              <input
                type="number"
                min="0"
                step="any"
                value={level.range}
                onChange={e =>
                  changeLevel(index, 'range', e.target.value)
                }
                required
              />
            </div>

            <div>
              <label>Upgrade cost</label>
              <input
                type="number"
                min="0"
                step="any"
                value={level.upgradeCost}
                onChange={e =>
                  changeLevel(index, 'upgradeCost', e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="admin-add-level"
        onClick={addLevel}
      >
        + ADD LEVEL
      </button>
    </div>
  );
}

function AdminPage({ units = [], onBack, onReload }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyUnit);
  const [levels, setLevels] = useState([]);

  const [shinyEnabled, setShinyEnabled] = useState(false);
  const [shinyForm, setShinyForm] = useState(emptyShiny);
  const [shinyLevels, setShinyLevels] = useState([]);

  const [activeVersion, setActiveVersion] = useState('normal');
  const [editingId, setEditingId] = useState(null);

  const [priceHistory, setPriceHistory] = useState([]);
  const [historyValue, setHistoryValue] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySaving, setHistorySaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const isAdmin = session?.user?.id === ADMIN_ID;

  const loadPriceHistory = async () => {
    if (!editingId || !isAdmin) {
      setPriceHistory([]);
      return;
    }

    setHistoryLoading(true);

    const { data, error } = await supabase
      .from('unit_price_history')
      .select('*')
      .eq('unit_id', editingId)
      .eq('version', activeVersion)
      .order('recorded_at', { ascending: false });

    if (error) {
      setError(`Price history: ${error.message}`);
      setPriceHistory([]);
    } else {
      setPriceHistory(data || []);
    }

    setHistoryLoading(false);
  };

  useEffect(() => {
    loadPriceHistory();
  }, [editingId, activeVersion, isAdmin]);

  const addPriceHistory = async () => {
    if (!editingId) {
      setError('Save the unit first before adding price history.');
      return;
    }

    if (
      historyValue === '' ||
      !Number.isFinite(Number(historyValue)) ||
      Number(historyValue) < 0
    ) {
      setError('Enter a valid price.');
      return;
    }

    setHistorySaving(true);
    setError('');

    const { error } = await supabase
      .from('unit_price_history')
      .insert([{
        unit_id: editingId,
        version: activeVersion,
        value: Number(historyValue)
      }]);

    setHistorySaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setHistoryValue('');
    await loadPriceHistory();
  };

  const deletePriceHistory = async (id) => {
    if (!window.confirm('Delete this price history record?')) {
      return;
    }

    const { error } = await supabase
      .from('unit_price_history')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
      return;
    }

    await loadPriceHistory();
  };

  const login = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user.id !== ADMIN_ID) {
      await supabase.auth.signOut();
      setError('This account does not have administrator access.');
    }
  };

  const resetForm = () => {
    setForm({ ...emptyUnit });
    setLevels([]);
    setShinyForm({ ...emptyShiny });
    setShinyLevels([]);
    setShinyEnabled(false);
    setActiveVersion('normal');
    setEditingId(null);
    setError('');
    setPriceHistory([]);
    setHistoryValue('');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    resetForm();
  };

  const change = (field, value) => {
    setForm(previous => ({
      ...previous,
      [field]: value
    }));
  };

  const changeShiny = (field, value) => {
    setShinyForm(previous => ({
      ...previous,
      [field]: value
    }));
  };

  const editUnit = (unit) => {
    setEditingId(unit.id);

    setForm({
      name: unit.name || '',
      rarity: unit.rarity || 'Mythic',
      value: unit.value ?? '',
      demand: Number(unit.demand) || 5,
      image: unit.image || '',
      description: unit.description || '',
      max_level: unit.max_level ?? unit.maxLevel ?? '',
      attack_type: unit.attack_type || unit.attackType || '',
      damage_type: unit.damage_type || unit.damageType || '',
      abilities: JSON.stringify(unit.abilities || [], null, 2)
    });

    setLevels(
      (unit.levels || []).map((level, index) => ({
        level: level.level ?? index + 1,
        damage: level.damage ?? '',
        cooldown: level.cooldown ?? '',
        range: level.range ?? '',
        upgradeCost: level.upgradeCost ?? ''
      }))
    );

    const shiny = unit.shiny;

    if (shiny && typeof shiny === 'object') {
      setShinyEnabled(true);

      setShinyForm({
        value: shiny.value ?? '',
        demand: Number(shiny.demand) || 5,
        max_level: shiny.max_level ?? '',
        attack_type: shiny.attack_type || '',
        damage_type: shiny.damage_type || '',
        abilities: JSON.stringify(shiny.abilities || [], null, 2)
      });

      setShinyLevels(
        (shiny.levels || []).map((level, index) => ({
          level: level.level ?? index + 1,
          damage: level.damage ?? '',
          cooldown: level.cooldown ?? '',
          range: level.range ?? '',
          upgradeCost: level.upgradeCost ?? ''
        }))
      );
    } else {
      setShinyEnabled(false);
      setShinyForm({ ...emptyShiny });
      setShinyLevels([]);
    }

    setActiveVersion('normal');
    setPriceHistory([]);
    setHistoryValue('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prepareAbilities = (json, label) => {
    try {
      const abilities = JSON.parse(json);

      if (!Array.isArray(abilities)) {
        throw new Error('Must be a JSON array.');
      }

      return abilities;
    } catch (err) {
      throw new Error(`${label}: ${err.message}`);
    }
  };

  const prepareLevels = (items, label) => {
    for (let i = 0; i < items.length; i++) {
      const level = items[i];

      if (
        level.level === '' ||
        level.damage === '' ||
        level.cooldown === '' ||
        level.range === ''
      ) {
        throw new Error(
          `${label}: Fill in Level, Damage, Cooldown and Range for level ${i + 1}.`
        );
      }

      if (
        !Number.isFinite(Number(level.level)) ||
        !Number.isFinite(Number(level.damage)) ||
        !Number.isFinite(Number(level.cooldown)) ||
        !Number.isFinite(Number(level.range)) ||
        Number(level.level) < 1 ||
        Number(level.damage) < 0 ||
        Number(level.cooldown) <= 0 ||
        Number(level.range) < 0
      ) {
        throw new Error(
          `${label}: Invalid statistics in level ${i + 1}. Cooldown must be greater than zero.`
        );
      }

      if (
        level.upgradeCost !== '' &&
        (!Number.isFinite(Number(level.upgradeCost)) ||
          Number(level.upgradeCost) < 0)
      ) {
        throw new Error(
          `${label}: Invalid upgrade cost in level ${i + 1}.`
        );
      }
    }

    return items.map(level => ({
      level: Number(level.level),
      damage: Number(level.damage),
      cooldown: Number(level.cooldown),
      range: Number(level.range),
      ...(level.upgradeCost !== ''
        ? { upgradeCost: Number(level.upgradeCost) }
        : {})
    }));
  };

  const validateDemand = (value, label) => {
    const demand = Number(value);

    if (!Number.isInteger(demand) || demand < 1 || demand > 10) {
      throw new Error(`${label} Demand must be between 1 and 10.`);
    }

    return demand;
  };

  const saveUnit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Unit name is required.');
      return;
    }

    let unitData;

    try {
      const abilities = prepareAbilities(
        form.abilities,
        'NORMAL Abilities'
      );

      const normalDemand = validateDemand(
        form.demand,
        'NORMAL'
      );

      const normalLevels = prepareLevels(
        levels,
        'NORMAL'
      );

      unitData = {
        name: form.name.trim(),
        rarity: form.rarity,
        value: form.value === '' ? null : Number(form.value),
        demand: normalDemand,
        image: form.image.trim(),
        description: form.description,
        max_level: form.max_level === '' ? null : Number(form.max_level),
        attack_type: form.attack_type,
        damage_type: form.damage_type,
        abilities,
        levels: normalLevels,
        shiny: null
      };

      if (shinyEnabled) {
        const shinyAbilities = prepareAbilities(
          shinyForm.abilities,
          'SHINY Abilities'
        );

        const shinyDemand = validateDemand(
          shinyForm.demand,
          'SHINY'
        );

        const formattedShinyLevels = prepareLevels(
          shinyLevels,
          'SHINY'
        );

        unitData.shiny = {
          value: shinyForm.value === ''
            ? null
            : Number(shinyForm.value),
          demand: shinyDemand,
          max_level: shinyForm.max_level === ''
            ? null
            : Number(shinyForm.max_level),
          attack_type: shinyForm.attack_type,
          damage_type: shinyForm.damage_type,
          abilities: shinyAbilities,
          levels: formattedShinyLevels
        };
      }
    } catch (err) {
      setError(err.message);
      return;
    }

    setSaving(true);

    let result;

    if (editingId !== null) {
      result = await supabase
        .from('units')
        .update(unitData)
        .eq('id', editingId);
    } else {
      result = await supabase
        .from('units')
        .insert([unitData]);
    }

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    resetForm();
    onReload?.();
  };

  const deleteUnit = async (id) => {
    if (!window.confirm('Are you sure you want to delete this unit?')) {
      return;
    }

    setError('');

    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    onReload?.();
  };

  if (checking) {
    return <div className="admin-page">Checking session...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <button className="back-button" onClick={onBack}>
          ← BACK
        </button>

        <div className="admin-login">
          <h1>ADMIN LOGIN</h1>
          <p>Sign in to manage the unit database.</p>

          <form onSubmit={login}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && <p className="admin-error">{error}</p>}

            <button type="submit" className="admin-primary">
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentForm = activeVersion === 'normal'
    ? form
    : shinyForm;

  const currentChange = activeVersion === 'normal'
    ? change
    : changeShiny;

  const currentLevels = activeVersion === 'normal'
    ? levels
    : shinyLevels;

  const currentSetLevels = activeVersion === 'normal'
    ? setLevels
    : setShinyLevels;

  return (
    <div className="admin-page">
      <div className="admin-top">
        <button className="back-button" onClick={onBack}>
          ← BACK TO SITE
        </button>

        <button className="admin-secondary" onClick={logout}>
          LOG OUT
        </button>
      </div>

      <h1>ADMIN PANEL</h1>
      <p className="admin-subtitle">Manage your unit database</p>

      <form className="admin-form" onSubmit={saveUnit}>
        <h2>{editingId !== null ? 'EDIT UNIT' : 'ADD NEW UNIT'}</h2>

        <label>Unit name *</label>
        <input
          value={form.name}
          onChange={e => change('name', e.target.value)}
          required
        />

        <div className="admin-form-grid">
          <div>
            <label>Rarity</label>
            <select
              value={form.rarity}
              onChange={e => change('rarity', e.target.value)}
            >
              {['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Secret'].map(item => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Image URL</label>
            <input
              value={form.image}
              onChange={e => change('image', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={e => change('description', e.target.value)}
          rows={3}
        />

        <div className="admin-level-section">
          <div className="admin-level-heading">
            <h2>UNIT VERSIONS</h2>
          </div>

          <div className="admin-actions">
            <button
              type="button"
              className={activeVersion === 'normal' ? 'admin-primary' : 'admin-secondary'}
              onClick={() => setActiveVersion('normal')}
            >
              NORMAL
            </button>

            <button
              type="button"
              className={activeVersion === 'shiny' ? 'admin-primary' : 'admin-secondary'}
              onClick={() => {
                setShinyEnabled(true);
                setActiveVersion('shiny');
              }}
            >
              SHINY
            </button>
          </div>

          <label>
            <input
              type="checkbox"
              checked={shinyEnabled}
              onChange={e => {
                setShinyEnabled(e.target.checked);

                if (!e.target.checked) {
                  setActiveVersion('normal');
                }
              }}
              style={{
                width: 'auto',
                marginRight: '9px',
                accentColor: '#e8bd65'
              }}
            />
            This unit has a Shiny version
          </label>
        </div>

        <div className="admin-form-grid">
          <div>
            <label>
              {activeVersion === 'normal' ? 'NORMAL VALUE' : 'SHINY VALUE'}
            </label>
            <input
              type="number"
              value={currentForm.value}
              onChange={e => currentChange('value', e.target.value)}
            />
          </div>

          <div>
            <label>Demand: {currentForm.demand}/10</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={currentForm.demand}
              onChange={e =>
                currentChange('demand', Number(e.target.value))
              }
              style={{
                width: '100%',
                accentColor: '#e8bd65',
                cursor: 'pointer'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#999',
              fontSize: '12px'
            }}>
              <span>1 — LOW</span>
              <span>10 — HIGH</span>
            </div>
          </div>

          <div>
            <label>Max level</label>
            <input
              type="number"
              value={currentForm.max_level}
              onChange={e =>
                currentChange('max_level', e.target.value)
              }
            />
          </div>

          <div>
            <label>Attack type</label>
            <input
              value={currentForm.attack_type}
              onChange={e =>
                currentChange('attack_type', e.target.value)
              }
            />
          </div>

          <div>
            <label>Damage type</label>
            <input
              value={currentForm.damage_type}
              onChange={e =>
                currentChange('damage_type', e.target.value)
              }
            />
          </div>
        </div>

        <label>Abilities (JSON array)</label>
        <textarea
          value={currentForm.abilities}
          onChange={e =>
            currentChange('abilities', e.target.value)
          }
          rows={7}
          spellCheck={false}
        />

        <LevelEditor
          title={`${activeVersion.toUpperCase()} LEVEL STATISTICS`}
          levels={currentLevels}
          setLevels={currentSetLevels}
        />

        {activeVersion === 'shiny' && !shinyEnabled && (
          <p className="admin-error">
            Enable the Shiny version checkbox to save Shiny data.
          </p>
        )}

        {/* PRICE HISTORY */}
        <div className="admin-level-section">
          <div className="admin-level-heading">
            <h2>VALUE HISTORY</h2>
            <span>{activeVersion.toUpperCase()}</span>
          </div>

          {editingId === null ? (
            <p className="admin-subtitle">
              Save the unit first to start adding price history.
            </p>
          ) : (
            <>
              <div>
                <label>New {activeVersion.toUpperCase()} value</label>

                <div className="admin-form-grid">
                  <div>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={historyValue}
                      onChange={e => setHistoryValue(e.target.value)}
                      placeholder="Enter new value"
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      className="admin-primary"
                      disabled={historySaving}
                      onClick={addPriceHistory}
                    >
                      {historySaving ? 'ADDING...' : '+ ADD PRICE'}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <h3 style={{ marginBottom: '12px' }}>
                  PRICE RECORDS ({priceHistory.length})
                </h3>

                {historyLoading ? (
                  <p className="admin-subtitle">Loading history...</p>
                ) : priceHistory.length === 0 ? (
                  <p className="admin-subtitle">
                    No price history yet.
                  </p>
                ) : (
                  priceHistory.map(record => (
                    <div
                      className="admin-unit-row"
                      key={record.id}
                    >
                      <div>
                        <strong>
                          {Number(record.value).toLocaleString('en-US')}
                        </strong>
                        <small>
                          {new Date(record.recorded_at).toLocaleString()}
                        </small>
                      </div>

                      <button
                        type="button"
                        className="admin-danger"
                        onClick={() => deletePriceHistory(record.id)}
                      >
                        DELETE
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-actions">
          <button
            type="submit"
            className="admin-primary"
            disabled={saving}
          >
            {saving
              ? 'SAVING...'
              : editingId !== null
                ? 'SAVE CHANGES'
                : 'ADD UNIT'}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="admin-secondary"
              onClick={resetForm}
            >
              CANCEL
            </button>
          )}
        </div>
      </form>

      <div className="admin-unit-list">
        <h2>EXISTING UNITS ({units.length})</h2>

        {units.map(unit => (
          <div className="admin-unit-row" key={unit.id}>
            <div>
              <strong>{unit.name}</strong>
              <small>
                {unit.rarity || 'No rarity'}
                {unit.shiny ? ' • SHINY AVAILABLE' : ''}
              </small>
            </div>

            <div className="admin-unit-actions">
              <button
                type="button"
                className="admin-secondary"
                onClick={() => editUnit(unit)}
              >
                EDIT
              </button>

              <button
                type="button"
                className="admin-danger"
                onClick={() => deleteUnit(unit.id)}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
