
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import SlideManager from './SlideManager';
import SoftwareManager from './SoftwareManager';
import { AdminUsersManager } from './AdminUsersManager';
import { ContactManager } from './ContactManager';
import { AboutContentManager } from './AboutContentManager';
import WhatsAppSettingsManager from './WhatsAppSettingsManager';
import TicketsManager from './TicketsManager';
import TrialRequestsManager from './TrialRequestsManager';
import ProjectRequestsManager from './ProjectRequestsManager';

type AdminTab = 'slides' | 'software' | 'users' | 'about' | 'contact' | 'whatsapp' | 'tickets' | 'trial_requests' | 'project_requests';

interface DefaultAdminManagerProps {
  setActiveTab: React.Dispatch<React.SetStateAction<AdminTab>>;
}

const DefaultAdminManager = ({ setActiveTab }: DefaultAdminManagerProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('slides')}>
        <CardHeader className="text-center">
          <CardTitle className="font-tajawal">إدارة العرض الرئيسي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-5xl mb-2">🖼️</div>
          <p className="text-center text-muted-foreground font-tajawal">إدارة شرائح العرض في الصفحة الرئيسية</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('software')}>
        <CardHeader className="text-center">
          <CardTitle className="font-tajawal">إدارة البرمجيات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-5xl mb-2">💻</div>
          <p className="text-center text-muted-foreground font-tajawal">إضافة وتعديل البرمجيات الجاهزة</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('users')}>
        <CardHeader className="text-center">
          <CardTitle className="font-tajawal">إدارة المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-5xl mb-2">👥</div>
          <p className="text-center text-muted-foreground font-tajawal">إدارة مستخدمي لوحة التحكم</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('about')}>
        <CardHeader className="text-center">
          <CardTitle className="font-tajawal">إدارة من نحن</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-5xl mb-2">ℹ️</div>
          <p className="text-center text-muted-foreground font-tajawal">تعديل محتوى صفحة من نحن</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('contact')}>
        <CardHeader className="text-center">
          <CardTitle className="font-tajawal">معلومات الاتصال</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-5xl mb-2">📞</div>
          <p className="text-center text-muted-foreground font-tajawal">تعديل معلومات الاتصال وساعات العمل</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('whatsapp')}>
        <CardHeader className="text-center">
          <CardTitle className="font-tajawal">إعدادات واتساب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-5xl mb-2">💬</div>
          <p className="text-center text-muted-foreground font-tajawal">إعدادات أيقونة الاستفسارات والواتساب</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('tickets')}>
        <CardHeader className="text-center">
          <CardTitle className="font-tajawal">تذاكر الدعم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-5xl mb-2">🎫</div>
          <p className="text-center text-muted-foreground font-tajawal">إدارة تذاكر الدعم الفني</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('trial_requests')}>
        <CardHeader className="text-center">
          <CardTitle className="font-tajawal">طلبات التجربة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-5xl mb-2">🧪</div>
          <p className="text-center text-muted-foreground font-tajawal">إدارة طلبات تجربة البرمجيات</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('project_requests')}>
        <CardHeader className="text-center">
          <CardTitle className="font-tajawal">تذاكر الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-5xl mb-2">📋</div>
          <p className="text-center text-muted-foreground font-tajawal">إدارة طلبات البرمجة الخاصة</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefaultAdminManager;
