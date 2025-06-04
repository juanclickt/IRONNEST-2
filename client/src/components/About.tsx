import { Eye, Target } from "lucide-react";

import image2 from "@assets/2.jpeg";

export default function About() {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-black mb-8">
              OUR <span className="outline-text">VISION</span>
            </h2>
            <div className="bg-gray-900 rounded-2xl p-8 mb-12">
              <p className="text-lg leading-relaxed">
                To transform everyday spaces into powerful, inspiring training environments—where performance meets precision, and strength feels at home.
              </p>
            </div>
            
            <h2 className="text-5xl font-black mb-8">
              OUR <span className="outline-text">MISSION</span>
            </h2>
            <div className="bg-gray-900 rounded-2xl p-8">
              <p className="text-lg leading-relaxed">
                IronNest Installations is dedicated to delivering top-tier gym flooring, equipment, mirrors, and lighting—designed for home gyms, studios, and training academies. We bring expert installation, functional design, and elite-quality gear together to elevate your training space.
              </p>
            </div>
          </div>
          
          <div className="space-y-8">
            <img 
              src={image2} 
              alt="Professional gym installation" 
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            
            <div className="text-center bg-iron-dark rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 tracking-wider">BUILDING STRENGTH FROM THE GROUND UP</h3>
              <p className="text-gray-300">Cape Town's premier gym installation specialists</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
