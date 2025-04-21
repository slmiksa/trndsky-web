
import { Code, Globe, Calendar, Settings, Star } from 'lucide-react';

const iconData = [
  {
    icon: <Code className="h-12 w-12 text-trndsky-teal mb-4" />,
    title: "تطوير مخصص",
    description: "برمجة حلول مخصصة تلبي احتياجات عملك بالضبط"
  },
  {
    icon: <Globe className="h-12 w-12 text-trndsky-teal mb-4" />,
    title: "تطبيقات الويب",
    description: "تطوير مواقع وتطبيقات ويب متجاوبة وسريعة"
  },
  {
    icon: <Settings className="h-12 w-12 text-trndsky-teal mb-4" />,
    title: "حلول متكاملة",
    description: "خدمات شاملة من التصميم إلى الاستضافة والصيانة"
  },
  {
    icon: <Calendar className="h-12 w-12 text-trndsky-teal mb-4" />,
    title: "تسليم سريع",
    description: "التزام بمواعيد التسليم مع جودة عالية"
  },
  {
    icon: <Star className="h-12 w-12 text-trndsky-teal mb-4" />,
    title: "خبرة واسعة",
    description: "فريق من المطورين ذوي خبرة في مختلف التقنيات"
  }
];

const TechIcons = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 font-tajawal text-trndsky-darkblue drop-shadow">
          خدماتنا <span className="text-trndsky-teal">البرمجية</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {iconData.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-7 rounded-xl shadow-lg card-hover bg-gradient-to-br from-white via-trndsky-gray to-[#effafe] hover:scale-105 hover:shadow-xl transition-all"
            >
              <div className="animate-bounce-slow">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 font-tajawal text-trndsky-blue">{item.title}</h3>
              <p className="text-gray-600 font-tajawal">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechIcons;
