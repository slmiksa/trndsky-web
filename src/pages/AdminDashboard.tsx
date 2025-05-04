import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FolderOpen, X, Eye, Users, Edit, Trash2, Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { SoftwareProductDialog } from "@/components/admin/SoftwareProductDialog";
import { AboutContentManager } from "@/components/admin/AboutContentManager";
import { ContactManager } from "@/components/admin/ContactManager";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import { DefaultAdminManager } from "@/components/admin/DefaultAdminManager";
import SlideManager from "@/components/admin/SlideManager";
import { useUploadPartnerLogo } from "@/hooks/useUploadPartnerLogo";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const WISAL_PARTNER = {
  id: -1,
  name: "شركة الوصل الوطنية لتحصيل ديون جهات التمويل",
  logo_url: "/lovable-uploads/aa977791-13b8-471b-92c8-d9ef4ef03f27.png",
  created_at: new Date().toISOString()
};

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

type TrialRequest = {
  id: string;
  company_name: string;
  whatsapp: string;
  status: string;
  created_at: string;
};

type Partner = {
  id: number;
  name: string;
  logo_url: string;
  created_at: string;
};

type SoftwareProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
};

const statusLabels: Record<string, string> = {
  new: "جديد",
  open: "مفتوح",
  closed: "مغلق"
};

const statusColors: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-800",
  open: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-800"
};

