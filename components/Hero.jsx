import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import About from "./About";
export default function Hero() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-animate {
          opacity: 0;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-base-100">

        
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2670&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.12] blur-[2px] scale-105"
          />
        </div>

        {/* 2. Gradient */}
        <div
          className="absolute inset-0 z-1"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 50%,
                transparent 0%,
                rgba(5,5,5,0.6) 60%,
                rgba(5,5,5,0.97) 100%)
            `
          }}
          aria-hidden="true"
        />


        <div
          className="absolute bottom-0 left-0 right-0 h-40 z-[1] bg-linear-to-t from-base-100 to-transparent"
          aria-hidden="true"
        />


        <div
          className="absolute top-0 left-0 right-0 h-32 z-[1] bg-linear-to-b from-base-100/80 to-transparent"
          aria-hidden="true"
        />


        <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-8 max-w-6xl mx-auto w-full pt-24">


          <div
            className="hero-animate inline-flex items-center gap-3 mb-10 md:mb-14"
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-px w-8 bg-white/20" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-base-content/40">
              Premium Automotive Experience
            </span>
            <span className="h-px w-8 bg-white/20" aria-hidden="true" />
          </div>


          <h1
            className="hero-animate font-heading font-bold tracking-[-0.04em] leading-[0.95] mb-8 md:mb-10"
            style={{ animationDelay: "100ms" }}
          >
            <span className="block text-[clamp(4rem,12vw,9rem)] text-base-content">
              Drive
            </span>
            <span className="block text-[clamp(4rem,12vw,9rem)] text-base-content/30">
              Beyond
            </span>
            <span className="block text-[clamp(4rem,12vw,9rem)] text-base-content">
              Ordinary.
            </span>
          </h1>

          <div
            className="hero-animate w-12 h-px bg-primary/60 mb-8 md:mb-10"
            style={{ animationDelay: "180ms" }}
            aria-hidden="true"
          />

          <p
            className="hero-animate text-base md:text-lg text-base-content/45 font-light leading-relaxed max-w-md mb-12"
            style={{ animationDelay: "220ms" }}
          >
            &ldquo;Handpicked performance vehicles for those who refuse to settle.
            Reserve yours in minutes.&rdquo;
          </p>


          <div
            className="hero-animate flex flex-col sm:flex-row items-center gap-4"
            style={{ animationDelay: "300ms" }}
          >
     
            <Link
              href="/cars"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-white text-sm font-semibold tracking-wide hover:bg-primary/90 hover:-translate-y-px hover:shadow-[0_0_36px_rgba(0,102,255,0.4)] transition-all duration-300 group"
            >
              Explore Fleet
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              href="#about"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-base-content/50 text-sm font-medium tracking-wide border border-white/10 hover:border-white/20 hover:text-white/80 transition-all duration-300"
            >
              How It Works
            </Link>
          </div>

          

        </div>
      </section>
    </>
  );
}
