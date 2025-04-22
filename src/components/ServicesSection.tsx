
import { Code, MessageSquare, Users, Layers, Code2 } from 'lucide-react';

const services = [
  {
    icon: <Code2 className="w-10 h-10" />,
    title: "تطوير البرمجيات",
    description: "تطوير تطبيقات ومواقع احترافية بأحدث التقنيات والأدوات"
  },
  {
    icon: <Layers className="w-10 h-10" />,
    title: "هندسة الانظمة",
    description: "تصميم وتطوير أنظمة متكاملة لمختلف المجالات والقطاعات"
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "حلول الفرق",
    description: "حلول تقنية متكاملة لفرق العمل لزيادة الإنتاجية والكفاءة"
  },
  {
    icon: <MessageSquare className="w-10 h-10" />,
    title: "استشارات تقنية",
    description: "استشارات في مجال التقنية وتحليل البيانات والذكاء الاصطناعي"
  },
  {
    icon: <Code className="w-10 h-10" />,
    title: "تحكم متكامل",
    description: "أنظمة تحكم وإدارة متكاملة للشركات والمؤسسات الكبرى"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-4 bg-trndsky-blue/10 text-trndsky-blue rounded-full text-sm mb-4 font-tajawal border border-trndsky-blue/20">
            خدماتنا المتميزة
          </span>
          <h2 className="text-4xl font-bold text-gray-800 font-tajawal mb-4">
            <span className="relative">
              ماذا نقدم لك؟
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-trndsky-teal to-trndsky-blue rounded-full"></span>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-tajawal">
            نقدم باقة متكاملة من الخدمات التقنية المتطورة لمساعدة عملائنا على تحقيق أهدافهم
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow hover:shadow-md transition-all duration-300
                hover:transform hover:translate-y-[-5px] border border-gray-100 group"
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl 
                bg-gradient-to-br from-trndsky-blue to-trndsky-teal text-white group-hover:shadow-lg 
                group-hover:shadow-trndsky-blue/20 transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-tajawal text-gray-800">
                {service.title}
              </h3>
              <p className="text-gray-600 font-tajawal leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
