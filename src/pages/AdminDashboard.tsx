
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Loader2, Menu, X } from 'lucide-react';
import DefaultAdminManager from '@/components/admin/DefaultAdminManager';
import SlideManager from '@/components/admin/SlideManager';
import SoftwareManager from '@/components/admin/SoftwareManager';
import { AdminUsersManager } from '@/components/admin/AdminUsersManager';
import { AboutContentManager } from '@/components/admin/AboutContentManager';
import { ContactManager } from '@/components/admin/ContactManager';
import WhatsAppSettingsManager from '@/components/admin/WhatsAppSettingsManager';
import TicketsManager from '@/components/admin/TicketsManager';
import TrialRequestsManager from '@/components/admin/TrialRequestsManager';
import ProjectRequestsManager from '@/components/admin/ProjectRequestsManager';
import SoftwareOrdersManager from '@/components/admin/SoftwareOrdersManager';
import GeneralSettingsManager from '@/components/admin/GeneralSettingsManager';
import PartnersManager from '@/components/admin/PartnersManager';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type AdminTab = 'slides' | 'software' | 'users' | 'about' | 'contact' | 'whatsapp' | 'tickets' | 'trial_requests' | 'project_requests' | 'software_orders' | 'general_settings' | 'partners';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('slides');
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const menuItems = [
    { id: 'slides', label: 'إدارة العرض الرئيسي' },
    { id: 'software', label: 'إدارة البرمجيات' },
    { id: 'users', label: 'إدارة المستخدمين' },
    { id: 'about', label: 'إدارة من نحن' },
    { id: 'contact', label: 'معلومات الاتصال' },
    { id: 'whatsapp', label: 'إعدادات واتساب' },
    { id: 'tickets', label: 'تذاكر الدعم الفني' },
    { id: 'trial_requests', label: 'تذاكر التجربة للبرمجيات' },
    { id: 'project_requests', label: 'تذاكر البرمجيات الجاهزة' },
    { id: 'software_orders', label: 'تذاكر برمجيات بأفكارك' },
    { id: 'partners', label: 'شركاء النجاح' },
    { id: 'general_settings', label: 'الإعدادات العامة للموقع' }
  ];

  useEffect(() => {
    fetchAdminUsers();
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('admin_users').select('*');
      if (error) {
        console.error('Error fetching admin users:', error);
        toast.error('Failed to load admin users');
      } else {
        setAdminUsers(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'slides': return <SlideManager />;
      case 'software': return <SoftwareManager />;
      case 'users': return <AdminUsersManager />;
      case 'about': return <AboutContentManager />;
      case 'contact': return <ContactManager />;
      case 'whatsapp': return <WhatsAppSettingsManager />;
      case 'tickets': return <TicketsManager />;
      case 'trial_requests': return <TrialRequestsManager />;
      case 'project_requests': return <ProjectRequestsManager />;
      case 'software_orders': return <SoftwareOrdersManager />;
      case 'general_settings': return <GeneralSettingsManager />;
      case 'partners': return <PartnersManager />;
      default: return <DefaultAdminManager setActiveTab={setActiveTab} />;
    }
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {isMobile && (
          <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
            <Button variant="outline" size="icon" onClick={toggleSidebar}>
              <Menu size={18} />
            </Button>
            <h1 className="text-xl font-bold text-center font-tajawal">لوحة التحكم</h1>
            <div className="w-8"></div> {/* Spacer to center the heading */}
          </div>
        )}
        
        <div className="flex flex-1">
          <Sidebar className="bg-gray-100 font-tajawal" collapsible={isMobile ? "offcanvas" : "none"}>
            <SidebarHeader className="p-4 text-center">
              <h2 className="text-2xl font-bold font-tajawal">لوحة التحكم</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      className="justify-end text-right font-tajawal"
                      isActive={activeTab === item.id}
                      onClick={() => {
                        setActiveTab(item.id as AdminTab);
                        if (isMobile) {
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="container max-w-7xl mx-auto">
              <div className="py-4 md:py-8">
                {!isMobile && <h1 className="text-3xl font-bold mb-6 text-right font-tajawal">لوحة التحكم</h1>}
                {renderActiveContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
