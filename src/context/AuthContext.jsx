import { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken, hasToken } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMe() {
      if (!hasToken()) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await api.me();
        setUser(user);
      } catch {
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    loadMe();
  }, []);

  async function login(payload) {
    const { token, user } = await api.login(payload);
    setToken(token);
    setUser(user);
  }

  async function signup(payload) {
    const { token, user } = await api.signup(payload);
    setToken(token);
    setUser(user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  function updateUser(patch) {
    setUser((u) => ({ ...u, ...patch }));
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
