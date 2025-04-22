
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import ServicesSection from '../components/ServicesSection';
import { FeaturedSoftware } from '../components/SoftwareCard';
import ProjectRequestForm from '../components/ProjectRequestForm';
import PartnersSection from '../components/PartnersSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <HeroSlider />
        
        {/* Featured Software Section - Moved up */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
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
              <p className="text-gray-600 max-w-2xl mx-auto font-tajawal">
                اكتشف مجموعة برمجياتنا المتطورة المصممة خصيصًا لتلبية احتياجات مختلف القطاعات
              </p>
            </div>
            <FeaturedSoftware />
          </div>
        </section>

        {/* Services Section */}
        <ServicesSection />
        
        {/* Project Request Section */}
        <section className="py-24 bg-gradient-to-br from-trndsky-darkblue to-trndsky-blue text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block py-1 px-4 bg-white/20 text-white rounded-full text-sm mb-4 font-tajawal border border-white/20">
                  ابدأ مشروعك
                </span>
                <h2 className="text-4xl font-bold text-white font-tajawal mb-4">
                  <span className="relative">
                    طلب مشروع جديد
                    <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-white/70 to-white/30 rounded-full"></span>
                  </span>
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto font-tajawal">
                  أخبرنا بفكرتك ودعنا نحولها إلى واقع ملموس بأحدث التقنيات
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white/20">
                <ProjectRequestForm />
              </div>
            </div>
          </div>
        </section>
        
        {/* Partners Section */}
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
