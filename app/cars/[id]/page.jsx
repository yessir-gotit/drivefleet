"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { useSession } from "@/lib/auth-client";
import {
  Car,
  Users,
  MapPin,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Fuel,
  Gauge,
  CalendarDays,
  ShieldCheck,
  Star,
  ChevronRight,
  CheckCircle,
  Clock,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/cars";

function formatRate(rate) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rate);
}

function DetailSkeleton() {
  return (
    <>
      <section className="relative h-[50vh] md:h-[65vh] lg:h-[75vh] bg-base-200 animate-pulse">
        <div className="absolute inset-0 bg-base-300/60" />
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-20">
        <div className="glass-premium rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="h-6 w-48 rounded-full bg-base-300/60" />
              <div className="h-4 w-32 rounded-full bg-base-300/60" />
            </div>
            <div className="h-10 w-36 rounded-full bg-base-300/60" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-4 w-full rounded-full bg-base-300/60" />
            <div className="h-4 w-5/6 rounded-full bg-base-300/60" />
            <div className="h-4 w-4/6 rounded-full bg-base-300/60" />
            <div className="h-4 w-full rounded-full bg-base-300/60" />
            <div className="h-4 w-3/4 rounded-full bg-base-300/60" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-base-300/60" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-32 md:py-48 text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <AlertCircle className="w-9 h-9 text-red-400" strokeWidth={1.5} />
      </div>
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-base-content mb-3">
        Something Went Wrong
      </h2>
      <p className="text-sm text-base-content/50 max-w-md mb-8 leading-relaxed">
        {message}
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={2} />
          Try Again
        </button>
        <Link
          href="/exploreCars"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-base-content/50 border border-white/10 text-sm font-medium hover:text-base-content hover:border-white/20 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          Back to Fleet
        </Link>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-32 md:py-48 text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <Car className="w-9 h-9 text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-base-content mb-3">
        Car Not Found
      </h2>
      <p className="text-sm text-base-content/50 max-w-md mb-8 leading-relaxed">
        The vehicle you&apos;re looking for doesn&apos;t exist or may have been
        removed from the fleet.
      </p>
      <Link
        href="/exploreCars"
        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        Browse All Cars
      </Link>
    </div>
  );
}

function SpecBadge({ icon: Icon, label, value }) {
  return (
    <div className="group flex items-center gap-3 p-4 rounded-xl bg-base-300/30 border border-white/[0.06] hover:bg-base-300/50 hover:border-white/[0.12] transition-all duration-300">
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/15 group-hover:border-primary/35 transition-all duration-300">
        <Icon className="w-4.5 h-4.5 text-primary" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-base-content/35">
          {label}
        </p>
        <p className="text-sm font-semibold text-base-content truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function SimilarCarCard({ car }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/cars/${car._id}`}
      className="group relative rounded-2xl border border-white/[0.07] bg-base-200 overflow-hidden transition-all duration-500 hover:border-white/[0.14] hover:-translate-y-1.5 block"
      style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
    >
      <div
        className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-all duration-500 pointer-events-none z-10"
        aria-hidden="true"
      />

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
            <Car className="w-8 h-8 text-base-content/20" strokeWidth={1} />
          </div>
        )}
        <div
          className="absolute inset-0 bg-linear-to-t from-base-200/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="font-heading text-base font-bold tracking-tight text-base-content">
            {car.carName}
          </h4>
          <span className="shrink-0 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {car.carType}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary font-heading tracking-tight">
            {formatRate(car.dailyRate)}
            <span className="text-xs text-base-content/40 ml-1 font-normal font-body">
              / day
            </span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-base-content/40 group-hover:text-primary transition-colors duration-300">
            View
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />
    </Link>
  );
}

