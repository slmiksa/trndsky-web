
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
    <section className="section-padding bg-trndsky-gray">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 font-tajawal text-trndsky-darkblue">
          شركاء <span className="text-trndsky-teal">النجاح</span>
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div 
              key={partner.id} 
              className="bg-white p-4 rounded-lg shadow-sm card-hover"
            >
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="h-16 object-contain" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
