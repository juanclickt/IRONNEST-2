import { Instagram } from "lucide-react";
import companySignet from "@assets/2.png";

export default function Footer() {
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

  const services = ["Design", "Supply", "Install", "Maintain"];
  const quickLinks = [
    { name: "About Us", id: "about" },
    { name: "Gallery", id: "gallery" },
    { name: "Contact", id: "contact" },
    { name: "Book Consultation", id: "booking" }
  ];

  return (
    <footer className="bg-iron-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={companySignet} alt="IronNest Signet" className="h-12 w-12" />
              <span className="text-xl font-bold tracking-tight">IRONNEST</span>
              <span className="text-sm text-gray-400">INSTALLATIONS</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Transforming spaces into powerful training environments across Cape Town. Your trusted partner for professional gym installations.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/ironnest_installations?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-iron-green transition-colors duration-200"
              >
                <Instagram className="text-xl w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              {services.map((service, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-iron-green transition-colors duration-200">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection(link.id)}
                    className="hover:text-iron-green transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Clickt Digital. All rights reserved. | Cape Town, South Africa</p>
        </div>
      </div>
    </footer>
  );
}
