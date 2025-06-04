import homeGymImage from "@assets/pexels-anete-lusina-16513600.jpg";
import commercialGymImage from "@assets/pexels-am83-14636326.jpg";

export default function Gallery() {
  const galleryItems = [
    {
      image: homeGymImage,
      alt: "Modern home gym installation",
      title: "Home Gym Setup"
    },
    {
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600",
      alt: "Professional gym flooring installation",
      title: "Premium Flooring"
    },
    {
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600",
      alt: "Training academy installation",
      title: "Training Academy"
    },
    {
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600",
      alt: "Fitness studio installation",
      title: "Fitness Studio"
    },
    {
      image: commercialGymImage,
      alt: "Commercial gym club installation",
      title: "Commercial Club"
    },
    {
      image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600",
      alt: "Custom gym equipment and mirror installation",
      title: "Custom Installation"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-6">
            OUR <span className="outline-text">WORK</span>
          </h2>
          <p className="text-xl text-gray-300">Recent installations across Cape Town</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <div key={index} className="relative group overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={item.image}
                alt={item.alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-semibold">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
