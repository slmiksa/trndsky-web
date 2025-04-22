import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123",
};

const getDefaultAdmin = () => ({
  username: localStorage.getItem("default-admin-username") || "admin",
  password: localStorage.getItem("default-admin-password") || "admin123",
});

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
      console.log("Attempting login with:", username);
      
      const defaultAdmin = getDefaultAdmin();
      if (username === defaultAdmin.username && password === defaultAdmin.password) {
        console.log("Default admin credentials detected");
        setIsLoggedIn(true);
        localStorage.setItem("admin-auth", "true");
        localStorage.setItem("admin-username", username);
        localStorage.setItem("admin-id", "default-admin");
        return true;
      }
      
      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("id, username, password")
        .eq("username", username)
        .maybeSingle();

      console.log("Login query result:", admin, adminError);
      
      if (adminError) {
        console.error("Error checking admin:", adminError);
        return false;
      }

      if (!admin) {
        console.error("Admin not found");
        return false;
      }

      if (admin.password === password) {
        console.log("Password match, login successful");
        setIsLoggedIn(true);
        localStorage.setItem("admin-auth", "true");
        localStorage.setItem("admin-username", username);
        localStorage.setItem("admin-id", admin.id);
        return true;
      }

      console.log("Password mismatch");
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
    localStorage.removeItem("admin-id");
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
