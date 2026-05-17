import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-base-100">

      <div className="ambient-glow"></div>
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2574&auto=format&fit=crop')",
        }}
      ></div>


      <div className="absolute inset-0 z-0 bg-linear-to-r from-[#050505] via-[#050505]/80 to-transparent md:via-[#050505]/60"></div>
      <div className="absolute inset-0 z-0 bg-linear-to-t from-[#050505] via-transparent to-transparent"></div>

      <div className="max-w-400 w-full mx-auto px-4 md:px-8 z-10 relative flex flex-col justify-center h-full mt-16 md:mt-0">
        
        <div className="max-w-3xl">

          <span className="inline-block py-1 px-3 rounded-full border border-white/10 bg-white/5 text-sm font-medium tracking-wide text-base-content/80 mb-6 backdrop-blur-md">
            DriveFleet Premium Collection
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter text-white leading-[1.05]">
            Pure Performance. <br />
            <span className="text-base-content/50">Zero Compromise.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-base-content/70 font-light max-w-2xl mt-8 leading-relaxed">
            Experience the pinnacle of automotive engineering. Reserve exclusive, 
            high-performance vehicles engineered for those who demand more from every journey.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
            <Link 
              href="/cars" 
              className="btn btn-primary rounded-full px-8 py-4 h-auto text-lg font-medium text-white border-none hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,102,255,0.6)] transition-all duration-300 group"
            >
              Explore Fleet
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/about" 
              className="btn bg-transparent border-white/20 text-white rounded-full px-8 py-4 h-auto text-lg font-medium hover:bg-white/5 hover:border-white/40 hover:-translate-y-1 transition-all duration-300"
            >
              How it works
            </Link>
          </div>
        </div>
      </div>

     
      
    </section>
  );
}