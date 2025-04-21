
import Navbar from '../components/Navbar';

const About = () => {
  const teamMembers = [
    {
      name: "أحمد السعيد",
      position: "المدير التنفيذي",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "سارة المحمد",
      position: "مدير تطوير البرمجيات",
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      name: "خالد العمري",
      position: "مهندس برمجيات رئيسي",
      image: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      name: "نورة الأحمد",
      position: "مديرة تجربة المستخدم",
      image: "https://randomuser.me/api/portraits/women/4.jpg"
    },
  ];

  const stats = [
    { value: "+10", label: "سنوات خبرة" },
    { value: "+200", label: "مشروع منجز" },
    { value: "+100", label: "عميل راضٍ" },
    { value: "+25", label: "مطور محترف" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-trndsky-blue text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 font-tajawal">من نحن</h1>
          <p className="text-xl text-center max-w-3xl mx-auto font-tajawal">
            شركة رائدة في مجال تطوير البرمجيات والحلول التقنية المتكاملة
          </p>
        </div>
      </div>
      
      <main className="flex-grow">
        {/* Company Overview */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-trndsky-darkblue font-tajawal">رؤيتنا ورسالتنا</h2>
                <div className="space-y-4 text-gray-700 font-tajawal text-right">
                  <p>
                    تأسست شركة TRNDSKY في عام 2015 بهدف تقديم حلول برمجية مبتكرة تساعد الشركات على النمو والازدهار في العصر الرقمي.
                  </p>
                  <p>
                    نحن نؤمن بأن التكنولوجيا يجب أن تكون متاحة وسهلة الاستخدام للجميع، ولذلك نسعى لتطوير برمجيات متطورة مع واجهات مستخدم بسيطة وسلسة.
                  </p>
                  <p>
                    رؤيتنا هي أن نصبح الشريك التقني المفضل للشركات في المنطقة من خلال تقديم خدمات عالية الجودة والاستماع لاحتياجات عملائنا وتحويل أفكارهم إلى حلول واقعية.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="فريق العمل" 
                  className="rounded-lg shadow-lg w-full object-cover h-[400px]" 
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 px-4 bg-trndsky-gray">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-trndsky-teal mb-2">{stat.value}</div>
                  <div className="text-gray-700 font-tajawal">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Our Team */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-trndsky-darkblue font-tajawal">
              فريقنا <span className="text-trndsky-teal">المتميز</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md text-center card-hover">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1 font-tajawal">{member.name}</h3>
                    <p className="text-gray-600 font-tajawal">{member.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 px-4 bg-trndsky-blue text-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center font-tajawal">
              قيمنا <span className="text-trndsky-teal">ومبادئنا</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-center font-tajawal">الابتكار</h3>
                <p className="text-gray-100 text-right font-tajawal">
                  نسعى دائمًا لتطوير حلول مبتكرة تتجاوز توقعات عملائنا وتساعدهم على تحقيق أهدافهم بطرق جديدة وفعالة.
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-center font-tajawal">الجودة</h3>
                <p className="text-gray-100 text-right font-tajawal">
                  نلتزم بتقديم منتجات وخدمات عالية الجودة تتميز بالأداء الممتاز والاستقرار والأمان لضمان رضا عملائنا.
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-center font-tajawal">التعاون</h3>
                <p className="text-gray-100 text-right font-tajawal">
                  نؤمن بأهمية التعاون مع عملائنا لفهم احتياجاتهم والعمل معًا لتحقيق النجاح المشترك وبناء علاقات طويلة الأمد.
                </p>
              </div>
            </div>
          </div>
        </section>
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

export default About;
