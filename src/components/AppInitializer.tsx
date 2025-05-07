
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GeneralSettings {
  site_title: string;
  favicon_url: string | null;
}

export const AppInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        // Explicitly cast the table name to work with TypeScript
        const { data, error } = await (supabase
          .from('general_settings')
          .select('*')
          .single()) as unknown as { 
            data: GeneralSettings | null; 
            error: any; 
          };
        
        if (error) {
          console.error('Error loading general settings:', error);
          return;
        }
        
        if (data) {
          console.log('تم تحميل الإعدادات العامة:', data);
          
          // تحديث عنوان الصفحة
          if (data.site_title) {
            document.title = data.site_title;
          }
          
          // تحديث الأيقونة
          if (data.favicon_url) {
            console.log('تحديث الأيقونة إلى:', data.favicon_url);
            
            // تحديث favicon
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            
            link.href = data.favicon_url;
            
            // تحديث apple-touch-icon
            let touchIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
            
            if (!touchIcon) {
              touchIcon = document.createElement('link');
              touchIcon.rel = 'apple-touch-icon';
              document.head.appendChild(touchIcon);
            }
            
            touchIcon.href = data.favicon_url;
            
            // إضافة رابط آخر للتأكد من تحديث الأيقونة في متصفحات مختلفة
            let shortcutIcon = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;
            
            if (!shortcutIcon) {
              shortcutIcon = document.createElement('link');
              shortcutIcon.rel = 'shortcut icon';
              document.head.appendChild(shortcutIcon);
            }
            
            shortcutIcon.href = data.favicon_url;
            
            console.log('تم تحديث الأيقونة بنجاح');
          }
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
