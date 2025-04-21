import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  supabaseAuth: {
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: () => Promise<void>;
  };
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsLoggedIn(true);
        localStorage.setItem("admin-auth", "true");
      } else {
        const authState = localStorage.getItem("admin-auth");
        setIsLoggedIn(authState === "true");
      }
    };

    initSession();
  }, []);

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

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Supabase auth error:", error);
        return false;
      }
      
      setIsLoggedIn(true);
      localStorage.setItem("admin-auth", "true");
      return true;
    } catch (err) {
      console.error("Unexpected error during sign in:", err);
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin-auth");
  };

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      if (!isLoggedIn) {
        setIsLoggedIn(true);
        localStorage.setItem("admin-auth", "true");
      }
      return true;
    }
    
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
      supabaseAuth: {
        signIn,
        signOut
      }
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
