
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  updateDefaultAdmin?: (username: string, password: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

// Setting the default admin credentials as requested
const DEFAULT_ADMIN = {
  username: "admin",
  password: "Salemss1412",
};

const getDefaultAdmin = () => ({
  username: localStorage.getItem("default-admin-username") || DEFAULT_ADMIN.username,
  password: localStorage.getItem("default-admin-password") || DEFAULT_ADMIN.password,
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [defaultAdmin, setDefaultAdmin] = useState(getDefaultAdmin());

  useEffect(() => {
    const initSession = async () => {
      const authState = localStorage.getItem("admin-auth");
      setIsLoggedIn(authState === "true");
    };

    initSession();
  }, []);

  // Function to update default admin credentials
  const updateDefaultAdmin = (username: string, password: string) => {
    const newDefaultAdmin = { username, password };
    setDefaultAdmin(newDefaultAdmin);
    console.log("Default admin updated:", username);
  };

  const login = async (username: string, password: string) => {
    try {
      console.log("Attempting login with:", username);
      
      // Get the latest default admin credentials
      const currentDefaultAdmin = getDefaultAdmin();
      console.log("Current default admin username:", currentDefaultAdmin.username);
      
      if (username === currentDefaultAdmin.username && password === currentDefaultAdmin.password) {
        console.log("Default admin credentials matched");
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
      updateDefaultAdmin
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
