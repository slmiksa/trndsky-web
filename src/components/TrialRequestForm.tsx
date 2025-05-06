
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useContactInfo } from "@/hooks/useContactInfo";

type TrialRequestFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TrialRequestForm = ({ isOpen, onClose }: TrialRequestFormProps) => {
  const { toast } = useToast();
  const { contactInfo } = useContactInfo();
  const [formData, setFormData] = useState({
    company_name: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert the trial request into the database
      const { error } = await supabase.from("trial_requests").insert([
        {
          company_name: formData.company_name,
          whatsapp: formData.whatsapp,
        },
      ]);

      if (error) {
        console.error("Error submitting trial request:", error);
        toast({
          title: "حدث خطأ!",
          description: "تعذر إرسال طلب التجربة. حاول مرة أخرى لاحقاً.",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      // Send email notification
      try {
        await supabase.functions.invoke("send-notification-email", {
          body: {
            to: contactInfo.email,
            subject: "طلب تجربة برمجيات جديد",
            requestType: "trial",
            requestDetails: {
              company_name: formData.company_name,
              whatsapp: formData.whatsapp,
            }
          }
        });
      } catch (emailError) {
        // Log error but continue as the database entry was successful
        console.error("Error sending email notification:", emailError);
      }

      toast({
        title: "تم استلام طلب التجربة",
        description: "سنتواصل معك قريباً لبدء التجربة",
        duration: 5000,
      });

      setFormData({
        company_name: "",
        whatsapp: "",
      });
      
      onClose();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "حدث خطأ!",
        description: "تعذر إرسال طلب التجربة. حاول مرة أخرى لاحقاً.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center font-tajawal mb-2">طلب تجربة</DialogTitle>
          <DialogDescription className="text-center font-tajawal">
            أدخل بيانات التواصل وسنقوم بالرد عليك في أقرب وقت
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name" className="font-tajawal font-bold">
              اسم الشركة / العميل
            </Label>
            <Input
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              dir="rtl"
              className="font-tajawal"
              placeholder="أدخل اسم الشركة أو العميل"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="font-tajawal font-bold">
              رقم واتساب للتواصل
            </Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              dir="rtl"
              className="font-tajawal"
              placeholder="+966123456789"
            />
          </div>
          <DialogFooter className="flex sm:justify-center gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="font-tajawal"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-l from-trndsky-teal to-trndsky-blue hover:from-trndsky-blue hover:to-trndsky-teal text-white font-tajawal"
            >
              {loading ? "جارٍ الإرسال..." : "إرسال طلب التجربة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrialRequestForm;
