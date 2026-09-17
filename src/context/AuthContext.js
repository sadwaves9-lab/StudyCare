import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import storage from '../services/storageService';
import { STORAGE_KEYS } from '../config/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await storage.get(STORAGE_KEYS.user, null);
      setUser(saved);
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    if (!email || !password) throw new Error('Email and password required');
    await new Promise((r) => setTimeout(r, 800));
    const u = {
      id: 'u_' + Date.now(),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    await storage.set(STORAGE_KEYS.user, u);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async ({ name, email, password, dob }) => {
    if (!name || !email || !password) throw new Error('All fields required');
    await new Promise((r) => setTimeout(r, 800));
    const u = {
      id: 'u_' + Date.now(),
      name, email,
      dob: dob ? dob.toISOString() : null,
      createdAt: new Date().toISOString(),
    };
    await storage.set(STORAGE_KEYS.user, u);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await storage.remove(STORAGE_KEYS.user);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch) => {
    const next = { ...(user || {}), ...patch };
    await storage.set(STORAGE_KEYS.user, next);
    setUser(next);
    return next;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, isAuthed: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
