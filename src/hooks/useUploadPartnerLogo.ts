
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUploadPartnerLogo() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadLogo = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("partner-logos")
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError || !uploadData) {
        console.error("Upload error:", uploadError);
        setError("حدث خطأ أثناء رفع الشعار");
        setUploading(false);
        return null;
      }

      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("partner-logos")
        .getPublicUrl(fileName);

      if (publicUrlError || !publicUrlData?.publicUrl) {
        console.error("Error getting public URL:", publicUrlError);
        setError("حدث خطأ في الحصول على رابط الشعار");
        setUploading(false);
        return null;
      }

      setUploading(false);
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Unexpected error during upload:", err);
      setError("حدث خطأ غير متوقع أثناء رفع الشعار");
      setUploading(false);
      return null;
    }
  };

  return { uploadLogo, uploading, error };
}
