"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const CAR_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=85&auto=format&fit=crop",
    alt: "Porsche 911 cruising on coastal road",
  },
  {
    src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=85&auto=format&fit=crop",
    alt: "Lamborghini side profile on city street",
  },
  {
    src: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=1451&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Mercedes AMG GT front view",
  },
  {
    src: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=85&auto=format&fit=crop",
    alt: "BMW M Series driving on highway",
  },
  {
    src: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1920&q=85&auto=format&fit=crop",
    alt: "Ferrari parked in urban setting",
  },
];

const AUTO_INTERVAL_MS = 2000; // 2 seconds per slide

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(
    typeof document !== "undefined" ? document.hidden : false
  );
  const intervalRef = useRef(null);
  const totalSlides = CAR_IMAGES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(nextSlide, AUTO_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, nextSlide]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    setCurrentSlide(index);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isPaused) {
      intervalRef.current = setInterval(nextSlide, AUTO_INTERVAL_MS);
    }
  };

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

      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-base-100"
      >
        <div className="absolute inset-0 z-0" aria-hidden="true">
          {CAR_IMAGES.map((image, index) => (
            <div
              key={image.src}
              className="absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ opacity: index === currentSlide ? 1 : 0 }}
            >
              <Image
                src={image.src}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center scale-105 blur-[2px] opacity-[0.12]"
              />
            </div>
          ))}
        </div>

        <div
          className="absolute inset-0 z-1"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 50%,
                transparent 0%,
                rgba(5,5,5,0.6) 60%,
                rgba(5,5,5,0.97) 100%)
            `,
          }}
          aria-hidden="true"
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-40 z-1 bg-linear-to-t from-base-100 to-transparent"
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
            &ldquo;Handpicked performance vehicles for those who refuse to
            settle. Reserve yours in minutes.&rdquo;
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

          <div className="flex items-center gap-2.5 mt-16 md:mt-20">
            {CAR_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={[
                  "rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
                  index === currentSlide
                    ? "w-8 h-1.5 bg-primary/80 shadow-[0_0_10px_rgba(0,102,255,0.35)]"
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40",
                ].join(" ")}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
