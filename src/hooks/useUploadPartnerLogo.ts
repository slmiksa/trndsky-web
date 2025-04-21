
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUploadPartnerLogo() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadLogo = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      // First, check if the partner-logos bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'partner-logos');

      // If bucket doesn't exist, create it
      if (!bucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket('partner-logos', { public: true });
        if (createBucketError) {
          console.error("Error creating bucket:", createBucketError);
          setError("حدث خطأ أثناء إنشاء مجلد الشعارات");
          setUploading(false);
          return null;
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;

      console.log("Uploading file:", fileName);
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

      console.log("Upload successful:", uploadData);
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("partner-logos")
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        console.error("Error getting public URL: No public URL returned");
        setError("حدث خطأ في الحصول على رابط الشعار");
        setUploading(false);
        return null;
      }

      console.log("Public URL:", publicUrlData.publicUrl);
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
