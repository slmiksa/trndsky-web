
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-trndsky-darkblue text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-right">
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-trndsky-teal">TRND</span>SKY
            </h2>
            <p className="text-gray-300 mb-4 font-tajawal">
              شريكك في التحول الرقمي وتطوير الحلول التقنية المبتكرة
            </p>
            <div className="flex gap-4 justify-end">
              <Link to="#" className="hover:text-trndsky-teal transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="hover:text-trndsky-teal transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="hover:text-trndsky-teal transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-right">
            <h3 className="text-xl font-bold mb-4 font-tajawal">روابط سريعة</h3>
            <ul className="space-y-2 font-tajawal">
              <li>
                <Link to="/" className="hover:text-trndsky-teal transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/software" className="hover:text-trndsky-teal transition-colors">
                  البرمجيات الجاهزة
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-trndsky-teal transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-trndsky-teal transition-colors">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-right">
            <h3 className="text-xl font-bold mb-4 font-tajawal">اتصل بنا</h3>
            <div className="space-y-3 font-tajawal">
              <a 
                href="mailto:info@trndsky.com" 
                className="flex items-center justify-end gap-2 hover:text-trndsky-teal transition-colors"
              >
                <span>info@trndsky.com</span>
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="tel:+966789456123" 
                className="flex items-center justify-end gap-2 hover:text-trndsky-teal transition-colors"
              >
                <span dir="ltr">789 456 123 966+</span>
                <Phone className="h-5 w-5" />
              </a>
              <div className="flex items-center justify-end gap-2">
                <span>المملكة العربية السعودية، الرياض</span>
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-700">
          <p className="text-gray-400 font-tajawal">
            © {new Date().getFullYear()} TRNDSKY. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