const AdminDashboard = () => {
  const { isLoggedIn, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [orders, setOrders] = useState<SoftwareOrder[]>([]);
  const [trialRequests, setTrialRequests] = useState<TrialRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTrials, setLoadingTrials] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [partnerToEdit, setPartnerToEdit] = useState<Partner | null>(null);
  const [partnerForm, setPartnerForm] = useState<Omit<Partner, "id" | "created_at">>({
    name: "",
    logo_url: ""
  });
  const [isSavingPartner, setIsSavingPartner] = useState(false);
  const [viewedRequest, setViewedRequest] = useState<ProjectRequest | null>(null);
  const [viewedOrder, setViewedOrder] = useState<SoftwareOrder | null>(null);
  const [viewedTrialRequest, setViewedTrialRequest] = useState<TrialRequest | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [products, setProducts] = useState<SoftwareProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<SoftwareProduct | null>(null);
  const [productTitlesMap, setProductTitlesMap] = useState<{
    [key: number]: string;
  }>({});
  const {
    uploadLogo,
    uploading: logoUploading,
    error: logoUploadError
  } = useUploadPartnerLogo();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/adminlogin");
      return;
    }
    fetchData();
    fetchTrialRequests();
    fetchPartners();
    fetchProducts();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const titlesMap = products.reduce((acc, product) => {
      acc[product.id] = product.title;
      return acc;
    }, {} as {
      [key: number]: string;
    });
    setProductTitlesMap(titlesMap);
  }, [products]);

  async function fetchData() {
    setLoading(true);
    const {
      data: reqData
    } = await supabase.from("project_requests").select("*").in("status", ["new", "open"]).order("created_at", {
      ascending: false
    });
    const {
      data: ordData
    } = await supabase.from("software_orders").select("*").in("status", ["new", "open"]).order("created_at", {
      ascending: false
    });
    setRequests(reqData || []);
    setOrders(ordData || []);
    setLoading(false);
  }

  async function fetchTrialRequests() {
    setLoadingTrials(true);
    try {
      console.log("Fetching trial requests...");
      
      // تم تعديل الاستعلام - استخدام استعلام مباشر بدون أي join مع جداول أخرى
      const { data, error } = await supabase
        .from("trial_requests")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching trial requests:", error);
        toast({
          title: "خطأ",
          description: `حدث خطأ أثناء جلب طلبات التجربة: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log("Trial requests fetched successfully:", data);
        setTrialRequests(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching trial requests:", err);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع أثناء جلب طلبات التجربة",
        variant: "destructive"
      });
    } finally {
      setLoadingTrials(false);
    }
  }

  async function fetchPartners() {
    setLoadingPartners(true);
    const {
      data,
      error
    } = await supabase.from("partners").select("*").order("id", {
      ascending: true
    });
    if (error) {
      console.error("Error fetching partners:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الشركاء",
        variant: "destructive"
      });
      setPartners([WISAL_PARTNER]);
    } else {
      const partnerList = data || [];
      const wisalExists = partnerList.some(p => p.name === WISAL_PARTNER.name || p.logo_url === WISAL_PARTNER.logo_url);
      if (!wisalExists) {
        setPartners([WISAL_PARTNER, ...partnerList]);
      } else {
        setPartners(partnerList);
      }
    }
    setLoadingPartners(false);
  }

  async function fetchProducts() {
    setLoadingProducts(true);
    const {
      data,
      error
    } = await supabase.from("software_products").select("*").order("id", {
      ascending: true
    });
    if (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب البرمجيات",
        variant: "destructive"
      });
    } else {
      setProducts(data || []);
    }
    setLoadingProducts(false);
  }

  const handleLogout = () => {
    logout();
    navigate("/adminlogin");
  };

  const openNewPartnerDialog = () => {
    setPartnerToEdit(null);
    setPartnerForm({
      name: "",
      logo_url: ""
    });
    setPartnerDialogOpen(true);
  };

  const openEditPartnerDialog = (partner: Partner) => {
    setPartnerToEdit(partner);
    setPartnerForm({
      name: partner.name,
      logo_url: partner.logo_url
    });
    setPartnerDialogOpen(true);
  };

  const handlePartnerFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setPartnerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSavePartner = async () => {
    setIsSavingPartner(true);
    try {
      let logo_url = partnerForm.logo_url;
      if (logoFile) {
        const uploadedUrl = await uploadLogo(logoFile);
        if (!uploadedUrl) {
          throw new Error("لم يتم رفع الشعار");
        }
        logo_url = uploadedUrl;
      }
      if (partnerToEdit && partnerToEdit.id === -1) {
        const updatedWisal = {
          ...WISAL_PARTNER,
          name: partnerForm.name,
          logo_url: logo_url
        };
        setPartners(prev => {
          const withoutWisal = prev.filter(p => p.id !== -1);
          return [updatedWisal, ...withoutWisal];
        });
        toast({
          title: "تم التحديث",
          description: "تم تحديث بيانات الشريك الإفتراضي بنجاح"
        });
      } else if (partnerToEdit) {
        const {
          error
        } = await supabase.from("partners").update({
          name: partnerForm.name,
          logo_url
        }).eq("id", partnerToEdit.id);
        if (error) throw error;
        toast({
          title: "تم التحديث",
          description: "تم تحديث بيانات الشريك بنجاح"
        });
      } else {
        const {
          error
        } = await supabase.from("partners").insert({
          name: partnerForm.name,
          logo_url
        });
        if (error) throw error;
        toast({
          title: "تمت الإضافة",
          description: "تم إضافة الشريك بنجاح"
        });
      }
      fetchPartners();
      setPartnerDialogOpen(false);
      setLogoFile(null);
      setPartnerForm({
        name: "",
        logo_url: ""
      });
    } catch (error: any) {
      console.error("Error saving partner:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء حفظ بيانات الشريك: ${error.message || error}`,
        variant: "destructive"
      });
    } finally {
      setIsSavingPartner(false);
    }
  };

  const handleDeletePartner = async (partnerId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الشريك؟")) {
      return;
    }
    try {
      if (partnerId === -1) {
        setPartners(prev => prev.filter(p => p.id !== -1));
        toast({
          title: "تم الحذف",
          description: "تم إزالة الشريك الإفتراضي من العرض"
        });
        return;
      }
      const {
        error
      } = await supabase.from("partners").delete().eq("id", partnerId);
      if (error) throw error;
      toast({
        title: "تم الحذف",
        description: "تم حذ الشريك بنجاح"
      });
      fetchPartners();
    } catch (error: any) {
      console.error("Error deleting partner:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء حذف الشريك: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from("project_requests").update({
      status: newStatus
    }).eq("id", id);
    fetchData();
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    await supabase.from("software_orders").update({
      status: newStatus
    }).eq("id", id);
    fetchData();
  };

  const updateTrialStatus = async (id: string, newStatus: string) => {
    try {
      console.log("Updating trial request status:", id, newStatus);
      const { error } = await supabase
        .from("trial_requests")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (error) {
        console.error("Error updating trial status:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحديث حالة الطلب",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الطلب بنجاح"
      });
      
      fetchTrialRequests();
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const openNewProductDialog = () => {
    setProductToEdit(null);
    setProductDialogOpen(true);
  };

  const openEditProductDialog = (product: SoftwareProduct) => {
    setProductToEdit(product);
    setProductDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا البرنامج؟")) {
      return;
    }
    try {
      const {
        error
      } = await supabase.from("software_products").delete().eq("id", productId);
      if (error) throw error;
      toast({
        title: "تم الحذف",
        description: "تم حذف البرنامج بنجاح"
      });
      fetchProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف البرنامج",
        variant: "destructive"
      });
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="relative z-10 px-8 py-6 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white font-tajawal tracking-wide">لوحة تحكم TRNDSKY</h1>
          <button onClick={handleLogout} className="bg-white/10 text-white px-6 py-2.5 rounded-lg font-tajawal hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-sm border border-white/10">
            تسجيل خروج
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 relative z-0">
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="flex justify-center mb-8 bg-white shadow-lg rounded-2xl border border-gray-100 p-2 backdrop-blur-sm sticky top-4 z-50">
            <TabsTrigger value="requests" className="text-lg px-6 py-3 font-medium data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-blue-800 data-[state=active]:text-white rounded-xl transition-all duration-300">
              تذاكر الطلبات
            </TabsTrigger>
            <TabsTrigger value="trials" className="text-lg px-6 py-3 font-medium data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-blue-800 data-[state=active]:text-white rounded-xl transition-all duration-300">
              طلبات التجربة
            </TabsTrigger>
            <TabsTrigger value="slides" className="text-lg px-6 py-3 font-medium data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-blue-800 data-[state=active]:text-white rounded-xl transition-all duration-300">
              السلايدات
            </TabsTrigger>
            <TabsTrigger value="partners" className="text-lg px-6 py-3 font-medium data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-blue-800 data-[state=active]:text-white rounded-xl transition-all duration-300">
              شركاء النجاح
            </TabsTrigger>
            <TabsTrigger value="software" className="text-lg px-6 py-3 font-medium data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-blue-800 data-[state=active]:text-white rounded-xl transition-all duration-300">
              البرمجيات الجاهزة
            </TabsTrigger>
            <TabsTrigger value="about" className="text-lg px-6 py-3 font-medium data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-blue-800 data-[state=active]:text-white rounded-xl transition-all duration-300">
              من نحن
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-lg px-6 py-3 font-medium data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-blue-800 data-[state=active]:text-white rounded-xl transition-all duration-300">
              التواصل معنا
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <div className="space-y-8">
              <section className="bg-white rounded-2xl shadow-lg p-8 backdrop-blur-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-blue-900 border-b pb-4">
                  طلبات برمجة بأفكارك (جديدة/مفتوحة)
                </h2>
                {loading ? <div className="text-center py-8 text-trndsky-blue">
                    جارٍ التحميل...
                  </div> : requests.length === 0 ? <div className="text-center py-4 text-gray-500">
                    لا توجد طلبات جديدة أو مفتوحة.
                  </div> : <div className="overflow-x-auto">
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
                        {requests.map(r => <tr key={r.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{r.name}</td>
                            <td className="px-4 py-2">{r.email || "-"}</td>
                            <td className="px-4 py-2">{r.phone || "-"}</td>
                            <td className="px-4 py-2">{r.title}</td>
                            <td className="px-4 py-2 max-w-[300px]">{r.description}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${statusColors[r.status] || ""}`}>
                                {statusLabels[r.status] || r.status}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              {new Date(r.created_at).toLocaleString("ar-EG")}
                            </td>
                            <td className="px-4 py-2 flex items-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon" title="استعراض كامل التذكرة" onClick={() => setViewedRequest(r)}>
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
                                  {viewedRequest && viewedRequest.id === r.id && <div className="text-base space-y-4 py-4">
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
                                        <span className={`rounded px-2 py-1 text-xs font-semibold ${statusColors[viewedRequest.status] || ""}`}>
                                          {statusLabels[viewedRequest.status] || viewedRequest.status}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-medium">تاريخ الطلب: </span>
                                        {new Date(viewedRequest.created_at).toLocaleString("ar-EG")}
                                      </div>
                                    </div>}
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="secondary">إغلاق</Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <button disabled={r.status === "open"} className="px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200 transition-all disabled:opacity-50" onClick={() => updateStatus(r.id, "open")} title="تحويل لمفتوح">
                                <FolderOpen size={16} />
                              </button>
                              <button disabled={r.status === "closed"} onClick={() => updateStatus(r.id, "closed")} title="إغلاق" className="px-2 py-1 rounded transition-all disabled:opacity-50 text-[#f40909] bg-[#eebfbf]">
                                <X size={16} />
                              </button>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>}
              </section>
              <section className="bg-white rounded-2xl shadow-lg p-8 backdrop-blur-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-blue-900 border-b pb-4">
                  طلبات برمجيات جاهزة (جديدة/مفتوحة)
                </h2>
                {loading ? <div className="text-center py-8 text-trndsky-blue">
                    جارٍ التحميل...
                  </div> : orders.length === 0 ? <div className="text-center py-4 text-gray-500">
                    لا توجد طلبات جديدة أو مفتوحة.
                  </div> : <div className="overflow-x-auto">
                    <table className="w-full text-base text-right border bg-white rounded-xl overflow-hidden">
                      <thead>
                        <tr className="bg-trndsky-teal/10">
                          <th className="px-4 py-2">اسم المنتج</th>
                          <th className="px-4 py-2">اسم الشركة / العميل</th>
                          <th className="px-4 py-2">واتساب</th>
                          <th className="px-4 py-2">الحالة</th>
                          <th className="px-4 py-2">تاريخ الطلب</th>
                          <th className="px-4 py-2">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => <tr key={o.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{productTitlesMap[o.software_id] || o.software_id}</td>
                            <td className="px-4 py-2">{o.company_name}</td>
                            <td className="px-4 py-2">{o.whatsapp}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${statusColors[o.status] || ""}`}>
                                {statusLabels[o.status] || o.status}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              {new Date(o.created_at).toLocaleString("ar-EG")}
                            </td>
                            <td className="px-4 py-2 flex items-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon" title="استعراض كامل الطلب" onClick={() => setViewedOrder(o)}>
                                    <Eye />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent dir="rtl">
                                  <DialogHeader>
                                    <DialogTitle>تفاصيل الطلب البرمجي الجاهز</DialogTitle>
                                    <DialogDescription>
                                      جميع معلومات الطلب
                                    </DialogDescription>
                                  </DialogHeader>
                                  {viewedOrder && viewedOrder.id === o.id && <div className="text-base space-y-4 py-4">
                                      <div>
                                        <span className="font-medium">اسم المنتج: </span>
                                        {productTitlesMap[viewedOrder.software_id] || viewedOrder.software_id}
                                      </div>
                                      <div>
                                        <span className="font-medium">اسم الشركة / العميل: </span>
                                        {viewedOrder.company_name}
                                      </div>
                                      <div>
                                        <span className="font-medium">رقم الواتساب: </span>
                                        {viewedOrder.whatsapp}
                                      </div>
                                      <div>
                                        <span className="font-medium">الحالة: </span>
                                        <span className={`rounded px-2 py-1 text-xs font-semibold ${statusColors[viewedOrder.status] || ""}`}>
                                          {statusLabels[viewedOrder.status] || viewedOrder.status}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-medium">تاريخ الطلب: </span>
                                        {new Date(viewedOrder.created_at).toLocaleString("ar-EG")}
                                      </div>
                                    </div>}
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="secondary">إغلاق</Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <button disabled={o.status === "open"} className="px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200 transition-all disabled:opacity-50" onClick={() => updateOrderStatus(o.id, "open")} title="تحويل لمفتوح">
                                <FolderOpen size={16} />
                              </button>
                              <button disabled={o.status === "closed"} className="px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 transition-all disabled:opacity-50" onClick={() => updateOrderStatus(o.id, "closed")} title="إغلاق">
                                <X size={16} />
                              </button>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>}
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="trials">
            <div className="space-y-8">
              <section className="bg-white rounded-2xl shadow-lg p-8 backdrop-blur-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-blue-900 border-b pb-4">
                  طلبات التجربة
                </h2>
                {loadingTrials ? (
                  <div className="text-center py-8 text-trndsky-blue">
                    جارٍ التحميل...
                  </div>
                ) : trialRequests.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    لا توجد طلبات تجربة.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-trndsky-teal/10">
                          <TableHead className="text-right">اسم الشركة / العميل</TableHead>
                          <TableHead className="text-right">واتساب</TableHead>
                          <TableHead className="text-right">الحالة</TableHead>
                          <TableHead className="text-right">تاريخ الطلب</TableHead>
                          <TableHead className="text-right">إجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trialRequests.map((tr) => (
                          <TableRow key={tr.id} className="border-t hover:bg-gray-50">
                            <TableCell className="px-4 py-2">{tr.company_name}</TableCell>
                            <TableCell className="px-4 py-2">{tr.whatsapp}</TableCell>
                            <TableCell className="px-4 py-2">
                              <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${statusColors[tr.status] || ""}`}>
                                {statusLabels[tr.status] || tr.status}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              {new Date(tr.created_at).toLocaleString("ar-EG")}
                            </TableCell>
                            <TableCell className="px-4 py-2 flex items-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon" title="استعراض كامل الطلب" onClick={() => setViewedTrialRequest(tr)}>
                                    <Eye />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent dir="rtl">
                                  <DialogHeader>
                                    <DialogTitle>تفاصيل طلب التجربة</DialogTitle>
                                    <DialogDescription>
                                      جميع معلومات طلب التجربة
                                    </DialogDescription>
                                  </DialogHeader>
                                  {viewedTrialRequest && viewedTrialRequest.id === tr.id && (
                                    <div className="text-base space-y-4 py-4">
                                      <div>
                                        <span className="font-medium">اسم الشركة / العميل: </span>
                                        {viewedTrialRequest.company_name}
                                      </div>
                                      <div>
                                        <span className="font-medium">رقم الواتساب: </span>
                                        {viewedTrialRequest.whatsapp}
                                      </div>
                                      <div>
                                        <span className="font-medium">الحالة: </span>
                                        <span className={`rounded px-2 py-1 text-xs font-semibold ${statusColors[viewedTrialRequest.status] || ""}`}>
                                          {statusLabels[viewedTrialRequest.status] || viewedTrialRequest.status}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-medium">تاريخ الطلب: </span>
                                        {new Date(viewedTrialRequest.created_at).toLocaleString("ar-EG")}
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
                                disabled={tr.status === "open"} 
                                className="px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200 transition-all disabled:opacity-50" 
                                onClick={() => updateTrialStatus(tr.id, "open")} 
                                title="تحويل لمفتوح"
                              >
                                <FolderOpen size={16} />
                              </button>
                              <button 
                                disabled={tr.status === "closed"} 
                                className="px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 transition-all disabled:opacity-50" 
                                onClick={() => updateTrialStatus(tr.id, "closed")} 
                                title="إغلاق"
                              >
                                <X size={16} />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </section>
            </div>
          </TabsContent>

          <TabsContent value="slides">
            <SlideManager />
          </TabsContent>

          <TabsContent value="partners">
            <div className="space-y-8">
              <section className="bg-white rounded-2xl shadow-lg p-8 backdrop-blur-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-blue-900">شركاء النجاح</h2>
                  <Button onClick={openNewPartnerDialog} className="flex items-center gap-2">
                    <Plus size={16} /> إضافة شريك جديد
                  </Button>
                </div>
                {loadingPartners ? (
                  <div className="text-center py-8 text-trndsky-blue">جارٍ التحميل...</div>
                ) : partners.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">لا يوجد شركاء حالياً. أضف شريك جديد.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map((partner) => (
                      <Card key={partner.id} className="overflow-hidden border border-gray-100">
                        <div className="h-36 bg-gray-50 flex items-center justify-center p-4">
                          {partner.logo_url ? (
                            <img
                              src={partner.logo_url}
                              alt={partner.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-gray-400 text-sm">بدون شعار</div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="font-medium mb-4">{partner.name}</div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditPartnerDialog(partner)}>
                              <Edit size={16} className="mr-1" /> تعديل
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeletePartner(partner.id)}>
                              <Trash2 size={16} className="mr-1" /> حذف
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              <Dialog open={partnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle>{partnerToEdit ? "تعديل شريك" : "إضافة شريك جديد"}</DialogTitle>
                    <DialogDescription>
                      {partnerToEdit
                        ? "قم بتحديث بيانات الشريك أدناه."
                        : "قم بإدخال بيانات الشريك الجديد."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <label className="block text-right mb-2">اسم الشريك</label>
                      <input
                        name="name"
                        value={partnerForm.name}
                        onChange={handlePartnerFormChange}
                        className="w-full p-2 border rounded"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block text-right mb-2">شعار الشريك</label>
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          onChange={handleLogoFileChange}
                          className="w-full p-2 border rounded"
                        />
                        <p className="text-sm text-gray-500">أو أدخل رابط الشعار أدناه</p>
                        <input
                          name="logo_url"
                          value={partnerForm.logo_url}
                          onChange={handlePartnerFormChange}
                          className="w-full p-2 border rounded"
                          dir="ltr"
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleSavePartner}
                      disabled={isSavingPartner || logoUploading}
                    >
                      {isSavingPartner ? "جارٍ الحفظ..." : "حفظ"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          <TabsContent value="software">
            <div className="space-y-8">
              <section className="bg-white rounded-2xl shadow-lg p-8 backdrop-blur-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-blue-900">البرمجيات الجاهزة</h2>
                  <Button onClick={openNewProductDialog} className="flex items-center gap-2">
                    <Plus size={16} /> إضافة برنامج جديد
                  </Button>
                </div>
                {loadingProducts ? (
                  <div className="text-center py-8 text-trndsky-blue">جارٍ التحميل...</div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">لا توجد برمجيات جاهزة حالياً. أضف برنامج جديد.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <Card key={product.id} className="overflow-hidden border border-gray-100">
                        <div className="h-48 bg-gray-50">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              بدون صورة
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                          <div className="text-blue-600 font-medium mb-4">{product.price} ريال</div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditProductDialog(product)}>
                              <Edit size={16} className="mr-1" /> تعديل
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 size={16} className="mr-1" /> حذف
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              {productDialogOpen && (
                <SoftwareProductDialog
                  open={productDialogOpen}
                  onOpenChange={setProductDialogOpen}
                  product={productToEdit}
                  onSuccess={fetchProducts}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <AboutContentManager />
          </TabsContent>

          <TabsContent value="contact">
            <ContactManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
