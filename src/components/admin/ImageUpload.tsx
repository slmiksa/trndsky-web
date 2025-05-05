
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { useStorage } from "@/hooks/useStorage";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label?: string;
  bucketName?: string;
}

export function ImageUpload({ onUpload, label = "رفع صورة", bucketName = "public" }: ImageUploadProps) {
  const { upload, isUploading, error } = useStorage(bucketName);
  const [lastError, setLastError] = useState<string | null>(null);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("يرجى اختيار صورة للرفع.");
      }

      const file = event.target.files[0];
      console.log(`بدء رفع الصورة: ${file.name}`);
      
      // تحديد المسار للصور
      const uploadPath = "uploads";
      const publicUrl = await upload(file, uploadPath);
      
      if (!publicUrl) {
        throw new Error(error || "فشل رفع الصورة، يرجى المحاولة مرة أخرى.");
      }
      
      console.log("تم رفع الصورة بنجاح، الرابط:", publicUrl);
      onUpload(publicUrl);
      setLastError(null);
    } catch (error: any) {
      console.error("خطأ في رفع الصورة:", error);
      setLastError(error.message);
      
      toast({
        title: "خطأ في رفع الصورة",
        description: error.message || "حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        disabled={isUploading}
        className="relative overflow-hidden w-full"
        type="button"
      >
        <input
          type="file"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={uploadImage}
          accept="image/*"
          disabled={isUploading}
        />
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "جاري الرفع..." : label}
      </Button>
      
      {lastError && (
        <p className="text-sm text-red-500 mt-1">{lastError}</p>
      )}
    </div>
  );
}
