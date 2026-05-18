"use client";

import Link from "next/link";
import { ArrowRight, Car, Headphones } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          opacity: 0;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <Navbar />

      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-base-100">

        {/*  Ambient Glow  */}
        <div className="ambient-glow z-1" aria-hidden="true" />

        {/*  Edge Fades  */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 z-[1] bg-linear-to-t from-base-100 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 right-0 h-32 z-[1] bg-linear-to-b from-base-100/80 to-transparent"
          aria-hidden="true"
        />

        {/*  Content  */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-8 max-w-6xl mx-auto w-full pt-24">

          {/*  Eyebrow  */}
          <div
            className="animate-in flex items-center gap-3 mb-8 md:mb-10"
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-px w-8 bg-white/20" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-base-content/40">
              Error 404
            </span>
            <span className="h-px w-8 bg-white/20" aria-hidden="true" />
          </div>

          {/*  Giant 404 Typography  */}
          <div
            className="animate-in flex items-baseline justify-center gap-4 md:gap-8 select-none"
            style={{ animationDelay: "100ms" }}
          >
            {/* Outlined "4" */}
            <span
              className="font-heading font-black leading-none"
              style={{
                fontSize: "clamp(6rem, 25vw, 16rem)",
                WebkitTextStroke: "2px rgba(244,244,245,0.25)",
                color: "transparent",
              }}
            >
              4
            </span>

            {/* Glowing ring of 0 */}
            <span className="relative inline-flex items-center justify-center">
              <span
                className="block rounded-full border-4 md:border-[6px] border-primary"
                style={{
                  width: "clamp(5rem, 20vw, 13rem)",
                  height: "clamp(5rem, 20vw, 13rem)",
                  boxShadow: "0 0 60px rgba(0,102,255,0.25), 0 0 120px rgba(0,102,255,0.1)",
                }}
                aria-hidden="true"
              />
            </span>

            {/* Outlined 4 */}
            <span
              className="font-heading font-black leading-none"
              style={{
                fontSize: "clamp(6rem, 25vw, 16rem)",
                WebkitTextStroke: "2px rgba(244,244,245,0.25)",
                color: "transparent",
              }}
            >
              4
            </span>
          </div>

          {/*  Divider  */}
          <div
            className="animate-in w-14 h-px bg-primary/60 mt-6 md:mt-8 mb-6 md:mb-8"
            style={{ animationDelay: "180ms" }}
            aria-hidden="true"
          />

          {/*  Message  */}
          <p
            className="animate-in text-base md:text-lg text-base-content/45 font-light leading-relaxed max-w-md px-2"
            style={{ animationDelay: "220ms" }}
          >
            You&rsquo;ve wandered off the map. This page doesn&rsquo;t exist — but the road ahead is full of possibilities.
          </p>

          {/*  Primary CTA  */}
          <div
            className="animate-in mt-10 md:mt-12"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-white text-sm font-semibold tracking-wide hover:bg-primary/90 hover:-translate-y-px hover:shadow-[0_0_36px_rgba(0,102,255,0.4)] transition-all duration-300 group"
            >
              Take Me Home
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/*  Secondary Links  */}
          <div
            className="animate-in mt-8 flex items-center gap-5 text-sm text-base-content/40"
            style={{ animationDelay: "380ms" }}
          >
            <Link
              href="/cars"
              className="inline-flex items-center gap-1.5 hover:text-base-content/70 transition-colors duration-200 group"
            >
              <Car className="w-3.5 h-3.5" strokeWidth={2} />
              Browse Cars
            </Link>

            <span className="w-px h-3 bg-white/10" aria-hidden="true" />

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 hover:text-base-content/70 transition-colors duration-200 group"
            >
              <Headphones className="w-3.5 h-3.5" strokeWidth={2} />
              Contact Support
            </Link>
          </div>

        </div>

        {/*  Decorative Background Watermark  */}
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 font-heading font-black text-[clamp(12rem,40vw,30rem)] text-white/[0.018] leading-none select-none pointer-events-none z-0"
          aria-hidden="true"
        >
          404
        </span>

      </main>
    </>
  );
}
