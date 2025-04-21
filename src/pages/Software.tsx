
import React from 'react';
import Navbar from '../components/Navbar';
import SoftwareCard from '../components/SoftwareCard';

const Software = () => {
  const softwareItems = [
    {
      id: 1,
      title: "نظام إدارة المبيعات",
      description: "نظام متكامل لإدارة المبيعات والمخزون مع تقارير تحليلية متقدمة وواجهة سهلة الاستخدام. يوفر النظام رؤية شاملة عن أداء المبيعات ويساعد في اتخاذ القرارات الاستراتيجية.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 2,
      title: "منصة التجارة الإلكترونية",
      description: "منصة احترافية للتجارة الإلكترونية مع دعم للدفع الإلكتروني وإدارة المنتجات والعملاء. تتيح المنصة إنشاء متجر إلكتروني بسهولة مع تجربة مستخدم مميزة.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 3,
      title: "تطبيق إدارة المشاريع",
      description: "تطبيق لإدارة المشاريع وتتبع المهام والتعاون بين فرق العمل مع تقارير متقدمة. يساعد على تنظيم سير العمل وتحسين كفاءة الفرق وإنجاز المشاريع في الوقت المحدد.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 4,
      title: "نظام إدارة الموارد البشرية",
      description: "نظام متكامل لإدارة شؤون الموظفين والرواتب والإجازات والتقييم. يساعد على تبسيط العمليات الإدارية وتحسين تجربة الموظفين.",
      image: "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 5,
      title: "منصة إدارة المحتوى",
      description: "منصة مرنة لإدارة المحتوى الرقمي بمختلف أنواعه. تتيح إنشاء وتحرير ونشر المحتوى بسهولة مع إمكانيات متقدمة للتخصيص.",
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: 6,
      title: "نظام إدارة علاقات العملاء",
      description: "نظام متكامل لإدارة علاقات العملاء وتتبع فرص المبيعات وخدمة العملاء. يساعد على بناء علاقات قوية مع العملاء وزيادة معدلات الاحتفاظ بهم.",
      image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ];

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
