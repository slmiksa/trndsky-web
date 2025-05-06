
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
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

type AdminTab = 'slides' | 'software' | 'users' | 'about' | 'contact' | 'whatsapp' | 'tickets' | 'trial_requests' | 'project_requests' | 'software_orders';
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('slides');
  const [adminUsers, setAdminUsers] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchAdminUsers();
  }, []);
  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from('admin_users').select('*');
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
  const createAdminUser = async () => {
    try {
      const {
        data: user,
        error: userError
      } = await supabase.auth.signUp({
        email: newAdmin.email,
        password: newAdmin.password
      });
      if (userError) {
        console.error('Error creating user:', userError);
        toast.error('Failed to create user');
        return;
      }

      // Fix: Changed the format to match the expected schema
      const {
        data,
        error
      } = await supabase.from('admin_users').insert([{
        user_id: user.user!.id,
        username: newAdmin.email,
        // Using email as username
        role: 'admin' as const // Cast as const to ensure it matches the expected enum type
      }]);
      if (error) {
        console.error('Error creating admin user:', error);
        toast.error('Failed to create admin user');
        return;
      }
      setNewAdmin({
        email: '',
        password: '',
        role: 'admin'
      });
      fetchAdminUsers();
      toast.success('Admin user created successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create admin user');
    }
  };
  return <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-2xl font-bold mb-4 text-center font-tajawal">لوحة التحكم</h2>
        <ul className="space-y-2 font-tajawal">
          <li>
            <Button variant="ghost" className="w-full justify-start font-tajawal" onClick={() => setActiveTab('slides')}>
              إدارة العرض الرئيسي
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start font-tajawal" onClick={() => setActiveTab('software')}>
              إدارة البرمجيات
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start font-tajawal" onClick={() => setActiveTab('users')}>
              إدارة المستخدمين
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start font-tajawal" onClick={() => setActiveTab('about')}>
              إدارة من نحن
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start font-tajawal" onClick={() => setActiveTab('contact')}>
              معلومات الاتصال
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start font-tajawal" onClick={() => setActiveTab('whatsapp')}>
              إعدادات واتساب
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start font-tajawal" onClick={() => setActiveTab('tickets')}>
              تذاكر الدعم الفني
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start font-tajawal" onClick={() => setActiveTab('trial_requests')}>
              طلبات تجربة البرمجيات
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start font-tajawal" onClick={() => setActiveTab('project_requests')}>
              طلبات البرمجة الخاصة
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start font-tajawal" onClick={() => setActiveTab('software_orders')}>
              طلبات شراء البرمجيات
            </Button>
          </li>
        </ul>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="container max-w-7xl mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-4 text-right font-tajawal">لوحة التحكم</h1>
            
            {activeTab === 'slides' && <SlideManager />}
            {activeTab === 'software' && <SoftwareManager />}
            {activeTab === 'users' && <AdminUsersManager />}
            {activeTab === 'about' && <AboutContentManager />}
            {activeTab === 'contact' && <ContactManager />}
            {activeTab === 'whatsapp' && <WhatsAppSettingsManager />}
            {activeTab === 'tickets' && <TicketsManager />}
            {activeTab === 'trial_requests' && <TrialRequestsManager />}
            {activeTab === 'project_requests' && <ProjectRequestsManager />}
            {activeTab === 'software_orders' && <SoftwareOrdersManager />}
          </div>
        </div>
      </div>
    </div>;
};
export default AdminDashboard;
