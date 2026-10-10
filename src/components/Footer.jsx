import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import Logo from './Logo';

export default function Footer() {
  const { isOwner } = useAuth();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <Logo size={24} />
          <p className="footer__tag">La mia collezione privata, iniziata il 1° aprile 2018. Una lattina alla volta.</p>
        </div>
        <nav className="footer__links">
          <Link to="/collezione">Collezione</Link>
          <Link to="/classifica">Classifica</Link>
        </nav>
      </div>
      <div className="footer__base">
        <span>© {new Date().getFullYear()} CANVAULT</span>
        <span>Progetto fan non ufficiale. Marchi dei rispettivi proprietari.</span>
        <span>
          Foto dei retro: <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer">Open Food Facts</a>,{' '}
          <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.it" target="_blank" rel="noreferrer">CC BY-SA</a>
        </span>
        {!isOwner && <Link to="/accedi" className="footer__private">Area riservata</Link>}
      </div>
    </footer>
  );
}
