
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { ArrowRight, LockKeyhole, User } from 'lucide-react';

const AdminLogin = () => {
  const { isLoggedIn, login } = useAdminAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isLoggedIn) {
    navigate("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate("/admin");
      } else {
        setError("بيانات الدخول غير صحيحة");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-trndsky-blue to-trndsky-darkblue"></div>
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-trndsky-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-60 -right-60 w-96 h-96 bg-trndsky-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      </div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[length:20px_20px] opacity-20"></div>
      
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 border border-white/20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-trndsky-teal to-trndsky-blue flex items-center justify-center shadow-lg">
              <LockKeyhole size={40} className="text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-8 text-center font-tajawal text-white">لوحة تحكم المسؤول</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <User className="h-5 w-5 text-white/70" />
              </div>
              <input
                type="text"
                placeholder="اسم المستخدم"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full border-0 p-4 pl-5 pr-12 rounded-xl font-tajawal focus:outline-none focus:ring-2 focus:ring-trndsky-teal text-right bg-white/10 backdrop-blur-md text-white placeholder:text-white/70"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <LockKeyhole className="h-5 w-5 text-white/70" />
              </div>
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border-0 p-4 pl-5 pr-12 rounded-xl font-tajawal focus:outline-none focus:ring-2 focus:ring-trndsky-teal text-right bg-white/10 backdrop-blur-md text-white placeholder:text-white/70"
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-red-300 font-tajawal text-sm text-right bg-red-500/10 p-3 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-white hover:bg-white/90 text-trndsky-blue py-4 rounded-xl font-tajawal text-lg transition-all flex items-center justify-center gap-2 font-medium"
              disabled={isLoading}
            >
              {isLoading ? "جاري الدخول..." : "دخول"}
              {!isLoading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-white/80 hover:text-white text-sm underline decoration-white/30 transition-all">
              العودة للصفحة الرئيسية
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
