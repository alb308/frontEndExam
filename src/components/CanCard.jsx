import { Link } from 'react-router-dom';
import { categoryColor } from '../lib/theme';

export default function CanCard({ can, rank }) {
  return (
    <Link to={`/lattina/${can.id}`} className="card" style={{ '--glow': categoryColor(can.category) }}>
      <div className="card__stage">
        {rank != null && <span className="card__rank">#{rank}</span>}
        {can.limited && <span className="tag tag--limited">Limited</span>}
        <img src={can.img} alt={can.name} loading="lazy" decoding="async" />
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span className="dot" />{can.category}<span className="card__year">{can.year}</span>
        </div>
        <h3 className="card__name">{can.name}</h3>
        <div className="card__foot">
          {can.score != null
            ? <span className="score">{can.score}<small>/10</small></span>
            : <span className="score score--empty">Non ancora votata</span>}
        </div>
      </div>
    </Link>
  );
}
