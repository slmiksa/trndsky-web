
const partners = [
  {
    id: 1,
    name: "شركة تك سوليوشنز",
    logo: "https://placehold.co/200x100/e5e7eb/a3a3a3?text=Tech+Solutions&font=Raleway",
  },
  {
    id: 2,
    name: "مؤسسة المستقبل الرقمي",
    logo: "https://placehold.co/200x100/e5e7eb/a3a3a3?text=Digital+Future&font=Raleway",
  },
  {
    id: 3,
    name: "شركة بيانات المتقدمة",
    logo: "https://placehold.co/200x100/e5e7eb/a3a3a3?text=Advanced+Data&font=Raleway",
  },
  {
    id: 4,
    name: "مجموعة الابتكار",
    logo: "https://placehold.co/200x100/e5e7eb/a3a3a3?text=Innovation+Group&font=Raleway",
  },
  {
    id: 5,
    name: "شركة سمارت تك",
    logo: "https://placehold.co/200x100/e5e7eb/a3a3a3?text=Smart+Tech&font=Raleway",
  },
];

const PartnersSection = () => {
  return (
    <section className="section-padding bg-gradient-to-tr from-[#f7fafc] via-[#ebf5fd] to-trndsky-gray">
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-12 font-tajawal text-trndsky-darkblue drop-shadow">
          شركاء <span className="text-trndsky-teal">النجاح</span>
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14">
          {partners.map((partner) => (
            <div 
              key={partner.id} 
              className="bg-white rounded-full border border-trndsky-blue/10 shadow-sm hover:shadow-md transition-all flex items-center justify-center h-28 w-44 md:h-32 md:w-56 p-3"
            >
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="object-contain max-h-14 max-w-[200px]" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
