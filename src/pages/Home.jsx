import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCans } from '../lib/useCans';
import { categoryColor, COLLECTION_START } from '../lib/theme';
import CanCard from '../components/CanCard';

const Can3D = lazy(() => import('../components/Can3D'));

function useElapsed(since) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.floor((now - since.getTime()) / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
}

const pad = (n) => String(n).padStart(2, '0');

export default function Home() {
  const { cans } = useCans();
  const elapsed = useElapsed(COLLECTION_START);
  const [i, setI] = useState(0);

  // Hero rotation: a handful of hand-picked crowd pleasers that read well large.
  const featured = useMemo(() => {
    if (!cans) return [];
    const ids = [65, 6, 10, 48, 66, 24, 30, 9];
    return ids.map((id) => cans.find((c) => c.id === id)).filter(Boolean);
  }, [cans]);

  useEffect(() => {
    if (!featured.length) return;
    const t = setInterval(() => setI((x) => (x + 1) % featured.length), 5200);
    return () => clearInterval(t);
  }, [featured.length]);

  const top = useMemo(() => {
    if (!cans) return [];
    const voted = cans.filter((c) => c.score != null).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    return voted.length >= 4 ? voted.slice(0, 4) : [...cans].sort((a, b) => (b.year ?? 0) - (a.year ?? 0)).slice(0, 4);
  }, [cans]);
  const hasRanking = (cans?.filter((c) => c.score != null).length ?? 0) >= 4;

  const categories = useMemo(() => {
    if (!cans) return [];
    const map = new Map();
    for (const c of cans) {
      const entry = map.get(c.category) ?? { name: c.category, count: 0, img: c.img };
      entry.count += 1;
      map.set(c.category, entry);
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [cans]);

  const stats = useMemo(() => cans && {
    cans: cans.length,
    categories: new Set(cans.map((c) => c.category)).size,
    limited: cans.filter((c) => c.limited).length,
    voted: cans.filter((c) => c.score != null).length,
  }, [cans]);

  const hero = featured[i];
  const left = featured[(i + featured.length - 1) % featured.length];
  const right = featured[(i + 1) % featured.length];

  return (
    <>
      <section className="hero" style={{ '--glow': hero ? categoryColor(hero.category) : 'var(--accent)' }}>
        <div className="hero__bgword" aria-hidden="true">CANVAULT</div>
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="eyebrow"><span className="pulse" /> Collezione privata · dal 1° aprile 2018</p>
            <h1 className="hero__title">
              La mia<br />collezione<br />di <em>Monster.</em>
            </h1>
            <p className="hero__lede">
              {stats ? stats.cans : '83'} lattine che ho raccolto in giro per il mondo, dalle Ultra alle Java,
              fino a quelle giapponesi. Ognuna con il mio voto da 1 a 10.
            </p>
            <div className="hero__ctas">
              <Link to="/collezione" className="btn btn--accent">Esplora la collezione</Link>
              <Link to="/classifica" className="btn btn--ghost">La mia classifica</Link>
            </div>
          </div>

          <div className="hero__stage">
            <div className="hero__ring" />
            {left && <img key={`l${left.id}`} className="hero__can hero__can--side hero__can--l" src={left.img} alt="" />}
            {right && <img key={`r${right.id}`} className="hero__can hero__can--side hero__can--r" src={right.img} alt="" />}
            {hero && (
              <div className="hero__model">
                <Suspense fallback={<div className="can3d"><span className="loader__bars can3d__wait" aria-hidden="true"><i /><i /><i /></span></div>}>
                  <Can3D src={hero.img} alt={hero.name} glow={categoryColor(hero.category)} />
                </Suspense>
              </div>
            )}
            {hero && (
              <Link to={`/lattina/${hero.id}`} className="hero__label">
                <span>{hero.category} · {hero.year}</span>
                <strong>{hero.name}</strong>
                <em>{hero.score != null ? `Il mio voto: ${hero.score}/10` : 'Non ancora votata'}</em>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="statband">
        <div className="statband__inner">
          <div className="stat">
            <span className="stat__num">{stats?.cans ?? '—'}</span>
            <span className="stat__label">Lattine</span>
          </div>
          <div className="stat">
            <span className="stat__num">{stats?.categories ?? '—'}</span>
            <span className="stat__label">Linee</span>
          </div>
          <div className="stat">
            <span className="stat__num">{stats?.limited ?? '—'}</span>
            <span className="stat__label">Limited edition</span>
          </div>
          <div className="stat">
            <span className="stat__num">{stats ? `${stats.voted}` : '—'}<small>/{stats?.cans}</small></span>
            <span className="stat__label">Già votate</span>
          </div>
          <div className="stat stat--clock">
            <span className="stat__num mono">
              {elapsed.d}<small>g</small> {pad(elapsed.h)}<small>h</small> {pad(elapsed.m)}<small>m</small> {pad(elapsed.s)}<small>s</small>
            </span>
            <span className="stat__label">Da quando è iniziata la collezione</span>
          </div>
        </div>
      </section>

      {cans && (
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...cans, ...cans].map((c, k) => <img key={k} src={c.img} alt="" loading="lazy" decoding="async" />)}
          </div>
        </div>
      )}

      <section className="section">
        <div className="section__head">
          <div>
            <p className="eyebrow">{hasRanking ? 'Classifica' : 'Ultimi arrivi'}</p>
            <h2 className="section__title">{hasRanking ? 'Le mie preferite' : 'Le più recenti'}</h2>
          </div>
          <Link to={hasRanking ? '/classifica' : '/collezione'} className="link-arrow">
            {hasRanking ? 'Classifica completa' : 'Tutta la collezione'} →
          </Link>
        </div>
        <div className="grid grid--4">
          {top.map((c, k) => <CanCard key={c.id} can={c} rank={hasRanking ? k + 1 : undefined} />)}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <p className="eyebrow">Linee</p>
            <h2 className="section__title">Scegli il tuo veleno</h2>
          </div>
        </div>
        <div className="cats">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/collezione?linea=${encodeURIComponent(cat.name)}`}
              className="cat"
              style={{ '--glow': categoryColor(cat.name) }}
            >
              <span className="cat__count">{String(cat.count).padStart(2, '0')}</span>
              <span className="cat__name">{cat.name}</span>
              <img src={cat.img} alt="" loading="lazy" />
            </Link>
          ))}
        </div>
      </section>

    </>
  );
}
