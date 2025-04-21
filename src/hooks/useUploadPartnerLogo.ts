
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUploadPartnerLogo() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadLogo = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);
    
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;
      
      // Upload the file to the partner-logos bucket
      const { error: uploadError } = await supabase.storage
        .from("partner-logos")
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type // Add content type for proper file serving
        });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        setError("حدث خطأ أثناء رفع الشعار");
        setUploading(false);
        return null;
      }

      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("partner-logos")
        .getPublicUrl(fileName);
      
      if (!publicUrlData?.publicUrl) {
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
