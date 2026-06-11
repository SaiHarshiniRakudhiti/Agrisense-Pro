import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("agrisense_user")); } catch { return null; }
  });

  const login = useCallback((token, userData) => {
    localStorage.setItem("agrisense_token", token);
    localStorage.setItem("agrisense_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("agrisense_token");
    localStorage.removeItem("agrisense_user");
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, isAuth: !!user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);