
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white overflow-hidden">
      {/* Top section with gradient border */}
      <div className="h-1 bg-gradient-to-r from-trndsky-blue via-trndsky-teal to-trndsky-blue"></div>
      
      {/* Wave separator */}
      <div className="relative h-16">
        <svg className="absolute bottom-0 left-0 w-full" 
          viewBox="0 0 1440 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 58L48 52C96 46 192 34 288 35.3C384 36.7 480 50.3 576 55.3C672 60.3 768 56.7 864 53.3C960 50 1056 47 1152 48.3C1248 49.7 1344 55.3 1392 58L1440 60.7V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V58Z" 
          fill="#1A1A1A"/>
        </svg>
      </div>
      
      <div className="bg-[#1A1A1A] pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="text-right md:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                <span className="bg-gradient-to-r from-trndsky-teal to-trndsky-blue bg-clip-text text-transparent">
                  TRNDSKY
                </span>
              </h2>
              <p className="text-gray-400 mb-8 font-tajawal text-lg leading-relaxed">
                شريكك في التحول الرقمي وتطوير الحلول التقنية المبتكرة. نعمل على تقديم خدمات تقنية متميزة بأعلى معايير الجودة لعملائنا في مختلف القطاعات.
              </p>
              <div className="flex gap-4 justify-end">
                <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} />
                <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} />
                <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} />
                <SocialLink href="#" icon={<Linkedin className="h-4 w-4" />} />
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-right">
              <h3 className="text-xl font-bold mb-6 font-tajawal text-white">روابط سريعة</h3>
              <ul className="space-y-4 font-tajawal">
                <FooterLink to="/">الرئيسية</FooterLink>
                <FooterLink to="/software">البرمجيات الجاهزة</FooterLink>
                <FooterLink to="/about">من نحن</FooterLink>
                <FooterLink to="/contact">تواصل معنا</FooterLink>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-right">
              <h3 className="text-xl font-bold mb-6 font-tajawal text-white">اتصل بنا</h3>
              <div className="space-y-4 font-tajawal">
                <ContactLink href="mailto:info@trndsky.com" icon={<Mail className="h-4 w-4" />}>
                  info@trndsky.com
                </ContactLink>
                <ContactLink href="tel:+966789456123" icon={<Phone className="h-4 w-4" />}>
                  <span dir="ltr">789 456 123 966+</span>
                </ContactLink>
                <ContactLink href="#" icon={<MapPin className="h-4 w-4" />}>
                  المملكة العربية السعودية، الرياض
                </ContactLink>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800">
            <div className="text-center">
              <p className="text-gray-500 font-tajawal">
                © {new Date().getFullYear()} TRNDSKY. جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a 
    href={href} 
    className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 text-gray-400 
    hover:bg-gradient-to-r hover:from-trndsky-teal hover:to-trndsky-blue hover:text-white 
    transition-all duration-300"
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li>
    <Link 
      to={to} 
      className="inline-block text-gray-400 hover:text-trndsky-teal transition-all duration-300 
      relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:right-0 
      after:bg-gradient-to-r after:from-trndsky-teal after:to-trndsky-blue after:transition-all 
      after:duration-300 hover:after:w-full"
    >
      {children}
    </Link>
  </li>
);

const ContactLink = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <a 
    href={href}
    className="flex items-center justify-end gap-3 text-gray-400 hover:text-trndsky-teal transition-all duration-300 group"
  >
    <span>{children}</span>
    <span className="p-2 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-all duration-300">
      {icon}
    </span>
  </a>
);

export default Footer;
