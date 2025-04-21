
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import TechIcons from '../components/TechIcons';
import ProjectRequestForm from '../components/ProjectRequestForm';
import { FeaturedSoftware } from '../components/SoftwareCard';
import PartnersSection from '../components/PartnersSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSlider />
        <TechIcons />
        <ProjectRequestForm />
        <FeaturedSoftware />
        <PartnersSection />
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

export default Index;
