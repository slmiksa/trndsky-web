
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

type Slide = {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
};

const defaultSlides = [
  {
    id: 1,
    title: "دعم فني متواصل",
    description: "فريقنا مستعد دائمًا لدعمك وتطوير مشاريعك على مدار الساعة وبأحدث التقنيات.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "حلول تقنية متكاملة",
    description: "نقدم خدمات برمجية شاملة من التصميم إلى التطوير والصيانة",
    image: "/placeholder.svg",
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const maxRetries = 2;

  // تحميل مسبق للصور
  const preloadImages = useCallback((slidesData: Slide[]) => {
    const newImagesLoaded: Record<number, boolean> = {};
    
    slidesData.forEach((slide) => {
      if (slide.image) {
        const img = new Image();
        img.src = slide.image;
        newImagesLoaded[slide.id] = false;
        
        img.onload = () => {
          setImagesLoaded(prev => ({
            ...prev,
            [slide.id]: true
          }));
        };
        
        img.onerror = () => {
          console.error(`Failed to load image for slide: ${slide.id}`);
        };
      }
    });
    
    // إذا لم تكن هناك صور للتحميل
    if (Object.keys(newImagesLoaded).length === 0) {
      setImagesLoaded({});
    }
  }, []);

  // جلب السلايدات من قاعدة البيانات مع محاولات إعادة الاتصال
  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('slides')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching slides:', error);
        
        if (retryCount < maxRetries) {
          // محاولة إعادة الاتصال بعد فترة
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchSlides();
          }, 1000 * (retryCount + 1)); // زيادة وقت الانتظار مع كل محاولة
          
          return;
        }
        
        toast({ 
          title: "استخدام السلايدات الافتراضية", 
          description: "سيتم عرض السلايدات الافتراضية بسبب مشكلة في الاتصال", 
          variant: "default" 
        });
      } else if (data && data.length > 0) {
        setSlides(data);
        preloadImages(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      // نضع زمن انتظار قصير قبل إخفاء شاشة التحميل حتى لو تم الانتهاء من التحميل فعلاً
      // هذا يضمن أن الواجهة تظهر كاملة وليس بشكل متقطع
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [retryCount, preloadImages]);

  // استدعاء وظيفة جلب السلايدات عند تحميل المكون
  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  // تغيير السلايد تلقائياً كل 5 ثوانٍ
  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchSlides();
  };

  if (loading) {
    return (
      <div className="relative pt-16 flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-trndsky-darkblue border-b-4 border-trndsky-teal h-[50vh]">
        <div className="text-white text-xl flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-trndsky-teal border-t-transparent rounded-full animate-spin mb-4"></div>
          جاري تحميل السلايدات...
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative pt-16 flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-trndsky-darkblue border-b-4 border-trndsky-teal h-[50vh]">
        <div className="text-white text-xl flex flex-col items-center">
          <p className="mb-4">لا توجد سلايدات متاحة</p>
          <button 
            onClick={handleRetry}
            className="px-6 py-2 bg-trndsky-teal text-white rounded-full hover:bg-trndsky-darkblue transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-16 flex items-center overflow-hidden bg-black border-b-4 border-trndsky-teal">
      {/* صور الخلفية وتأثيراتها */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ display: index === currentSlide ? 'block' : 'none' }}
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50 mix-blend-multiply"
            ></div>
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -1
              }}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundImage = 
                  'url(/placeholder.svg)';
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* المحتوى */}
      <div className="relative z-10 container mx-auto px-6 py-32 md:py-40">
        <div className="max-w-3xl ml-auto">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-all duration-500 ${
                index === currentSlide 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10 absolute'
              }`}
              style={{ display: index === currentSlide ? 'block' : 'none' }}
            >
              <span className="inline-block text-white/90 bg-trndsky-blue/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4 font-tajawal border border-trndsky-blue/40">
                TRNDSKY+ تكنولوجيا المستقبل
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white font-tajawal leading-tight">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 font-tajawal max-w-2xl">
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
                  className="px-8 py-4 bg-transparent border-2 border-white/40 hover:border-white/80 
                    text-white rounded-full font-tajawal text-lg transition-all duration-300"
                >
                  استعرض البرمجيات
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* أزرار التنقل */}
      <div className="absolute bottom-8 right-8 z-10 flex gap-3">
        <button 
          onClick={goToPrevSlide}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm
            text-white border border-white/30 hover:bg-white/30 transition-all duration-300"
          aria-label="السلايد السابق"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={goToNextSlide} 
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm
            text-white border border-white/30 hover:bg-white/30 transition-all duration-300"
          aria-label="السلايد التالي"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* مؤشرات الصفحات */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-10 bg-trndsky-teal' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`انتقل إلى سلايد ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
