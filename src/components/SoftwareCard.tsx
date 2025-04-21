
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
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div 
        className="h-48 overflow-hidden relative"
        style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 font-tajawal text-right">{title}</h3>
        
        <div className="flex justify-end">
          <button
            onClick={toggleDetails}
            className="text-trndsky-teal hover:text-trndsky-blue font-medium transition-colors font-tajawal"
          >
            {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-4 text-gray-600 text-right animate-fade-in font-tajawal">
            <p>{description}</p>
            <div className="mt-4 flex justify-end">
              <button className="btn-secondary text-sm font-tajawal">طلب المزيد من المعلومات</button>
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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-tajawal text-trndsky-darkblue">
          برمجياتنا <span className="text-trndsky-teal">الجاهزة</span>
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-tajawal">
          مجموعة من الحلول البرمجية الجاهزة التي يمكن تخصيصها لتناسب احتياجات عملك
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <a href="/software" className="btn-primary inline-block font-tajawal">عرض جميع البرمجيات</a>
        </div>
      </div>
    </section>
  );
};

export default SoftwareCard;
