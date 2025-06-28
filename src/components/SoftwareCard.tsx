import { useState, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import TrialRequestForm from './TrialRequestForm';
import { ImageGallery } from './admin/ImageGallery';
import { useContactInfo } from '@/hooks/useContactInfo';
import { Button } from './ui/button';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const {
    contactInfo
  } = useContactInfo();
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
      const { error } = await supabase
        .from('software_orders')
        .insert({
          software_id: id,
          company_name: orderData.company,
          whatsapp: orderData.whatsapp,
          status: 'new'
        });

      if (error) {
        console.error('Error submitting order:', error);
        toast({
          title: "خطأ في الإرسال",
          description: "حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
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
              software_title: title
            }
          }
        });
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
      }

      setOrderSent(true);
      setOrderData({ company: '', whatsapp: '' });
      setSuccessMessage('تم إرسال طلب الشراء بنجاح! سنتواصل معكم قريباً.');
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowOrderForm(false);
      }, 1800);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
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
    <>
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100/50 hover:scale-[1.02] group">
        <div className="h-56 md:h-48 overflow-hidden relative" style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
          <div className="absolute bottom-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-trndsky-blue border border-white/50">
              جديد
            </div>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 font-tajawal text-right text-trndsky-darkblue leading-tight">
            {title}
          </h3>
          
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            {price && (
              <div className="bg-gradient-to-r from-trndsky-teal to-trndsky-blue text-white px-4 py-2 rounded-full font-tajawal text-lg font-bold shadow-md">
                {price}
              </div>
            )}
            <button 
              onClick={toggleDetails} 
              className="text-trndsky-blue hover:text-trndsky-darkblue font-bold transition-all duration-300 font-tajawal bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full border border-blue-200 shadow-sm hover:shadow-md"
            >
              {showDetails ? '🔼 إخفاء التفاصيل' : '🔽 عرض التفاصيل'}
            </button>
          </div>
          
          {showDetails && (
            <div className="mt-4 animate-fade-in">
              <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl p-6 border border-blue-100/50 shadow-inner">
                <div className="prose max-w-none text-right font-tajawal">
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6 font-medium">
                    {description}
                  </p>
                </div>

                {/* عرض معرض الصور */}
                {loadingImages ? (
                  <div className="text-center py-8 bg-white/50 rounded-xl">
                    <div className="w-8 h-8 border-3 border-trndsky-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-trndsky-blue font-tajawal">جاري تحميل الصور...</p>
                  </div>
                ) : (
                  (additionalImages.length > 0 || image) && (
                    <div className="my-6">
                      <h4 className="font-bold mb-4 text-trndsky-darkblue text-lg font-tajawal flex items-center gap-2">
                        🖼️ معرض الصور
                      </h4>
                      <div className="bg-white/70 rounded-xl p-4 border border-blue-100">
                        <ImageGallery 
                          images={additionalImages.length > 0 ? additionalImages : [image]} 
                          readOnly={true} 
                        />
                      </div>
                    </div>
                  )
                )}

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                  {!showOrderForm && (
                    <>
                      <Button 
                        onClick={handleOrderClick} 
                        type="button" 
                        size="lg" 
                        className="bg-gradient-to-r from-trndsky-blue to-trndsky-darkblue hover:from-trndsky-darkblue hover:to-trndsky-blue text-white font-tajawal font-bold px-8 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
                      >
                        🛒 طلب المنتج
                      </Button>
                      <Button 
                        onClick={handleTrialClick} 
                        type="button" 
                        size="lg" 
                        className="bg-gradient-to-r from-trndsky-teal to-trndsky-green hover:from-trndsky-green hover:to-trndsky-teal text-white font-tajawal font-bold px-8 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
                      >
                        🚀 طلب تجربة
                      </Button>
                    </>
                  )}
                </div>

                {showOrderForm && (
                  <form className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-blue-100" onSubmit={handleOrderSubmit} dir="rtl">
                    <div className="grid gap-4">
                      <div>
                        <label className="block mb-2 text-trndsky-darkblue font-tajawal font-bold text-lg" htmlFor={`company-${id}`}>
                          🏢 اسم الشركة / العميل
                        </label>
                        <input 
                          id={`company-${id}`}
                          name="company" 
                          required 
                          value={orderData.company} 
                          onChange={handleInputChange} 
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-trndsky-blue focus:border-trndsky-blue bg-gray-50 font-tajawal text-lg transition-all duration-300" 
                          placeholder="أدخل اسم الشركة أو العميل" 
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-trndsky-darkblue font-tajawal font-bold text-lg" htmlFor={`whatsapp-${id}`}>
                          📱 رقم الواتساب للتواصل
                        </label>
                        <input 
                          id={`whatsapp-${id}`}
                          name="whatsapp" 
                          required 
                          value={orderData.whatsapp} 
                          onChange={handleInputChange} 
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-trndsky-blue focus:border-trndsky-blue bg-gray-50 font-tajawal text-lg transition-all duration-300" 
                          pattern="^[0-9+]{8,15}$" 
                          placeholder="05xxxxxxxx أو +9665xxxxxxx" 
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={orderSent || isSubmitting} 
                      size="lg" 
                      className="w-full mt-6 text-lg font-bold py-4 bg-gradient-to-r from-trndsky-blue to-trndsky-darkblue hover:from-trndsky-darkblue hover:to-trndsky-blue text-white font-tajawal rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-white/20"
                    >
                      <Send className="w-6 h-6 ml-2" /> 
                      {isSubmitting ? "⏳ جاري الإرسال..." : orderSent ? "✅ تم الإرسال بنجاح" : "🚀 إرسال الطلب"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* مودال نجاح الإرسال */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-3 font-tajawal">تم الإرسال بنجاح!</h3>
              <p className="text-gray-600 mb-6 font-tajawal text-lg leading-relaxed">{successMessage}</p>
              <Button 
                onClick={() => setShowSuccessModal(false)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-tajawal font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* نموذج طلب التجربة */}
      {!onTrialRequest && (
        <TrialRequestForm 
          isOpen={showTrialForm} 
          onClose={() => setShowTrialForm(false)} 
        />
      )}
    </>
  );
};

export const FeaturedSoftware = ({
  onTrialRequest
}: {
  onTrialRequest?: () => void;
}) => {
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
          
          <h2 className="text-4xl font-bold text-gray-800 font-tajawal mb-4">
            
          </h2>
          
        </div>
        
        {loading ? <div className="text-center py-8">
            <p className="text-xl text-trndsky-blue">جاري تحميل البرمجيات...</p>
          </div> : softwareItems.length === 0 ? <div className="text-center py-8">
            <p className="text-gray-500">لا توجد برمجيات متاحة حالياً</p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
            {softwareItems.map(item => <SoftwareCard key={item.id} id={item.id} title={item.title} description={item.description} image={item.image_url} price={item.show_price && item.price ? `${item.price.toLocaleString()} ر.س` : ""} onTrialRequest={onTrialRequest} />)}
          </div>}
        
        <div className="mt-12 text-center">
          <a href="/software" className="btn-primary inline-block font-tajawal rounded-full shadow-xl hover:bg-trndsky-teal hover:text-white text-lg px-10 py-3 transition-all">عرض جميع البرمجيات</a>
        </div>
      </div>
    </section>;
};

export default SoftwareCard;
