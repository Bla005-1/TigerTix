import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  console.log("READY")
  useEffect(() => {
    const t = localStorage.getItem('jwt');
    const user_name = localStorage.getItem('user_name');
    if (t) {
      setToken(t);
      setUser(user_name);
    }
  }, []);

  async function login(user_name, password) {

    const res = await fetch('http://localhost:7001/login', {
      method: 'POST',
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ user_name, password })
    });
    console.log("HWERE")
    const data = await res.json();
    console.log(data, res)

    if (!res.ok) throw new Error(data.error);

    setUser(user_name);
    setToken(data.token);

    localStorage.setItem('jwt', data.token);
    localStorage.setItem('user_name', user_name);
  }

  async function register(user_name, password) {
    console.log(user_name, password);
    console.log(JSON.stringify({ user_name, password }));
    const res = await fetch('http://localhost:7001/register', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_name, password })
    });
    console.log("WHAT")
    
    const data = await res.json();
    console.log(data, res)

    if (!res.ok) throw new Error(data.error);

    return true;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user_name');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
