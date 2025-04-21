
import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAdminAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Short timeout to ensure the auth state is properly loaded
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-tajawal text-trndsky-blue">جاري التحقق من صلاحيات الوصول...</p>
        </div>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/adminlogin" state={{ from: location.pathname }} />;
  }
  
  return <>{children}</>;
}
