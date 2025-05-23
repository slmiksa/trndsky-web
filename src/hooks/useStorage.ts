
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useStorage(bucketName: string = "public") {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, path?: string): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // تحقق من نوع الملف (صور فقط)
      if (!file.type.startsWith('image/')) {
        setError("يرجى اختيار ملف صورة صالح");
        toast({
          title: "خطأ في نوع الملف",
          description: "يرجى اختيار ملف صورة صالح",
          variant: "destructive"
        });
        return null;
      }

      // تحقق من حجم الملف (أقل من 5 ميجا)
      if (file.size > 5 * 1024 * 1024) {
        setError("حجم الملف كبير جداً، يجب أن يكون أقل من 5 ميجابايت");
        toast({
          title: "خطأ في حجم الملف",
          description: "حجم الملف كبير جداً، يجب أن يكون أقل من 5 ميجابايت",
          variant: "destructive"
        });
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;
      
      console.log(`محاولة رفع الملف: ${filePath} إلى الحاوية: ${bucketName}`);

      // تحقق من وضع الجلسة (لأغراض التسجيل فقط)
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.log("المستخدم غير مسجل الدخول، استخدام الرفع العام المسموح به من خلال السياسات المحدثة");
      }

      // محاولة رفع الملف
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error("خطأ في رفع الملف:", uploadError);
        setError(uploadError.message);
        toast({
          title: "خطأ في رفع الملف",
          description: uploadError.message,
          variant: "destructive"
        });
        return null;
      }
      
      console.log("تم الرفع بنجاح:", data);
      
      // الحصول على الرابط العام
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      toast({
        title: "تم بنجاح",
        description: "تم رفع الملف بنجاح",
      });
      
      return publicUrl;
    } catch (err: any) {
      console.error("خطأ غير متوقع:", err);
      setError(err.message || "حدث خطأ أثناء رفع الملف");
      toast({
        title: "خطأ غير متوقع",
        description: err.message || "حدث خطأ أثناء رفع الملف",
        variant: "destructive"
      });
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
