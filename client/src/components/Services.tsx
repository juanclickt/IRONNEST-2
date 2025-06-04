import { PenTool, Package, Wrench, RotateCcw, CheckCircle } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: PenTool,
      title: "Design",
      description: "Custom gym layouts tailored to your space, goals, and training style. From concept to detailed blueprints."
    },
    {
      icon: Package,
      title: "Supply",
      description: "Premium equipment sourcing from trusted suppliers. Quality gear that meets your budget and vision."
    },
    {
      icon: Wrench,
      title: "Install",
      description: "Professional installation with precision and care. Every piece perfectly positioned for optimal performance."
    },
    {
      icon: RotateCcw,
      title: "Maintain",
      description: "Ongoing support and maintenance. We're your long-term gym partner for upgrades and service."
    }
  ];

  return (
    <section id="services" className="py-20 bg-iron-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-6">
            OUR <span className="outline-text">SERVICES</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            YOUR GYM, OUR CRAFT
          </p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Left vertical block */}
          <div className="lg:col-span-2 bg-iron-green text-black rounded-2xl p-12 flex flex-col justify-center min-h-[400px]">
            <h3 className="text-2xl lg:text-3xl font-black mb-8 leading-tight">
              From floor to ceiling, we build your gym the right way
            </h3>
            <ul className="space-y-6">
              {['Flooring', 'Lighting', 'Paint', 'Mirrors', 'Equipment'].map((item, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-4 text-black flex-shrink-0" />
                  <span className="text-lg font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right service cards */}
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={index}
                  className="bg-white text-black rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-black rounded-full p-4 mr-4 flex items-center justify-center min-w-[64px] min-h-[64px]">
                      {index === 0 && <PenTool className="w-8 h-8" style={{ color: '#7ED321' }} />}
                      {index === 1 && <Package className="w-8 h-8" style={{ color: '#7ED321' }} />}
                      {index === 2 && <Wrench className="w-8 h-8" style={{ color: '#7ED321' }} />}
                      {index === 3 && <RotateCcw className="w-8 h-8" style={{ color: '#7ED321' }} />}
                    </div>
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
