
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../redux/actions/authActions';
import './AuthPage.css';

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error: authError, isAuthenticated } = useSelector(state => state.auth);
  
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');
  
  const from = location.state?.from || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = await dispatch(login(formData.email, formData.password));
      if (!result.success) {
        setError(result.error || 'Errore durante il login');
      }
    } else {
      const userData = {
        email: formData.email,
        password: formData.password,
        name: formData.username
      };
      const result = await dispatch(register(userData));
      if (!result.success) {
        setError(result.error || 'Errore durante la registrazione');
      }
    }
  };

  const toggleAuthMode = () => {
    navigate(isLogin ? '/register' : '/login');
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Accedi al tuo account' : 'Crea un nuovo account'}</h2>
        
        {(error || authError) && <div className="auth-error">{error || authError}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength="3"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-spinner"></span>
            ) : isLogin ? 'Accedi' : 'Registrati'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
          <button 
            type="button" 
            className="toggle-button"
            onClick={toggleAuthMode}
          >
            {isLogin ? 'Registrati' : 'Accedi'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;