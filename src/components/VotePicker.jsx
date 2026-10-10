import { useState } from 'react';
import { scoreLabel } from '../lib/theme';

export default function VotePicker({ value, onVote, onClear, busy }) {
  const [hover, setHover] = useState(null);
  const shown = hover ?? value;

  return (
    <div className="picker">
      <div className="picker__readout" aria-live="polite">
        <span className="picker__num">{shown ?? '–'}</span>
        <span className="picker__label">{shown ? scoreLabel(shown) : 'Scegli un voto da 1 a 10'}</span>
      </div>
      <div className="picker__row" role="radiogroup" aria-label="Voto" onPointerLeave={() => setHover(null)}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`Voto ${n}`}
            disabled={busy}
            className={`picker__seg ${shown != null && n <= shown ? 'is-on' : ''} ${value === n ? 'is-picked' : ''}`}
            style={{ '--i': n }}
            onPointerEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(null)}
            onClick={() => onVote(n)}
          >
            <span>{n}</span>
          </button>
        ))}
      </div>
      {value != null && (
        <button type="button" className="picker__clear" onClick={onClear} disabled={busy}>
          Rimuovi il mio voto
        </button>
      )}
    </div>
  );
}
