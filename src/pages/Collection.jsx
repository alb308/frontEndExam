import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useCans } from '../lib/useCans';
import { categoryColor } from '../lib/theme';
import CanCard from '../components/CanCard';
import Loader from '../components/Loader';

const SORTS = {
  nome: { label: 'Nome A–Z', fn: (a, b) => a.name.localeCompare(b.name) },
  voto: { label: 'Voto', fn: (a, b) => (b.score ?? -1) - (a.score ?? -1) || a.name.localeCompare(b.name) },
  nuove: { label: 'Più recenti', fn: (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.name.localeCompare(b.name) },
  vecchie: { label: 'Più vecchie', fn: (a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.name.localeCompare(b.name) },
};

export default function Collection() {
  const { isOwner } = useAuth();
  const { cans, error } = useCans();
  const [params, setParams] = useSearchParams();

  const q = params.get('q') ?? '';
  const line = params.get('linea') ?? '';
  const sort = SORTS[params.get('ordina')] ? params.get('ordina') : 'nome';
  const onlyLimited = params.get('limited') === '1';
  const onlyUnvoted = params.get('davotare') === '1';

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  const categories = useMemo(() => {
    if (!cans) return [];
    const counts = {};
    for (const c of cans) counts[c.category] = (counts[c.category] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [cans]);

  const list = useMemo(() => {
    if (!cans) return [];
    const needle = q.trim().toLowerCase();
    return cans
      .filter((c) => !line || c.category === line)
      .filter((c) => !needle || c.name.toLowerCase().includes(needle))
      .filter((c) => !onlyLimited || c.limited)
      .filter((c) => !onlyUnvoted || c.score == null)
      .sort(SORTS[sort].fn);
  }, [cans, q, line, sort, onlyLimited, onlyUnvoted]);

  const votedCount = cans?.filter((c) => c.score != null).length ?? 0;

  return (
    <div className="page">
      <header className="page__head">
        <p className="eyebrow">La collezione</p>
        <h1 className="page__title">Tutte le lattine</h1>
        {cans && (
          <div className="progress">
            <div className="progress__bar"><span style={{ width: `${(votedCount / cans.length) * 100}%` }} /></div>
            <span>Ne ho votate <b>{votedCount}</b> su {cans.length}</span>
          </div>
        )}
      </header>

      <div className="filters">
        <div className="filters__row">
          <label className="search">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <input
              type="search"
              placeholder="Cerca una lattina…"
              value={q}
              onChange={(e) => set('q', e.target.value)}
            />
          </label>
          <label className="select">
            <span>Ordina</span>
            <select value={sort} onChange={(e) => set('ordina', e.target.value === 'nome' ? '' : e.target.value)}>
              {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
          </label>
          <button className={`toggle ${onlyLimited ? 'is-on' : ''}`} onClick={() => set('limited', onlyLimited ? '' : '1')}>
            Solo limited
          </button>
          {isOwner && (
            <button className={`toggle ${onlyUnvoted ? 'is-on' : ''}`} onClick={() => set('davotare', onlyUnvoted ? '' : '1')}>
              Da votare
            </button>
          )}
        </div>
        <div className="chips">
          <button className={`chip ${!line ? 'is-on' : ''}`} onClick={() => set('linea', '')}>
            Tutte <small>{cans?.length ?? ''}</small>
          </button>
          {categories.map(([name, n]) => (
            <button
              key={name}
              className={`chip ${line === name ? 'is-on' : ''}`}
              style={{ '--glow': categoryColor(name) }}
              onClick={() => set('linea', line === name ? '' : name)}
            >
              <span className="dot" />{name} <small>{n}</small>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="empty">{error}</p>}
      {!cans && !error && <Loader />}
      {cans && (
        list.length ? (
          <>
            <p className="results">{list.length} {list.length === 1 ? 'lattina' : 'lattine'}</p>
            <div className="grid">
              {list.map((c) => <CanCard key={c.id} can={c} />)}
            </div>
          </>
        ) : (
          <div className="empty">
            <strong>Nessuna lattina trovata.</strong>
            <button className="btn btn--ghost btn--sm" onClick={() => setParams({}, { replace: true })}>Azzera i filtri</button>
          </div>
        )
      )}
    </div>
  );
}
