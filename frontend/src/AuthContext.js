import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('jwt');
    const username = localStorage.getItem('username');
    if (t) {
      setToken(t);
      setUser(username);
    }
  }, []);

  async function login(username, password) {
    const res = await fetch('http://localhost:7001/login', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    setUser(username);
    setToken(data.token);

    localStorage.setItem('jwt', data.token);
    localStorage.setItem('username', username);
  }

  async function register(username, password) {
    const res = await fetch('http://localhost:7001/register', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    return true;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
