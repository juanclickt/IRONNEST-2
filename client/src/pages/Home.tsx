import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import ServiceDetails from "@/components/ServiceDetails";
import Gallery from "@/components/Gallery";
import BookingSystem from "@/components/BookingSystem";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      <Hero />
      <Services />
      <About />
      <ServiceDetails />
      <Gallery />
      <BookingSystem />
      <Contact />
      <Footer />
    </div>
  );
}