export default function CarDetailPage({ params }) {
  const router = useRouter();
  const { data: session, isPending: authLoading } = useSession();

  const { id } = use(params);

  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const res = await fetch(`${API_URL}/${id}`);

        if (cancelled) return;

        if (res.status === 404) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to load car (${res.status})`);
        }

        const data = await res.json();
        if (cancelled) return;

        setCar(data);
        setIsLoading(false);

        fetchSimilarCars(data);
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Something went wrong");
        setIsLoading(false);
      }
    }

    async function fetchSimilarCars(currentCar) {
      try {
        const similarRes = await fetch(
          `${API_URL}?carType=${encodeURIComponent(currentCar.carType)}`,
        );
        if (similarRes.ok) {
          const similarData = await similarRes.json();
          if (!cancelled) {
            setSimilarCars(
              similarData.filter((c) => c._id !== currentCar._id).slice(0, 3),
            );
          }
        }
      } catch {
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id, retryCount, refreshKey]);

  const handleBookingComplete = () => {
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    if (!authLoading && !session?.user) {
      router.replace("/login");
    }
  }, [session, authLoading, router]);

  if (authLoading || !session?.user) {
    return (
      <>
        <Navbar />
        <main className="relative min-h-screen flex items-center justify-center bg-base-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-base-content/40">
              {authLoading ? "Checking authentication..." : "Redirecting..."}
            </p>
          </div>
        </main>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="relative min-h-screen bg-base-100">
          <DetailSkeleton />
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="relative min-h-screen bg-base-100">
          <div className="absolute inset-0 z-0 dot-grid" aria-hidden="true" />
          <div className="ambient-glow z-[1]" aria-hidden="true" />
          <ErrorState
            message={error}
            onRetry={() => setRetryCount((c) => c + 1)}
          />
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !car) {
    return (
      <>
        <Navbar />
        <main className="relative min-h-screen bg-base-100">
          <div className="absolute inset-0 z-0 dot-grid" aria-hidden="true" />
          <div className="ambient-glow z-[1]" aria-hidden="true" />
          <NotFoundState />
        </main>
        <Footer />
      </>
    );
  }

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

        .dot-grid {
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
        }

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

        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          z-index: 60;
          background: linear-gradient(90deg, #0066FF, #3399FF, #0066FF);
          background-size: 200% 100%;
          transform-origin: 0 50%;
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 0%; }
        }

        .image-zoom-container {
          overflow: hidden;
        }
        .image-zoom-container img {
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .image-zoom-container:hover img {
          transform: scale(1.08);
        }

        .sticky-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 40;
          background: rgba(5, 5, 5, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transform: translateY(100%);
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sticky-cta.visible {
          transform: translateY(0);
          opacity: 1;
        }
        @media (min-width: 1024px) {
          .sticky-cta {
            display: none;
          }
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .status-dot.available {
          background: #34d399;
          box-shadow: 0 0 12px rgba(52, 211, 153, 0.4);
        }
        .status-dot.unavailable {
          background: #f87171;
          box-shadow: 0 0 12px rgba(248, 113, 113, 0.4);
        }

        .glass-premium {
          background: rgba(17, 17, 17, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>

      <Navbar />

      <main className="relative min-h-screen bg-base-100">
        <div
          className="scroll-progress"
          style={{ transform: "scaleX(0)" }}
          id="scroll-progress"
          aria-hidden="true"
        />

        <div
          className="fixed inset-0 z-0 dot-grid pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="ambient-glow z-[1] pointer-events-none"
          aria-hidden="true"
        />

        <section className="relative z-10">
          <div className="relative h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] image-zoom-container overflow-hidden">
            {!imgError ? (
              <Image
                src={car.imageUrl}
                alt={car.carName}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-base-300">
                <Car
                  className="w-20 h-20 text-base-content/15"
                  strokeWidth={1}
                />
              </div>
            )}

            <div
              className="absolute inset-0 z-[1]"
              style={{
                background: `
                  linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.4) 40%, rgba(5,5,5,0.15) 70%, rgba(5,5,5,0.3) 100%)
                `,
              }}
              aria-hidden="true"
            />

            <div
              className="absolute top-0 left-0 right-0 h-32 z-[2] bg-linear-to-b from-base-100/80 to-transparent"
              aria-hidden="true"
            />

            <div className="absolute top-20 left-4 md:left-8 z-[3]">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium text-xs font-medium text-base-content/60 hover:text-base-content hover:bg-white/10 transition-all duration-200 backdrop-blur-xl cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
                Back
              </button>
            </div>

            <div className="absolute bottom-6 md:bottom-10 left-4 md:left-8 right-4 md:right-8 z-[3]">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="animate-in" style={{ animationDelay: "100ms" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="h-px w-8 bg-primary/60"
                      aria-hidden="true"
                    />
                    <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary/80">
                      {car.carType}
                    </span>
                  </div>
                  <h1 className="font-heading font-bold tracking-[-0.03em] text-white text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.95]">
                    {car.carName}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div
              className="animate-in glass-premium rounded-2xl p-5 md:p-6 mb-8 mt-10 md:mb-10"
              style={{ animationDelay: "300ms" }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                <SpecBadge icon={Car} label="Type" value={car.carType} />
                <SpecBadge
                  icon={Users}
                  label="Seats"
                  value={`${car.seatCapacity} Passengers`}
                />
                <SpecBadge
                  icon={MapPin}
                  label="Location"
                  value={car.pickupLocation}
                />
                <SpecBadge
                  icon={Gauge}
                  label="Rate"
                  value={`${formatRate(car.dailyRate)}/day`}
                />
                <SpecBadge
                  icon={CalendarDays}
                  label="Status"
                  value={
                    <span>
                      <span
                        className={
                          car.isAvailable ? "text-emerald-400" : "text-red-400"
                        }
                      >
                        {car.isAvailable ? "Available" : "Not Available"}
                      </span>
                    </span>
                  }
                />
                <SpecBadge
                  icon={Users}
                  label="Bookings"
                  value={`${car.bookedCount ?? 0} user${(car.bookedCount ?? 0) !== 1 ? "s" : ""}`}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
              <div
                className="animate-in lg:col-span-2"
                style={{ animationDelay: "400ms" }}
              >
                <div className="space-y-8">
                  <div>
                    <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-base-content mb-4">
                      About This Vehicle
                    </h2>
                    <p className="text-sm md:text-base text-base-content/60 leading-[1.8]">
                      {car.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-heading text-lg font-bold tracking-tight text-base-content mb-4">
                      Features & Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "GPS Navigation", icon: MapPin },
                        { label: "Bluetooth Connectivity", icon: Car },
                        { label: "Climate Control", icon: Gauge },
                        { label: "ABS & Traction Control", icon: ShieldCheck },
                        { label: "Premium Sound System", icon: Star },
                        { label: "24/7 Roadside Assistance", icon: Clock },
                      ].map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3.5 rounded-xl bg-base-300/20 border border-white/[0.04]"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <CheckCircle
                              className="w-4 h-4 text-emerald-400"
                              strokeWidth={2}
                            />
                          </div>
                          <span className="text-sm text-base-content/70 font-medium">
                            {feature.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-premium rounded-2xl p-6 md:p-8">
                    <h3 className="font-heading text-lg font-bold tracking-tight text-base-content mb-4">
                      Rental Terms
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Free cancellation up to 24 hours before pickup",
                        "Comprehensive insurance included",
                        "Unlimited mileage on all bookings",
                        "Valid driver's license required",
                        "Security deposit: $500 (refundable)",
                        "Minimum rental age: 21 years",
                      ].map((term, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-base-content/55"
                        >
                          <CheckCircle
                            className="w-4 h-4 text-primary shrink-0 mt-0.5"
                            strokeWidth={2}
                          />
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div
                className="animate-in space-y-6"
                style={{ animationDelay: "500ms" }}
              >
                <div className="glass-premium rounded-2xl p-6 md:p-8 sticky top-24">
                  <h3 className="font-heading text-lg font-bold tracking-tight text-base-content mb-6">
                    Booking Summary
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                      <span className="text-sm text-base-content/50">
                        Daily Rate
                      </span>
                      <span className="text-sm font-semibold text-base-content">
                        {formatRate(car.dailyRate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                      <span className="text-sm text-base-content/50">
                        Insurance
                      </span>
                      <span className="text-sm font-semibold text-emerald-400">
                        Included
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                      <span className="text-sm text-base-content/50">
                        Security Deposit
                      </span>
                      <span className="text-sm font-semibold text-base-content">
                        $500.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-base-content/70">
                        Total / Day
                      </span>
                      <span className="font-heading text-2xl font-bold text-primary tracking-tight">
                        {formatRate(car.dailyRate)}
                      </span>
                    </div>
                  </div>

                  {car.isAvailable ? (
                    <button
                      onClick={() => setBookingModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-white text-sm font-semibold tracking-wide hover:bg-primary/90 hover:-translate-y-px hover:shadow-[0_0_36px_rgba(0,102,255,0.4)] transition-all duration-300 group/btn cursor-pointer"
                    >
                      Book This Vehicle
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  ) : (
                    <div className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold cursor-not-allowed select-none">
                      <AlertCircle className="w-4 h-4" strokeWidth={2} />
                      Currently Unavailable
                    </div>
                  )}

                  <p className="text-center text-xs text-base-content/30 mt-4">
                    No payment required to reserve
                  </p>
                </div>
              </div>
            </div>

            {similarCars.length > 0 && (
              <section className="mt-16 md:mt-24 mb-8">
                <div
                  className="animate-in flex items-center justify-between mb-8"
                  style={{ animationDelay: "600ms" }}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="h-px w-8 bg-primary/40"
                        aria-hidden="true"
                      />
                      <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-primary/60">
                        Similar Vehicles
                      </span>
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-base-content">
                      More {car.carType}s
                    </h2>
                  </div>
                  <Link
                    href="/exploreCars"
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-base-content/50 hover:text-primary transition-colors duration-200"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                </div>

                <div
                  className="animate-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
                  style={{ animationDelay: "700ms" }}
                >
                  {similarCars.map((similarCar) => (
                    <SimilarCarCard key={similarCar._id} car={similarCar} />
                  ))}
                </div>

                <div className="mt-6 text-center sm:hidden">
                  <Link
                    href="/exploreCars"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-base-content/50 hover:text-primary transition-colors duration-200"
                  >
                    View All Vehicles
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                </div>
              </section>
            )}
          </div>
        </section>

        <div className="sticky-cta" id="mobile-cta">
          <div>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-base-content/40">
              From
            </p>
            <p className="font-heading text-xl font-bold text-primary tracking-tight">
              {formatRate(car.dailyRate)}
              <span className="text-xs font-normal text-base-content/50 ml-1 font-body">
                /day
              </span>
            </p>
          </div>
          {car.isAvailable ? (
            <button
              onClick={() => setBookingModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all duration-300 shrink-0 cursor-pointer"
            >
              Book Now
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold shrink-0 cursor-not-allowed select-none">
              <AlertCircle className="w-4 h-4" strokeWidth={2} />
              Unavailable
            </div>
          )}
        </div>
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          car={car}
          session={session}
          onBookingComplete={handleBookingComplete}
        />
      </main>

      <Footer />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var progressBar = document.getElementById('scroll-progress');
              var mobileCta = document.getElementById('mobile-cta');
              if (!progressBar || !mobileCta) return;

              function onScroll() {
                var scrollTop = window.scrollY;
                var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                var progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
                progressBar.style.transform = 'scaleX(' + progress + ')';

                if (scrollTop > window.innerHeight * 0.5) {
                  mobileCta.classList.add('visible');
                } else {
                  mobileCta.classList.remove('visible');
                }
              }

              window.addEventListener('scroll', onScroll, { passive: true });
              onScroll();
            })();
          `,
        }}
      />
    </>
  );
}
