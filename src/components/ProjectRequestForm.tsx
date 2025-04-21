
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
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      title: '',
      description: '',
    });
  };

  return (
    <section className="section-padding bg-trndsky-gray">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 font-tajawal text-trndsky-blue">
            اطلب برمجة <span className="text-trndsky-teal">بأفكارك</span>
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-lg font-medium text-right font-tajawal">
                  الاسم الثنائي / اسم الشركة
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
                <label htmlFor="contact" className="block text-lg font-medium text-right font-tajawal">
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
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal"
                    dir="rtl"
                  />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="رقم الهاتف"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="title" className="block text-lg font-medium text-right font-tajawal">
                عنوان الفكرة
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal"
                dir="rtl"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-lg font-medium text-right font-tajawal">
                شرح الفكرة
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trndsky-teal resize-none"
                dir="rtl"
              ></textarea>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn-primary py-3 px-8 text-lg font-tajawal"
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
