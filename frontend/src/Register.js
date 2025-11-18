import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import './Auth.css';

function Register({ navigate }) {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      navigate('login');
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Create Account</h2>
      {msg && <p className="status">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input aria-label="username" aria-required="true" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input aria-label="password" aria-required="true" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button>Register</button>
      </form>
    </div>
  );
}

export default Register;
