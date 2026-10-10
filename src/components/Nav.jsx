import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import Logo from './Logo';

export default function Nav() {
  const { isOwner, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__brand" aria-label="CANVAULT home"><Logo /></Link>

        <nav className="nav__links">
          <NavLink to="/collezione">Collezione</NavLink>
          <NavLink to="/classifica">Classifica</NavLink>
        </nav>

        <div className="nav__side">
          {isOwner && (
            <div className="owner">
              <span className="owner__badge"><span className="pulse" /> Modalità voto</span>
              <button className="owner__out" onClick={onLogout}>Esci</button>
            </div>
          )}
          <button className="nav__burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            <span /><span />
          </button>
        </div>
      </div>
      {open && (
        <div className="nav__sheet">
          <NavLink to="/collezione">Collezione</NavLink>
          <NavLink to="/classifica">Classifica</NavLink>
          {isOwner && <button onClick={onLogout}>Esci</button>}
        </div>
      )}
    </header>
  );
}
