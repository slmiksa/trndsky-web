import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import TrialRequestForm from './TrialRequestForm';
import { ImageGallery } from './admin/ImageGallery';
import { useContactInfo } from '@/hooks/useContactInfo';

interface SoftwareCardProps {
  title: string;
  description: string;
  image: string;
  id: number;
  price: string;
  onTrialRequest?: () => void;
}

const SoftwareCard = ({
  title,
  description,
  image,
  id,
  price,
  onTrialRequest
}: SoftwareCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    company: '',
    whatsapp: ''
  });
  const [orderSent, setOrderSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTrialForm, setShowTrialForm] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const { contactInfo } = useContactInfo();

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    setShowOrderForm(false);
    setOrderSent(false);
  };

  const handleOrderClick = () => {
    setShowOrderForm(!showOrderForm);
    setOrderSent(false);
  };

  const handleTrialClick = () => {
    // If an external handler is provided, use it, otherwise show the local form
    if (onTrialRequest) {
      onTrialRequest();
    } else {
      setShowTrialForm(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Insert the software order into the database
      const {
        error
      } = await supabase.from('software_orders').insert({
        software_id: id,
        company_name: orderData.company,
        whatsapp: orderData.whatsapp,
        status: 'new'
      });

      if (error) {
        console.error('Error submitting order:', error);
        toast.error('حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.');
        setIsSubmitting(false);
        return;
      }

      // Send email notification
      try {
        await supabase.functions.invoke("send-notification-email", {
          body: {
            to: contactInfo.email,
            subject: "طلب شراء برمجية جديد",
            requestType: "purchase",
            requestDetails: {
              company_name: orderData.company,
              whatsapp: orderData.whatsapp,
              software_id: id,
              software_title: title,
            }
          }
        });
      } catch (emailError) {
        // Log error but continue as the database entry was successful
        console.error("Error sending email notification:", emailError);
      }

      setOrderSent(true);
      setOrderData({
        company: '',
        whatsapp: ''
      });
      toast.success('تم إرسال طلبك بنجاح!');
      setTimeout(() => {
        setShowOrderForm(false);
      }, 1800);
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // جلب الصور الإضافية للمنتج
  useEffect(() => {
    if (showDetails && id) {
      fetchProductImages(id);
    }
  }, [showDetails, id]);
  
  const fetchProductImages = async (productId: number) => {
    setLoadingImages(true);
    try {
      const {
        data,
        error
      } = await supabase.from('software_product_images').select('image_url').eq('product_id', productId).order('created_at', {
        ascending: true
      });
      if (error) throw error;

      // تجميع جميع الصور (الصورة الرئيسية والصور الإضافية)
      const imageUrls = data.map(item => item.image_url);
      setAdditionalImages(imageUrls);
    } catch (error) {
      console.error('Error fetching product images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-white via-trndsky-gray to-[#f3fafe] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-trndsky-blue/10 hover:scale-105">
      <div className="h-48 overflow-hidden relative" style={{
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent px-0 mx-0 my-0 rounded-none"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 font-tajawal text-right text-trndsky-darkblue">{title}</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="font-tajawal text-xl font-bold text-trndsky-teal">{price}</span>
          <button onClick={toggleDetails} className="text-trndsky-teal hover:text-trndsky-blue font-medium transition-colors font-tajawal underline underline-offset-4">
            {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
          </button>
        </div>
        
        {showDetails && <div className="mt-2 text-gray-600 text-right animate-fade-in font-tajawal bg-gray-50 rounded-lg p-4 border border-trndsky-blue/10">
            <p className="mb-4">{description}</p>

            {/* عرض معرض الصور إذا كانت هناك صور إضافية */}
            {loadingImages ? <div className="text-center py-4">جاري تحميل الصور...</div> : (additionalImages.length > 0 || image) && <div className="my-4">
                <h4 className="font-semibold mb-2 text-trndsky-darkblue">معرض الصور:</h4>
                <ImageGallery images={additionalImages.length > 0 ? additionalImages : [image]} readOnly={true} />
              </div>}

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:justify-end">
              {!showOrderForm && <>
                  <button className="px-6 py-2 bg-white text-trndsky-blue border-2 border-trndsky-blue/20 hover:bg-gradient-to-l hover:from-trndsky-teal hover:to-trndsky-blue hover:text-white text-sm font-tajawal rounded-full shadow-md transition-all duration-300" onClick={handleOrderClick} type="button">
                    طلب المنتج
                  </button>
                  <button className="px-6 py-2 bg-white text-trndsky-blue border-2 border-trndsky-blue/20 hover:bg-gradient-to-l hover:from-trndsky-teal hover:to-trndsky-blue hover:text-white text-sm font-tajawal rounded-full shadow-md transition-all duration-300" onClick={handleTrialClick} type="button">
                    طلب تجربة
                  </button>
                </>}
            </div>

            {showOrderForm && <form className="mt-4 bg-white border border-trndsky-blue/10 rounded-xl p-4 animate-fade-in shadow" onSubmit={handleOrderSubmit} dir="rtl">
                <div className="mb-3">
                  <label className="block mb-1 text-trndsky-darkblue font-tajawal font-semibold text-base" htmlFor={`company-${id}`}>
                    اسم الشركة / العميل
                  </label>
                  <input id={`company-${id}`} name="company" required value={orderData.company} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trndsky-teal bg-gray-50 font-tajawal" placeholder="أدخل اسم الشركة أو العميل" />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 text-trndsky-darkblue font-tajawal font-semibold text-base" htmlFor={`whatsapp-${id}`}>
                    رقم الواتساب للتواصل
                  </label>
                  <input id={`whatsapp-${id}`} name="whatsapp" required value={orderData.whatsapp} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trndsky-teal bg-gray-50 font-tajawal" pattern="^[0-9+]{8,15}$" placeholder="05xxxxxxxx أو +9665xxxxxxx" />
                </div>
                <button type="submit" disabled={orderSent || isSubmitting} className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-l from-trndsky-teal to-trndsky-blue text-white font-tajawal shadow hover:scale-105 transition-all hover:from-trndsky-blue hover:to-trndsky-teal">
                  <Send className="w-5 h-5" /> {isSubmitting ? "جاري الإرسال..." : orderSent ? "تم الإرسال بنجاح" : "إرسال الطلب"}
                </button>
                {orderSent && <div className="mt-2 text-trndsky-teal font-tajawal text-sm">
                    تم استلام الطلب بنجاح، سنتواصل معكم على واتساب قريباً.
                  </div>}
              </form>}
          </div>}
      </div>
      
      {/* نموذج طلب التجربة */}
      {!onTrialRequest && <TrialRequestForm isOpen={showTrialForm} onClose={() => setShowTrialForm(false)} />}
    </div>
  );
};

interface FeaturedSoftwareProps {
  onTrialRequest?: () => void;
}

export const FeaturedSoftware = ({
  onTrialRequest
}: FeaturedSoftwareProps) => {
  const [softwareItems, setSoftwareItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchFeaturedSoftware = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('software_products').select('*').order('id', {
        ascending: true
      }).limit(3);
      if (error) {
        console.error('Error fetching featured software products:', error);
        return;
      }
      setSoftwareItems(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFeaturedSoftware();
  }, []);
  return <section className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-4 bg-trndsky-blue/10 text-trndsky-blue rounded-full text-sm mb-4 font-tajawal border border-trndsky-blue/20">
            منتجاتنا المميزة
          </span>
          <h2 className="text-4xl font-bold text-gray-800 font-tajawal mb-4">
            <span className="relative">
              برمجياتنا الجاهزة
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-trndsky-teal to-trndsky-blue rounded-full"></span>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-tajawal text-lg">
            مجموعة من الحلول البرمجية الجاهزة التي يمكن تخصيصها لتناسب احتياجات عملك
          </p>
        </div>
        
        {loading ? <div className="text-center py-8">
            <p className="text-xl text-trndsky-blue">جاري تحميل البرمجيات...</p>
          </div> : softwareItems.length === 0 ? <div className="text-center py-8">
            <p className="text-gray-500">لا توجد برمجيات متاحة حالياً</p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
            {softwareItems.map(item => <SoftwareCard key={item.id} id={item.id} title={item.title} description={item.description} image={item.image_url} price={`${item.price.toLocaleString()} ر.س`} onTrialRequest={onTrialRequest} />)}
          </div>}
        
        <div className="mt-12 text-center">
          <a href="/software" className="btn-primary inline-block font-tajawal rounded-full shadow-xl hover:bg-trndsky-teal hover:text-white text-lg px-10 py-3 transition-all">عرض جميع البرمجيات</a>
        </div>
      </div>
    </section>;
};

export default SoftwareCard;
