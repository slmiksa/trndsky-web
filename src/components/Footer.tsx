
import { ContactDetails } from '@/components/ContactDetails';

const Footer = () => {
  return (
    <footer className="bg-trndsky-darkblue text-white py-8 mt-auto">
      <div className="container mx-auto">
        <ContactDetails variant="footer" />
        <div className="text-center mt-8">
          <div className="text-xl font-bold mb-4">
            <span className="text-trndsky-teal">TRND</span>SKY
          </div>
          <p className="font-tajawal">© {new Date().getFullYear()} TRNDSKY. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
