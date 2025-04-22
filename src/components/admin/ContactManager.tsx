import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

type ContactInfo = {
  id: number;
  email: string;
  phone: string;
  location: string;
  working_hours_start: string;
  working_hours_end: string;
  working_days: string;
  closed_days: string;
};

export function ContactManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    id: 1,
    email: "",
    phone: "",
    location: "",
    working_hours_start: "",
    working_hours_end: "",
    working_days: "",
    closed_days: ""
  });

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .single();

      if (error) throw error;

      if (data) {
        setContactInfo(data);
      }
    } catch (error: any) {
      console.error("Error fetching contact info:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب معلومات التواصل",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("contact_info")
        .upsert({
          ...contactInfo,
          id: 1
        });

      if (error) throw error;

      toast({
        title: "تم الحفظ",
        description: "تم حفظ معلومات التواصل بنجاح",
      });
    } catch (error: any) {
      console.error("Error saving contact info:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ معلومات التواصل",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-trndsky-darkblue">
            معلومات التواصل الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              البريد الإلكتروني
            </label>
            <Input
              value={contactInfo.email}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, email: e.target.value })
              }
              dir="ltr"
              className="text-left"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium flex items-center gap-2">
              <Phone className="w-4 h-4" />
              رقم الهاتف
            </label>
            <Input
              value={contactInfo.phone}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, phone: e.target.value })
              }
              dir="ltr"
              className="text-left"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              العنوان
            </label>
            <Input
              value={contactInfo.location}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, location: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-trndsky-darkblue">
            ساعات العمل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-medium">من</label>
              <Input
                value={contactInfo.working_hours_start}
                onChange={(e) =>
                  setContactInfo({
                    ...contactInfo,
                    working_hours_start: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="font-medium">إلى</label>
              <Input
                value={contactInfo.working_hours_end}
                onChange={(e) =>
                  setContactInfo({
                    ...contactInfo,
                    working_hours_end: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-medium">أيام العمل</label>
            <Input
              value={contactInfo.working_days}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, working_days: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium">أيام الإغلاق</label>
            <Input
              value={contactInfo.closed_days}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, closed_days: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </div>
  );
}
