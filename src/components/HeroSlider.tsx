
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
    <div className="relative h-[70vh] overflow-hidden rounded-b-3xl shadow-xl bg-gradient-to-br from-[#F5F7FA] via-[#e0e7ef] to-trndsky-blue">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(10, 36, 99, 0.92) 35%, rgba(11, 61, 145, 0.8) 100%),url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
            <div className={`transform transition-all duration-700 delay-300 ${
              index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 font-tajawal drop-shadow-xl">{slide.title}</h2>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-trndsky-teal font-tajawal">{slide.subtitle}</h3>
              <p className="max-w-2xl mx-auto text-xl font-tajawal text-blue-50 bg-black/20 rounded-lg px-6 py-3 backdrop-blur">{slide.description}</p>
              <button className="mt-8 bg-gradient-to-l from-trndsky-teal to-trndsky-blue shadow-xl text-white py-3 px-10 transition-all hover:scale-105 rounded-full font-tajawal text-lg tracking-widest">اطلب الآن</button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/80 text-trndsky-blue border border-trndsky-teal shadow-lg rounded-full p-2 transition hover:bg-trndsky-teal hover:text-white z-20"
        aria-label="Previous slide"
      >
        <ArrowLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/80 text-trndsky-blue border border-trndsky-teal shadow-lg rounded-full p-2 transition hover:bg-trndsky-teal hover:text-white z-20"
        aria-label="Next slide"
      >
        <ArrowRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-8 rounded-full transition-colors ${
              index === currentSlide ? 'bg-trndsky-teal' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
