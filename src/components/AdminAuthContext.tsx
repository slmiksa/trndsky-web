
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  supabaseAuth: {
    signIn: (username: string, password: string) => Promise<boolean>;
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
      // التحقق من حالة تسجيل الدخول من التخزين المحلي
      const authState = localStorage.getItem("admin-auth");
      setIsLoggedIn(authState === "true");
    };

    initSession();
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  // تسجيل الدخول البسيط (للدعم المتراجع)
  const login = (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true);
      localStorage.setItem("admin-auth", "true");
      return true;
    }
    return false;
  };

  // تسجيل الدخول باستخدام قاعدة البيانات
  const signIn = async (username: string, password: string) => {
    try {
      // التحقق من وجود المشرف في جدول admin_users
      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", username)
        .single();
      
      if (adminError) {
        console.error("Error checking admin:", adminError);
        return false;
      }
      
      // التحقق من كلمة المرور
      if (adminData) {
        // التحقق من كلمة المرور (بشكل بسيط، يمكن استخدام طرق أكثر أمانًا)
        if (adminData.password === password) {
          setIsLoggedIn(true);
          localStorage.setItem("admin-auth", "true");
          localStorage.setItem("admin-username", username);
          return true;
        }
      }
      
      return false;
    } catch (err) {
      console.error("Unexpected error during sign in:", err);
      return false;
    }
  };

  const signOut = async () => {
    logout();
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin-auth");
    localStorage.removeItem("admin-username");
  };

  const checkAuth = async () => {
    // التحقق من حالة تسجيل الدخول من التخزين المحلي
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
