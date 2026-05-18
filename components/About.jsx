import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Zap, Star, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <section className="relative overflow-hidden bg-base-200 py-24 mt-3 md:py-36" id="about">
      <span
        className="text-[18rem] md:text-[22rem] font-heading font-black text-white/2.5 absolute top-0 right-0 leading-none select-none pointer-events-none z-0 "
        aria-hidden="true"
      >
        02
      </span>

      <div
        className="ambient-glow"
        style={{
          left: "0%",
          top: "auto",
          bottom: "-10%",
          transform: "translateX(0) scale(0.4)",
          transformOrigin: "bottom left",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24  items-center">
          <div className="relative overflow-hidden">
            <div className="relative w-[65%] aspect-3/4 rounded-2xl overflow-hidden border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=600&q=80"
                alt="Luxury sports car front view"
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 768px) 65vw, 30vw"
              />
            </div>

            <div className="w-[55%] ml-auto -mt-12 z-10 relative aspect-4/3 rounded-2xl overflow-hidden border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
                alt="Porsche 911 cruising on coastal road"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 55vw, 25vw"
              />
            </div>

            
            <div className="absolute bottom-4 left-4 z-20 glass-premium px-4 py-2 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block mr-2" />
              500+ Premium Vehicles
            </div>
          </div>

       
          <div className="md:pl-12 lg:pl-20">
          
            <span className="border-l-2 border-primary pl-3 text-xs tracking-[0.2em] uppercase text-primary font-semibold">
              About DriveFleet
            </span>

            {/* Heading */}
            <h2 className="font-heading text-[2.5rem] sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] mt-4 wrap-break-word">
              <span className="text-base-content">{`We Don't Just`}</span>
              <br />
              <span className="text-base-content">Rent Cars.</span>
              <br />
              <span className="text-base-content">We Curate</span>
              <br />
              <span
                className="text-transparent"
                style={{
                  WebkitTextStroke: "1.5px rgba(244,244,245,0.35)",
                }}
              >
                Experiences.
              </span>
            </h2>


            <p className="mt-6 text-base-content/60 text-lg leading-relaxed max-w-md">
              DriveFleet was built for people who see driving as more than
              transport. We handpick every vehicle in our fleet — from electric
              hypercars to refined grand tourers — and pair them with a seamless
              digital booking experience.
            </p>


            <div className="mt-8 space-y-4">

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-base-content">
                    Verified & Insured
                  </p>
                  <p className="text-sm text-base-content/55">
                    Every vehicle passes our 50-point safety check
                  </p>
                </div>
              </div>


              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-base-content">
                    Instant Booking
                  </p>
                  <p className="text-sm text-base-content/55">
                    Reserve in under 2 minutes, zero paperwork
                  </p>
                </div>
              </div>


              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-base-content">
                    Concierge Support
                  </p>
                  <p className="text-sm text-base-content/55">
                    24/7 dedicated assistance on every rental
                  </p>
                </div>
              </div>
            </div>


            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-300 group"
              >
                Our Full Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
