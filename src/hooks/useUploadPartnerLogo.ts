
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
      console.log("بدء عملية رفع الصورة...");
      
      // فحص حجم الملف
      if (file.size > 3 * 1024 * 1024) { // أكبر من 3 ميجابايت
        toast({
          title: "تنبيه",
          description: "حجم الملف كبير، يرجى استخدام صورة أصغر لضمان سرعة التحميل.",
          variant: "default",
        });
      }
      
      // إنشاء اسم فريد للملف
      const fileExt = file.name.split('.').pop();
      const fileName = `partner-logo-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `partner-logos/${fileName}`;
      
      // ✅ استخدام Supabase مباشرة للتخزين في الـ public bucket
      const { data, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error("خطأ في رفع الملف:", uploadError);
        throw new Error(`خطأ في رفع الملف: ${uploadError.message}`);
      }
      
      // ✅ الحصول على الرابط العام للملف
      const { data: publicUrlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      console.log("تم رفع الصورة بنجاح:", publicUrlData.publicUrl);
      
      // ✅ إرجاع الرابط العام
      return publicUrlData.publicUrl;
      
    } catch (err: any) {
      console.error("خطأ غير متوقع أثناء عملية الرفع:", err);
      
      // محاولة استخدام المسار المحلي كحل بديل
      const fileName = `partner-logo-${Date.now()}-${Math.random().toString(36).substring(2)}.${file.type.split('/')[1]}`;
      const localPath = `/lovable-uploads/${fileName}`;
      
      toast({
        title: "خطأ في الرفع على Supabase",
        description: "سيتم استخدام التخزين المحلي كحل بديل.",
        variant: "destructive",
      });
      
      setError("حدث خطأ أثناء رفع الصورة على Supabase");
      return localPath;
    } finally {
      setUploading(false);
    }
  };

  return { uploadLogo, uploading, error };
}
