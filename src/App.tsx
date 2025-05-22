
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Software from "./pages/Software";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Partners from "./pages/Partners";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { AdminAuthProvider } from "@/components/AdminAuthContext";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import React, { Suspense } from 'react';
import FloatingContactButton from "./components/FloatingContactButton";
import { useWhatsAppNumber } from "./hooks/useWhatsAppNumber";
import AppInitializer from "./components/AppInitializer";

// إنشاء مثيل واحد للعميل
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // تعتبر البيانات قديمة بعد دقيقة واحدة
      gcTime: 5 * 60 * 1000, // تبقى البيانات في الذاكرة المؤقتة لمدة 5 دقائق
      retry: 1, // محاولة واحدة فقط في حالة الفشل
    },
  },
});

// مكون للتحميل البطيء
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-trndsky-blue border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-tajawal">جاري تحميل الصفحة...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { whatsAppSettings, loading } = useWhatsAppNumber();
  
  return (
    <>
      <AppInitializer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/software" element={<Software />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      {/* دائما إظهار زر التواصل بغض النظر عن حالة التحميل */}
      <FloatingContactButton 
        phoneNumber={loading ? "966575594911" : whatsAppSettings.phone_number} 
        defaultMessage={loading ? "استفسار من موقع TRNDSKY" : whatsAppSettings.default_message} 
      />
    </>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AdminAuthProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </AdminAuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
