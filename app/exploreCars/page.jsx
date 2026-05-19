"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession } from "@/lib/auth-client";
import {
  Search,
  Car,
  Users,
  MapPin,
  ArrowRight,
  ChevronDown,
  SlidersHorizontal,
  X,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const CAR_TYPES = [
  "All",
  "SUV",
  "Sedan",
  "Hatchback",
  "Luxury",
  "Coupe",
  "Convertible",
  "Truck",
  "Van",
  "Electric",
  "Sports",
];

const API_URL = "http://localhost:5000/api/cars";

async function fetchCars({ carType, search, signal }) {
  const params = new URLSearchParams();
  if (carType && carType !== "All") params.set("carType", carType);
  if (search) params.set("search", search);

  const query = params.toString();
  const url = query ? `${API_URL}?${query}` : API_URL;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Failed to fetch cars (${res.status})`);
  return res.json();
}

function formatRate(rate) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rate);
}

function SkeletonCard() {
  return (
    <div className="relative rounded-2xl border border-white/[0.07] bg-base-200 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-video bg-base-300/60" />

      <div className="p-5 space-y-4">
        {/* Title ande  badge row */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded-full bg-base-300/60" />
          <div className="h-5 w-20 rounded-full bg-base-300/60" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full bg-base-300/60" />
          <div className="h-3 w-3/4 rounded-full bg-base-300/60" />
        </div>

        {/* Specs */}
        <div className="flex gap-4">
          <div className="h-4 w-20 rounded-full bg-base-300/60" />
          <div className="h-4 w-24 rounded-full bg-base-300/60" />
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-white/6">
          <div className="h-6 w-24 rounded-full bg-base-300/60" />
          <div className="h-9 w-28 rounded-full bg-base-300/60" />
        </div>
      </div>
    </div>
  );
}

function CarCard({ car }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group relative rounded-2xl border border-white/[0.07] bg-base-200 overflow-hidden transition-all duration-500 hover:border-white/[0.14] hover:-translate-y-1.5 flex flex-col h-full"
      style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* ── Hover glow  ── */}
      <div
        className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-all duration-500 pointer-events-none z-10"
        aria-hidden="true"
      />

      {/*  Image  */}
      <div className="relative aspect-video overflow-hidden bg-base-300">
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
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-10 h-10 text-base-content/20" strokeWidth={1} />
          </div>
        )}

        {/* Image overlay gradient */}
        <div
          className="absolute inset-0 bg-linear-to-t from-base-200/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        />
      </div>

      {/*  Content  */}
      <div className="p-5 flex flex-col flex-1">
        {/* Name and Type */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-heading text-lg font-bold tracking-tight text-base-content leading-tight">
            {car.carName}
          </h3>
          <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {car.carType}
          </span>
        </div>

        <div className="flex-1">
          {/* Description */}
          <p className="text-sm text-base-content/50 leading-relaxed line-clamp-2 mb-4">
            {car.description}
          </p>

          {/* Specs */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-base-content/40">
              <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
              {car.seatCapacity} seats
            </div>
            <div className="flex items-center gap-1.5 text-xs text-base-content/40">
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
              {car.pickupLocation}
            </div>
            {/* Availability */}
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  car.isAvailable ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span
                className={
                  car.isAvailable ? "text-emerald-400/70" : "text-red-400/70"
                }
              >
                {car.isAvailable ? "Available" : "Rented"}
              </span>
            </div>
          </div>
        </div>

        {/* Price and CTA */}
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

      {/* Bottom hover glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />
    </div>
  );
}

export default function ExploreCarsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [carType, setCarType] = useState("All");

  //  Fetch on mount and when filters change
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const controller = new AbortController();
        const [data] = await Promise.all([
          fetchCars({ carType, search, signal: controller.signal }),
          new Promise((r) => setTimeout(r, 300)),
        ]);

        if (!cancelled) {
          setCars(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (err.name === "AbortError" || cancelled) return;
        setError(err.message || "Something went wrong");
        setIsLoading(false);
      }
    }

    const timer = setTimeout(load, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [carType, search]);

  // Route protection
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  if (isPending || !session?.user) {
    return (
      <>
        <Navbar />
        <main className="relative min-h-screen flex items-center justify-center bg-base-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-base-content/40">
              {isPending ? "Checking authentication..." : "Redirecting..."}
            </p>
          </div>
        </main>
      </>
    );
  }

  const resultsCount = cars.length;

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

        /* ── Dot grid texture ── */
        .dot-grid {
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        /* ── Watermark ── */
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: "Plus Jakarta Sans", "Space Grotesk", sans-serif;
          font-weight: 900;
          font-size: clamp(12rem, 30vw, 32rem);
          letter-spacing: -0.06em;
          color: rgba(255, 255, 255, 0.015);
          pointer-events: none;
          user-select: none;
          line-height: 1;
          z-index: 0;
        }

        /* ── Custom select ── */
        .custom-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        .custom-select option {
          background: #1C1C1E;
          color: #F4F4F5;
        }

        /* ── Line clamp for description ── */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <Navbar />

      <main className="relative min-h-screen bg-base-100">
        {/*  Background Effects  */}
        <div className="absolute inset-0 z-0 dot-grid" aria-hidden="true" />
        <div className="ambient-glow z-[1]" aria-hidden="true" />
        <span className="watermark" aria-hidden="true">
          DF
        </span>

        {/*  Hero Section  */}
        <section className="relative z-10 pt-28 md:pt-36 pb-8 md:pb-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center text-center">
            {/* Eyebrow */}
            <div
              className="animate-in flex items-center gap-3 mb-6 md:mb-8"
              style={{ animationDelay: "0ms" }}
            >
              <span className="h-px w-8 bg-white/20" aria-hidden="true" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-base-content/40">
                Curated Collection
              </span>
              <span className="h-px w-8 bg-white/20" aria-hidden="true" />
            </div>

            {/* Heading */}
            <div
              className="animate-in text-center"
              style={{ animationDelay: "80ms" }}
            >
              <h1 className="font-heading font-bold tracking-[-0.04em] leading-[0.95] select-none flex flex-wrap items-baseline justify-center gap-x-6 md:gap-x-8">
                <span className="text-[clamp(2.6rem,7vw,5rem)] text-base-content">
                  EXPLORE
                </span>
                <span className="text-[clamp(2.6rem,7vw,5rem)] text-primary">
                  THE FLEET.
                </span>
              </h1>
            </div>

            {/* Divider */}
            <div
              className="animate-in w-14 h-px bg-primary/60 mt-5 md:mt-7 mb-5 md:mb-7"
              style={{ animationDelay: "120ms" }}
              aria-hidden="true"
            />

            {/* Subtitle */}
            <p
              className="animate-in text-sm md:text-base text-base-content/45 font-light leading-relaxed max-w-lg text-center px-2"
              style={{ animationDelay: "160ms" }}
            >
              Handpicked performance vehicles waiting for you. Find the perfect
              ride for any journey.
            </p>
          </div>
        </section>

        {/*  Filter Bar (Full-Width Glassmorphism)  */}
        <section className="relative z-10 py-8 md:py-10 overflow-hidden">
          {/* Full width glass background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "rgba(17, 17, 17, 0.10)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
            aria-hidden="true"
          />

          {/* Subtle glow on top of glass */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-px bg-linear-to-r from-transparent via-primary/20 to-transparent z-[1]"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
            <div
              className="animate-in flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              style={{ animationDelay: "240ms" }}
            >
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-base-content/30">
                  <Search className="w-4 h-4" strokeWidth={2} />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cars..."
                  aria-label="Search cars"
                  className="w-full bg-base-300/50 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/30 hover:text-base-content/60 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                  </button>
                )}
              </div>

              {/* Car Type Filter */}
              <div className="relative sm:w-48">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-base-content/30">
                  <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
                </span>
                <select
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  aria-label="Filter by car type"
                  className="w-full bg-base-300/50 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-base-content focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200 custom-select"
                >
                  {CAR_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-base-content/30">
                  <ChevronDown className="w-4 h-4" strokeWidth={2} />
                </span>
              </div>

              {/* Results count */}
              {!isLoading && !error && (
                <div className="shrink-0 text-xs text-base-content/40 font-medium px-2 text-center sm:text-left">
                  {resultsCount} {resultsCount === 1 ? "car" : "cars"} found
                </div>
              )}
            </div>
          </div>
        </section>

        {/*  Results Section  */}
        <section className="relative z-10 pb-24 md:pb-32 mt-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="flex flex-col items-center justify-center py-24 md:py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                  <AlertCircle
                    className="w-7 h-7 text-red-400"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-heading text-xl font-bold text-base-content mb-2">
                  Failed to Load
                </h3>
                <p className="text-sm text-base-content/50 max-w-sm mb-6">
                  {error}
                </p>
                <button
                  onClick={() => {
                    // Re-trigger fetch by forcing re-render
                    setError(null);
                    setIsLoading(true);
                    // The useEffect will re-run since we're not changing deps,
                    // so we need a key trick. Better: just reload.
                    window.location.reload();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" strokeWidth={2} />
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !error && resultsCount === 0 && (
              <div className="flex flex-col items-center justify-center py-24 md:py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <Car className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl font-bold text-base-content mb-2">
                  No Cars Found
                </h3>
                <p className="text-sm text-base-content/50 max-w-sm mb-6">
                  {search || carType !== "All"
                    ? "Try adjusting your filters or search term."
                    : "No vehicles in the fleet yet. Check back soon!"}
                </p>
                {(search || carType !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCarType("All");
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" strokeWidth={2} />
                    Reset Filters
                  </button>
                )}
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && !error && resultsCount > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {cars.map((car, index) => (
                  <div
                    key={car._id}
                    className="animate-in h-full"
                    style={{
                      animationDelay: `${Math.min(80 + index * 60, 500)}ms`,
                    }}
                  >
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
