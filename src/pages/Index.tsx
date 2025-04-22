
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import TechIcons from '../components/TechIcons';
import ProjectRequestForm from '../components/ProjectRequestForm';
import { FeaturedSoftware } from '../components/SoftwareCard';
import PartnersSection from '../components/PartnersSection';
import { ArrowUp } from 'lucide-react';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    // Ensure animation is only triggered after component has mounted
    setIsVisible(true);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    const animatableElements = document.querySelectorAll('.animate-on-scroll');
    animatableElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      animatableElements.forEach((el) => {
        observer.unobserve(el);
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="min-h-screen flex flex-col custom-scrollbar">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSlider />
        
        {/* Services Section - New Design */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#e0e7ef_1px,transparent_1px)] bg-[length:20px_20px] opacity-50"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-trndsky-blue/10 text-trndsky-blue mb-4">خدماتنا</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-trndsky-darkblue to-trndsky-blue bg-clip-text text-transparent">
                خدماتنا البرمجية
              </h2>
              <div className="w-24 h-1 mx-auto bg-gradient-to-r from-trndsky-teal to-trndsky-blue rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Project Request Section - New Design */}
        <section className="py-24 relative bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,61,145,0.03)_0%,rgba(16,185,179,0.03)_100%)]"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-trndsky-blue/10 text-trndsky-blue mb-4">مشروع جديد</span>
              <h2 className="text-4xl font-bold mb-4 text-trndsky-darkblue">طلب مشروع</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">نحن هنا لمساعدتك في تطوير مشروعك التقني. أخبرنا عن فكرتك وسنتواصل معك في أقرب وقت ممكن.</p>
              <div className="w-24 h-1 mx-auto bg-gradient-to-r from-trndsky-teal to-trndsky-blue mt-4 rounded-full"></div>
            </div>
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <ProjectRequestForm />
            </div>
          </div>
        </section>
        
        {/* Featured Software Section - New Design */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e0e7ef_1px,transparent_1px)] bg-[length:20px_20px] opacity-50"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-trndsky-blue/10 text-trndsky-blue mb-4">برمجياتنا</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-trndsky-darkblue to-trndsky-blue bg-clip-text text-transparent">
                برمجياتنا المميزة
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">مجموعة من أحدث الحلول البرمجية المُصممة خصيصاً لتلبية احتياجات عملائنا</p>
              <div className="w-24 h-1 mx-auto bg-gradient-to-r from-trndsky-teal to-trndsky-blue rounded-full mt-4"></div>
            </div>
            <FeaturedSoftware />
          </div>
        </section>
        
        {/* Partners Section - New Design */}
        <section className="py-24 relative bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,61,145,0.03)_0%,rgba(16,185,179,0.03)_100%)]"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-trndsky-blue/10 text-trndsky-blue mb-4">شركاؤنا</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-trndsky-darkblue to-trndsky-blue bg-clip-text text-transparent">
                شركاؤنا
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">نفتخر بالتعاون مع أفضل الشركات والمؤسسات في مختلف المجالات</p>
              <div className="w-24 h-1 mx-auto bg-gradient-to-r from-trndsky-teal to-trndsky-blue rounded-full mt-4"></div>
            </div>
            <PartnersSection />
          </div>
        </section>
      </main>
      
      {/* Scroll to top button - Enhanced */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-gradient-to-r from-trndsky-teal to-trndsky-blue text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50 ${
          showScrollButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

// Service card component
const ServiceCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
    <div className="flex justify-center mb-6">
      <div className="text-trndsky-teal bg-gradient-to-br from-trndsky-blue/10 to-trndsky-teal/5 p-4 rounded-2xl group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold mb-4 text-trndsky-blue font-tajawal text-center">{title}</h3>
    <p className="text-gray-600 font-tajawal text-center">{description}</p>
  </div>
);

// Services data
const services = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    title: "تطوير مخصص",
    description: "برمجة حلول مخصصة تلبي احتياجات عملك بالضبط مع مراعاة أعلى معايير الجودة والأمان"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "تطبيقات الويب",
    description: "تصميم وتطوير مواقع وتطبيقات ويب متجاوبة وسريعة تعمل على جميع الأجهزة بكفاءة عالية"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "حلول متكاملة",
    description: "خدمات شاملة من التصميم إلى الاستضافة والصيانة مع دعم فني متواصل ومتابعة مستمرة"
  }
];

export default Index;
