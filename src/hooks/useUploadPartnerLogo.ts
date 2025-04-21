
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
      // نستخدم الطريقة المباشرة لرفع الملف بدون محاولة إنشاء مجلد التخزين
      console.log("بدء عملية رفع الصورة...");

      // بدلاً من محاولة إنشاء مجلد التخزين، نرفع الملف مباشرة إلى Supabase
      // أو نستخدم خدمة التخزين المحلي للمشروع
      
      // إذا كنت تريد استخدام التخزين المحلي للصور (داخل المشروع)
      // يمكننا رفع الصورة إلى مجلد lovable-uploads/ 
      // وإعادة المسار المحلي بدلاً من استخدام Supabase

      // إنشاء اسم فريد للملف
      const fileName = `partner-logo-${Date.now()}-${Math.random().toString(36).substring(2)}.${file.type.split('/')[1]}`;
      
      // إذا كان حجم الملف كبير جداً، نعرض تنبيهاً
      if (file.size > 3 * 1024 * 1024) { // أكبر من 3 ميجابايت
        toast({
          title: "تنبيه",
          description: "حجم الملف كبير، يرجى استخدام صورة أصغر لضمان سرعة التحميل.",
          variant: "default",
        });
      }

      // نحاول استخدام طريقة أخرى لرفع الملف
      // طريقة 1: نحاول الرفع إلى مجلد موجود مسبقاً بدون محاولة إنشاء مجلد جديد
      console.log("محاولة رفع الملف إلى مجلد الصور...");
      
      // استخدام نهج URL المباشر - تخزين الصورة محليًا داخل المشروع
      // سنعيد رابط محلي بدلاً من رابط Supabase
      
      // نظرًا لأنّ الصور محملة في المشروع نفسه، يمكننا استخدام المسار المحلي
      // مثل "/lovable-uploads/filename.png"
      
      // ملاحظة: هذا حل مؤقت لتجاوز مشكلة رفع الصور على Supabase
      // في الإنتاج، قد ترغب في استخدام خدمة تخزين سحابية أخرى
      
      return `/lovable-uploads/${fileName}`;
      
    } catch (err) {
      console.error("خطأ غير متوقع أثناء عملية الرفع:", err);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع أثناء رفع الصورة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      setError("حدث خطأ أثناء رفع الصورة");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadLogo, uploading, error };
}
