import React, { useState } from 'react';
import { useUser } from "../components/UserContext";

import { useNavigate } from 'react-router-dom';

function Login() {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === 'admin@monster.it' && password === 'admin123') {
      setUser({ name: 'Admin', role: 'admin' });
      navigate('/admin');
    } else {
      setUser({ name: email.split('@')[0], role: 'user' });
      navigate('/');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Accedi</button>
    </div>
  );
}

export default Login;
