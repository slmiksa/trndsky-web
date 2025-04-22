
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import TechIcons from '../components/TechIcons';
import ProjectRequestForm from '../components/ProjectRequestForm';
import { FeaturedSoftware } from '../components/SoftwareCard';
import PartnersSection from '../components/PartnersSection';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ensure animation is only triggered after component has mounted
    setIsVisible(true);

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
        
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              <span className="text-trndsky-darkblue">خدماتنا </span>
              <span className="text-[#10B9B3]">البرمجية</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="text-[#10B9B3] p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-trndsky-blue font-tajawal">تطوير مخصص</h3>
                <p className="text-gray-600 font-tajawal">برمجة حلول مخصصة تلبي احتياجات عملك بالضبط</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="text-[#10B9B3] p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-trndsky-blue font-tajawal">تطبيقات الويب</h3>
                <p className="text-gray-600 font-tajawal">تطوير مواقع وتطبيقات ويب متجاوبة وسريعة</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="text-[#10B9B3] p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-trndsky-blue font-tajawal">حلول متكاملة</h3>
                <p className="text-gray-600 font-tajawal">خدمات شاملة من التصميم إلى الاستضافة والصيانة</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="text-[#10B9B3] p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-trndsky-blue font-tajawal">تسليم سريع</h3>
                <p className="text-gray-600 font-tajawal">التزام بمواعيد التسليم مع جودة عالية</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="text-[#10B9B3] p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-trndsky-blue font-tajawal">خبرة واسعة</h3>
                <p className="text-gray-600 font-tajawal">فريق من المطورين ذوي خبرة في مختلف التقنيات</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-trndsky-darkblue">طلب مشروع</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">نحن هنا لمساعدتك في تطوير مشروعك التقني. أخبرنا عن فكرتك وسنتواصل معك في أقرب وقت ممكن.</p>
              <div className="w-24 h-1 bg-trndsky-teal mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
              <ProjectRequestForm />
            </div>
          </div>
        </section>
        
        <section className="section-padding bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-trndsky-darkblue">برمجياتنا المميزة</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">مجموعة من أحدث الحلول البرمجية المُصممة خصيصاً لتلبية احتياجات عملائنا</p>
              <div className="w-24 h-1 bg-trndsky-teal mx-auto mt-4 rounded-full"></div>
            </div>
            <FeaturedSoftware />
          </div>
        </section>
        
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-trndsky-darkblue">شركاؤنا</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">نفتخر بالتعاون مع أفضل الشركات والمؤسسات في مختلف المجالات</p>
              <div className="w-24 h-1 bg-trndsky-teal mx-auto mt-4 rounded-full"></div>
            </div>
            <PartnersSection />
          </div>
        </section>
      </main>
      
      {/* Remove the duplicate footer content from here */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-trndsky-blue text-white p-3 rounded-full shadow-lg hover:bg-trndsky-darkblue transition-all duration-300 z-50 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>
    </div>
  );
};

export default Index;
