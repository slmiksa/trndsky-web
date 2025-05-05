import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SoftwareCard from '../components/SoftwareCard';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import Footer from '../components/Footer';
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
      const {
        data,
        error
      } = await supabase.from('software_products').select('*').order('id', {
        ascending: true
      });
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
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-r from-trndsky-darkblue to-trndsky-blue text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 font-tajawal">
            البرمجيات الجاهزة
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto font-tajawal text-white/90">
            مجموعة متنوعة من الحلول البرمجية الجاهزة التي يمكن تخصيصها لتلبية احتياجات عملك
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          {loading ? <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-trndsky-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-trndsky-blue">جاري تحميل البرمجيات...</p>
            </div> : softwareItems.length === 0 ? <div className="text-center py-12 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xl text-gray-500 mb-3">لا توجد برمجيات متاحة حالياً</p>
              <p className="text-gray-400">يمكنك إضافة برمجيات جديدة من لوحة التحكم</p>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {softwareItems.map(item => <SoftwareCard key={item.id} id={item.id} title={item.title} description={item.description} image={item.image_url} price={`${item.price.toLocaleString()} ر.س`} />)}
            </div>}
          
          
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Software;