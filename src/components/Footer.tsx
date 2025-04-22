
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-trndsky-darkblue to-black opacity-95 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-48bce0dae167?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2029&q=80')] bg-cover bg-center opacity-5"></div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="text-right md:col-span-2">
            <h2 className="text-3xl font-bold mb-6">
              <span className="text-trndsky-teal">TRND</span>
              <span className="text-white">SKY</span>
            </h2>
            <p className="text-gray-300 mb-8 font-tajawal text-lg leading-relaxed">
              شريكك في التحول الرقمي وتطوير الحلول التقنية المبتكرة. نعمل على تقديم خدمات تقنية متميزة بأعلى معايير الجودة لعملائنا في مختلف القطاعات.
            </p>
            <div className="flex gap-4 justify-end">
              <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-right">
            <h3 className="text-xl font-bold mb-6 font-tajawal text-white">روابط سريعة</h3>
            <ul className="space-y-3 font-tajawal">
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
              <ContactLink href="mailto:info@trndsky.com" icon={<Mail className="h-5 w-5" />}>
                info@trndsky.com
              </ContactLink>
              <ContactLink href="tel:+966789456123" icon={<Phone className="h-5 w-5" />}>
                <span dir="ltr">789 456 123 966+</span>
              </ContactLink>
              <ContactLink href="#" icon={<MapPin className="h-5 w-5" />}>
                المملكة العربية السعودية، الرياض
              </ContactLink>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent my-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 font-tajawal">
            © {new Date().getFullYear()} TRNDSKY. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-gray-300 hover:bg-trndsky-teal hover:text-white transition-all duration-300"
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
      className="inline-block text-gray-300 hover:text-trndsky-teal transition-colors relative py-1 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:right-0 after:bg-trndsky-teal after:transition-all hover:after:w-full"
    >
      {children}
    </Link>
  </li>
);

const ContactLink = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <a 
    href={href}
    className="flex items-center justify-end gap-3 text-gray-300 hover:text-trndsky-teal transition-colors group"
  >
    <span>{children}</span>
    <span className="bg-white/10 p-2 rounded-full group-hover:bg-trndsky-teal/20 transition-all">
      {icon}
    </span>
  </a>
);

export default Footer;
