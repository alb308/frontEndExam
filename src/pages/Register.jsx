import React, { useState } from 'react';
import { useUser } from "../components/UserContext";

import { useNavigate } from 'react-router-dom';

function Register() {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    // Simula registrazione
    setUser({ name: email.split('@')[0], role: 'user' });
    navigate('/home');
  };

  return (
    <div>
      <h2>Registrati</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrati</button>
    </div>
  );
}

export default Register;
