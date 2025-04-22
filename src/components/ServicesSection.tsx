
import { Code, MessageSquare, Users, Layers, Code2 } from 'lucide-react';

const services = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "تطوير البرمجيات",
    description: "تطوير تطبيقات ومواقع احترافية"
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: "هندسة الانظمة",
    description: "تصميم وتطوير أنظمة متكاملة"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "حلول الفرق",
    description: "حلول تقنية لفرق العمل"
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "استشارات تقنية",
    description: "استشارات في مجال التقنية"
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "تحكم متكامل",
    description: "أنظمة تحكم وإدارة متكاملة"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 modern-gradient">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="modern-card p-6 text-center"
            >
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-trndsky-blue/10 text-trndsky-blue">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 font-tajawal text-trndsky-darkblue">
                {service.title}
              </h3>
              <p className="text-gray-600 font-tajawal">
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
