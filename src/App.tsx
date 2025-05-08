
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
import React from 'react';
import FloatingContactButton from "./components/FloatingContactButton";
import { useWhatsAppNumber } from "./hooks/useWhatsAppNumber";
import AppInitializer from "./components/AppInitializer";

// Create a client
const queryClient = new QueryClient();

const AppContent = () => {
  const { whatsAppSettings, loading } = useWhatsAppNumber();
  
  return (
    <>
      <AppInitializer />
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
      
      {!loading && whatsAppSettings.enabled && (
        <FloatingContactButton 
          phoneNumber={whatsAppSettings.phone_number} 
          defaultMessage={whatsAppSettings.default_message} 
        />
      )}
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
