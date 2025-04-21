
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUploadPartnerLogo() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadLogo = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;
    const filePath = `partner-logos/${fileName}`;

    // رفع الملف إلى الباكيت
    const { data, error } = await supabase.storage
      .from("partner-logos")
      .upload(fileName, file, { upsert: true });
    
    if (error) {
      setError("حدث خطأ أثناء رفع الشعار");
      setUploading(false);
      return null;
    }

    // ربط الرابط العام للعرض
    const { data: publicUrlData } = supabase.storage
      .from("partner-logos")
      .getPublicUrl(fileName);
    setUploading(false);
    return publicUrlData?.publicUrl || null;
  };

  return { uploadLogo, uploading, error };
}
