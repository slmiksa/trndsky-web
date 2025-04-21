
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const ProjectRequestForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    toast({
      title: "تم استلام طلبك",
      description: "سنتواصل معك قريباً لمناقشة تفاصيل المشروع",
      duration: 5000,
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      title: '',
      description: '',
    });
  };

  return (
    <section className="section-padding bg-white relative">
      {/* Background circles */}
      <div className="absolute -top-24 -left-20 w-60 h-60 rounded-full bg-trndsky-teal/10 z-0"></div>
      <div className="absolute -bottom-14 -right-24 w-72 h-72 rounded-full bg-trndsky-blue/10 z-0"></div>
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#f5f7fa] via-white to-[#e0f7fa] rounded-3xl shadow-2xl p-10 border border-trndsky-blue/10">
          <h2 className="text-4xl font-extrabold text-center mb-8 font-tajawal text-trndsky-blue drop-shadow-md">
            اطلب برمجة <span className="text-trndsky-teal">بأفكارك</span>
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-lg font-bold text-right font-tajawal text-trndsky-darkblue">
                  الاسم الثنائي / اسم الشركة
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal bg-white shadow-sm text-lg font-tajawal"
                  dir="rtl"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contact" className="block text-lg font-bold text-right font-tajawal text-trndsky-darkblue">
                  البريد الإلكتروني / رقم التواصل
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="البريد الإلكتروني"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal bg-white shadow-sm text-lg font-tajawal"
                    dir="rtl"
                  />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="رقم الهاتف"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal bg-white shadow-sm text-lg font-tajawal"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="title" className="block text-lg font-bold text-right font-tajawal text-trndsky-darkblue">
                عنوان الفكرة
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal bg-white shadow-sm text-lg font-tajawal"
                dir="rtl"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-lg font-bold text-right font-tajawal text-trndsky-darkblue">
                شرح الفكرة
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal bg-white shadow-sm text-lg font-tajawal resize-none"
                dir="rtl"
              ></textarea>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gradient-to-l from-trndsky-teal to-trndsky-blue hover:from-trndsky-blue hover:to-trndsky-teal text-white py-3 px-12 rounded-full shadow-lg text-xl font-tajawal tracking-widest transition-all hover:scale-105"
              >
                إرسال الطلب
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProjectRequestForm;
