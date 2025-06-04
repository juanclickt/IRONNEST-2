import { Calendar } from "lucide-react";
import companySignet from "@assets/2.png";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center space-x-4 mb-8">
          <img src={companySignet} alt="IronNest Signet" className="h-20 w-20" />
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-wider">IRONNEST</h1>
            <p className="text-sm text-gray-300 tracking-widest">INSTALLATIONS</p>
          </div>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          TRANSFORM YOUR
          <span className="block text-iron-green">TRAINING SPACE</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Your turnkey solution for custom gym spaces — flooring, paint, mirrors, and lighting, all in one seamless service
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => scrollToSection('booking')}
            className="bg-iron-green text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-400 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Book Consultation
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-black transition-all duration-200"
          >
            View Services
          </button>
        </div>
      </div>
    </section>
  );
}
