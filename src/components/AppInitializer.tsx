
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const AppInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('general_settings')
          .select('*')
          .single();
        
        if (error) {
          console.error('Error loading general settings:', error);
          return;
        }
        
        if (data) {
          // تحديث عنوان الصفحة
          if (data.site_title) {
            document.title = data.site_title;
          }
          
          // تحديث الأيقونة
          if (data.favicon_url) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            
            link.href = data.favicon_url;
            
            // إضافة علامة للموبايل أيضًا
            let touchIcon: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
            
            if (!touchIcon) {
              touchIcon = document.createElement('link');
              touchIcon.rel = 'apple-touch-icon';
              document.head.appendChild(touchIcon);
            }
            
            touchIcon.href = data.favicon_url;
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
