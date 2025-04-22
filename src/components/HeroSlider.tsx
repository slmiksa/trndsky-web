
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "حلول برمجية متكاملة",
    subtitle: "نبتكر لمستقبل رقمي أفضل",
    description: "نقدم حلولاً تقنية متطورة تلبي احتياجات عملائنا وتواكب التطور التقني",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2920&q=80",
  },
  {
    id: 2,
    title: "تطوير تطبيقات الويب",
    subtitle: "تصميم وبرمجة مواقع عصرية",
    description: "نصمم ونطور مواقع وتطبيقات ويب متجاوبة وعالية الأداء",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2915&q=80",
  },
  {
    id: 3,
    title: "حلول ذكاء اصطناعي",
    subtitle: "تقنيات المستقبل اليوم",
    description: "نوظف تقنيات الذكاء الاصطناعي لتطوير حلول مبتكرة",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, isAnimating]);

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
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-trndsky-blue/20 via-transparent to-transparent opacity-30"></div>
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center">
                <div className={`space-y-6 transform transition-all duration-700 delay-100 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-tajawal leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-8 font-tajawal">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto font-tajawal">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-4 bg-gradient-to-r from-trndsky-teal to-trndsky-blue text-white rounded-full 
                      font-tajawal text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                      focus:outline-none focus:ring-2 focus:ring-trndsky-teal focus:ring-offset-2 focus:ring-offset-transparent">
                      اطلب الخدمة
                    </button>
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full
                      font-tajawal text-lg transition-all duration-300 hover:bg-white/20">
                      اعرف المزيد
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-sm
          border border-white/20 text-white transition-all duration-300 hover:bg-white/20"
        aria-label="Previous slide"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-sm
          border border-white/20 text-white transition-all duration-300 hover:bg-white/20"
        aria-label="Next slide"
      >
        <ArrowRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-trndsky-teal w-16' : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
