
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUploadPartnerLogo } from "@/hooks/useUploadPartnerLogo";
import { Loader2, Trash2 } from "lucide-react";

interface Partner {
  id: number;
  name: string;
  logo_url: string;
}

export const PartnersManager = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPartner, setNewPartner] = useState({
    name: "",
    logo_url: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadLogo, uploading } = useUploadPartnerLogo();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("partners").select("*").order("id", { ascending: true });

      if (error) {
        toast.error("فشل في تحميل بيانات الشركاء");
        console.error("Error fetching partners:", error);
        return;
      }

      setPartners(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Clean up the preview URL when component unmounts or when a new file is selected
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPartner.name) {
      toast.error("يرجى إدخال اسم الشريك");
      return;
    }

    if (!selectedFile && !newPartner.logo_url) {
      toast.error("يرجى اختيار شعار للشريك");
      return;
    }

    try {
      let logoUrl = newPartner.logo_url;
      
      // Upload logo if a file is selected
      if (selectedFile) {
        logoUrl = await uploadLogo(selectedFile) || "";
        if (!logoUrl) {
          toast.error("فشل في رفع الشعار");
          return;
        }
      }

      // Add partner to database
      const { data, error } = await supabase.from("partners").insert([
        { 
          name: newPartner.name,
          logo_url: logoUrl
        }
      ]).select();

      if (error) {
        toast.error("فشل في إضافة الشريك");
        console.error("Error adding partner:", error);
        return;
      }

      toast.success("تم إضافة الشريك بنجاح");
      fetchPartners();
      
      // Reset form
      setNewPartner({ name: "", logo_url: "" });
      setSelectedFile(null);
      setPreviewUrl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const handleDeletePartner = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الشريك؟")) {
      return;
    }

    try {
      const { error } = await supabase.from("partners").delete().eq("id", id);

      if (error) {
        toast.error("فشل في حذف الشريك");
        console.error("Error deleting partner:", error);
        return;
      }

      toast.success("تم حذف الشريك بنجاح");
      fetchPartners();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-right">
        <h2 className="text-2xl font-bold mb-4 font-tajawal">إدارة شركاء النجاح</h2>
        <p className="text-gray-500 mb-8 font-tajawal">إضافة وحذف الشركاء الذين يظهرون في قسم شركاء النجاح</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-tajawal">إضافة شريك جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name" className="font-tajawal">اسم الشريك</Label>
                <Input
                  id="name"
                  placeholder="أدخل اسم الشريك"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="font-tajawal"
                />
              </div>
              
              <div>
                <Label htmlFor="logo" className="font-tajawal">شعار الشريك</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="font-tajawal"
                />
                {previewUrl && (
                  <div className="mt-2 p-2 border rounded-md">
                    <p className="mb-2 font-tajawal">معاينة:</p>
                    <img src={previewUrl} alt="معاينة الشعار" className="max-h-24" />
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={uploading || loading} className="font-tajawal">
              {uploading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                "إضافة شريك"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-tajawal">قائمة الشركاء</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : partners.length === 0 ? (
            <p className="text-center text-gray-500 p-4 font-tajawal">لا يوجد شركاء حالياً</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map((partner) => (
                <div key={partner.id} className="border rounded-lg p-4 flex flex-col items-center">
                  <div className="bg-gray-50 w-full h-24 flex items-center justify-center rounded-xl p-2 mb-3">
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="object-contain max-h-20 max-w-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                        e.currentTarget.alt = "صورة غير متوفرة";
                      }}
                    />
                  </div>
                  <h3 className="font-medium text-center mb-2 font-tajawal">{partner.name}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePartner(partner.id)}
                    className="mt-2"
                  >
                    <Trash2 className="h-4 w-4 ml-1" />
                    حذف
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnersManager;
