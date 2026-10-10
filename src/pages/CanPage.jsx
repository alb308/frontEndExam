import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { categoryColor, COUNTRY_FLAGS, scoreLabel } from '../lib/theme';
import CanCard from '../components/CanCard';
import Loader from '../components/Loader';
import VotePicker from '../components/VotePicker';

const Can3D = lazy(() => import('../components/Can3D'));

export default function CanPage() {
  const { id } = useParams();
  const { isOwner, ready } = useAuth();
  const navigate = useNavigate();
  const [can, setCan] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!ready) return;
    let alive = true;
    setError(null);
    api.can(id)
      .then((data) => alive && setCan(data))
      .catch((e) => alive && setError(e.status === 404 ? 'notfound' : e.message));
    return () => { alive = false; };
  }, [id, ready, isOwner]);

  // ← / → to flip through the collection.
  useEffect(() => {
    if (!can) return;
    const onKey = (e) => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowLeft') navigate(`/lattina/${can.prev.id}`);
      if (e.key === 'ArrowRight') navigate(`/lattina/${can.next.id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [can, navigate]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const applyVote = async (action, optimistic) => {
    const before = can;
    setCan({ ...can, score: optimistic });
    setBusy(true);
    try {
      const { score } = await action();
      setCan((c) => ({ ...c, score }));
      setToast(optimistic ? `Voto salvato: ${optimistic}/10` : 'Voto rimosso');
    } catch (e) {
      setCan(before);
      setToast(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (error === 'notfound') {
    return (
      <div className="page empty">
        <strong>Questa lattina non esiste (ancora).</strong>
        <Link to="/collezione" className="btn btn--ghost btn--sm">Torna alla collezione</Link>
      </div>
    );
  }
  if (error) return <div className="page empty">{error}</div>;
  if (!can || String(can.id) !== String(id)) return <div className="page"><Loader /></div>;

  const glow = categoryColor(can.category);

  return (
    <div className="can" style={{ '--glow': glow }}>
      <div className="can__bgword" aria-hidden="true">{can.category}</div>

      <div className="can__inner">
        <nav className="crumbs">
          <Link to="/collezione">Collezione</Link>
          <span>/</span>
          <Link to={`/collezione?linea=${encodeURIComponent(can.category)}`}>{can.category}</Link>
        </nav>

        <div className="can__layout">
          <div className="can__stage">
            <div className="can__halo" />
            <Suspense fallback={<img src={can.img} alt={can.name} className="can__img" />}>
              <Can3D src={can.img} alt={can.name} glow={glow} hint />
            </Suspense>
            <div className="can__flip">
              <Link to={`/lattina/${can.prev.id}`} aria-label={`Precedente: ${can.prev.name}`}>←</Link>
              <span className="mono">#{String(can.id).padStart(3, '0')}</span>
              <Link to={`/lattina/${can.next.id}`} aria-label={`Successiva: ${can.next.name}`}>→</Link>
            </div>
          </div>

          <div className="can__info">
            <p className="eyebrow"><span className="dot" /> {can.category}{can.limited && <span className="tag tag--limited">Limited</span>}</p>
            <h1 className="can__title">{can.name}</h1>

            <dl className="specs">
              <div><dt>Anno</dt><dd>{can.year ?? '—'}</dd></div>
              <div><dt>Paese</dt><dd>{COUNTRY_FLAGS[can.country] ?? ''} {can.country ?? '—'}</dd></div>
              <div><dt>Formato</dt><dd>{can.size ?? '—'}</dd></div>
              <div><dt>Edizione</dt><dd>{can.limited ? 'Limitata' : 'Standard'}</dd></div>
            </dl>

            <section className={`votebox ${can.score == null ? 'votebox--empty' : ''}`}>
              <div className="votebox__summary">
                <div className="votebox__avg">
                  <span className="votebox__num">{can.score ?? '–'}</span>
                  <span className="votebox__of">/10</span>
                </div>
                <div className="votebox__text">
                  <span className="votebox__kicker">Il mio voto</span>
                  <strong>{can.score != null ? scoreLabel(can.score) : 'Non ancora votata'}</strong>
                </div>
              </div>

              {isOwner && (
                <div className="votebox__action">
                  <h2 className="votebox__h">{can.score ? 'Cambia voto' : 'Vota questa lattina'}</h2>
                  <VotePicker
                    value={can.score}
                    busy={busy}
                    onVote={(n) => n !== can.score && applyVote(() => api.vote(can.id, n), n)}
                    onClear={() => applyVote(() => api.unvote(can.id), null)}
                  />
                </div>
              )}
            </section>
          </div>
        </div>

        {can.related.length > 0 && (
          <section className="section section--tight">
            <div className="section__head">
              <div>
                <p className="eyebrow">Stessa linea</p>
                <h2 className="section__title">Altre {can.category}</h2>
              </div>
            </div>
            <div className="grid grid--4">
              {can.related.map((c) => <CanCard key={c.id} can={c} />)}
            </div>
          </section>
        )}
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
