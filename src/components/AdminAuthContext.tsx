
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: 'admin';
  created_at: string;
  updated_at: string;
  user_id: string;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const initSession = async () => {
      const authState = localStorage.getItem("admin-auth");
      setIsLoggedIn(authState === "true");
    };

    initSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", username)
        .single();

      if (adminError || !admin) {
        console.error("Error checking admin:", adminError);
        return false;
      }

      if (admin.password === password) {
        setIsLoggedIn(true);
        localStorage.setItem("admin-auth", "true");
        localStorage.setItem("admin-username", username);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Unexpected error during login:", err);
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin-auth");
    localStorage.removeItem("admin-username");
  };

  const checkAuth = async () => {
    const authState = localStorage.getItem("admin-auth");
    const isAuthenticated = authState === "true";
    
    if (isLoggedIn !== isAuthenticated) {
      setIsLoggedIn(isAuthenticated);
    }
    
    return isAuthenticated;
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isLoggedIn, 
      login, 
      logout, 
      checkAuth,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
