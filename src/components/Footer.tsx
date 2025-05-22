
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useContactInfo } from '../hooks/useContactInfo';

const Footer = () => {
  const { contactInfo, loading } = useContactInfo();

  return (
    <footer className="bg-gradient-to-br from-trndsky-blue to-trndsky-darkblue text-white pt-20 pb-8 font-tajawal">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo and Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img 
                src="/lovable-uploads/494b749b-6590-48df-b844-3fd9b22b299f.png" 
                alt="TRNDSKY Logo" 
                className="h-20 rounded-lg hover-lift" 
              />
            </Link>
            <p className="text-blue-100 mt-4 text-sm leading-relaxed">
              نقدم خدمات برمجية احترافية وحلول تقنية متكاملة بأعلى معايير الجودة لتلبية احتياجات عملائنا وتطوير أعمالهم
            </p>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors hover:scale-110 duration-300">
                <Facebook size={18} className="text-trndsky-yellow" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors hover:scale-110 duration-300">
                <Twitter size={18} className="text-trndsky-yellow" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors hover:scale-110 duration-300">
                <Instagram size={18} className="text-trndsky-yellow" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              روابط سريعة
              <span className="absolute -bottom-1 right-0 w-12 h-1 bg-trndsky-yellow rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-blue-100 hover:text-white transition-colors inline-block gradient-underline">الرئيسية</Link>
              </li>
              <li>
                <Link to="/software" className="text-blue-100 hover:text-white transition-colors inline-block gradient-underline">البرمجيات الجاهزة</Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-100 hover:text-white transition-colors inline-block gradient-underline">من نحن</Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-100 hover:text-white transition-colors inline-block gradient-underline">تواصل معنا</Link>
              </li>
              <li>
                <Link to="/partners" className="text-blue-100 hover:text-white transition-colors inline-block gradient-underline">شركاء النجاح</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              خدماتنا
              <span className="absolute -bottom-1 right-0 w-12 h-1 bg-trndsky-yellow rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-trndsky-red"></span>
                تطوير تطبيقات الويب
              </li>
              <li className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-trndsky-red"></span>
                تطوير تطبيقات الجوال
              </li>
              <li className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-trndsky-red"></span>
                تصميم واجهات المستخدم
              </li>
              <li className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-trndsky-red"></span>
                الاستضافة السحابية
              </li>
              <li className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-trndsky-red"></span>
                الحلول البرمجية المخصصة
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              معلومات التواصل
              <span className="absolute -bottom-1 right-0 w-12 h-1 bg-trndsky-yellow rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {!loading && contactInfo ? (
                <>
                  <li className="flex items-center gap-3 text-blue-100 hover:text-white transition-all hover-lift">
                    <div className="bg-white/10 p-2 rounded-full">
                      <Mail size={18} className="text-trndsky-yellow flex-shrink-0" />
                    </div>
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-trndsky-yellow transition-colors">
                      {contactInfo.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-blue-100 hover:text-white transition-all hover-lift">
                    <div className="bg-white/10 p-2 rounded-full">
                      <Phone size={18} className="text-trndsky-yellow flex-shrink-0" />
                    </div>
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-trndsky-yellow transition-colors">
                      {contactInfo.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-blue-100 hover:text-white transition-all hover-lift">
                    <div className="bg-white/10 p-2 rounded-full mt-1">
                      <MapPin size={18} className="text-trndsky-yellow flex-shrink-0" />
                    </div>
                    <span>{contactInfo.location}</span>
                  </li>
                </>
              ) : (
                <li>جاري تحميل معلومات التواصل...</li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-16 pt-8 text-center text-blue-200 text-sm">
          <p>© {new Date().getFullYear()} TRNDSKY. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
