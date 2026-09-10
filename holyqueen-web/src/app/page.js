import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Schemes from "@/components/sections/Schemes";
import Deposits from "@/components/sections/Deposits";
import Calculator from "@/components/sections/Calculator";
import Why from "@/components/sections/Why";
import Policies from "@/components/sections/Policies";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Location from "@/components/sections/Location";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Schemes />
      <Deposits />
      <Calculator />
      <Why />
      <Policies />
      <Services />
      <Testimonials />
      <Location />
      <Contact />
    </>
  );
}
