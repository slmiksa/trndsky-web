
import { Code, MessageSquare, Users, Layers, Code2 } from 'lucide-react';

const services = [
  {
    icon: <Code2 className="w-10 h-10" />,
    title: "تطوير البرمجيات",
    description: "تطوير تطبيقات ومواقع احترافية بأحدث التقنيات والأدوات",
    color: "blue"
  },
  {
    icon: <Layers className="w-10 h-10" />,
    title: "هندسة الانظمة",
    description: "تصميم وتطوير أنظمة متكاملة لمختلف المجالات والقطاعات",
    color: "yellow"
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "حلول الفرق",
    description: "حلول تقنية متكاملة لفرق العمل لزيادة الإنتاجية والكفاءة",
    color: "red"
  },
  {
    icon: <MessageSquare className="w-10 h-10" />,
    title: "استشارات تقنية",
    description: "استشارات في مجال التقنية وتحليل البيانات والذكاء الاصطناعي",
    color: "green"
  },
  {
    icon: <Code className="w-10 h-10" />,
    title: "تحكم متكامل",
    description: "أنظمة تحكم وإدارة متكاملة للشركات والمؤسسات الكبرى",
    color: "blue"
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
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-trndsky-blue via-trndsky-green to-trndsky-yellow rounded-full"></span>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-tajawal">
            نقدم باقة متكاملة من الخدمات التقنية المتطورة لمساعدة عملائنا على تحقيق أهدافهم
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, index) => {
            // Define gradient and shadow based on color
            let gradientClass = "";
            let shadowClass = "";
            
            switch(service.color) {
              case "blue":
                gradientClass = "bg-gradient-to-br from-trndsky-blue to-trndsky-blue/80";
                shadowClass = "group-hover:shadow-blue-glow";
                break;
              case "yellow":
                gradientClass = "bg-gradient-to-br from-trndsky-yellow to-trndsky-yellow/80";
                shadowClass = "group-hover:shadow-yellow-glow";
                break;
              case "red":
                gradientClass = "bg-gradient-to-br from-trndsky-red to-trndsky-red/80";
                shadowClass = "group-hover:shadow-red-glow";
                break;
              case "green":
                gradientClass = "bg-gradient-to-br from-trndsky-green to-trndsky-green/80";
                shadowClass = "group-hover:shadow-green-glow";
                break;
              default:
                gradientClass = "bg-gradient-to-br from-trndsky-blue to-trndsky-blue/80";
                shadowClass = "group-hover:shadow-blue-glow";
            }
            
            return (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-500
                  hover:transform hover:translate-y-[-5px] border border-gray-100 group
                  hover:border-gray-200"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl 
                  ${gradientClass} text-white group-hover:shadow-lg ${shadowClass}
                  transition-all duration-500 transform group-hover:scale-110`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-tajawal text-gray-800 group-hover:text-trndsky-blue transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 font-tajawal leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
