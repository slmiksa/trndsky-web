
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
        // Use type assertion to work around TypeScript error
        const { data, error } = await supabase
          .from('general_settings' as any)
          .select('*')
          .single();
        
        if (error) {
          console.error('Error loading general settings:', error);
          return;
        }
        
        if (data) {
          // Cast the data to our interface
          const settings = data as unknown as GeneralSettings;
          
          // تحديث عنوان الصفحة
          if (settings.site_title) {
            document.title = settings.site_title;
          }
          
          // تحديث الأيقونة
          if (settings.favicon_url) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            
            link.href = settings.favicon_url;
            
            // إضافة علامة للموبايل أيضًا
            let touchIcon: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
            
            if (!touchIcon) {
              touchIcon = document.createElement('link');
              touchIcon.rel = 'apple-touch-icon';
              document.head.appendChild(touchIcon);
            }
            
            touchIcon.href = settings.favicon_url;
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
