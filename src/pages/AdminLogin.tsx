
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/components/AdminAuthContext";

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
    <div className="flex min-h-screen items-center justify-center bg-blue-900">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-8 text-center font-tajawal text-blue-900">لوحة تحكم المسؤول</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border p-3 rounded-md font-tajawal focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-gray-50"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border p-3 rounded-md font-tajawal focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-gray-50"
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-red-600 font-tajawal text-sm text-right">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-md font-tajawal text-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
