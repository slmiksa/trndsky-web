
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIsMobile } from '@/hooks/use-mobile';

type AdminTab = 'slides' | 'software' | 'users' | 'about' | 'contact' | 'whatsapp' | 'tickets' | 'trial_requests' | 'project_requests' | 'software_orders' | 'general_settings' | 'partners';

interface DefaultAdminManagerProps {
  setActiveTab: React.Dispatch<React.SetStateAction<AdminTab>>;
}

const DefaultAdminManager = ({ setActiveTab }: DefaultAdminManagerProps) => {
  const isMobile = useIsMobile();
  
  const adminCards = [
    {
      tab: 'slides',
      title: 'إدارة العرض الرئيسي',
      icon: '🖼️',
      description: 'إدارة شرائح العرض في الصفحة الرئيسية'
    },
    {
      tab: 'software',
      title: 'إدارة البرمجيات',
      icon: '💻',
      description: 'إضافة وتعديل البرمجيات الجاهزة'
    },
    {
      tab: 'users',
      title: 'إدارة المستخدمين',
      icon: '👥',
      description: 'إدارة مستخدمي لوحة التحكم'
    },
    {
      tab: 'about',
      title: 'إدارة من نحن',
      icon: 'ℹ️',
      description: 'تعديل محتوى صفحة من نحن'
    },
    {
      tab: 'contact',
      title: 'معلومات الاتصال',
      icon: '📞',
      description: 'تعديل معلومات الاتصال وساعات العمل'
    },
    {
      tab: 'whatsapp',
      title: 'إعدادات واتساب',
      icon: '💬',
      description: 'إعدادات أيقونة الاستفسارات والواتساب'
    },
    {
      tab: 'tickets',
      title: 'تذاكر الدعم الفني',
      icon: '🎫',
      description: 'إدارة تذاكر الدعم من العملاء'
    },
    {
      tab: 'trial_requests',
      title: 'طلبات تجربة البرمجيات',
      icon: '🧪',
      description: 'إدارة طلبات تجربة البرمجيات الجاهزة'
    },
    {
      tab: 'project_requests',
      title: 'طلبات البرمجة الخاصة',
      icon: '📋',
      description: 'إدارة طلبات المشاريع البرمجية الخاصة'
    },
    {
      tab: 'software_orders',
      title: 'طلبات شراء البرمجيات',
      icon: '🛒',
      description: 'إدارة طلبات شراء البرمجيات الجاهزة'
    },
    {
      tab: 'partners',
      title: 'شركاء النجاح',
      icon: '🤝',
      description: 'إدارة شركاء النجاح الذين يظهرون في الصفحة الرئيسية'
    },
    {
      tab: 'general_settings',
      title: 'الإعدادات العامة',
      icon: '⚙️',
      description: 'تغيير عنوان الموقع وأيقونة المتصفح'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1">
      {adminCards.map((card) => (
        <Card 
          key={card.tab}
          className="hover:shadow-md transition-shadow cursor-pointer border-2 border-trndsky-blue/10 hover:border-trndsky-blue/30" 
          onClick={() => setActiveTab(card.tab as AdminTab)}
        >
          <CardHeader className="text-center">
            <CardTitle className="font-tajawal text-trndsky-darkblue">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-4xl md:text-5xl mb-2">{card.icon}</div>
            <p className="text-center text-muted-foreground font-tajawal">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DefaultAdminManager;
