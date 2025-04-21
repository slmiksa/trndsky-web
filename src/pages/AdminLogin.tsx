
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/components/AdminAuthContext";

const AdminLogin = () => {
  const { isLoggedIn, login } = useAdminAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isLoggedIn) {
    navigate("/admin");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate("/admin");
    } else {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-trndsky-blue">
      <div className="bg-white rounded-2xl p-8 shadow-2xl min-w-[320px]">
        <h2 className="text-2xl font-bold mb-6 text-center font-tajawal text-trndsky-darkblue">لوحة تحكم المسؤول</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border p-3 rounded font-tajawal focus:outline-none focus:ring-2 focus:ring-trndsky-teal"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border p-3 rounded font-tajawal focus:outline-none focus:ring-2 focus:ring-trndsky-teal"
              required
            />
          </div>
          {error && <div className="text-red-600 font-tajawal text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-l from-trndsky-teal to-trndsky-blue text-white py-2 rounded mt-4 font-tajawal text-lg hover:scale-105 transition-all"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminLogin;
