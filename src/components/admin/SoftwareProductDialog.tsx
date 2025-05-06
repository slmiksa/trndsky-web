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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";
import { SimpleImageUpload } from "./SimpleImageUpload";
import { ImageGallery } from "./ImageGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type SoftwareProduct = {
  id?: number;
  title: string;
  description: string;
  price: number | null;
  show_price: boolean;
  image_url: string;
};

interface SoftwareProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: SoftwareProduct | null;
  onSuccess: () => void;
}

export function SoftwareProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: SoftwareProductDialogProps) {
  const [form, setForm] = useState<SoftwareProduct>({
    title: "",
    description: "",
    price: null,
    show_price: true,
    image_url: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        console.log("Setting form with product data:", product);
        setForm({
          id: product.id,
          title: product.title || "",
          description: product.description || "",
          price: product.price ?? null,
          show_price: product.show_price !== false, // Default to true if not specified
          image_url: product.image_url || "",
        });
        if (product.id) {
          fetchProductImages(product.id);
        }
      } else {
        // Reset form for new product
        setForm({
          title: "",
          description: "",
          price: null,
          show_price: true,
          image_url: "",
        });
        setAdditionalImages([]);
      }
    }
  }, [open, product]);

  const fetchProductImages = async (productId: number) => {
    setIsLoadingImages(true);
    try {
      const { data, error } = await supabase
        .from("software_product_images")
        .select("image_url")
        .eq("product_id", productId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      // Extract image URLs from the received data
      const imageUrls = data.map(item => item.image_url);
      setAdditionalImages(imageUrls);
    } catch (error: any) {
      console.error("Error loading product images:", error);
      toast("حدث خطأ أثناء تحميل صور المنتج");
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (product?.id) {
        // Update existing product
        const { error } = await supabase
          .from("software_products")
          .update({
            title: form.title,
            description: form.description,
            price: form.price,
            show_price: form.show_price,
            image_url: form.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        if (error) throw error;
        
        // Save additional images
        await saveAdditionalImages(product.id);
        
        toast.success("تم تحديث البرنامج بنجاح");
      } else {
        console.log("Adding new product:", form);
        
        // Get next product ID
        const nextId = await getNextProductId();
        console.log("New product ID:", nextId);
        
        // Add new product with explicit ID and timestamps
        const { data, error } = await supabase.from("software_products").insert([
          {
            id: nextId,
            title: form.title,
            description: form.description,
            price: form.price,
            show_price: form.show_price,
            image_url: form.image_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]).select("id");
        
        if (error) {
          console.error("Error adding product:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Save additional images for new product
          await saveAdditionalImages(nextId);
        }
        
        console.log("Added new product successfully:", data);
        toast.success("تم إضافة البرنامج بنجاح");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ البرنامج");
    } finally {
      setIsSaving(false);
    }
  };

  // Save additional images for product
  const saveAdditionalImages = async (productId: number) => {
    try {
      // First, delete all current product images
      await supabase
        .from("software_product_images")
        .delete()
        .eq("product_id", productId);
      
      // Then insert new images
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
      console.error("Error saving additional images:", error);
      throw error;
    }
  };

  // Get next available ID
  const getNextProductId = async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("software_products")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error getting max product ID:", error);
        return 1; // Default to 1 if error
      }
      
      return data && data.length > 0 ? (data[0].id + 1) : 1;
    } catch (err) {
      console.error("Unexpected error getting next ID:", err);
      return Math.floor(Date.now() / 1000); // Fallback to timestamp-based ID
    }
  };

  const handleImageUpload = (url: string) => {
    setForm({ ...form, image_url: url });
    setUploadError(null);
    toast.success("تم إضافة الصورة الرئيسية");
  };

  const handleAdditionalImageUpload = (url: string) => {
    setAdditionalImages(prev => [...prev, url]);
    toast.success("تم إضافة صورة جديدة إلى معرض الصور");
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    toast.success("تم حذف الصورة من معرض الصور");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || value === null) {
      setForm({ ...form, price: null });
    } else {
      setForm({ ...form, price: parseFloat(value) || 0 });
    }
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-price" className="font-medium">إظهار السعر</Label>
              <div className="flex items-center space-x-2 space-x-reverse">
                {form.show_price ? <Eye className="h-4 w-4 ml-1" /> : <EyeOff className="h-4 w-4 ml-1" />}
                <Switch
                  id="show-price"
                  checked={form.show_price}
                  onCheckedChange={(checked) => setForm({ ...form, show_price: checked })}
                />
              </div>
            </div>
            
            {form.show_price && (
              <div>
                <label className="font-medium block mb-1">السعر</label>
                <Input
                  type="number"
                  value={form.price ?? ""}
                  onChange={handlePriceChange}
                  min="0"
                  step="0.01"
                  placeholder="سعر البرنامج"
                />
              </div>
            )}
          </div>
          <div>
            <label className="font-medium block mb-1">الصورة الرئيسية للبرنامج</label>
            
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">رفع صورة</TabsTrigger>
                <TabsTrigger value="link">إدخال رابط</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="space-y-2 mt-2">
                <ImageUpload onUpload={handleImageUpload} label="رفع صورة رئيسية للبرنامج" />
                {uploadError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="h-4 w-4 ml-2" />
                    <AlertDescription>
                      {uploadError}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              <TabsContent value="link" className="mt-2">
                <SimpleImageUpload 
                  onUpload={handleImageUpload} 
                  label="إضافة رابط صورة" 
                  currentUrl={form.image_url}
                />
              </TabsContent>
            </Tabs>
            
            {form.image_url && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">الصورة الحالية:</p>
                <div className="flex items-center gap-2">
                  <img src={form.image_url} alt="معاينة الصورة" className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <Input
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      placeholder="رابط صورة البرنامج"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional images section */}
          <div>
            <label className="font-medium block mb-1">صور إضافية للبرنامج</label>
            <div className="space-y-4">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">رفع صورة</TabsTrigger>
                  <TabsTrigger value="link">إدخال رابط</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="space-y-2 mt-2">
                  <ImageUpload 
                    onUpload={handleAdditionalImageUpload} 
                    label="إضافة صور للمعرض"
                  />
                </TabsContent>
                <TabsContent value="link" className="mt-2">
                  <SimpleImageUpload 
                    onUpload={handleAdditionalImageUpload} 
                    label="إضافة رابط صورة للمعرض"
                  />
                </TabsContent>
              </Tabs>

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
