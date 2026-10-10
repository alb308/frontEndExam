import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCans } from '../lib/useCans';
import { categoryColor, scoreLabel } from '../lib/theme';
import Loader from '../components/Loader';

export default function Ranking() {
  const { cans, error } = useCans();

  const ranked = useMemo(() => (cans ?? [])
    .filter((c) => c.score != null)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)), [cans]);

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  return (
    <div className="page">
      <header className="page__head">
        <p className="eyebrow">Classifica</p>
        <h1 className="page__title">La mia classifica</h1>
        <p className="page__lede">
          {cans ? `${ranked.length} lattine votate su ${cans.length}, dalla migliore alla peggiore.` : ' '}
        </p>
      </header>

      {error && <p className="empty">{error}</p>}
      {!cans && !error && <Loader />}
      {cans && !ranked.length && (
        <div className="empty">
          <strong>Nessuna lattina votata, per ora.</strong>
          <Link to="/collezione" className="btn btn--ghost btn--sm">Guarda la collezione</Link>
        </div>
      )}

      {podium.length > 0 && (
        <div className="podium">
          {[podium[1], podium[0], podium[2]].map((c, k) => !c ? <div key={`empty${k}`} /> : (
            <Link
              key={c.id}
              to={`/lattina/${c.id}`}
              className={`podium__step podium__step--${[2, 1, 3][k]}`}
              style={{ '--glow': categoryColor(c.category) }}
            >
              <img src={c.img} alt={c.name} />
              <div className="podium__block">
                <span className="podium__pos">{[2, 1, 3][k]}</span>
                <strong>{c.name}</strong>
                <span className="podium__score">{c.score}/10 <small>· {scoreLabel(c.score)}</small></span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <ol className="board">
          {rest.map((c, k) => (
            <li key={c.id} style={{ '--glow': categoryColor(c.category) }}>
              <Link to={`/lattina/${c.id}`}>
                <span className="board__pos mono">{String(k + 4).padStart(2, '0')}</span>
                <img src={c.img} alt="" loading="lazy" />
                <span className="board__name">
                  <strong>{c.name}</strong>
                  <small><span className="dot" />{c.category}{c.year ? ` · ${c.year}` : ''}</small>
                </span>
                <span className="board__bar"><span style={{ width: `${c.score * 10}%` }} /></span>
                <span className="board__score mono">{c.score}<small>{scoreLabel(c.score)}</small></span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
