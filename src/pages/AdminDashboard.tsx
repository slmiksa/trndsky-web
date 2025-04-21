
import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
// استبدل أي استخدام لأي أيقونة خارج اللائحة بأيقونة من القائمة المسموح بها
import { FolderOpen, X, Eye } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

const statusLabels: Record<string, string> = {
  new: "جديد",
  open: "مفتوح",
  closed: "مغلق",
};

const statusColors: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-800",
  open: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-800",
};

const AdminDashboard = () => {
  const { isLoggedIn, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [orders, setOrders] = useState<SoftwareOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // حاله لتحديد التذكرة المعروضة
  const [viewedRequest, setViewedRequest] = useState<ProjectRequest | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/adminlogin");
      return;
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, navigate]);

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

  const handleLogout = () => {
    logout();
    navigate("/adminlogin");
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase
      .from("project_requests")
      .update({ status: newStatus })
      .eq("id", id);
    fetchData();
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <header className="flex items-center justify-between px-8 py-6 bg-white shadow">
        <h1 className="text-2xl font-bold text-trndsky-blue">
          لوحة تحكم المسؤول
        </h1>
        <button
          onClick={handleLogout}
          className="bg-trndsky-teal text-white px-4 py-2 rounded-lg font-tajawal hover:bg-trndsky-blue transition-all"
        >
          تسجيل خروج
        </button>
      </header>
      <main className="max-w-6xl mx-auto py-8 px-4">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-trndsky-darkblue">
            طلبات برمجة بأفكارك (جديدة/مفتوحة)
          </h2>
          {loading ? (
            <div className="text-center py-8 text-trndsky-blue">
              جارٍ التحميل...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              لا توجد طلبات جديدة أو مفتوحة.
            </div>
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
                    <th className="px-4 py-2">إجراءات</th>
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
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-semibold ${statusColors[r.status] || ""
                            }`}
                        >
                          {statusLabels[r.status] || r.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {new Date(r.created_at).toLocaleString("ar-EG")}
                      </td>
                      <td className="px-4 py-2 flex items-center gap-1">
                        {/* زر استعراض كامل التذكرة */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              title="استعراض كامل التذكرة"
                              onClick={() => setViewedRequest(r)}
                            >
                              <Eye />
                            </Button>
                          </DialogTrigger>
                          <DialogContent dir="rtl">
                            <DialogHeader>
                              <DialogTitle>تفاصيل التذكرة</DialogTitle>
                              <DialogDescription>
                                معلومات الطلب بشكل كامل
                              </DialogDescription>
                            </DialogHeader>
                            {viewedRequest && viewedRequest.id === r.id && (
                              <div className="text-base space-y-4 py-4">
                                <div>
                                  <span className="font-medium">الاسم: </span>
                                  {viewedRequest.name}
                                </div>
                                <div>
                                  <span className="font-medium">البريد الإلكتروني: </span>
                                  {viewedRequest.email || "-"}
                                </div>
                                <div>
                                  <span className="font-medium">رقم الهاتف: </span>
                                  {viewedRequest.phone || "-"}
                                </div>
                                <div>
                                  <span className="font-medium">العنوان: </span>
                                  {viewedRequest.title}
                                </div>
                                <div>
                                  <span className="font-medium">الشرح: </span>
                                  {viewedRequest.description}
                                </div>
                                <div>
                                  <span className="font-medium">الحالة: </span>
                                  <span className={`rounded px-2 py-1 text-xs font-semibold ${statusColors[viewedRequest.status] || ""
                                    }`}>
                                    {statusLabels[viewedRequest.status] || viewedRequest.status}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium">تاريخ الطلب: </span>
                                  {new Date(viewedRequest.created_at).toLocaleString("ar-EG")}
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="secondary">إغلاق</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <button
                          disabled={r.status === "open"}
                          className="px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200 transition-all disabled:opacity-50"
                          onClick={() => updateStatus(r.id, "open")}
                          title="تحويل لمفتوح"
                        >
                          <FolderOpen size={16} />
                        </button>
                        <button
                          disabled={r.status === "closed"}
                          className="px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 transition-all disabled:opacity-50"
                          onClick={() => updateStatus(r.id, "closed")}
                          title="إغلاق"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-trndsky-darkblue">
            طلبات برمجيات جاهزة (جديدة/مفتوحة)
          </h2>
          {loading ? (
            <div className="text-center py-8 text-trndsky-blue">
              جارٍ التحميل...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              لا توجد طلبات جديدة أو مفتوحة.
            </div>
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
                      <td className="px-4 py-2">
                        {new Date(o.created_at).toLocaleString("ar-EG")}
                      </td>
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
