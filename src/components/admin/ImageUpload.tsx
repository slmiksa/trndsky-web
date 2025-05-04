
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
      // تحسين اسم الملف لتجنب التعارض
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // تحديد المجلد حسب نوع الاستخدام
      const folderName = bucketName === "public" ? "software-images" : bucketName;
      const filePath = `${folderName}/${fileName}`;

      console.log(`Attempting to upload to bucket: ${bucketName}, path: ${filePath}`);

      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      console.log("Upload successful, public URL:", publicUrl);
      onUpload(publicUrl);
      toast({
        title: "تم الرفع",
        description: "تم رفع الصورة بنجاح",
      });
    } catch (error: any) {
      console.error("Error uploading:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء رفع الصورة",
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
