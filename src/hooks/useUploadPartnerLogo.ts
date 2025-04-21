
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useUploadPartnerLogo() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadLogo = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'partner-logos');
      
      if (!bucketExists) {
        console.log("Partner-logos bucket doesn't exist, creating it now");
        
        try {
          // Create public bucket
          const { error: createBucketError } = await supabase.storage.createBucket('partner-logos', {
            public: true,
            fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
          });
          
          if (createBucketError) {
            console.error("Error creating bucket:", createBucketError);
            toast({
              title: "خطأ",
              description: "حدث خطأ أثناء إنشاء مجلد الشعارات. يرجى تسجيل الدخول والمحاولة مرة أخرى.",
              variant: "destructive",
            });
            setError("حدث خطأ أثناء إنشاء مجلد الشعارات");
            setUploading(false);
            return null;
          }
          
          // Add public policy to the bucket (this will be done automatically since public: true)
          console.log("Partner-logos bucket created successfully");
        } catch (err) {
          console.error("Unexpected bucket creation error:", err);
          toast({
            title: "خطأ",
            description: "حدث خطأ غير متوقع أثناء إنشاء مجلد الشعارات. يرجى المحاولة لاحقًا.",
            variant: "destructive",
          });
          setError("حدث خطأ غير متوقع أثناء إنشاء مجلد الشعارات");
          setUploading(false);
          return null;
        }
      }

      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;

      console.log("Uploading file:", fileName);
      
      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("partner-logos")
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError || !uploadData) {
        console.error("Upload error:", uploadError);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء رفع الشعار. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
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
        toast({
          title: "خطأ",
          description: "حدث خطأ في الحصول على رابط الشعار.",
          variant: "destructive",
        });
        setError("حدث خطأ في الحصول على رابط الشعار");
        setUploading(false);
        return null;
      }

      console.log("Public URL:", publicUrlData.publicUrl);
      setUploading(false);
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Unexpected error during upload:", err);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع أثناء رفع الشعار. تأكد من تسجيل الدخول.",
        variant: "destructive",
      });
      setError("حدث خطأ غير متوقع أثناء رفع الشعار");
      setUploading(false);
      return null;
    }
  };

  return { uploadLogo, uploading, error };
}
