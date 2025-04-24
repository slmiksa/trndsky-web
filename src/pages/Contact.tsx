import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import { ContactDetails } from '@/components/ContactDetails';
import { useContactInfo } from '@/hooks/useContactInfo';
const Contact = () => {
  const {
    contactInfo,
    loading
  } = useContactInfo();
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-trndsky-darkblue text-white">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-trndsky-darkblue font-tajawal">
                أرسل لنا <span className="text-trndsky-teal">رسالة</span>
              </h2>
              <p className="text-gray-700 mb-8 font-tajawal text-right">
                نحن دائمًا سعداء بالتواصل معكم والإجابة على استفساراتكم. يمكنكم ملء النموذج التالي وسنقوم بالرد عليكم في أقرب وقت ممكن.
              </p>
              <ContactForm />
            </div>
            
            <div>
              
              <div className="bg-white p-6 rounded-lg shadow-md font-tajawal text-right">
                <h3 className="text-xl font-bold mb-3">ساعات العمل</h3>
                <div className="space-y-2 text-gray-700">
                  {loading ? <p>جاري التحميل...</p> : <>
                      <p>{contactInfo.working_days}: {contactInfo.working_hours_start} - {contactInfo.working_hours_end}</p>
                      <p>{contactInfo.closed_days}: مغلق</p>
                    </>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-trndsky-darkblue text-white py-8">
        <div className="container mx-auto text-center">
          <div className="text-xl font-bold mb-4">
            <span className="text-trndsky-teal">TRND</span>SKY
          </div>
          <p className="font-tajawal">© {new Date().getFullYear()} TRNDSKY. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>;
};
export default Contact;