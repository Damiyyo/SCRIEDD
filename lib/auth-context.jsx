"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { backendRequest } from "@/lib/backend";

const STORAGE_KEY = "scried.auth";
const AuthContext = createContext(null);

function readSession() {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeSession(session) {
  if (session) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else sessionStorage.removeItem(STORAGE_KEY);
}

function tokenFrom(result) {
  const payload = result?.data || result;
  return {
    accessToken: payload?.access_token || payload?.accessToken,
    refreshToken: payload?.refresh_token || payload?.refreshToken,
  };
}

function normalizeUser(result) {
  const value = result?.data || result;
  if (!value) return null;
  return { ...value, isStaff: value.isStaff ?? value.is_staff ?? (value.role === "staff" || value.role === "admin") };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const clearSession = useCallback(() => {
    writeSession(null);
    setSession(null);
    setUser(null);
  }, []);

  const saveTokens = useCallback((tokens) => {
    const next = { ...tokens };
    writeSession(next);
    setSession(next);
    return next;
  }, []);

  const refresh = useCallback(async (refreshToken = session?.refreshToken) => {
    if (!refreshToken) throw new Error("Your session has expired. Please sign in again.");
    const result = await backendRequest("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    return saveTokens({ ...tokenFrom(result), refreshToken: tokenFrom(result).refreshToken || refreshToken });
  }, [saveTokens, session?.refreshToken]);

  const authenticatedRequest = useCallback(async (path, options = {}) => {
    const active = session || readSession();
    if (!active?.accessToken) throw new Error("Please sign in to continue.");
    try {
      return await backendRequest(path, {
        ...options,
        headers: { ...(options.headers || {}), Authorization: `Bearer ${active.accessToken}` },
      });
    } catch (error) {
      if (error.status !== 401 || !active.refreshToken) throw error;
      const next = await refresh(active.refreshToken);
      return backendRequest(path, {
        ...options,
        headers: { ...(options.headers || {}), Authorization: `Bearer ${next.accessToken}` },
      });
    }
  }, [refresh, session]);

  const signIn = useCallback(async (credentials) => {
    const result = await backendRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
    const tokens = tokenFrom(result);
    if (!tokens.accessToken) throw new Error("The API did not return an access token.");
    saveTokens(tokens);
    const current = await backendRequest("/auth/me", { headers: { Authorization: `Bearer ${tokens.accessToken}` } });
    const normalized = normalizeUser(current);
    setUser(normalized);
    return normalized;
  }, [saveTokens]);

  const signOut = useCallback(async () => {
    const active = session || readSession();
    try {
      if (active?.accessToken) await backendRequest("/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${active.accessToken}` } });
    } finally {
      clearSession();
    }
  }, [clearSession, session]);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const stored = readSession();
      if (!stored?.accessToken) return setReady(true);
      setSession(stored);
      try {
        const current = await backendRequest("/auth/me", { headers: { Authorization: `Bearer ${stored.accessToken}` } });
        if (!cancelled) setUser(normalizeUser(current));
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    hydrate();
    return () => { cancelled = true; };
  }, [clearSession]);

  const value = useMemo(() => ({ user, session, ready, isAuthenticated: Boolean(session?.accessToken), signIn, signOut, refresh, authenticatedRequest, clearSession }), [user, session, ready, signIn, signOut, refresh, authenticatedRequest, clearSession]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
