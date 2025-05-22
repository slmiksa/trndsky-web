
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

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

  useEffect(() => {
    fetchPartners();
  }, []);

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
      
      setPartners(exist ? partnerList : [WISAL_PARTNER, ...(partnerList as Partner[])]);
    } catch (err) {
      setError("حدث خطأ غير متوقع");
      setPartners([WISAL_PARTNER]);
    } finally {
      setLoading(false);
    }
  };

  // محدود للشركاء الأربعة الأولى فقط
  const limitedPartners = partners.slice(0, 4);

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

  return (
    <div className="container mx-auto px-6 py-8">
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
        {limitedPartners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">لا يوجد شركاء حالياً</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {limitedPartners.map(partner => (
                <div 
                  key={partner.id} 
                  className="bg-white border border-trndsky-blue/10 shadow hover:shadow-md transition-all flex flex-col items-center justify-center h-48 p-4 rounded-3xl animate-fade-in"
                >
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
                  <div className="text-trndsky-darkblue font-bold text-sm text-center mt-2 px-2 h-16 overflow-y-auto">
                    {partner.name}
                  </div>
                </div>
              ))}
            </div>
            
            {/* زر عرض جميع الشركاء */}
            <div className="mt-8 text-center">
              <Link to="/partners">
                <Button 
                  variant="outline" 
                  className="border-trndsky-blue text-trndsky-blue hover:bg-trndsky-blue/10 font-tajawal"
                >
                  عرض جميع الشركاء
                  <ChevronRight className="mr-2 h-4 w-4 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnersSection;
