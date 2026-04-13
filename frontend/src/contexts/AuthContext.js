import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    authAPI.verify(token)
      .then(r => setCurrentUser(r.data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const r = await authAPI.login(email, password);
    localStorage.setItem("token", r.data.token);
    setCurrentUser(r.data.user);
  };

  const register = async (name, email, password) => {
    const r = await authAPI.register(name, email, password);
    localStorage.setItem("token", r.data.token);
    setCurrentUser(r.data.user);
  };

  const logout = () => { localStorage.removeItem("token"); setCurrentUser(null); };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
