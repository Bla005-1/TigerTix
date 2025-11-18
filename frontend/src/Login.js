import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import './Auth.css';

function Login({ navigate }) {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {msg && <p className="status">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input aria-label="username" aria-required="true" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input aria-label="password" aria-required="true" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button>Login</button>
      </form>
      <div className="auth-link">
        <button aria-label="register" onClick={() => navigate('register')}>New Here? Register</button>
      </div>
    </div>
  );
}

export default Login;
