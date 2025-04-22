
import { Mail, MapPin, Phone } from 'lucide-react';
import { useContactInfo } from '@/hooks/useContactInfo';

export function ContactDetails({ variant = 'footer' }: { variant?: 'footer' | 'card' }) {
  const { contactInfo } = useContactInfo();

  const details = [
    {
      icon: <Mail className={variant === 'footer' ? "h-6 w-6 text-white" : "h-8 w-8 text-trndsky-teal"} />,
      title: "البريد الإلكتروني",
      details: contactInfo.email || "info@trndsky.com",
      link: `mailto:${contactInfo.email || "info@trndsky.com"}`
    },
    {
      icon: <Phone className={variant === 'footer' ? "h-6 w-6 text-white" : "h-8 w-8 text-trndsky-teal"} />,
      title: "رقم الهاتف",
      details: contactInfo.phone || "+966 12 345 6789",
      link: `tel:${(contactInfo.phone || "+966 12 345 6789").replace(/\s+/g, '')}`
    },
    {
      icon: <MapPin className={variant === 'footer' ? "h-6 w-6 text-white" : "h-8 w-8 text-trndsky-teal"} />,
      title: "الموقع",
      details: contactInfo.location || "الرياض، المملكة العربية السعودية",
      link: "#"
    },
  ];

  if (variant === 'footer') {
    return (
      <div className="text-center space-y-4">
        {details.map((info, index) => (
          <a 
            key={index}
            href={info.link}
            className="flex flex-col items-center text-white hover:text-gray-300 transition-colors"
          >
            {info.icon}
            <span className="mt-2 text-sm font-tajawal">{info.details}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
      {details.map((info, index) => (
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
  );
}
