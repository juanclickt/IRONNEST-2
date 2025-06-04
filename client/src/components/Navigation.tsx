import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import companyLogo from "@assets/1.png";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-sm border-b border-gray-800' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 md:py-4">
          <div className="flex items-center space-x-2">
            <img src={companyLogo} alt="IronNest Logo" className="h-12 md:h-16 w-auto" />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="hover:text-iron-green transition-colors duration-200"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="hover:text-iron-green transition-colors duration-200"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="hover:text-iron-green transition-colors duration-200"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="hover:text-iron-green transition-colors duration-200"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-iron-green text-black px-6 py-2 rounded-lg font-semibold hover:bg-green-400 transition-colors duration-200"
            >
              Contact
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white flex-shrink-0 p-1"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left hover:text-iron-green transition-colors duration-200"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-left hover:text-iron-green transition-colors duration-200"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left hover:text-iron-green transition-colors duration-200"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-left hover:text-iron-green transition-colors duration-200"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-iron-green text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition-colors duration-200 w-fit"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
