
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WhatsAppSettings {
  phone_number: string;
  default_message: string;
  enabled: boolean;
}

export const useWhatsAppNumber = () => {
  const [whatsAppSettings, setWhatsAppSettings] = useState<WhatsAppSettings>({
    phone_number: '966575594911', // Default number
    default_message: 'استفسار من موقع TRNDSKY',
    enabled: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWhatsAppSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('whatsapp_settings')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching WhatsApp settings:', error);
        } else if (data) {
          setWhatsAppSettings(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWhatsAppSettings();
  }, []);

  return { whatsAppSettings, loading };
};
