"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, Car, Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const BOOKING_API = "http://localhost:5000/api/bookings";

function formatRate(rate) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rate);
}

export default function BookingModal({ isOpen, onClose, car, session, onBookingComplete }) {
  const [driverNeeded, setDriverNeeded] = useState(false);
  const [specialNote, setSpecialNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animPhase, setAnimPhase] = useState("enter");
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("You must be logged in to book a car.");
      return;
    }

    setAnimPhase("submitting");
    setIsSubmitting(true);

    const payload = {
      carId: car._id,
      carName: car.carName,
      carImage: car.imageUrl || "",
      dailyRate: car.dailyRate,
      driverNeeded,
      specialNote,
    };

    try {
      const res = await fetch(BOOKING_API, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Booking Confirmed!</p>
            <p className="text-xs text-white/50 mt-0.5">{car.carName} is all yours.</p>
          </div>
        </div>,
        { icon: false }
      );

      onBookingComplete?.();

      setTimeout(() => onClose(), 1200);
    } catch (err) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-red-400" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Booking Failed</p>
            <p className="text-xs text-white/50 mt-0.5">{err.message}</p>
          </div>
        </div>,
        { icon: false }
      );
      setIsSubmitting(false);
      setAnimPhase("enter");
    }
  };

  if (!isOpen) return null;

  if (!car?.isAvailable) {
    return (
      <>
        <style>{`
          @keyframes booking-overlay-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes booking-panel-in {
            from { opacity: 0; transform: translateY(24px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes booking-panel-out {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to   { opacity: 0; transform: translateY(24px) scale(0.96); }
          }
          .booking-enter .booking-overlay {
            animation: booking-overlay-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
          }
          .booking-enter .booking-panel {
            animation: booking-panel-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
          }
        `}</style>

        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6 booking-enter"
        >
          <div
            className="booking-overlay absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          <div className="booking-panel relative w-full sm:max-w-md bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/[0.08] rounded-t-3xl sm:rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="relative shrink-0 px-6 pt-6 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-heading text-lg font-bold tracking-tight text-base-content">
                  Not Available
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-base-content/30 hover:text-base-content hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
                  aria-label="Close booking modal"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
              <p className="text-xs text-base-content/40">
                This vehicle is currently unavailable
              </p>
            </div>

            <div className="px-6 py-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <AlertCircle className="w-7 h-7 text-red-400" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-lg font-bold text-base-content mb-2">
                {car.carName}
              </h3>
              <p className="text-sm text-base-content/50 leading-relaxed max-w-xs">
                This vehicle has been marked as unavailable by the owner. Please check back later or browse other available vehicles in our fleet.
              </p>
            </div>

            <div className="shrink-0 px-6 py-5 border-t border-white/[0.06] bg-black/20">
              <button
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.08] text-sm font-medium text-base-content/50 hover:text-base-content hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes booking-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes booking-panel-in {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes booking-panel-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(24px) scale(0.96); }
        }
        .booking-enter .booking-overlay {
          animation: booking-overlay-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .booking-enter .booking-panel {
          animation: booking-panel-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .booking-exit .booking-overlay {
          animation: booking-overlay-in 0.3s cubic-bezier(0.16,1,0.3,1) reverse forwards;
        }
        .booking-exit .booking-panel {
          animation: booking-panel-out 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        .booking-textarea::-webkit-scrollbar {
          width: 4px;
        }
        .booking-textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        .booking-textarea::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 10px;
        }
      `}</style>

      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        // Always "enter" on fresh mount (key‑driven reset handles form)
        className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6 booking-enter"
      >
        <div
          className="booking-overlay absolute inset-0 bg-black/70 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div
          ref={panelRef}
          className={[
            "booking-panel relative w-full sm:max-w-lg",
            "bg-[#0A0A0A]/95 backdrop-blur-2xl",
            "border border-white/[0.08]",
            "rounded-t-3xl sm:rounded-2xl",
            "shadow-[0_32px_80px_rgba(0,0,0,0.6)]",
            "overflow-hidden",
            "max-h-[90vh] sm:max-h-[85vh]",
            "flex flex-col",
          ].join(" ")}
        >
          <div className="relative shrink-0 px-6 pt-6 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-heading text-lg font-bold tracking-tight text-base-content">
                Confirm Your Booking
              </h2>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-base-content/30 hover:text-base-content hover:bg-white/[0.06] transition-all duration-200 disabled:opacity-30 cursor-pointer"
                aria-label="Close booking modal"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
            <p className="text-xs text-base-content/40">
              Secure your ride in seconds
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
          >
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-base-300 shrink-0">
                {car.imageUrl ? (
                  <Image
                    src={car.imageUrl}
                    alt={car.carName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-base-content/20" strokeWidth={1} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-sm font-bold text-base-content truncate">
                  {car.carName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    {car.carType}
                  </span>
                  <span className="text-xs text-base-content/50">
                    {car.seatCapacity} seats
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-heading text-lg font-bold text-primary tracking-tight">
                  {formatRate(car.dailyRate)}
                </p>
                <p className="text-[10px] text-base-content/30">/ day</p>
              </div>
            </div>

            <div className="space-y-2.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-base-content/40">Daily Rate</span>
                <span className="text-xs font-medium text-base-content/70">
                  {formatRate(car.dailyRate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-base-content/40">Insurance</span>
                <span className="text-xs font-medium text-emerald-400">Included</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <span className="text-xs font-semibold text-base-content/80">
                  Total / Day
                </span>
                <span className="font-heading text-base font-bold text-primary">
                  {formatRate(car.dailyRate)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-base-content/50 mb-3">
                Need a Driver?
              </label>
              <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] w-fit">
                <button
                  type="button"
                  onClick={() => setDriverNeeded(true)}
                  className={[
                    "px-5 py-2 rounded-[10px] text-xs font-semibold transition-all duration-300 cursor-pointer",
                    driverNeeded
                      ? "bg-primary text-white shadow-[0_0_20px_rgba(0,102,255,0.2)]"
                      : "text-base-content/40 hover:text-base-content/70",
                  ].join(" ")}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setDriverNeeded(false)}
                  className={[
                    "px-5 py-2 rounded-[10px] text-xs font-semibold transition-all duration-300 cursor-pointer",
                    !driverNeeded
                      ? "bg-primary text-white shadow-[0_0_20px_rgba(0,102,255,0.2)]"
                      : "text-base-content/40 hover:text-base-content/70",
                  ].join(" ")}
                >
                  No
                </button>
              </div>
              <p className="text-[10px] text-base-content/30 mt-2">
                {driverNeeded
                  ? "A professional driver will be assigned to your booking."
                  : "You will drive the vehicle yourself."}
              </p>
            </div>

            <div>
              <label
                htmlFor="special-note"
                className="block text-xs font-semibold tracking-wider uppercase text-base-content/50 mb-3"
              >
                Special Note
              </label>
              <textarea
                id="special-note"
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="Any special requests? Pickup time, location details, etc..."
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
                className="booking-textarea w-full resize-none bg-base-300/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-base-content placeholder:text-base-content/25 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50"
              />
              <div className="flex justify-end mt-1.5">
                <span className="text-[10px] text-base-content/25">
                  {specialNote.length}/500
                </span>
              </div>
            </div>
          </form>

          <div className="shrink-0 px-6 py-5 border-t border-white/[0.06] bg-black/20">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={[
                "w-full inline-flex items-center justify-center gap-2.5",
                "px-6 py-3.5 rounded-xl",
                "bg-primary text-white",
                "text-sm font-semibold tracking-wide",
                "hover:bg-primary/90 hover:-translate-y-px",
                "hover:shadow-[0_0_36px_rgba(0,102,255,0.3)]",
                "transition-all duration-300",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
                "cursor-pointer",
              ].join(" ")}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" strokeWidth={2} />
                  Confirm Booking
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-base-content/25 mt-3">
              No payment required to reserve
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
