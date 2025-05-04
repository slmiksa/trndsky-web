
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";
import { ImageGallery } from "./ImageGallery";

type SoftwareProduct = {
  id?: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
};

interface SoftwareProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: SoftwareProduct;
  onSuccess: () => void;
}

export function SoftwareProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: SoftwareProductDialogProps) {
  const [form, setForm] = useState<SoftwareProduct>(
    product || {
      title: "",
      description: "",
      price: 0,
      image_url: "",
    }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // تحميل الصور الإضافية عند فتح نافذة تعديل منتج موجود
  useEffect(() => {
    if (product?.id) {
      fetchProductImages(product.id);
    } else {
      setAdditionalImages([]);
    }
  }, [product]);

  const fetchProductImages = async (productId: number) => {
    setIsLoadingImages(true);
    try {
      const { data, error } = await supabase
        .from("software_product_images")
        .select("image_url")
        .eq("product_id", productId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      // تجميع روابط الصور من البيانات المستلمة
      const imageUrls = data.map(item => item.image_url);
      setAdditionalImages(imageUrls);
    } catch (error: any) {
      console.error("خطأ في تحميل صور المنتج:", error);
      toast({ 
        title: "خطأ", 
        description: "حدث خطأ أثناء تحميل صور المنتج",
        variant: "destructive"
      });
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (product?.id) {
        // تحديث المنتج الموجود
        const { error } = await supabase
          .from("software_products")
          .update({
            title: form.title,
            description: form.description,
            price: form.price,
            image_url: form.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        if (error) throw error;
        
        // حفظ الصور الإضافية
        await saveAdditionalImages(product.id);
        
        toast({ title: "تم التحديث", description: "تم تحديث البرنامج بنجاح" });
      } else {
        console.log("بدء إضافة منتج جديد:", form);
        
        // الحصول على معرف جديد للمنتج
        const nextId = await getNextProductId();
        console.log("ID المنتج الجديد:", nextId);
        
        // إضافة منتج جديد مع معرف صريح وطوابع زمنية
        const { data, error } = await supabase.from("software_products").insert([
          {
            id: nextId,
            title: form.title,
            description: form.description,
            price: form.price,
            image_url: form.image_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]).select("id");
        
        if (error) {
          console.error("خطأ في إضافة المنتج:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // حفظ الصور الإضافية للمنتج الجديد
          await saveAdditionalImages(nextId);
        }
        
        console.log("تم إضافة منتج جديد بنجاح:", data);
        toast({ title: "تمت الإضافة", description: "تم إضافة البرنامج بنجاح" });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ البرنامج",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // حفظ الصور الإضافية للمنتج
  const saveAdditionalImages = async (productId: number) => {
    try {
      // أولاً، حذف جميع صور المنتج الحالية
      await supabase
        .from("software_product_images")
        .delete()
        .eq("product_id", productId);
      
      // ثم إدراج الصور الجديدة
      if (additionalImages.length > 0) {
        const imagesToInsert = additionalImages.map(url => ({
          product_id: productId,
          image_url: url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        
        const { error } = await supabase
          .from("software_product_images")
          .insert(imagesToInsert);
        
        if (error) throw error;
      }
    } catch (error: any) {
      console.error("خطأ في حفظ الصور الإضافية:", error);
      throw error;
    }
  };

  // الحصول على المعرف التالي المتاح
  const getNextProductId = async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("software_products")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error getting max product ID:", error);
        return 1; // التقديم الافتراضي إلى 1 في حالة وجود خطأ
      }
      
      return data && data.length > 0 ? (data[0].id + 1) : 1;
    } catch (err) {
      console.error("Unexpected error getting next ID:", err);
      return Math.floor(Date.now() / 1000); // الاحتياطي للمعرف المستند إلى الطابع الزمني
    }
  };

  const handleImageUpload = (url: string) => {
    setForm({ ...form, image_url: url });
    toast({ 
      title: "تم رفع الصورة", 
      description: "تم إضافة رابط الصورة الرئيسية إلى النموذج" 
    });
  };

  const handleAdditionalImageUpload = (url: string) => {
    setAdditionalImages(prev => [...prev, url]);
    toast({ 
      title: "تم رفع الصورة", 
      description: "تم إضافة صورة جديدة إلى معرض الصور" 
    });
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    toast({ 
      title: "تم حذف الصورة", 
      description: "تم حذف الصورة من معرض الصور" 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? "تعديل برنامج" : "إضافة برنامج جديد"}</DialogTitle>
          <DialogDescription>
            {product
              ? "قم بتعديل بيانات البرنامج أدناه"
              : "أدخل بيانات البرنامج الجديد"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-medium block mb-1">اسم البرنامج</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="اسم البرنامج"
            />
          </div>
          <div>
            <label className="font-medium block mb-1">الوصف</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              placeholder="وصف البرنامج"
              rows={4}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">السعر</label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: parseFloat(e.target.value) })
              }
              required
              min="0"
              step="0.01"
              placeholder="سعر البرنامج"
            />
          </div>
          <div>
            <label className="font-medium block mb-1">الصورة الرئيسية للبرنامج</label>
            <div className="space-y-2">
              <ImageUpload onUpload={handleImageUpload} label="رفع صورة رئيسية للبرنامج" />
              {form.image_url && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={form.image_url} alt="معاينة الصورة" className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <Input
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      placeholder="رابط صورة البرنامج"
                    />
                  </div>
                </div>
              )}
              {!form.image_url && (
                <Input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="أو أدخل رابط صورة البرنامج يدوياً"
                />
              )}
            </div>
          </div>

          {/* قسم الصور الإضافية */}
          <div>
            <label className="font-medium block mb-1">صور إضافية للبرنامج</label>
            <div className="space-y-4">
              <ImageUpload 
                onUpload={handleAdditionalImageUpload} 
                label="إضافة صور للمعرض" 
                bucketName="software-images"
              />

              {isLoadingImages ? (
                <div className="text-center py-4">جاري تحميل الصور...</div>
              ) : (
                <ImageGallery 
                  images={additionalImages} 
                  onRemoveImage={handleRemoveAdditionalImage} 
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "جارٍ الحفظ..." : product ? "حفظ التعديلات" : "إضافة البرنامج"}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">إلغاء</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
