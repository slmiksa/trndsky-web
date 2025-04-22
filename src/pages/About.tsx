
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-trndsky-darkblue text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-tajawal">من نحن</h1>
          <p className="text-xl max-w-3xl mx-auto font-tajawal">
            شركة رائدة في مجال تطوير البرمجيات والحلول التقنية المتكاملة
          </p>
        </div>
      </div>
      
      <main className="flex-grow bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-trndsky-darkblue font-tajawal">
              رسالتنا
            </h2>
            <p className="text-gray-700 leading-relaxed font-tajawal">
              نسعى لتقديم حلول تقنية مبتكرة ومتكاملة تساعد عملائنا على تحقيق أهدافهم الرقمية بكفاءة وإبداع
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
