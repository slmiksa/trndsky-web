
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GeneralSettings {
  site_title: string;
  favicon_url: string | null;
}

export const AppInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // تنفيذ هذا الكود مرة واحدة فقط عند تحميل الصفحة
    const loadSiteSettings = async () => {
      try {
        console.log('جاري تحميل الإعدادات العامة...');
        
        // إزالة أي أيقونات موجودة مسبقاً من رأس الصفحة - تأكد أن هذا الكود يعمل فوراً
        const existingIcons = document.querySelectorAll("link[rel*='icon']");
        existingIcons.forEach(icon => {
          if (icon.parentNode) {
            icon.parentNode.removeChild(icon);
          }
        });

        // استخدام maybeSingle لمعالجة الحالات التي لا توجد فيها بيانات
        const { data, error } = await supabase
          .from('general_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading general settings:', error);
          return;
        }
        
        if (data) {
          console.log('تم تحميل الإعدادات العامة:', data);
          
          // تحديث عنوان الصفحة
          if (data.site_title) {
            document.title = data.site_title;
            console.log('تم تحديث عنوان الصفحة إلى:', data.site_title);
          }
          
          // تحديث الأيقونة فقط إذا كانت موجودة في الإعدادات
          if (data.favicon_url) {
            console.log('تحديث الأيقونة إلى:', data.favicon_url);
            
            const timestamp = new Date().getTime(); // إضافة طابع زمني لمنع التخزين المؤقت
            const faviconUrl = `${data.favicon_url}?t=${timestamp}`;
            
            // تأكد من إزالة جميع الأيقونات القديمة أولا
            document.querySelectorAll("link[rel*='icon']").forEach(icon => {
              if (icon.parentNode) {
                icon.parentNode.removeChild(icon);
              }
            });
            
            // إضافة أيقونة عادية
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = faviconUrl;
            document.head.appendChild(link);
            
            // إضافة أيقونة لأجهزة آبل
            const touchIcon = document.createElement('link');
            touchIcon.rel = 'apple-touch-icon';
            touchIcon.href = faviconUrl;
            document.head.appendChild(touchIcon);
            
            // إضافة اختصار أيقونة للتوافق مع جميع المتصفحات
            const shortcutIcon = document.createElement('link');
            shortcutIcon.rel = 'shortcut icon';
            shortcutIcon.href = faviconUrl;
            document.head.appendChild(shortcutIcon);
            
            console.log('تم تحديث الأيقونة بنجاح');
          }
        } else {
          console.log('لم يتم العثور على إعدادات عامة');
        }
      } catch (error) {
        console.error('Error initializing app settings:', error);
      } finally {
        setInitialized(true);
      }
    };
    
    loadSiteSettings();
    
    // منع الأيقونة الافتراضية من الظهور بعد إعادة تحميل الصفحة
    const preventDefaultFavicon = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
              // التحقق إذا كانت العقدة المضافة هي رابط أيقونة
              if (node.nodeName === 'LINK' && 
                  (node as HTMLLinkElement).rel && 
                  (node as HTMLLinkElement).rel.includes('icon') && 
                  !(node as HTMLLinkElement).href.includes('?t=')) {
                // إزالة الأيقونة الافتراضية إذا تم إضافتها تلقائيًا
                node.parentNode?.removeChild(node);
              }
            });
          }
        });
      });
      
      // مراقبة التغييرات في رأس الصفحة
      observer.observe(document.head, { 
        childList: true,
        subtree: true
      });
      
      return observer;
    };
    
    const observer = preventDefaultFavicon();
    
    // تنظيف المراقب عند إلغاء تحميل المكون
    return () => observer.disconnect();
  }, []);
  
  return null; // هذا المكون لا يقوم بعرض أي عناصر واجهة
};

export default AppInitializer;
