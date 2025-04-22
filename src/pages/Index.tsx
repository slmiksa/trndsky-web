
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import ServicesSection from '../components/ServicesSection';
import { FeaturedSoftware } from '../components/SoftwareCard';
import ProjectRequestForm from '../components/ProjectRequestForm';
import PartnersSection from '../components/PartnersSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSlider />
        <ServicesSection />
        
        {/* Featured Software Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-trndsky-darkblue font-tajawal mb-4">
                برمجياتنا المميزة
              </h2>
              <div className="w-24 h-1 mx-auto bg-trndsky-blue rounded-full"></div>
            </div>
            <FeaturedSoftware />
          </div>
        </section>
        
        {/* Project Request Section */}
        <section className="py-20 modern-gradient">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-trndsky-darkblue font-tajawal mb-4">
                  طلب مشروع
                </h2>
                <div className="w-24 h-1 mx-auto bg-trndsky-blue rounded-full"></div>
              </div>
              <div className="modern-card p-8">
                <ProjectRequestForm />
              </div>
            </div>
          </div>
        </section>
        
        {/* Partners Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-trndsky-darkblue font-tajawal mb-4">
                شركاؤنا
              </h2>
              <div className="w-24 h-1 mx-auto bg-trndsky-blue rounded-full"></div>
            </div>
            <PartnersSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
