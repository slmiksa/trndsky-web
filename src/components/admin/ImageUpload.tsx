
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label?: string;
  bucketName?: string;
}

export function ImageUpload({ onUpload, label = "رفع صورة", bucketName = "public" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("يرجى اختيار صورة للرفع.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;
      
      console.log(`محاولة رفع الصورة ${fileName} إلى حاوية ${bucketName}`);
      
      // تخطي التحقق من وجود الحاوية والذهاب مباشرة إلى الرفع
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error("خطأ أثناء رفع الصورة:", error);
        throw error;
      }
      
      console.log("تم رفع الصورة بنجاح، استلام البيانات:", data);
      
      // الحصول على الرابط العام
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      console.log("الرابط العام للصورة:", publicUrl);
      
      onUpload(publicUrl);
      toast({
        title: "تم الرفع",
        description: "تم رفع الصورة بنجاح",
      });
    } catch (error: any) {
      console.error("خطأ في رفع الصورة:", error);
      
      // عرض رسالة خطأ أكثر تفصيلا للمستخدم
      toast({
        title: "خطأ في رفع الصورة",
        description: error.message || "حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Button
      variant="outline"
      disabled={uploading}
      className="relative overflow-hidden"
      type="button"
    >
      <input
        type="file"
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={uploadImage}
        accept="image/*"
        disabled={uploading}
      />
      <Upload className="mr-2" />
      {uploading ? "جاري الرفع..." : label}
    </Button>
  );
}
