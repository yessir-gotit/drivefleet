"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession } from "@/lib/auth-client";
import {
  CalendarDays,
  Car,
  MapPin,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Loader2,
  User,
  FileText,
  Clock,
  CheckCircle,
  Hash,
  ChevronRight,
} from "lucide-react";

import { API } from "@/lib/api";
const BOOKING_API = API.bookings;
const SPRING_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

function formatRate(rate) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rate);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function shortenId(id) {
  if (!id) return "";
  return `#bk-${id.slice(-5).toLowerCase()}`;
}

async function fetchUserBookings() {
  const res = await fetch(`${BOOKING_API}/user/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to fetch bookings (${res.status})`);
  return res.json();
}

function AnimatedNumber({ value, duration = 600 }) {
  const [display, setDisplay] = useState(0);
  const currentRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = currentRef.current;
    const end = value;
    let startTime = null;

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      currentRef.current = current;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return <>{display}</>;
}

function SkeletonCard() {
  return (
    <div className="relative rounded-2xl border border-white/[0.07] bg-base-200 overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-48 sm:h-auto skeleton-shimmer" />
        <div className="flex-1 p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="h-6 w-40 rounded-full skeleton-shimmer" />
            <div className="h-6 w-20 rounded-full skeleton-shimmer" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full skeleton-shimmer" />
            <div className="h-3 w-3/4 rounded-full skeleton-shimmer" />
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-28 rounded-full skeleton-shimmer" />
            <div className="h-4 w-20 rounded-full skeleton-shimmer" />
          </div>
          <div className="h-px bg-white/[0.06]" />
          <div className="h-4 w-24 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

function StatsBar({ bookings }) {
  const total = bookings.length;
  const withDriver = bookings.filter((b) => b.driverNeeded).length;
  const withNotes = bookings.filter((b) => b.specialNote).length;

  const stats = [
    {
      label: "Total Bookings",
      value: total,
      icon: CalendarDays,
      accent: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      label: "With Driver",
      value: withDriver,
      icon: User,
      accent: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "With Notes",
      value: withNotes,
      icon: FileText,
      accent: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative group rounded-2xl border border-white/[0.06] bg-base-200/60 backdrop-blur-sm p-4 md:p-5 overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-base-200/80 stats-card"
          style={{ animationDelay: "200ms" }}
        >
          <div
            className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${
                stat.label === "With Driver"
                  ? "rgba(96,165,250,0.08)"
                  : stat.label === "With Notes"
                    ? "rgba(251,191,36,0.08)"
                    : "rgba(0,102,255,0.08)"
              } 0%, transparent 70%)`,
            }}
            aria-hidden="true"
          />
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <stat.icon
                className={`w-[18px] h-[18px] ${stat.accent}`}
                strokeWidth={1.5}
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-[11px] font-semibold tracking-wider uppercase text-base-content/35">
                {stat.label}
              </p>
              <p className="font-heading text-xl md:text-2xl font-bold tracking-tight text-base-content">
                <AnimatedNumber value={stat.value} duration={700} />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BookingCard({ booking, index }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className="animate-fade-up group relative rounded-2xl border border-white/[0.07] bg-base-200 overflow-hidden transition-all duration-500 hover:border-white/[0.14] hover:-translate-y-1"
      style={{
        animationDelay: `${300 + index * 80}ms`,
        transitionTimingFunction: SPRING_OUT,
      }}
    >
      <div
        className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-all duration-700 pointer-events-none z-10"
        aria-hidden="true"
      />

      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden bg-base-300">
          {booking.carImage && !imgError ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 skeleton-shimmer z-[1]" />
              )}
              <Image
                src={booking.carImage}
                alt={booking.carName}
                fill
                sizes="(max-width: 640px) 100vw, 192px"
                className={`object-cover transition-all duration-700 ease-out ${
                  imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                } group-hover:scale-110`}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car className="w-10 h-10 text-base-content/20" strokeWidth={1} />
            </div>
          )}
          <div
            className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 sm:bg-linear-to-r sm:from-black/30 sm:to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="flex-1 p-5 md:p-6 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-heading text-lg md:text-xl font-bold tracking-tight text-base-content leading-tight group-hover:text-primary transition-colors duration-300">
              {booking.carName}
            </h3>
            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
              {booking.status || "Confirmed"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-base-content/40 mb-3">
            <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
            <span>{formatDate(booking.bookingDate || booking.createdAt)}</span>
            <span className="text-base-content/20">·</span>
            <span className="text-base-content/30">
              {formatRelativeTime(booking.bookingDate || booking.createdAt)}
            </span>
          </div>

          <div className="h-px bg-white/[0.06] mb-3" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-base-content/30 mb-1">
                Total / Day
              </p>
              <p className="font-heading text-lg font-bold text-primary tracking-tight">
                {formatRate(booking.dailyRate)}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-base-content/30 mb-1">
                Driver
              </p>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                  booking.driverNeeded
                    ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                    : "bg-white/[0.04] border border-white/[0.06] text-base-content/40"
                }`}
              >
                <User className="w-3 h-3" strokeWidth={2} />
                {booking.driverNeeded ? "Yes" : "No"}
              </span>
            </div>

            <div className="hidden sm:block">
              <p className="text-[10px] font-semibold tracking-wider uppercase text-base-content/30 mb-1">
                Reference
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-base-content/30">
                <Hash className="w-3 h-3" strokeWidth={2} />
                {shortenId(booking._id)}
              </span>
            </div>
          </div>

          {booking.specialNote && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.04] mb-2">
              <FileText
                className="w-3.5 h-3.5 text-amber-400/60 shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <p className="text-[11px] text-base-content/40 italic leading-relaxed line-clamp-1">
                &ldquo;{booking.specialNote}&rdquo;
              </p>
            </div>
          )}

          <div className="mt-auto pt-2 flex items-center justify-between">
            <span className="text-[10px] text-base-content/20 font-mono sm:hidden">
              {shortenId(booking._id)}
            </span>
            <Link
              href={`/cars/${booking.carId}`}
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-base-content/30 hover:text-primary transition-colors duration-200"
            >
              View Car
              <ChevronRight className="w-3 h-3" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 md:py-32 text-center px-4 animate-fade-up">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <CalendarDays className="w-9 h-9 text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-base-content mb-3">
        No Bookings Yet
      </h2>
      <p className="text-sm text-base-content/50 max-w-md mb-8 leading-relaxed">
        You haven&apos;t booked any vehicles yet. Browse our fleet and reserve
        your perfect ride.
      </p>
      <Link
        href="/exploreCars"
        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300"
        style={{ transitionTimingFunction: SPRING_OUT }}
      >
        <Car className="w-4 h-4" strokeWidth={2} />
        Explore Fleet
        <ArrowRight className="w-4 h-4" strokeWidth={2} />
      </Link>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 md:py-32 text-center px-4 animate-fade-up">
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
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          style={{ transitionTimingFunction: SPRING_OUT }}
        >
          <RefreshCw className="w-4 h-4" strokeWidth={2} />
          Try Again
        </button>
        <Link
          href="/exploreCars"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-base-content/50 border border-white/10 text-sm font-medium hover:text-base-content hover:border-white/20 transition-all duration-300"
        >
          Browse Cars
        </Link>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = useSession();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authPending && !session?.user) {
      router.replace("/login");
    }
  }, [session, authPending, router]);

  useEffect(() => {
    if (!session?.user) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const [data] = await Promise.all([
          fetchUserBookings(),
          new Promise((r) => setTimeout(r, 300)),
        ]);

        if (!cancelled) {
          setBookings(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Something went wrong");
        setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [session]);

  if (authPending || !session?.user) {
    return (
      <>
        <Navbar />
        <main className="relative min-h-screen flex items-center justify-center bg-base-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-base-content/40">
              {authPending ? "Checking authentication..." : "Redirecting..."}
            </p>
          </div>
        </main>
      </>
    );
  }

  const resultsCount = bookings.length;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.97);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        .animate-fade-up {
          opacity: 0;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .stats-card {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <Navbar />

      <main className="relative min-h-screen bg-base-100">
        <div className="absolute inset-0 z-0 dot-grid" aria-hidden="true" />
        <div className="ambient-glow z-[1]" aria-hidden="true" />
        <span className="watermark" aria-hidden="true">
          DF
        </span>

        <section className="relative z-10 pt-28 md:pt-36 pb-8 md:pb-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center text-center">
            <div
              className="animate-fade-up flex items-center gap-3 mb-6 md:mb-8"
              style={{ animationDelay: "0ms" }}
            >
              <span className="h-px w-8 bg-white/20" aria-hidden="true" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-base-content/40">
                Reservation History
              </span>
              <span className="h-px w-8 bg-white/20" aria-hidden="true" />
            </div>

            <div
              className="animate-fade-up text-center"
              style={{ animationDelay: "80ms" }}
            >
              <h1 className="font-heading font-bold tracking-[-0.04em] leading-[0.95] select-none flex flex-wrap items-baseline justify-center gap-x-6 md:gap-x-8">
                <span className="text-[clamp(2.6rem,7vw,5rem)] text-base-content">
                  MY
                </span>
                <span className="text-[clamp(2.6rem,7vw,5rem)] text-primary">
                  BOOKINGS.
                </span>
              </h1>
            </div>

            <div
              className="animate-fade-up w-14 h-px bg-primary/60 mt-5 md:mt-7 mb-5 md:mb-7"
              style={{ animationDelay: "140ms" }}
              aria-hidden="true"
            />

            <p
              className="animate-fade-up text-sm md:text-base text-base-content/45 font-light leading-relaxed max-w-lg text-center px-2"
              style={{ animationDelay: "200ms" }}
            >
              Track and manage all your vehicle reservations in one place. Every
              ride, right at your fingertips.
            </p>
          </div>
        </section>

        {!isLoading && !error && resultsCount > 0 && (
          <section className="relative z-10 pb-8 md:pb-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <StatsBar bookings={bookings} />
            </div>
          </section>
        )}

        <section className="relative z-10 pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {isLoading && (
              <div className="space-y-4 md:space-y-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {!isLoading && error && (
              <ErrorState
                message={error}
                onRetry={() => {
                  setError(null);
                  setIsLoading(true);
                  setTimeout(() => {
                    fetchUserBookings()
                      .then((data) => {
                        setBookings(data);
                        setIsLoading(false);
                      })
                      .catch((err) => {
                        setError(err.message);
                        setIsLoading(false);
                      });
                  }, 100);
                }}
              />
            )}

            {!isLoading && !error && resultsCount === 0 && <EmptyState />}

            {!isLoading && !error && resultsCount > 0 && (
              <div className="space-y-4 md:space-y-5">
                {bookings.map((booking, index) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    index={index}
                  />
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
