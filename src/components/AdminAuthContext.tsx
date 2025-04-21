
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminAuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Load auth state on initial render
  useEffect(() => {
    const authState = localStorage.getItem("admin-auth");
    setIsLoggedIn(authState === "true");
  }, []);

  // If auth state is still loading, show nothing
  if (isLoggedIn === null) {
    return null;
  }

  const login = (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true);
      localStorage.setItem("admin-auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin-auth");
  };

  return (
    <AdminAuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
