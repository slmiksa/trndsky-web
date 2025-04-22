
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

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Full-width hero image with overlay */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ display: index === currentSlide ? 'block' : 'none' }}
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent mix-blend-multiply"
            ></div>
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -1
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-24">
        <div className="max-w-3xl ml-auto">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-all duration-700 ${
                index === currentSlide 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10 absolute'
              }`}
              style={{ display: index === currentSlide ? 'block' : 'none' }}
            >
              <span className="inline-block text-white/90 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4 font-tajawal">
                TRNDSKY+ تكنولوجيا المستقبل
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white font-tajawal leading-tight">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 font-tajawal max-w-2xl">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white hover:bg-opacity-95 text-trndsky-darkblue rounded-full 
                    font-tajawal text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl
                    hover:translate-y-[-2px]"
                >
                  تواصل معنا
                </Link>
                <Link
                  to="/software"
                  className="px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white/60 
                    text-white rounded-full font-tajawal text-lg transition-all duration-300"
                >
                  استعرض البرمجيات
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-8 right-8 z-10 flex gap-3">
        <button 
          onClick={goToPrevSlide}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm
            text-white border border-white/30 hover:bg-white/30 transition-all duration-300"
          aria-label="Previous slide"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={goToNextSlide} 
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm
            text-white border border-white/30 hover:bg-white/30 transition-all duration-300"
          aria-label="Next slide"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-10 bg-white' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
