
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Send email notification with correct requestType "contact" 
      const response = await supabase.functions.invoke("send-notification-email", {
        body: {
          subject: `رسالة جديدة من ${formData.name}`,
          requestType: "contact",
          requestDetails: {
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            subject: formData.subject,
            message: formData.message,
          }
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast({
        title: "تم إرسال رسالتك",
        description: "سنقوم بالرد عليك في أقرب وقت ممكن",
        duration: 5000,
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال رسالتك، يرجى المحاولة مرة أخرى",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-lg font-medium text-right font-tajawal">
            الاسم
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal"
            dir="rtl"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-lg font-medium text-right font-tajawal">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal"
            dir="rtl"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-lg font-medium text-right font-tajawal">
            رقم الهاتف
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal"
            dir="rtl"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="subject" className="block text-lg font-medium text-right font-tajawal">
            الموضوع
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal"
            dir="rtl"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="block text-lg font-medium text-right font-tajawal">
          الرسالة
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal resize-none"
          dir="rtl"
        ></textarea>
      </div>
      
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={loading}
          className="py-3 px-8 text-lg font-tajawal"
          variant="default"
          size="lg"
        >
          {loading ? "جاري الإرسال..." : "إرسال"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
