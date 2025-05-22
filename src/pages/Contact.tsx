
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import { ContactDetails } from '@/components/ContactDetails';
import { useContactInfo } from '@/hooks/useContactInfo';
import { Toaster } from '@/components/ui/toaster';
import Footer from '../components/Footer';

const Contact = () => {
  const {
    contactInfo,
    loading
  } = useContactInfo();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-gradient-to-r from-trndsky-blue to-trndsky-darkblue text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 font-tajawal">تواصل معنا</h1>
          <p className="text-xl text-center max-w-3xl mx-auto font-tajawal">
            نحن هنا للإجابة على استفساراتكم ومساعدتكم في تحقيق أهدافكم الرقمية
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <ContactDetails variant="card" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            <div>
              <ContactForm />
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md font-tajawal text-right">
                <h3 className="text-xl font-bold mb-3 text-trndsky-blue">ساعات العمل</h3>
                <div className="space-y-2 text-gray-700">
                  {loading ? (
                    <p>جاري التحميل...</p>
                  ) : (
                    <>
                      <p>{contactInfo.working_days}: {contactInfo.working_hours_start} - {contactInfo.working_hours_end}</p>
                      <p>{contactInfo.closed_days}: مغلق</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default Contact;
