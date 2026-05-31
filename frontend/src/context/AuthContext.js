import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    return token ? { token, role, name } : null;
  });

  const login = async (email, password) => {
    const form = new FormData();
    form.append("username", email);
    form.append("password", password);
    const { data } = await api.post("/auth/login", form);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);
    setUser({ token: data.access_token, role: data.role, name: data.name });
    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
