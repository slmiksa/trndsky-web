
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
      
      <footer className="bg-trndsky-darkblue text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-trndsky-teal">TRND</span>SKY
              </div>
              <p className="font-tajawal text-gray-300 mb-4">شريكك في التحول الرقمي وتطوير الحلول التقنية المبتكرة</p>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <a href="#" className="text-white hover:text-trndsky-teal transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </a>
                <a href="#" className="text-white hover:text-trndsky-teal transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a href="#" className="text-white hover:text-trndsky-teal transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.045-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 font-tajawal">روابط سريعة</h3>
              <ul className="space-y-3 font-tajawal">
                <li><a href="/" className="text-gray-300 hover:text-trndsky-teal transition-colors">الرئيسية</a></li>
                <li><a href="/software" className="text-gray-300 hover:text-trndsky-teal transition-colors">البرمجيات الجاهزة</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-trndsky-teal transition-colors">من نحن</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-trndsky-teal transition-colors">تواصل معنا</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 font-tajawal">اتصل بنا</h3>
              <ul className="space-y-3 font-tajawal">
                <li className="flex items-center">
                  <svg className="w-5 h-5 ml-3 text-trndsky-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span className="text-gray-300">info@trndsky.com</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 ml-3 text-trndsky-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <span className="text-gray-300">+966 123 456 789</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 ml-3 text-trndsky-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span className="text-gray-300">المملكة العربية السعودية، الرياض</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-700 text-center">
            <p className="font-tajawal">© {new Date().getFullYear()} TRNDSKY. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
      
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
