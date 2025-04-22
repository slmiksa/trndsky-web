
import { useState } from "react";
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
            image_url: form.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        if (error) throw error;
        toast({ title: "تم التحديث", description: "تم تحديث البرنامج بنجاح" });
      } else {
        console.log("بدء إضافة منتج جديد:", form);
        
        // Generate a new ID for the product when inserting
        const nextId = await getNextProductId();
        console.log("ID المنتج الجديد:", nextId);
        
        // Add new product with explicit ID and timestamps
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
        ]);
        
        if (error) {
          console.error("خطأ في إضافة المنتج:", error);
          throw error;
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

  // Helper function to get the next available product ID
  const getNextProductId = async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("software_products")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error getting max product ID:", error);
        return 1; // Default to 1 if there's an error
      }
      
      return data && data.length > 0 ? (data[0].id + 1) : 1;
    } catch (err) {
      console.error("Unexpected error getting next ID:", err);
      return Math.floor(Date.now() / 1000); // Fallback to timestamp-based ID
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
            <label className="font-medium block mb-1">رابط الصورة</label>
            <Input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              required
              placeholder="رابط صورة البرنامج"
            />
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
