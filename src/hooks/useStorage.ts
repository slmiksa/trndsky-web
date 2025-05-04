
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useStorage(bucketName: string = "public") {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to check if bucket exists
  const checkBucketExists = async (bucket: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.storage.getBucket(bucket);
      if (error) {
        console.error("Error checking bucket:", error);
        return false;
      }
      return !!data;
    } catch (err) {
      console.error("Exception checking bucket:", err);
      return false;
    }
  };

  const upload = async (file: File, path?: string): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // First check if the bucket exists
      const bucketExists = await checkBucketExists(bucketName);
      if (!bucketExists) {
        console.error(`Bucket "${bucketName}" does not exist`);
        throw new Error(`حاوية التخزين "${bucketName}" غير موجودة`);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;
      
      console.log(`محاولة رفع الملف: ${filePath} إلى الحاوية: ${bucketName}`);

      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error("خطأ في رفع الملف:", uploadError);
        setError(uploadError.message);
        return null;
      }
      
      console.log("تم الرفع بنجاح:", data);
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (err: any) {
      console.error("خطأ غير متوقع:", err);
      setError(err.message || "حدث خطأ أثناء رفع الملف");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const getPublicUrl = (path: string): string => {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);
    
    return data.publicUrl;
  };

  return {
    upload,
    getPublicUrl,
    isUploading,
    error
  };
}
