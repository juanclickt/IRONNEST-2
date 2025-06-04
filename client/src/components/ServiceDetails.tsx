import { ClipboardList, Search, Truck, Handshake } from "lucide-react";
import consultingImage from "@assets/ChatGPT Image May 25, 2025, 11_41_23 AM.png";
import image1 from "@assets/1.jpeg";
import image2 from "@assets/2.jpeg";
import image3 from "@assets/3.jpeg";
import image4 from "@assets/4.jpeg";

export default function ServiceDetails() {
  const serviceDetails = [
    {
      icon: ClipboardList,
      title: "CONSULTING",
      subtitle: "& PLANNING",
      description: "We start by understanding your space, goals, and training style. Whether it's a home gym, studio, or academy—we design around your needs.",
      image: consultingImage,
      imageAlt: "Two people discussing home gym layout plans"
    },
    {
      icon: Search,
      title: "PRODUCT",
      subtitle: "SOURCING",
      description: "We work with trusted suppliers to find the best equipment, flooring, mirrors, and lighting for your budget and vision.",
      image: image3,
      imageAlt: "Premium gym equipment and supplies",
      reverse: true
    },
    {
      icon: Truck,
      title: "DELIVERY &",
      subtitle: "INSTALLATION",
      description: "From gym racks to rubber flooring, our team ensures every piece is delivered and professionally installed with precision and care.",
      image: image1,
      imageAlt: "Professional gym equipment installation"
    },
    {
      icon: Handshake,
      title: "ONGOING",
      subtitle: "SUPPORT",
      description: "Need extra gear? Want to upgrade later? We're just a call away—your long-term gym partner.",
      image: image4,
      imageAlt: "Ongoing gym equipment support and maintenance",
      reverse: true
    }
  ];

  return (
    <section className="py-20 bg-iron-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-6">
            HOW WE <span className="outline-text block">OPERATE</span>
          </h2>
        </div>
        
        <div className="space-y-20">
          {serviceDetails.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${service.reverse ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={service.reverse ? 'lg:order-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="bg-iron-green rounded-lg p-3 mr-4">
                      <IconComponent className="text-black text-2xl w-6 h-6" />
                    </div>
                    <h3 className="text-4xl font-black">
                      {service.title} <span className="outline-text">{service.subtitle}</span>
                    </h3>
                  </div>
                  <div className="bg-gray-900 rounded-2xl p-8">
                    <p className="text-lg leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
                <img 
                  src={service.image}
                  alt={service.imageAlt}
                  className={`rounded-2xl shadow-2xl w-full h-96 object-cover ${service.reverse ? 'lg:order-1' : ''}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
