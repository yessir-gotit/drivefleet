"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Car,
  Users,
  MapPin,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { API } from "@/lib/api";
const API_URL = API.cars;
const MAX_CARS = 6;

function formatRate(rate) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rate);
}

function SkeletonCard() {
  return (
    <div className="relative rounded-2xl border border-white/[0.07] bg-base-200 overflow-hidden">
      <div className="aspect-video skeleton-shimmer" />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded-full skeleton-shimmer" />
          <div className="h-5 w-20 rounded-full skeleton-shimmer" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full skeleton-shimmer" />
          <div className="h-3 w-3/4 rounded-full skeleton-shimmer" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-20 rounded-full skeleton-shimmer" />
          <div className="h-4 w-24 rounded-full skeleton-shimmer" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <div className="h-6 w-24 rounded-full skeleton-shimmer" />
          <div className="h-9 w-28 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

function CarCard({ car, index }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group relative rounded-2xl border border-white/[0.07] bg-base-200 overflow-hidden transition-all duration-500 hover:border-white/[0.14] hover:-translate-y-1.5 flex flex-col h-full "
      style={{ animationDelay: `${80 + index * 80}ms` }}
    >
      <div
        className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-all duration-500 pointer-events-none z-10"
        aria-hidden="true"
      />

      <div className="relative aspect-video overflow-hidden bg-base-300 isolate">
        {!imgError ? (
          <Image
            src={car.imageUrl}
            alt={car.carName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-base-300">
            <Car className="w-10 h-10 text-base-content/20" strokeWidth={1} />
          </div>
        )}

        <div
          className="absolute inset-0 bg-linear-to-t from-base-200 via-base-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-heading text-lg font-bold tracking-tight text-base-content leading-tight">
            {car.carName}
          </h3>
          <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {car.carType}
          </span>
        </div>

        <div className="flex-1">
          <p className="text-sm text-base-content/50 leading-relaxed line-clamp-2 mb-4">
            {car.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-base-content/40">
              <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
              {car.seatCapacity} seats
            </div>
            <div className="flex items-center gap-1.5 text-xs text-base-content/40">
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
              {car.pickupLocation}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]`}
              />
              <span className="text-emerald-400/70">Available</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div>
            <span className="text-xl font-bold text-primary font-heading tracking-tight">
              {formatRate(car.dailyRate)}
            </span>
            <span className="text-xs text-base-content/40 ml-1">/ day</span>
          </div>

          <Link
            href={`/cars/${car._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-base-content/60 border border-white/10 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group/btn"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />
    </div>
  );
}

export default function AvailableCars() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}?isAvailable=true`, {
          signal: controller.signal,
        });

        if (cancelled) return;

        if (!res.ok) {
          throw new Error(`Failed to load vehicles (${res.status})`);
        }

        const data = await res.json();

        if (cancelled) return;

        // Slice to first 6
        setCars(Array.isArray(data) ? data.slice(0, MAX_CARS) : []);
        setIsLoading(false);
      } catch (err) {
        if (err.name === "AbortError" || cancelled) return;
        setError(err.message || "Something went wrong");
        setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      load();
    }, 400);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [retryCount]);

  function handleRetry() {
    setError(null);
    setIsLoading(true);
    setCars([]);
    setRetryCount((c) => c + 1);
  }

  const hasCars = cars.length > 0;
  const resultsCount = cars.length;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          opacity: 0;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-base-100 py-24 md:py-32 lg:py-40"
      >
        

        <div
          className="absolute top-[-15%] right-[-5%] w-[50vw] h-[50vw] bg-radial from-primary/[0.08] to-transparent blur-[100px] pointer-events-none z-0"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 z-[1] opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading font-black text-[clamp(10rem,25vw,28rem)] text-white/[0.015] leading-none select-none pointer-events-none z-0"
          aria-hidden="true"
        >
          CURATED
        </span>

        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-px bg-linear-to-r from-transparent via-primary/20 to-transparent z-[2]"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div
            className={`flex flex-col items-center text-center mb-14 md:mb-18 lg:mb-22 ${
              isVisible ? "animate-fade-in" : "opacity-0"
            }`}
            style={{ animationDelay: "0ms" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-primary/40" aria-hidden="true" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-primary/60">
                Curated Fleet
              </span>
              <span className="h-px w-10 bg-primary/40" aria-hidden="true" />
            </div>

            <h2 className="font-heading font-bold tracking-[-0.04em] leading-[0.95] select-none flex flex-wrap items-baseline justify-center gap-x-4 md:gap-x-6">
              <span className="text-[clamp(2.8rem,7vw,5.5rem)] text-base-content">
                Available
              </span>
              <span
                className="text-[clamp(2.8rem,7vw,5.5rem)] text-transparent"
                style={{
                  WebkitTextStroke: "1.5px rgba(244,244,245,0.25)",
                }}
              >
                Vehicles
              </span>
            </h2>

            <div
              className="w-14 h-px bg-primary/50 mt-6 mb-6"
              aria-hidden="true"
            />

            <p className="text-sm md:text-base text-base-content/45 font-light leading-relaxed max-w-lg text-center px-2">
              Handpicked performance vehicles ready for your next journey.
              Reserve yours in minutes.
            </p>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {Array.from({ length: MAX_CARS }).map((_, i) => (
                <div
                  key={i}
                  className={`${isVisible ? "animate-fade-in" : "opacity-0"}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <SkeletonCard />
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center py-20 md:py-28 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <AlertCircle
                  className="w-7 h-7 text-red-400"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-heading text-xl font-bold text-base-content mb-2">
                Unable to Load Fleet
              </h3>
              <p className="text-sm text-base-content/50 max-w-sm mb-6">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" strokeWidth={2} />
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !error && !hasCars && (
            <div className="flex flex-col items-center justify-center py-20 md:py-28 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Car className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-xl font-bold text-base-content mb-2">
                No Vehicles Available
              </h3>
              <p className="text-sm text-base-content/50 max-w-sm mb-6">
                All our vehicles are currently on the road. Check back soon for
                new arrivals.
              </p>
              <Link
                href="/exploreCars"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                Browse All Vehicles
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>
          )}

          {!isLoading && !error && hasCars && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {cars.map((car, index) => (
                  <div
                    key={car._id}
                    className={`${isVisible ? "animate-fade-in" : "opacity-0"}`}
                    style={{
                      animationDelay: `${Math.min(120 + index * 80, 600)}ms`,
                    }}
                  >
                    <CarCard car={car} index={index} />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center mt-12 md:mt-16">
                <div className="group relative">
                  <div
                    className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                    aria-hidden="true"
                  />

                  <Link
                    href="/exploreCars"
                    className="relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-primary text-white text-sm font-semibold tracking-wide hover:bg-primary/90 hover:-translate-y-px hover:shadow-[0_0_40px_rgba(0,102,255,0.4)] transition-all duration-300"
                  >
                    View Full Fleet
                    <span className="inline-flex items-center gap-1 text-xs text-white/60">
                      ({resultsCount}+ available)
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
