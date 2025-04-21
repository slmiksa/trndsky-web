
import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type ProjectRequest = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  title: string;
  description: string;
  status: string;
  created_at: string;
};

type SoftwareOrder = {
  id: string;
  software_id: number;
  company_name: string;
  whatsapp: string;
  status: string;
  created_at: string;
};

const AdminDashboard = () => {
  const { isLoggedIn, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [orders, setOrders] = useState<SoftwareOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/adminlogin");
      return;
    }

    async function fetchData() {
      setLoading(true);
      // Fetch project_requests
      const { data: reqData } = await supabase
        .from("project_requests")
        .select("*")
        .in("status", ["new", "open"])
        .order("created_at", { ascending: false });

      // Fetch software_orders
      const { data: ordData } = await supabase
        .from("software_orders")
        .select("*")
        .in("status", ["new", "open"])
        .order("created_at", { ascending: false });

      setRequests(reqData || []);
      setOrders(ordData || []);
      setLoading(false);
    }
    fetchData();
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/adminlogin");
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <header className="flex items-center justify-between px-8 py-6 bg-white shadow">
        <h1 className="text-2xl font-bold text-trndsky-blue">لوحة تحكم المسؤول</h1>
        <button
          onClick={handleLogout}
          className="bg-trndsky-teal text-white px-4 py-2 rounded-lg font-tajawal hover:bg-trndsky-blue transition-all"
        >
          تسجيل خروج
        </button>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-trndsky-darkblue">طلبات برمجة بأفكارك (جديدة/مفتوحة)</h2>
          {loading ? (
            <div className="text-center py-8 text-trndsky-blue">جارٍ التحميل...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-4 text-gray-500">لا توجد طلبات جديدة أو مفتوحة.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-base text-right border bg-white rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-trndsky-teal/10">
                    <th className="px-4 py-2">الاسم</th>
                    <th className="px-4 py-2">البريد الإلكتروني</th>
                    <th className="px-4 py-2">رقم الهاتف</th>
                    <th className="px-4 py-2">العنوان</th>
                    <th className="px-4 py-2">الشرح</th>
                    <th className="px-4 py-2">الحالة</th>
                    <th className="px-4 py-2">تاريخ الطلب</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{r.name}</td>
                      <td className="px-4 py-2">{r.email || "-"}</td>
                      <td className="px-4 py-2">{r.phone || "-"}</td>
                      <td className="px-4 py-2">{r.title}</td>
                      <td className="px-4 py-2 max-w-[300px]">{r.description}</td>
                      <td className="px-4 py-2">{r.status}</td>
                      <td className="px-4 py-2">{new Date(r.created_at).toLocaleString("ar-EG")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-trndsky-darkblue">طلبات برمجيات جاهزة (جديدة/مفتوحة)</h2>
          {loading ? (
            <div className="text-center py-8 text-trndsky-blue">جارٍ التحميل...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-4 text-gray-500">لا توجد طلبات جديدة أو مفتوحة.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-base text-right border bg-white rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-trndsky-teal/10">
                    <th className="px-4 py-2">رقم المنتج</th>
                    <th className="px-4 py-2">اسم الشركة / العميل</th>
                    <th className="px-4 py-2">واتساب</th>
                    <th className="px-4 py-2">الحالة</th>
                    <th className="px-4 py-2">تاريخ الطلب</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{o.software_id}</td>
                      <td className="px-4 py-2">{o.company_name}</td>
                      <td className="px-4 py-2">{o.whatsapp}</td>
                      <td className="px-4 py-2">{o.status}</td>
                      <td className="px-4 py-2">{new Date(o.created_at).toLocaleString("ar-EG")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
export default AdminDashboard;
