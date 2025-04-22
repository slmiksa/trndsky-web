
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
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-trndsky-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-trndsky-blue">جاري تحميل بيانات الشركاء...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4 text-lg">{error}</div>
          <button 
            onClick={fetchPartners}
            className="bg-trndsky-teal text-white px-4 py-2 rounded-lg hover:bg-trndsky-blue transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="relative mx-auto max-w-5xl">
        {partners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">لا يوجد شركاء حالياً</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="py-4">
                {partners.map((partner) => (
                  <CarouselItem key={partner.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 p-1">
                    <div className="bg-white rounded-2xl border border-trndsky-blue/10 shadow hover:shadow-md transition-all 
                         flex flex-col items-center justify-center h-44 p-4 mx-auto">
                      <div className="bg-gray-50 w-full h-24 flex items-center justify-center rounded-xl p-2 mb-3">
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="object-contain max-h-20 max-w-[80%]"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                            e.currentTarget.alt = "صورة غير متوفرة";
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
                <CarouselPrevious className="position-static mx-1 opacity-80 hover:opacity-100" />
                <CarouselNext className="position-static mx-1 opacity-80 hover:opacity-100" />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnersSection;
