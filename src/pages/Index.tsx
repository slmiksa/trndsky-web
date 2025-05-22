import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import ServicesSection from '../components/ServicesSection';
import { FeaturedSoftware } from '../components/SoftwareCard';
import ProjectRequestForm from '../components/ProjectRequestForm';
import PartnersSection from '../components/PartnersSection';
import Footer from '../components/Footer';
import { useState } from 'react';
import TrialRequestForm from '../components/TrialRequestForm';
import { Toaster } from '../components/ui/toaster';
const Index = () => {
  const [showTrialForm, setShowTrialForm] = useState(false);
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <HeroSlider />
        
        {/* Services Section */}
        <ServicesSection />

        {/* Featured Software Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              
              <h2 className="text-4xl font-bold text-gray-800 font-tajawal mb-4">
                
              </h2>
              
            </div>
            <FeaturedSoftware onTrialRequest={() => setShowTrialForm(true)} />
          </div>
        </section>
        
        {/* Project Request Section */}
        <section className="py-24 bg-gradient-to-br from-trndsky-blue to-trndsky-darkblue text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block py-1 px-4 bg-white/20 text-white rounded-full mb-4 font-tajawal border border-white/20 text-3xl">
                  ابدأ مشروعك
                </span>
                <h2 className="text-4xl font-bold text-white font-tajawal mb-4">
                  <span className="relative">
                    طلب مشروع جديد
                    <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-trndsky-yellow via-white/70 to-trndsky-yellow/70 rounded-full"></span>
                  </span>
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto font-tajawal">
                  أخبرنا بفكرتك ودعنا نحولها إلى واقع ملموس بأحدث التقنيات
                </p>
              </div>
              <div className="glass-card p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
                <ProjectRequestForm />
              </div>
            </div>
          </div>
        </section>
        
        {/* Partners Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-4 bg-trndsky-green/10 text-trndsky-green rounded-full text-sm mb-4 font-tajawal border border-trndsky-green/20">
                نفخر بشركائنا
              </span>
              <h2 className="text-4xl font-bold text-gray-800 font-tajawal mb-4">
                <span className="relative">
                  شركاء النجاح
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-trndsky-green to-trndsky-blue rounded-full"></span>
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-tajawal">
                نتعاون مع نخبة من أفضل الشركات لتقديم حلول متكاملة ترتقي بأعمال عملائنا
              </p>
            </div>
          </div>
          <PartnersSection />
        </section>
        
        {/* نموذج طلب التجربة */}
        <TrialRequestForm isOpen={showTrialForm} onClose={() => setShowTrialForm(false)} />
      </main>
      <Footer />
      <Toaster />
    </div>;
};
export default Index;