import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Zap, Star, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <section
      className="relative overflow-hidden bg-base-200 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-36 "
      id="about"
    >
      <span
        className="text-[10rem] sm:text-[12rem] md:text-[14rem] lg:text-[18rem] xl:text-[22rem] font-heading font-black text-white/[0.025] absolute -top-6 sm:-top-2 md:top-0 right-0 leading-none select-none pointer-events-none z-0 mt-10 md:mt-0"
        aria-hidden="true"
      >
        03
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

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 lg:gap-14 xl:gap-24 items-center">
          <div className="relative w-full max-w-xs sm:max-w-sm mx-auto md:max-w-none">
            <div className="relative w-[68%] md:w-[62%] lg:w-[65%] aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=600&q=80"
                alt="Luxury sports car front view"
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 768px) 60vw, (max-width: 1280px) 30vw, 28vw"
              />
            </div>

            <div className="w-[58%] md:w-[52%] lg:w-[55%] ml-auto -mt-8 md:-mt-8 lg:-mt-12 relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 z-10">
              <Image
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
                alt="Porsche 911 cruising on coastal road"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 24vw"
              />
            </div>

            <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 lg:bottom-4 lg:left-4 z-20 glass-premium px-2.5 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-full text-[11px] md:text-xs lg:text-sm font-semibold">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse inline-block mr-1 md:mr-1.5 lg:mr-2" />
              500+ Premium Vehicles
            </div>
          </div>

          <div className="md:pl-0 lg:pl-10 xl:pl-20">
            <span className="border-l-2 border-primary pl-3 text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase text-primary font-semibold">
              About DriveFleet
            </span>

            <h2 className="font-heading text-[1.85rem] sm:text-3xl md:text-[2.1rem] lg:text-[2.75rem] xl:text-6xl font-bold tracking-tighter leading-[1.08] mt-3 md:mt-4 break-words">
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

            <p className="mt-4 md:mt-5 lg:mt-6 text-base-content/60 text-sm md:text-[0.94rem] lg:text-lg leading-relaxed max-w-md">
              DriveFleet was built for people who see driving as more than
              transport. We handpick every vehicle in our fleet — from electric
              hypercars to refined grand tourers — and pair them with a seamless
              digital booking experience.
            </p>

            <div className="mt-5 md:mt-6 lg:mt-8 space-y-3 md:space-y-3 lg:space-y-4">
              <div className="flex items-start gap-2.5 md:gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm md:text-base text-base-content">
                    Verified &amp; Insured
                  </p>
                  <p className="text-xs md:text-sm text-base-content/55">
                    Every vehicle passes our 50-point safety check
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 md:gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Zap className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm md:text-base text-base-content">
                    Instant Booking
                  </p>
                  <p className="text-xs md:text-sm text-base-content/55">
                    Reserve in under 2 minutes, zero paperwork
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 md:gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Star className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm md:text-base text-base-content">
                    Concierge Support
                  </p>
                  <p className="text-xs md:text-sm text-base-content/55">
                    24/7 dedicated assistance on every rental
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-8 lg:mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-primary hover:gap-3 transition-all duration-300 group"
              >
                Our Full Story
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
