
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: "دعم فني متواصل",
    description: "فريقنا مستعد دائمًا لدعمك وتطوير مشاريعك على مدار الساعة وبأحدث التقنيات.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2920&q=80",
  },
  {
    id: 2,
    title: "حلول تقنية متكاملة",
    description: "نقدم خدمات برمجية شاملة من التصميم إلى التطوير والصيانة",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2915&q=80",
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#f1f5ff] to-[#e4eaff]">
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`text-center transition-all duration-700 ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ display: index === currentSlide ? 'block' : 'none' }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-trndsky-darkblue font-tajawal leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 font-tajawal max-w-2xl mx-auto">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/contact"
                    className="px-8 py-4 bg-trndsky-blue hover:bg-trndsky-darkblue text-white rounded-full 
                      font-tajawal text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    تواصل معنا
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-trndsky-blue w-8' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] bg-[length:20px_20px] opacity-25"></div>
    </div>
  );
};

export default HeroSlider;
