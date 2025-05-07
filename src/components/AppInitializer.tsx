
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
    const loadSiteSettings = async () => {
      try {
        console.log('جاري تحميل الإعدادات العامة...');
        
        // Use maybeSingle instead of single to handle cases where no data exists
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
          
          // تحديث الأيقونة
          if (data.favicon_url) {
            console.log('تحديث الأيقونة إلى:', data.favicon_url);
            
            const timestamp = new Date().getTime(); // Add timestamp to prevent caching
            const faviconUrl = `${data.favicon_url}?t=${timestamp}`;
            
            // تحديث favicon
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            
            link.href = faviconUrl;
            
            // تحديث apple-touch-icon
            let touchIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
            
            if (!touchIcon) {
              touchIcon = document.createElement('link');
              touchIcon.rel = 'apple-touch-icon';
              document.head.appendChild(touchIcon);
            }
            
            touchIcon.href = faviconUrl;
            
            // إضافة رابط آخر للتأكد من تحديث الأيقونة في متصفحات مختلفة
            let shortcutIcon = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;
            
            if (!shortcutIcon) {
              shortcutIcon = document.createElement('link');
              shortcutIcon.rel = 'shortcut icon';
              document.head.appendChild(shortcutIcon);
            }
            
            shortcutIcon.href = faviconUrl;
            
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
  }, []);
  
  return null; // هذا المكون لا يقوم بعرض أي عناصر واجهة
};

export default AppInitializer;
