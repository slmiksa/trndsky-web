
import { useState } from 'react';

interface SoftwareCardProps {
  title: string;
  description: string;
  image: string;
  id: number;
}

const SoftwareCard = ({ title, description, image, id }: SoftwareCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="bg-gradient-to-tr from-white via-trndsky-gray to-[#f3fafe] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-trndsky-blue/10 hover:scale-105">
      <div 
        className="h-48 overflow-hidden relative"
        style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 font-tajawal text-right text-trndsky-darkblue">{title}</h3>
        
        <div className="flex justify-end">
          <button
            onClick={toggleDetails}
            className="text-trndsky-teal hover:text-trndsky-blue font-medium transition-colors font-tajawal underline underline-offset-4"
          >
            {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-4 text-gray-600 text-right animate-fade-in font-tajawal bg-gray-50 rounded-lg p-4 border border-trndsky-blue/10">
            <p>{description}</p>
            <div className="mt-4 flex justify-end">
              <button className="btn-secondary text-sm font-tajawal rounded-full shadow-md hover:bg-trndsky-darkblue">طلب المزيد من المعلومات</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Featured Software Section Component
export const FeaturedSoftware = () => {
  const softwareItems = [
    {
      id: 1,
      title: "نظام إدارة المبيعات",
      description: "نظام متكامل لإدارة المبيعات والمخزون مع تقارير تحليلية متقدمة وواجهة سهلة الاستخدام",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 2,
      title: "منصة التجارة الإلكترونية",
      description: "منصة احترافية للتجارة الإلكترونية مع دعم للدفع الإلكتروني وإدارة المنتجات والعملاء",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 3,
      title: "تطبيق إدارة المشاريع",
      description: "تطبيق لإدارة المشاريع وتتبع المهام والتعاون بين فرق العمل مع تقارير متقدمة",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-4 font-tajawal text-trndsky-darkblue drop-shadow-lg">
          برمجياتنا <span className="text-trndsky-teal">الجاهزة</span>
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-tajawal text-lg">
          مجموعة من الحلول البرمجية الجاهزة التي يمكن تخصيصها لتناسب احتياجات عملك
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
          {softwareItems.map((item) => (
            <SoftwareCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a href="/software" className="btn-primary inline-block font-tajawal rounded-full shadow-xl hover:bg-trndsky-teal hover:text-white text-lg px-10 py-3 transition-all">عرض جميع البرمجيات</a>
        </div>
      </div>
    </section>
  );
};

export default SoftwareCard;
