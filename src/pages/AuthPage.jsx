import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useCans } from '../lib/useCans';

export default function AuthPage() {
  const { user, login } = useAuth();
  const { cans } = useCans();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/collezione?davotare=1';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => { if (user) navigate(from, { replace: true }); }, [user, from, navigate]);

  const wall = useMemo(() => (cans ?? []).slice(0, 24), [cans]);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <aside className="auth__wall" aria-hidden="true">
        <div className="auth__wallgrid">
          {wall.map((c) => <img key={c.id} src={c.img} alt="" />)}
        </div>
        <div className="auth__wallcopy">
          <h2>Area riservata.</h2>
          <p>Solo per il proprietario della collezione: da qui si votano le lattine.</p>
        </div>
      </aside>

      <section className="auth__panel">
        <form className="form" onSubmit={onSubmit} noValidate>
          <p className="eyebrow">Proprietario</p>
          <h1 className="form__title">Accedi</h1>

          <label className="field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={update('email')} autoComplete="email" required />
          </label>
          <label className="field">
            <span>Password</span>
            <div className="field__pw">
              <input
                type={show ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                autoComplete="current-password"
                required
              />
              <button type="button" onClick={() => setShow((s) => !s)}>{show ? 'Nascondi' : 'Mostra'}</button>
            </div>
          </label>

          {error && <p className="form__error" role="alert">{error}</p>}

          <button className="btn btn--accent btn--block" disabled={busy}>
            {busy ? 'Un attimo…' : 'Entra'}
          </button>
        </form>
      </section>
    </div>
  );
}
