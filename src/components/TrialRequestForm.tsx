
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Send, X } from 'lucide-react';
import { useContactInfo } from '@/hooks/useContactInfo';

interface TrialRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrialRequestForm = ({ isOpen, onClose }: TrialRequestFormProps) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    software_type: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { contactInfo } = useContactInfo();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Map form data to database fields
      const dbData = {
        company_name: formData.company_name,
        contact_person: formData.contact_person,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.phone, // Use phone as whatsapp
        software_type: formData.software_type,
        message: formData.message,
        status: 'new'
      };

      const { error } = await supabase
        .from('trial_requests')
        .insert(dbData);

      if (error) {
        console.error('Error submitting trial request:', error);
        toast({
          title: "خطأ في الإرسال",
          description: "حدث خطأ أثناء إرسال طلب التجربة. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
        return;
      }

      // Send email notification
      try {
        await supabase.functions.invoke("send-notification-email", {
          body: {
            to: contactInfo.email,
            subject: "طلب تجربة جديد",
            requestType: "trial",
            requestDetails: formData
          }
        });
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
      }

      setFormData({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        software_type: '',
        message: ''
      });
      
      onClose();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال طلب التجربة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-blue-100">
          <DialogHeader className="text-right">
            <DialogTitle className="text-2xl font-bold text-trndsky-darkblue font-tajawal flex items-center justify-center gap-2">
              🚀 طلب تجربة البرمجية
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-4" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name" className="text-right font-tajawal font-bold text-trndsky-darkblue">
                  🏢 اسم الشركة
                </Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                  className="mt-2 text-right font-tajawal rounded-xl border-2 border-gray-200 focus:border-trndsky-blue"
                  placeholder="أدخل اسم الشركة"
                />
              </div>
              
              <div>
                <Label htmlFor="contact_person" className="text-right font-tajawal font-bold text-trndsky-darkblue">
                  👤 اسم الشخص المسؤول
                </Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  required
                  className="mt-2 text-right font-tajawal rounded-xl border-2 border-gray-200 focus:border-trndsky-blue"
                  placeholder="أدخل اسم الشخص المسؤول"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-right font-tajawal font-bold text-trndsky-darkblue">
                  📧 البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-2 text-right font-tajawal rounded-xl border-2 border-gray-200 focus:border-trndsky-blue"
                  placeholder="example@company.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-right font-tajawal font-bold text-trndsky-darkblue">
                  📱 رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-2 text-right font-tajawal rounded-xl border-2 border-gray-200 focus:border-trndsky-blue"
                  placeholder="05xxxxxxxx"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="software_type" className="text-right font-tajawal font-bold text-trndsky-darkblue">
                💻 نوع البرمجية المطلوبة
              </Label>
              <Input
                id="software_type"
                name="software_type"
                value={formData.software_type}
                onChange={handleInputChange}
                required
                className="mt-2 text-right font-tajawal rounded-xl border-2 border-gray-200 focus:border-trndsky-blue"
                placeholder="مثل: نظام إدارة المخازن، نظام نقاط البيع، إلخ"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-right font-tajawal font-bold text-trndsky-darkblue">
                💬 تفاصيل إضافية
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="mt-2 text-right font-tajawal rounded-xl border-2 border-gray-200 focus:border-trndsky-blue min-h-[100px]"
                placeholder="أي تفاصيل إضافية تود إضافتها..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-trndsky-teal to-trndsky-blue hover:from-trndsky-blue hover:to-trndsky-darkblue text-white font-tajawal font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] text-lg"
            >
              <Send className="w-5 h-5 ml-2" />
              {isSubmitting ? "⏳ جاري الإرسال..." : "🚀 إرسال طلب التجربة"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* مودال نجاح الإرسال */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-3 font-tajawal">تم الإرسال بنجاح!</h3>
              <p className="text-gray-600 mb-6 font-tajawal text-lg leading-relaxed">
                تم إرسال طلب التجربة بنجاح! سنتواصل معكم قريباً لترتيب موعد العرض التوضيحي.
              </p>
              <Button 
                onClick={() => setShowSuccessModal(false)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-tajawal font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrialRequestForm;
