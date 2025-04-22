
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SoftwareCard from '../components/SoftwareCard';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

type SoftwareProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
};

const Software = () => {
  const [softwareItems, setSoftwareItems] = useState<SoftwareProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSoftwareProducts();
  }, []);

  const fetchSoftwareProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('software_products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching software products:', error);
        toast.error('حدث خطأ أثناء تحميل البرمجيات');
      } else {
        setSoftwareItems(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء تحميل البرمجيات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-trndsky-blue text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 font-tajawal">البرمجيات الجاهزة</h1>
          <p className="text-xl text-center max-w-3xl mx-auto font-tajawal">
            مجموعة متنوعة من الحلول البرمجية الجاهزة التي يمكن تخصيصها لتلبية احتياجات عملك
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-trndsky-blue">جاري تحميل البرمجيات...</p>
            </div>
          ) : softwareItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">لا توجد برمجيات متاحة حالياً</p>
              <p className="mt-2 text-gray-400">يمكنك إضافة برمجيات جديدة من لوحة التحكم</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {softwareItems.map((item) => (
                <SoftwareCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  image={item.image_url}
                  price={`${item.price.toLocaleString()} ر.س`}
                />
              ))}
            </div>
          )}
          
          <div className="mt-16 bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center font-tajawal text-trndsky-darkblue">
              لم تجد ما تبحث عنه؟
            </h2>
            <p className="text-center text-gray-600 mb-6 font-tajawal">
              نحن نقدم خدمات تطوير برمجي مخصصة لتلبية احتياجاتك الفريدة
            </p>
            <div className="flex justify-center">
              <a href="/" className="btn-primary font-tajawal">اطلب تطوير مخصص</a>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-trndsky-darkblue text-white py-8">
        <div className="container mx-auto text-center">
          <div className="text-xl font-bold mb-4">
            <span className="text-trndsky-teal">TRND</span>SKY
          </div>
          <p className="font-tajawal">© {new Date().getFullYear()} TRNDSKY. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
};

export default Software;
