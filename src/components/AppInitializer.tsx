
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        // وضع الأيقونة الافتراضية أولاً لتجنب التحميلات المتعددة وتحسين السرعة
        setDefaultFavicon();
        
        // استخدام ترميز منطقة التخزين المؤقت للحد من طلبات قاعدة البيانات
        const cachedSettings = localStorage.getItem('site_settings');
        const cacheExpiry = localStorage.getItem('site_settings_expiry');
        const now = new Date().getTime();
        
        // التحقق مما إذا كانت الإعدادات المخزنة مؤقتًا صالحة
        if (cachedSettings && cacheExpiry && parseInt(cacheExpiry) > now) {
          const settings = JSON.parse(cachedSettings);
          applySettings(settings);
          setInitialized(true);
          return;
        }
        
        // إذا لم يتم العثور على بيانات مخزنة مؤقتًا صالحة، فقم بجلب البيانات من قاعدة البيانات
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
          // تخزين البيانات مؤقتًا لمدة ساعة
          localStorage.setItem('site_settings', JSON.stringify(data));
          localStorage.setItem('site_settings_expiry', String(now + 60 * 60 * 1000)); // انتهاء الصلاحية بعد ساعة واحدة
          
          applySettings(data);
        } else {
          console.log('لم يتم العثور على إعدادات عامة');
        }
      } catch (error) {
        console.error('Error initializing app settings:', error);
      } finally {
        setInitialized(true);
      }
    };
    
    // تطبيق الإعدادات على الصفحة
    const applySettings = (data: GeneralSettings) => {
      // تحديث عنوان الصفحة
      if (data.site_title) {
        document.title = data.site_title;
      }
      
      // تحديث الأيقونة فقط إذا كانت موجودة في الإعدادات
      if (data.favicon_url) {
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
      } else {
        // استخدام الأيقونة الافتراضية إذا لم تكن هناك أيقونة في البيانات
        setDefaultFavicon();
      }
    };
    
    // دالة لتعيين الأيقونة الافتراضية (الشعار الجديد)
    const setDefaultFavicon = () => {
      // إزالة أي أيقونات موجودة
      document.querySelectorAll("link[rel*='icon']").forEach(icon => {
        if (icon.parentNode) {
          icon.parentNode.removeChild(icon);
        }
      });
      
      const defaultFaviconUrl = `/lovable-uploads/64c873ad-7948-4191-9929-bbb9fb1d9858.png`;
      
      // إضافة أيقونة عادية
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = defaultFaviconUrl;
      document.head.appendChild(link);
      
      // إضافة أيقونة لأجهزة آبل
      const touchIcon = document.createElement('link');
      touchIcon.rel = 'apple-touch-icon';
      touchIcon.href = defaultFaviconUrl;
      document.head.appendChild(touchIcon);
      
      // إضافة اختصار أيقونة للتوافق مع جميع المتصفحات
      const shortcutIcon = document.createElement('link');
      shortcutIcon.rel = 'shortcut icon';
      shortcutIcon.href = defaultFaviconUrl;
      document.head.appendChild(shortcutIcon);
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
                  !(node as HTMLLinkElement).href.includes('/lovable-uploads')) {
                // إزالة الأيقونة الافتراضية إذا تم إضافتها تلقائيًا
                node.parentNode?.removeChild(node);
                // إضافة الأيقونة المخصصة بدلاً منها
                setDefaultFavicon();
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
