
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "@/components/UserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectRequest {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

interface SoftwareOrder {
  id: string;
  software_id: number;
  status: string;
  created_at: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  created_at: string;
}

const CustomerDashboard = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [softwareOrders, setSoftwareOrders] = useState<SoftwareOrder[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      try {
        const [projectRequestsData, softwareOrdersData, ticketsData] = await Promise.all([
          supabase
            .from("project_requests")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("software_orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("support_tickets")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        if (projectRequestsData.data) setProjectRequests(projectRequestsData.data);
        if (softwareOrdersData.data) setSoftwareOrders(softwareOrdersData.data);
        if (ticketsData.data) setTickets(ticketsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-24">
        <h1 className="text-3xl font-bold text-right font-tajawal text-trndsky-darkblue mb-8">
          لوحة التحكم
        </h1>

        <Tabs defaultValue="projects" dir="rtl" className="w-full">
          <TabsList className="w-full justify-end mb-6">
            <TabsTrigger value="projects" className="font-tajawal">الطلبات</TabsTrigger>
            <TabsTrigger value="software" className="font-tajawal">البرمجيات</TabsTrigger>
            <TabsTrigger value="tickets" className="font-tajawal">التذاكر</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            {loading ? (
              <p className="text-center font-tajawal">جاري التحميل...</p>
            ) : projectRequests.length === 0 ? (
              <p className="text-center text-gray-500 font-tajawal">لا يوجد طلبات حالياً</p>
            ) : (
              <div className="grid gap-4">
                {projectRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <h3 className="font-bold text-lg mb-2 text-right font-tajawal">
                      {request.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString("ar-SA")}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-tajawal
                        ${request.status === "new" ? "bg-blue-100 text-blue-700" : ""}
                        ${request.status === "in_progress" ? "bg-yellow-100 text-yellow-700" : ""}
                        ${request.status === "completed" ? "bg-green-100 text-green-700" : ""}
                      `}>
                        {request.status === "new" ? "جديد" : 
                         request.status === "in_progress" ? "قيد التنفيذ" : "مكتمل"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="software">
            {loading ? (
              <p className="text-center font-tajawal">جاري التحميل...</p>
            ) : softwareOrders.length === 0 ? (
              <p className="text-center text-gray-500 font-tajawal">لا يوجد طلبات برمجيات حالياً</p>
            ) : (
              <div className="grid gap-4">
                {softwareOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString("ar-SA")}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-tajawal
                        ${order.status === "new" ? "bg-blue-100 text-blue-700" : ""}
                        ${order.status === "processing" ? "bg-yellow-100 text-yellow-700" : ""}
                        ${order.status === "completed" ? "bg-green-100 text-green-700" : ""}
                      `}>
                        {order.status === "new" ? "جديد" : 
                         order.status === "processing" ? "قيد المعالجة" : "مكتمل"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tickets">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => navigate("/new-ticket")}
                className="bg-trndsky-blue text-white px-6 py-2 rounded-lg font-tajawal hover:bg-trndsky-blue/90 transition-colors"
              >
                فتح تذكرة جديدة
              </button>
            </div>
            
            {loading ? (
              <p className="text-center font-tajawal">جاري التحميل...</p>
            ) : tickets.length === 0 ? (
              <p className="text-center text-gray-500 font-tajawal">لا يوجد تذاكر حالياً</p>
            ) : (
              <div className="grid gap-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                  >
                    <h3 className="font-bold text-lg mb-2 text-right font-tajawal">
                      {ticket.subject}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(ticket.created_at).toLocaleDateString("ar-SA")}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-tajawal
                        ${ticket.status === "open" ? "bg-green-100 text-green-700" : ""}
                        ${ticket.status === "closed" ? "bg-gray-100 text-gray-700" : ""}
                      `}>
                        {ticket.status === "open" ? "مفتوح" : "مغلق"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CustomerDashboard;
