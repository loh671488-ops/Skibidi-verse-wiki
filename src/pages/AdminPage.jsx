
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const ADMIN_ID = '7e3a6901-3fde-463d-ae9d-832a6c1e09d8';

const emptyUnit = {
  name: '',
  rarity: 'Mythic',
  value: '',
  demand: 'Medium',
  image: '',
  description: '',
  max_level: '',
  attack_type: '',
  damage_type: '',
  abilities: '[]',
  levels: '[]'
};

function AdminPage({ units = [], onBack, onReload }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyUnit);
  const [editingId, setEditingId] = useState(null);

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

  const logout = async () => {
    await supabase.auth.signOut();
    setForm(emptyUnit);
    setEditingId(null);
  };

  const change = (field, value) => {
    setForm(previous => ({
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
      demand: unit.demand || 'Medium',
      image: unit.image || '',
      description: unit.description || '',
      max_level: unit.max_level ?? unit.maxLevel ?? '',
      attack_type: unit.attack_type || unit.attackType || '',
      damage_type: unit.damage_type || unit.damageType || '',
      abilities: JSON.stringify(unit.abilities || [], null, 2),
      levels: JSON.stringify(unit.levels || [], null, 2)
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveUnit = async (e) => {
    e.preventDefault();
    setError('');

    let abilities;
    let levels;

    try {
      abilities = JSON.parse(form.abilities);
      levels = JSON.parse(form.levels);

      if (!Array.isArray(abilities) || !Array.isArray(levels)) {
        throw new Error('Abilities and levels must be JSON arrays.');
      }
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      return;
    }

    if (!form.name.trim()) {
      setError('Unit name is required.');
      return;
    }

    const unitData = {
      name: form.name.trim(),
      rarity: form.rarity,
      value: form.value === '' ? null : Number(form.value),
      demand: form.demand,
      image: form.image.trim(),
      description: form.description,
      max_level: form.max_level === '' ? null : Number(form.max_level),
      attack_type: form.attack_type,
      damage_type: form.damage_type,
      abilities,
      levels
    };

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

    setForm(emptyUnit);
    setEditingId(null);
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
      setEditingId(null);
      setForm(emptyUnit);
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
            <label>Value</label>
            <input
              type="number"
              value={form.value}
              onChange={e => change('value', e.target.value)}
            />
          </div>

          <div>
            <label>Demand</label>
            <select
              value={form.demand}
              onChange={e => change('demand', e.target.value)}
            >
              {['High', 'Medium', 'Low'].map(item => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Max level</label>
            <input
              type="number"
              value={form.max_level}
              onChange={e => change('max_level', e.target.value)}
            />
          </div>
        </div>

        <label>Image URL</label>
        <input
          value={form.image}
          onChange={e => change('image', e.target.value)}
          placeholder="https://..."
        />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={e => change('description', e.target.value)}
          rows={3}
        />

        <div className="admin-form-grid">
          <div>
            <label>Attack type</label>
            <input
              value={form.attack_type}
              onChange={e => change('attack_type', e.target.value)}
            />
          </div>

          <div>
            <label>Damage type</label>
            <input
              value={form.damage_type}
              onChange={e => change('damage_type', e.target.value)}
            />
          </div>
        </div>

        <label>Abilities (JSON array)</label>
        <textarea
          value={form.abilities}
          onChange={e => change('abilities', e.target.value)}
          rows={7}
          spellCheck={false}
        />

        <label>Levels (JSON array)</label>
        <textarea
          value={form.levels}
          onChange={e => change('levels', e.target.value)}
          rows={9}
          spellCheck={false}
        />

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-actions">
          <button type="submit" className="admin-primary" disabled={saving}>
            {saving ? 'SAVING...' : editingId !== null ? 'SAVE CHANGES' : 'ADD UNIT'}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="admin-secondary"
              onClick={() => {
                setEditingId(null);
                setForm(emptyUnit);
              }}
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
              <small>{unit.rarity || 'No rarity'}</small>
            </div>

            <div className="admin-unit-actions">
              <button
                className="admin-secondary"
                onClick={() => editUnit(unit)}
              >
                EDIT
              </button>

              <button
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
