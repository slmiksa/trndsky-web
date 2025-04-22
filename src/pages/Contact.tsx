
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    location: "",
    working_days: "الأحد - الخميس",
    closed_days: "الجمعة - السبت",
    working_hours_start: "9:00 صباحًا",
    working_hours_end: "5:00 مساءً"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .single();
        
        if (error) {
          console.error("Error fetching contact info:", error);
          return;
        }
        
        if (data) {
          setContactInfo(data);
        }
      } catch (error) {
        console.error("Error in contact info fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const contactDetails = [
    {
      icon: <Mail className="h-8 w-8 text-trndsky-teal" />,
      title: "البريد الإلكتروني",
      details: contactInfo.email || "info@trndsky.com",
      link: `mailto:${contactInfo.email || "info@trndsky.com"}`
    },
    {
      icon: <Phone className="h-8 w-8 text-trndsky-teal" />,
      title: "رقم الهاتف",
      details: contactInfo.phone || "+966 12 345 6789",
      link: `tel:${(contactInfo.phone || "+966 12 345 6789").replace(/\s+/g, '')}`
    },
    {
      icon: <MapPin className="h-8 w-8 text-trndsky-teal" />,
      title: "الموقع",
      details: contactInfo.location || "الرياض، المملكة العربية السعودية",
      link: "#"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-trndsky-blue text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 font-tajawal">تواصل معنا</h1>
          <p className="text-xl text-center max-w-3xl mx-auto font-tajawal">
            نحن هنا للإجابة على استفساراتكم ومساعدتكم في تحقيق أهدافكم الرقمية
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {contactDetails.map((info, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center card-hover">
                <div className="flex justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 font-tajawal">{info.title}</h3>
                <a 
                  href={info.link} 
                  className="text-gray-700 hover:text-trndsky-teal transition-colors font-tajawal"
                >
                  {info.details}
                </a>
              </div>
            ))}
          </div>
          
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
              <h2 className="text-3xl font-bold mb-6 text-trndsky-darkblue font-tajawal">
                موقعنا
              </h2>
              <div className="rounded-lg overflow-hidden shadow-lg h-[400px] mb-8">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.674457331385!2d46.675331711233605!3d24.7135517774737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f1df57e6dc5a3%3A0x1d108112e5d6fcba!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1682915877158!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TRNDSKY Location"
                ></iframe>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md font-tajawal text-right">
                <h3 className="text-xl font-bold mb-3">ساعات العمل</h3>
                <div className="space-y-2 text-gray-700">
                  {loading ? (
                    <p>جاري التحميل...</p>
                  ) : (
                    <>
                      <p>{contactInfo.working_days || "الأحد - الخميس"}: {contactInfo.working_hours_start || "9:00 صباحًا"} - {contactInfo.working_hours_end || "5:00 مساءً"}</p>
                      <p>{contactInfo.closed_days || "الجمعة - السبت"}: مغلق</p>
                    </>
                  )}
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
    </div>
  );
};

export default Contact;
