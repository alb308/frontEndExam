import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="notfound">
      <span className="notfound__code">404</span>
      <h1>Lattina vuota.</h1>
      <p>Questa pagina non c'è. Forse l'ha bevuta qualcuno.</p>
      <Link to="/" className="btn btn--accent">Torna alla home</Link>
    </div>
  );
}
