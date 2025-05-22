
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WhatsAppSettings {
  phone_number: string;
  default_message: string;
  enabled: boolean;
}

const defaultSettings: WhatsAppSettings = {
  phone_number: '966575594911',
  default_message: 'استفسار من موقع TRNDSKY',
  enabled: true
};

export const useWhatsAppNumber = () => {
  const [whatsAppSettings, setWhatsAppSettings] = useState<WhatsAppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWhatsAppSettings = async () => {
      try {
        // التحقق من وجود بيانات مخزنة مؤقتًا
        const cachedData = localStorage.getItem('whatsapp_settings');
        const cacheExpiry = localStorage.getItem('whatsapp_settings_expiry');
        const now = new Date().getTime();
        
        // استخدام البيانات المخزنة مؤقتًا إذا كانت صالحة
        if (cachedData && cacheExpiry && parseInt(cacheExpiry) > now) {
          setWhatsAppSettings(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
        
        setLoading(true);
        
        // جلب البيانات من قاعدة البيانات
        const { data, error } = await supabase
          .from('whatsapp_settings')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching WhatsApp settings:', error);
          setWhatsAppSettings(defaultSettings);
        } else if (data) {
          setWhatsAppSettings({
            phone_number: data.phone_number || defaultSettings.phone_number,
            default_message: data.default_message || defaultSettings.default_message,
            enabled: data.enabled !== undefined ? data.enabled : defaultSettings.enabled
          });
          
          // تخزين البيانات مؤقتًا لمدة ساعة
          localStorage.setItem('whatsapp_settings', JSON.stringify(data));
          localStorage.setItem('whatsapp_settings_expiry', String(now + 60 * 60 * 1000)); // انتهاء الصلاحية بعد ساعة واحدة
        }
      } catch (error) {
        console.error('Error:', error);
        setWhatsAppSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchWhatsAppSettings();
  }, []);

  return { whatsAppSettings, loading };
};
