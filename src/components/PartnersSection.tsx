
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { toast } from "@/components/ui/use-toast";
import { useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// شعار شركة الوصل الوطنية المرفق مباشرة ضمن المشروع
const WISAL_PARTNER = {
  id: -1,
  name: "شركة الوصل الوطنية لتحصيل ديون جهات التمويل",
  logo_url: "/lovable-uploads/aa977791-13b8-471b-92c8-d9ef4ef03f27.png"
};

type Partner = {
  id: number;
  name: string;
  logo_url: string;
};

const PartnersSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<any>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimeMs = 3000; // وقت الانتقال بين الشرائح (3 ثوان)
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchPartners();
  }, []);

  // تعريف وظيفة الانتقال التلقائي
  const startAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }

    autoplayTimerRef.current = setTimeout(() => {
      if (api) {
        api.scrollNext();
        startAutoplay();
      }
    }, intervalTimeMs);
  }, [api]);

  // بدء التشغيل التلقائي عندما تكون API جاهزة
  useEffect(() => {
    if (api && partners.length > 0) {
      startAutoplay();
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [api, partners, startAutoplay]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const {
        data,
        error
      } = await supabase.from("partners").select("*").order("id", {
        ascending: true
      });
      if (error) {
        setError("حدث خطأ أثناء تحميل بيانات الشركاء");
        toast({
          title: "خطأ في التحميل",
          description: "لم نتمكن من تحميل بيانات الشركاء، يرجى المحاولة مرة أخرى لاحقاً.",
          variant: "destructive"
        });
        setPartners([WISAL_PARTNER]);
        return;
      }
      // إضافة شركة الوصل دائمًا أول القائمة إن لم تكن موجودة
      const partnerList = data || [];
      const exist = partnerList.some(p => p.name === WISAL_PARTNER.name || p.logo_url === WISAL_PARTNER.logo_url);
      
      // تحقق من البيانات المستلمة قبل التعيين
      console.log("Fetched partners:", partnerList);
      
      setPartners(exist ? partnerList : [WISAL_PARTNER, ...(partnerList as Partner[])]);
    } catch (err) {
      setError("حدث خطأ غير متوقع");
      setPartners([WISAL_PARTNER]);
    } finally {
      setLoading(false);
    }
  };

  // إيقاف التشغيل التلقائي عند تحريك المؤشر فوق الشريط
  const handleMouseEnter = () => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }
  };

  // إعادة تشغيل التشغيل التلقائي عندما يغادر المؤشر الشريط
  const handleMouseLeave = () => {
    startAutoplay();
  };

  if (loading) {
    return <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-trndsky-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-trndsky-blue">جاري تحميل بيانات الشركاء...</p>
        </div>
      </div>;
  }

  if (error) {
    return <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4 text-lg">{error}</div>
          <button onClick={fetchPartners} className="bg-trndsky-teal text-white px-4 py-2 rounded-lg hover:bg-trndsky-blue transition-colors">
            إعادة المحاولة
          </button>
        </div>
      </div>;
  }

  // طباعة عدد الشركاء وأسماءهم للتأكد من استلام البيانات بشكل صحيح
  console.log(`تم تحميل ${partners.length} شركاء:`, partners.map(p => p.name));
  console.log("الجهاز محمول؟", isMobile);

  return <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-16">
        <span className="inline-block py-1 px-4 bg-trndsky-blue/10 text-trndsky-blue rounded-full text-sm mb-4 font-tajawal border border-trndsky-blue/20">
          شركاؤنا
        </span>
        <h2 className="text-4xl font-bold text-gray-800 font-tajawal mb-4">
          <span className="relative">
            شركاء النجاح
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-trndsky-teal to-trndsky-blue rounded-full"></span>
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto font-tajawal text-lg">
          نفخر بشراكاتنا التي تدعم نمو وتطور الأعمال
        </p>
      </div>

      <div className="relative mx-auto max-w-5xl">
        {partners.length === 0 ? <div className="text-center py-12">
            <p className="text-xl text-gray-500">لا يوجد شركاء حالياً</p>
          </div> : <div 
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Carousel 
              opts={{
                align: "start",
                loop: true,
              }} 
              className="w-full"
              setApi={setApi}
            >
              <CarouselContent className="py-4">
                {partners.map(partner => (
                  <CarouselItem key={partner.id} className="basis-full">
                    <div className="bg-white border border-trndsky-blue/10 shadow hover:shadow-md transition-all flex flex-col items-center justify-center h-44 p-4 mx-1 rounded-3xl animate-slide-in-right">
                      <div className="bg-gray-50 w-full h-24 flex items-center justify-center rounded-xl p-2 mb-3">
                        <img 
                          src={partner.logo_url} 
                          alt={partner.name} 
                          className="object-contain max-h-20 max-w-[80%]" 
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                            e.currentTarget.alt = "صورة غير متوفرة";
                            console.log(`تعذر تحميل الصورة: ${partner.logo_url}`);
                          }}
                        />
                      </div>
                      <div className="text-trndsky-darkblue font-bold text-sm text-center mt-2 line-clamp-2">
                        {partner.name}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-6">
                <CarouselPrevious className="relative static mx-1 opacity-80 hover:opacity-100" />
                <CarouselNext className="relative static mx-1 opacity-80 hover:opacity-100" />
              </div>
            </Carousel>
          </div>}
      </div>
    </div>;
};

export default PartnersSection;
