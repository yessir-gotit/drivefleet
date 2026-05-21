import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AvailableCars from "@/components/AvailableCars";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AvailableCars />
      <About />
      <WhyChooseUs />
      <Footer />
    </>
  );
}
