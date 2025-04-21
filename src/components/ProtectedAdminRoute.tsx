
import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, checkAuth } = useAdminAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "خطأ في التحقق",
          description: "حدث خطأ أثناء التحقق من صلاحيات الوصول",
          variant: "destructive"
        });
      } finally {
        setIsChecking(false);
      }
    };
    
    verifyAuth();
  }, [checkAuth]);
  
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
