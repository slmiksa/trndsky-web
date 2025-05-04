
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Link, Upload } from "lucide-react";

interface SimpleImageUploadProps {
  onUpload: (url: string) => void;
  label?: string;
  currentUrl?: string;
}

export function SimpleImageUpload({ onUpload, label = "إضافة صورة", currentUrl = "" }: SimpleImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentUrl);

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleSubmit = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رابط الصورة",
        variant: "destructive",
      });
      return;
    }

    onUpload(imageUrl);
    toast({
      title: "تم",
      description: "تم إضافة رابط الصورة بنجاح",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Input
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="أدخل رابط الصورة هنا"
          dir="ltr"
          className="flex-1"
        />
        <Button type="button" onClick={handleSubmit} size="sm">
          <Link className="h-4 w-4 mr-2" />
          إضافة
        </Button>
      </div>
      
      {imageUrl && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">معاينة الصورة:</p>
          <img 
            src={imageUrl} 
            alt="معاينة" 
            className="max-h-20 rounded border border-gray-200 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/200x150?text=خطأ+في+الصورة";
              toast({
                title: "تنبيه",
                description: "الرابط لا يشير إلى صورة صالحة",
                variant: "destructive",
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
