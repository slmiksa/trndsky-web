
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
      // فحص حجم الملف
      if (file.size > 3 * 1024 * 1024) { // أكبر من 3 ميجابايت
        toast({
          title: "تنبيه",
          description: "حجم الملف كبير، يرجى استخدام صورة أصغر لضمان سرعة التحميل.",
          variant: "default",
        });
        return null;
      }
      
      // إنشاء اسم فريد للملف
      const fileExt = file.name.split('.').pop();
      const fileName = `partner-logo-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `partner-logos/${fileName}`;
      
      // محاولة رفع الملف مع التعامل مع الأخطاء بشكل أفضل
      const { data, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error("خطأ في رفع الملف:", uploadError);
        toast({
          title: "خطأ في الرفع",
          description: `حدث خطأ أثناء رفع الصورة: ${uploadError.message}`,
          variant: "destructive",
        });
        return null;
      }
      
      // الحصول على الرابط العام للملف
      const { data: publicUrlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      console.log("تم رفع الصورة بنجاح:", publicUrlData.publicUrl);
      
      return publicUrlData.publicUrl;
      
    } catch (err: any) {
      console.error("خطأ غير متوقع أثناء عملية الرفع:", err);
      
      toast({
        title: "خطأ غير متوقع",
        description: "حدث خطأ أثناء محاولة رفع الصورة",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadLogo, uploading, error };
}
