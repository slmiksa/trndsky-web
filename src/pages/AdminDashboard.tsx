import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FolderOpen, X, Eye, Edit, Trash2, Plus } from "lucide-react";
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useUploadPartnerLogo } from "@/hooks/useUploadPartnerLogo";
import { Card, CardContent } from "@/components/ui/card";
import { SoftwareProductDialog } from "@/components/admin/SoftwareProductDialog";

const initialSlides = [
  {
    id: 1,
    title: "برمجيات احترافية",
    subtitle: "حلول تقنية متكاملة لمشاريعك",
    description: "نقدم خدمات برمجية متكاملة بأحدث التقنيات وأفضل الممارسات العالمية",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
  },
  {
    id: 2,
    title: "تطوير المواقع والتطبيقات",
    subtitle: "برمجة الويب بأحدث التقنيات",
    description: "تصميم وتطوير مواقع وتطبيقات ويب متجاوبة وعالية الأداء",
    image: "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 3,
    title: "حلول ذكاء اصطناعي",
    subtitle: "الابتكار التقني للمستقبل",
    description: "تطبيقات ذكاء اصطناعي متطورة لتحسين أداء وكفاءة أعمالك",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
];

const WISAL_PARTNER = {
  id: -1,
  name: "شركة الوصل الوطنية لتحصيل ديون جهات التمويل",
  logo_url: "/lovable-uploads/aa977791-13b8-471b-92c8-d9ef4ef03f27.png",
  created_at: new Date().toISOString(),
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

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
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

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [partnerToEdit, setPartnerToEdit] = useState<Partner | null>(null);
  const [partnerForm, setPartnerForm] = useState<Omit<Partner, "id" | "created_at">>({
    name: "",
    logo_url: "",
  });
  const [isSavingPartner, setIsSavingPartner] = useState(false);

  const [viewedRequest, setViewedRequest] = useState<ProjectRequest | null>(null);
  const [viewedOrder, setViewedOrder] = useState<SoftwareOrder | null>(null);

  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [slideDialogOpen, setSlideDialogOpen] = useState(false);
  const [slideToEdit, setSlideToEdit] = useState<Slide | null>(null);
  const [slideForm, setSlideForm] = useState<Omit<Slide, "id">>({
    title: "",
    subtitle: "",
    description: "",
    image: "",
  });

  const [isSavingSlide, setIsSavingSlide] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [products, setProducts] = useState<SoftwareProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<SoftwareProduct | null>(null);

  const { uploadLogo, uploading: logoUploading, error: logoUploadError } = useUploadPartnerLogo();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/adminlogin");
      return;
    }
    fetchData();
    fetchPartners();
    fetchProducts();
  }, [isLoggedIn, navigate]);

  async function fetchData() {
    setLoading(true);
    const { data: reqData } = await supabase
      .from("project_requests")
      .select("*")
      .in("status", ["new", "open"])
      .order("created_at", { ascending: false });

    const { data: ordData } = await supabase
      .from("software_orders")
      .select("*")
      .in("status", ["new", "open"])
      .order("created_at", { ascending: false });

    setRequests(reqData || []);
    setOrders(ordData || []);
    setLoading(false);
  }

  async function fetchPartners() {
    setLoadingPartners(true);
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching partners:", error);
      toast({ title: "خطأ", description: "حدث خطأ أثناء جلب بيانات الشركاء", variant: "destructive" });
      setPartners([WISAL_PARTNER]);
    } else {
      const partnerList = data || [];
      const wisalExists = partnerList.some(p => 
        p.name === WISAL_PARTNER.name || 
        p.logo_url === WISAL_PARTNER.logo_url
      );
      
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
    const { data, error } = await supabase
      .from("software_products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب البرمجيات",
        variant: "destructive",
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
      logo_url: "",
    });
    setPartnerDialogOpen(true);
  };

  const openEditPartnerDialog = (partner: Partner) => {
    setPartnerToEdit(partner);
    setPartnerForm({
      name: partner.name,
      logo_url: partner.logo_url,
    });
    setPartnerDialogOpen(true);
  };

  const handlePartnerFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPartnerForm((prev) => ({
      ...prev,
      [name]: value,
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
        
        toast({ title: "تم التحديث", description: "تم تحديث بيانات الشريك الإفتراضي بنجاح" });
      } else if (partnerToEdit) {
        const { error } = await supabase
          .from("partners")
          .update({
            name: partnerForm.name,
            logo_url,
          })
          .eq("id", partnerToEdit.id);

        if (error) throw error;
        toast({ title: "تم التحديث", description: "تم تحديث بيانات الشريك بنجاح" });
      } else {
        const { error } = await supabase
          .from("partners")
          .insert({
            name: partnerForm.name,
            logo_url,
          });

        if (error) throw error;
        toast({ title: "تمت الإضافة", description: "تم إضافة الشريك بنجاح" });
      }

      fetchPartners();
      setPartnerDialogOpen(false);
      setLogoFile(null);
      setPartnerForm({ name: "", logo_url: "" });
    } catch (error: any) {
      console.error("Error saving partner:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء حفظ بيانات الشريك: ${error.message || error}`,
        variant: "destructive",
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
        toast({ title: "تم الحذف", description: "تم إزالة الشريك الإفتراضي من العرض" });
        return;
      }
      
      const { error } = await supabase
        .from("partners")
        .delete()
        .eq("id", partnerId);

      if (error) throw error;
      
      toast({ title: "تم الحذف", description: "تم حذف الشريك بنجاح" });
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
    await supabase
      .from("project_requests")
      .update({ status: newStatus })
      .eq("id", id);
    fetchData();
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    await supabase
      .from("software_orders")
      .update({ status: newStatus })
      .eq("id", id);
    fetchData();
  };

  const openNewSlideDialog = () => {
    setSlideToEdit(null);
    setSlideForm({
      title: "",
      subtitle: "",
      description: "",
      image: "",
    });
    setSlideDialogOpen(true);
  };

  const openEditSlideDialog = (slide: Slide) => {
    setSlideToEdit(slide);
    setSlideForm({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image: slide.image,
    });
    setSlideDialogOpen(true);
  };

  const handleSlideFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSlideForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSlide = () => {
    setIsSavingSlide(true);
    if (slideToEdit) {
      setSlides((prev) =>
        prev.map((s) => (s.id === slideToEdit.id ? { ...slideToEdit, ...slideForm } : s))
      );
    } else {
      const nextId = Math.max(...slides.map(s => s.id), 0) + 1;
      setSlides([...slides, { id: nextId, ...slideForm }]);
    }
    setIsSavingSlide(false);
    setSlideDialogOpen(false);
    setSlideToEdit(null);
    setSlideForm({
      title: "",
      subtitle: "",
      description: "",
      image: "",
    });
  };

  const handleDeleteSlide = (slideId: number) => {
    setSlides((prev) => prev.filter((s) => s.id !== slideId));
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
      const { error } = await supabase
        .from("software_products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast({ title: "تم الحذف", description: "تم حذف البرنامج بنجاح" });
      fetchProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف البرنامج",
        variant: "destructive",
      });
    }
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
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="flex justify-center mb-8 bg-trndsky-blue/5 border border-trndsky-blue/20 rounded-xl">
            <TabsTrigger value="requests" className="text-lg px-8 font-bold data-[state=active]:bg-trndsky-blue data-[state=active]:text-white">
              تذاكر الطلبات
            </TabsTrigger>
            <TabsTrigger value="slides" className="text-lg px-8 font-bold data-[state=active]:bg-trndsky-blue data-[state=active]:text-white">
              السلايدات
            </TabsTrigger>
            <TabsTrigger value="partners" className="text-lg px-8 font-bold data-[state=active]:bg-trndsky-blue data-[state=active]:text-white">
              شركاء النجاح
            </TabsTrigger>
            <TabsTrigger value="software" className="text-lg px-8 font-bold data-[state=active]:bg-trndsky-blue data-[state=active]:text-white">
              البرمجيات الجاهزة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
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
                        <th className="px-4 py-2">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{o.software_id}</td>
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
                                <Button
                                  variant="outline"
                                  size="icon"
                                  title="استعراض كامل الطلب"
                                  onClick={() => setViewedOrder(o)}
                                >
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
                                {viewedOrder && viewedOrder.id === o.id && (
                                  <div className="text-base space-y-4 py-4">
                                    <div>
                                      <span className="font-medium">رقم المنتج: </span>
                                      {viewedOrder.software_id}
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
                              disabled={o.status === "open"}
                              className="px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200 transition-all disabled:opacity-50"
                              onClick={() => updateOrderStatus(o.id, "open")}
                              title="تحويل لمفتوح"
                            >
                              <FolderOpen size={16} />
                            </button>
                            <button
                              disabled={o.status === "closed"}
                              className="px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 transition-all disabled:opacity-50"
                              onClick={() => updateOrderStatus(o.id, "closed")}
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
          </TabsContent>

          <TabsContent value="slides">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-trndsky-darkblue">
                  إدارة السلايدات الرئيسية
                </h2>
                <Button onClick={openNewSlideDialog} className="flex items-center gap-2">
                  <Plus size={18} /> إضافة سلايد
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((slide) => (
                  <div key={slide.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="rounded-lg h-40 object-cover mb-3 w-full"
                    />
                    <h3 className="font-bold text-trndsky-teal text-lg mb-1">{slide.title}</h3>
                    <div className="text-trndsky-darkblue font-medium">{slide.subtitle}</div>
                    <div className="text-gray-700 text-sm mt-1">{slide.description}</div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditSlideDialog(slide)}
                        title="تعديل"
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteSlide(slide.id)}
                        title="حذف"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                {slides.length === 0 && (
                  <div className="text-gray-400 col-span-3 text-center py-12">
                    لا توجد سلايدات حاليًا.
                  </div>
                )}
              </div>
            </section>
            <Dialog open={slideDialogOpen} onOpenChange={setSlideDialogOpen}>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle>{slideToEdit ? "تعديل السلايد" : "إضافة سلايد جديد"}</DialogTitle>
                  <DialogDescription>
                    {slideToEdit
                      ? "يمكنك تعديل بيانات السلايد أدناه"
                      : "قم بإضافة سلايد جديد للواجهة الرئيسية"}
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={e => {
                    e.preventDefault();
                    handleSaveSlide();
                  }}
                >
                  <div>
                    <label className="font-medium block mb-1">عنوان السلايد</label>
                    <input
                      name="title"
                      value={slideForm.title}
                      onChange={handleSlideFormChange}
                      required
                      className="input border px-3 py-2 w-full rounded"
                      placeholder="عنوان السلايد"
                    />
                  </div>
                  <div>
                    <label className="font-medium block mb-1">العنوان الفرعي</label>
                    <input
                      name="subtitle"
                      value={slideForm.subtitle}
                      onChange={handleSlideFormChange}
                      required
                      className="input border px-3 py-2 w-full rounded"
                      placeholder="العنوان الفرعي"
                    />
                  </div>
                  <div>
                    <label className="font-medium block mb-1">الوصف</label>
                    <textarea
                      name="description"
                      value={slideForm.description}
                      onChange={handleSlideFormChange}
                      rows={3}
                      required
                      className="input border px-3 py-2 w-full rounded"
                      placeholder="وصف السلايد"
                    />
                  </div>
                  <div>
                    <label className="font-medium block mb-1">رابط صورة السلايد</label>
                    <input
                      name="image"
                      value={slideForm.image}
                      onChange={handleSlideFormChange}
                      required
                      className="input border px-3 py-2 w-full rounded"
                      placeholder="رابط الصورة"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSavingSlide}>
                      {isSavingSlide ? "جارٍ الحفظ..." : slideToEdit ? "حفظ التعديلات" : "إضافة السلايد"}
                    </Button>
                    <DialogClose asChild>
                      <Button variant="secondary">إلغاء</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="partners">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-trndsky-darkblue">
                  إدارة شركاء النجاح
                </h2>
                <Button onClick={openNewPartnerDialog} className="flex items-center gap-2">
                  <Plus size={18} /> إضافة شريك جديد
                </Button>
              </div>
              
              {loadingPartners ? (
                <div className="text-center py-12 text-trndsky-blue">
                  جارٍ التحميل...
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partners.map((partner) => (
                    <div key={partner.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                      <div className="h-40 flex items-center justify-center bg-gray-50 rounded-lg mb-3">
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="max-h-32 max-w-full object-contain"
                        />
                      </div>
                      <h3 className="font-bold text-trndsky-teal text-lg mb-1 text-center">{partner.name}</h3>
                      {partner.id === -1 && (
                        <p className="text-gray-500 text-xs text-center mb-2">
                          (شريك افتراضي - يظهر دائماً في الموقع)
                        </p>
                      )}
                      <div className="flex gap-2 mt-auto pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditPartnerDialog(partner)}
                          className="flex-1"
                        >
                          <Edit size={16} className="ml-2" />
                          تعديل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePartner(partner.id)}
                          className="flex-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} className="ml-2" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                  {partners.length === 0 && (
                    <div className="text-gray-400 col-span-3 text-center py-12">
                      لا يوجد شركاء حالياً. أضف شركاء للموقع باستخدام الزر أعلاه.
                    </div>
                  )}
                </div>
              )}
            </section>

            <Dialog open={partnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle>{partnerToEdit ? "تعديل شريك" : "إضافة شريك جديد"}</DialogTitle>
                  <DialogDescription>
                    {partnerToEdit
                      ? `أدخل المعلومات الجديدة ${partnerToEdit.id === -1 ? 'للشريك الافتراضي' : 'للشريك'}`
                      : "أدخل اسم الشريك وشعاره"}
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSavePartner();
                  }}
                >
                  <div>
                    <label className="font-medium block mb-1">اسم الشريك</label>
                    <input
                      name="name"
                      value={partnerForm.name}
                      onChange={handlePartnerFormChange}
                      required
                      className="input border px-3 py-2 w-full rounded"
                      placeholder="اسم الشريك"
                    />
                  </div>

                  <div>
                    <label className="font-medium block mb-1">رابط الشعار (إختياري)</label>
                    <input
                      name="logo_url"
                      value={partnerForm.logo_url}
                      onChange={handlePartnerFormChange}
                      className="input border px-3 py-2 w-full rounded"
                      placeholder="رابط شعار الشريك"
                    />
                  </div>

                  <div>
                    <label className="font-medium block mb-1">أو تحميل شعار جديد</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      className="w-full border rounded p-2"
                    />
                    {logoFile && (
                      <div className="mt-2 text-sm text-green-600">
                        تم اختيار: {logoFile.name}
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={isSavingPartner}>
                      {isSavingPartner ? "جارٍ الحفظ..." : partnerToEdit ? "حفظ التعديلات" : "إضافة الشريك"}
                    </Button>
                    <DialogClose asChild>
                      <Button variant="secondary">إلغاء</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="software">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-trndsky-darkblue">
                  إدارة البرمجيات الجاهزة
                </h2>
                <Button onClick={openNewProductDialog} className="flex items-center gap-2">
                  <Plus size={18} /> إضافة برنامج
                </Button>
              </div>

              {loadingProducts ? (
                <div className="text-center py-12 text-trndsky-blue">
                  جارٍ التحميل...
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-trndsky-teal text-lg mb-2">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="text-trndsky-blue font-semibold mb-3">
                          {product.price.toLocaleString()} ريال
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditProductDialog(product)}
                            className="flex-1"
                          >
                            <Edit size={16} className="ml-2" />
                            تعديل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} className="ml-2" />
                            حذف
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {products.length === 0 && (
                    <div className="text-gray-400 col-span-3 text-center py-12">
                      لا توجد برمجيات حالياً. أضف برمجيات جديدة باستخدام الزر أعلاه.
                    </div>
                  )}
                </div>
              )}
            </section>

            <SoftwareProductDialog
              open={productDialogOpen}
              onOpenChange={setProductDialogOpen}
              product={productToEdit || undefined}
              onSuccess={fetchProducts}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
