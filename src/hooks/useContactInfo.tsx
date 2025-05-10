
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ContactInfo = {
  email: string;
  phone: string;
  location: string;
  working_days: string;
  working_hours_start: string;
  working_hours_end: string;
  closed_days: string;
};

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "",
    phone: "",
    location: "",
    working_days: "الأحد - الخميس",
    closed_days: "الجمعة - السبت",
    working_hours_start: "9:00 صباحًا",
    working_hours_end: "5:00 مساءً"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching contact info:", error);
          return;
        }
        
        if (data) {
          setContactInfo(data);
        }
      } catch (error) {
        console.error("Error in contact info fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return { contactInfo, loading };
}
