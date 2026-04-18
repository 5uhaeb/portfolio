import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // On mount, if we have a token, verify it by hitting /auth/me
  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!getToken()) {
        setReady(true);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(username, password) {
    const { data } = await api.post('/auth/login', { username, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, isAdmin: user?.role === 'admin', ready, login, logout }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
