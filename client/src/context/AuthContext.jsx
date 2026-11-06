/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";
import { TOKEN_KEY } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If a token is saved we must check it with the server before deciding who is logged in.
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    let cancelled = false;
    authService
      .me()
      .then((data) => !cancelled && setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const startSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  }, []);

  const login = useCallback(async (email, password) => startSession(await authService.login({ email, password })), [startSession]);
  const register = useCallback(async (name, email, password) => startSession(await authService.register({ name, email, password })), [startSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout, setUser }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
