
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "برمجيات احترافية",
    subtitle: "حلول تقنية متكاملة لمشاريعك",
    description: "نقدم خدمات برمجية متكاملة بأحدث التقنيات وأفضل الممارسات العالمية",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
  },
  {
    id: 2,
    title: "تطوير المواقع والتطبيقات",
    subtitle: "برمجة الويب بأحدث التقنيات",
    description: "تصميم وتطوير مواقع وتطبيقات ويب متجاوبة وعالية الأداء",
    image: "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 3,
    title: "حلول ذكاء اصطناعي",
    subtitle: "الابتكار التقني للمستقبل",
    description: "تطبيقات ذكاء اصطناعي متطورة لتحسين أداء وكفاءة أعمالك",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <div className="relative h-[85vh] overflow-hidden bg-gradient-to-br from-[#F5F7FA] via-[#e0e7ef] to-trndsky-blue">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
      
      <div className="absolute inset-0">
        <div className="h-full w-full bg-gradient-to-b from-trndsky-blue/50 via-trndsky-blue/30 to-transparent"></div>
        <div className="h-full w-full bg-[linear-gradient(135deg,rgba(11,61,145,0.1)_0%,rgba(16,185,179,0.1)_100%)] backdrop-blur-[1px]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10 transform scale-100' : 'opacity-0 z-0 transform scale-110'
          }`}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
            <div className={`max-w-5xl mx-auto px-6 transform transition-all duration-700 delay-300 ${
              index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <span className="inline-block text-xs md:text-sm font-medium px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-trndsky-teal mb-4">TRNDSKY</span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 font-tajawal drop-shadow-sm text-white">{slide.title}</h2>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-trndsky-teal font-tajawal">{slide.subtitle}</h3>
              <p className="max-w-2xl mx-auto text-lg md:text-xl font-tajawal text-white/90 bg-black/10 rounded-xl px-6 py-3 backdrop-blur-sm">{slide.description}</p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-gradient-to-r from-trndsky-teal to-trndsky-blue shadow-lg shadow-trndsky-blue/20 text-white py-3 px-8 transition-all hover:scale-105 rounded-full font-tajawal text-lg tracking-wider flex items-center gap-2">
                  اطلب الآن
                  <ArrowLeft size={18} />
                </button>
                <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white py-3 px-8 transition-all hover:bg-white/30 rounded-full font-tajawal">تواصل معنا</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Restyled */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full p-3 transition-all hover:bg-white/30 z-20"
        aria-label="Previous slide"
      >
        <ArrowLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full p-3 transition-all hover:bg-white/30 z-20"
        aria-label="Next slide"
      >
        <ArrowRight size={24} />
      </button>

      {/* Slide Indicators - Restyled */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-10 rounded-full transition-all ${
              index === currentSlide ? 'bg-trndsky-teal w-16' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
