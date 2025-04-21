
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "@/components/ui/use-toast";

// شعار شركة الوصل الوطنية المرفق مباشرة ضمن المشروع
const WISAL_PARTNER = {
  id: -1,
  name: "شركة الوصل الوطنية لتحصيل ديون جهات التمويل",
  logo_url: "/lovable-uploads/aa977791-13b8-471b-92c8-d9ef4ef03f27.png",
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

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("id", { ascending: true });
      if (error) {
        setError("حدث خطأ أثناء تحميل بيانات الشركاء");
        toast({
          title: "خطأ في التحميل",
          description: "لم نتمكن من تحميل بيانات الشركاء، يرجى المحاولة مرة أخرى لاحقاً.",
          variant: "destructive",
        });
        setPartners([WISAL_PARTNER]);
        return;
      }
      // إضافة شركة الوصل دائمًا أول القائمة إن لم تكن موجودة
      const partnerList = data || [];
      const exist = partnerList.some(
        (p) =>
          p.name === WISAL_PARTNER.name ||
          p.logo_url === WISAL_PARTNER.logo_url
      );
      setPartners(
        exist
          ? partnerList
          : [WISAL_PARTNER, ...(partnerList as Partner[])]
      );
    } catch (err) {
      setError("حدث خطأ غير متوقع");
      setPartners([WISAL_PARTNER]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-tr from-[#f7fafc] via-[#ebf5fd] to-trndsky-gray">
        <div className="container mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-12 font-tajawal text-trndsky-darkblue drop-shadow">
            شركاء <span className="text-trndsky-teal">النجاح</span>
          </h2>
          <div className="text-center text-gray-500">جاري التحميل...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-gradient-to-tr from-[#f7fafc] via-[#ebf5fd] to-trndsky-gray">
        <div className="container mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-12 font-tajawal text-trndsky-darkblue drop-shadow">
            شركاء <span className="text-trndsky-teal">النجاح</span>
          </h2>
          <div className="text-center text-red-500">{error}</div>
          <div className="text-center mt-4">
            <button 
              onClick={fetchPartners}
              className="bg-trndsky-teal text-white px-4 py-2 rounded-lg hover:bg-trndsky-blue transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-tr from-[#f7fafc] via-[#ebf5fd] to-trndsky-gray">
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-12 font-tajawal text-trndsky-darkblue drop-shadow">
          شركاء <span className="text-trndsky-teal">النجاح</span>
        </h2>
        {partners.length === 0 ? (
          <div className="text-center text-gray-500">لا يوجد شركاء حالياً</div>
        ) : (
          <div className="px-8 md:px-16">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="py-4">
                {partners.map((partner) => (
                  <CarouselItem key={partner.id} className="md:basis-1/3 lg:basis-1/4">
                    <div className="bg-white rounded-full border border-trndsky-blue/10 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center h-40 w-44 md:h-48 md:w-56 p-3 mx-auto">
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="object-contain max-h-16 max-w-[200px] mb-2"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                          e.currentTarget.alt = "صورة غير متوفرة";
                        }}
                      />
                      <div className="text-trndsky-darkblue font-bold text-xs text-center mt-1">
                        {partner.name}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 opacity-80 hover:opacity-100" />
              <CarouselNext className="right-0 opacity-80 hover:opacity-100" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnersSection;

