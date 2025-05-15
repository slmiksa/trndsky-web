
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useContactInfo } from '../hooks/useContactInfo';

const Footer = () => {
  const { contactInfo, loading } = useContactInfo();

  return (
    <footer className="bg-gradient-to-br from-trndsky-darkblue to-gray-900 text-white pt-20 pb-8 font-tajawal">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo and Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img 
                src="/lovable-uploads/d478d2a6-fe65-491d-b0eb-5beeace8f5ae.png" 
                alt="TRNDSKY Logo" 
                className="h-12" 
              />
            </Link>
            <p className="text-gray-300 mt-4 text-sm leading-relaxed">
              نقدم خدمات برمجية احترافية وحلول تقنية متكاملة بأعلى معايير الجودة لتلبية احتياجات عملائنا وتطوير أعمالهم
            </p>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              روابط سريعة
              <span className="absolute -bottom-1 right-0 w-12 h-1 bg-trndsky-blue rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors inline-block">الرئيسية</Link>
              </li>
              <li>
                <Link to="/software" className="text-gray-300 hover:text-white transition-colors inline-block">البرمجيات الجاهزة</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors inline-block">من نحن</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors inline-block">تواصل معنا</Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-300 hover:text-white transition-colors inline-block">شركاء النجاح</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              خدماتنا
              <span className="absolute -bottom-1 right-0 w-12 h-1 bg-trndsky-blue rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li className="text-gray-300 hover:text-white transition-colors">تطوير تطبيقات الويب</li>
              <li className="text-gray-300 hover:text-white transition-colors">تطوير تطبيقات الجوال</li>
              <li className="text-gray-300 hover:text-white transition-colors">تصميم واجهات المستخدم</li>
              <li className="text-gray-300 hover:text-white transition-colors">الاستضافة السحابية</li>
              <li className="text-gray-300 hover:text-white transition-colors">الحلول البرمجية المخصصة</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              معلومات التواصل
              <span className="absolute -bottom-1 right-0 w-12 h-1 bg-trndsky-blue rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {!loading && contactInfo ? (
                <>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Mail size={18} className="text-trndsky-blue flex-shrink-0" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                      {contactInfo.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Phone size={18} className="text-trndsky-blue flex-shrink-0" />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                      {contactInfo.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <MapPin size={18} className="text-trndsky-blue flex-shrink-0 mt-1" />
                    <span>{contactInfo.address}</span>
                  </li>
                </>
              ) : (
                <li>جاري تحميل معلومات التواصل...</li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-16 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} TRNDSKY. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
