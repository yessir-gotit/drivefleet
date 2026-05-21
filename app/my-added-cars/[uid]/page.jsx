"use client";

import { useState, useEffect, useRef, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession } from "@/lib/auth-client";
import {
  Car,
  Users,
  MapPin,
  ArrowRight,
  Plus,
  Trash2,
  Pencil,
  AlertCircle,
  RefreshCw,
  X,
  CheckCircle,
  Loader2,
  DollarSign,
  ListFilter,
  Image as ImageIcon,
  FileText,
  Clock,
} from "lucide-react";

import { API } from "@/lib/api";
const API_URL = API.cars;

const CAR_TYPES = [
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

const SPRING_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const SPRING_OVERSHOOT = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function formatRate(rate) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rate);
}

async function fetchUserCars(uid) {
  const res = await fetch(`${API_URL}/user/${uid}`);
  if (!res.ok) throw new Error(`Failed to fetch your cars (${res.status})`);
  return res.json();
}

async function deleteCarAPI(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete car");
  return data;
}

async function updateCar(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to update car");
  return result;
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

function useAnimatedModal(isOpen, exitDuration = 280) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => setAnimated(true));
        raf1._raf2 = raf2;
      });
      return () => {
        cancelAnimationFrame(raf1);
        if (raf1._raf2) cancelAnimationFrame(raf1._raf2);
      };
    } else {
      setAnimated(false);
      const timer = setTimeout(() => setShouldRender(false), exitDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, exitDuration]);

  return { shouldRender, animated };
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
        <div className="flex items-center justify-between pt-2 border-t border-white/6">
          <div className="h-6 w-24 rounded-full skeleton-shimmer" />
          <div className="h-9 w-28 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

function StatsBar({ cars }) {
  const total = cars.length;
  const available = cars.filter((c) => c.isAvailable).length;
  const rented = total - available;

  const stats = [
    {
      label: "Total Cars",
      value: total,
      icon: Car,
      accent: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      label: "Available",
      value: available,
      icon: CheckCircle,
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Not Available",
      value: rented,
      icon: Clock,
      accent: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="stats-card relative group rounded-2xl border border-white/[0.06] bg-base-200/60 backdrop-blur-sm p-4 md:p-5 overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-base-200/80"
          style={{ animationDelay: `${200 + i * 80}ms` }}
        >
          <div
            className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${
                stat.label === "Available"
                  ? "rgba(52,211,153,0.08)"
                  : stat.label === "Not Available"
                    ? "rgba(248,113,113,0.08)"
                    : "rgba(0,102,255,0.08)"
              } 0%, transparent 70%)`,
            }}
            aria-hidden="true"
          />
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
              style={{ transitionTimingFunction: SPRING_OVERSHOOT }}
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

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 md:py-32 text-center px-4 animate-fade-up"
      style={{ animationDelay: "0ms" }}
    >
      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 animate-float">
        <Car className="w-9 h-9 text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-base-content mb-3">
        No Cars Added Yet
      </h2>
      <p className="text-sm text-base-content/50 max-w-md mb-8 leading-relaxed">
        Start building your collection. Add your first vehicle to the fleet and
        it will appear here.
      </p>
      <Link
        href="/addCar"
        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
        style={{ transitionTimingFunction: SPRING_OUT }}
      >
        <Plus className="w-4 h-4" strokeWidth={2} />
        Add Your First Car
      </Link>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 md:py-32 text-center px-4 animate-fade-up"
      style={{ animationDelay: "0ms" }}
    >
      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <AlertCircle className="w-9 h-9 text-red-400" strokeWidth={1.5} />
      </div>
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-base-content mb-3">
        Something Went Wrong
      </h2>
      <p className="text-sm text-base-content/50 max-w-md mb-8 leading-relaxed">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer"
        style={{ transitionTimingFunction: SPRING_OUT }}
      >
        <RefreshCw className="w-4 h-4" strokeWidth={2} />
        Try Again
      </button>
    </div>
  );
}

function DeleteConfirmModal({ car, isOpen, onClose, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { shouldRender, animated } = useAnimatedModal(isOpen, 280);

  if (!shouldRender || !car) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCarAPI(car._id);
      toast.success(`"${car.carName}" removed from fleet.`);
      onDeleted(car._id);
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to delete car.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        className="absolute inset-0 bg-black/70 transition-all duration-300"
        style={{
          opacity: animated ? 1 : 0,
          backdropFilter: animated ? "blur(8px)" : "blur(0px)",
          WebkitBackdropFilter: animated ? "blur(8px)" : "blur(0px)",
        }}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#111111]/95 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] p-6 md:p-8 transition-all duration-280 origin-center"
        style={{
          transitionTimingFunction: SPRING_OUT,
          opacity: animated ? 1 : 0,
          transform: animated
            ? "scale(1) translateY(0)"
            : "scale(0.92) translateY(12px)",
        }}
      >
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer disabled:opacity-30"
          aria-label="Close"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 mx-auto">
          <Trash2 className="w-7 h-7 text-red-400" strokeWidth={1.5} />
        </div>

        <h3 className="font-heading text-xl font-bold text-center text-base-content mb-2">
          Delete Car
        </h3>

        <p className="text-sm text-base-content/50 text-center leading-relaxed mb-7">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-base-content/80">
            {car.carName}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-5 py-3 rounded-xl border border-white/[0.08] text-sm font-medium text-base-content/50 hover:text-base-content hover:border-white/[0.15] hover:bg-white/[0.04] active:scale-[0.97] transition-all duration-200 cursor-pointer disabled:opacity-30"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 hover:border-red-500/40 active:scale-[0.97] transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" strokeWidth={2} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditCarModal({ car, isOpen, onClose, onSaved }) {
  const { shouldRender, animated } = useAnimatedModal(isOpen, 280);

  const [isSaving, setIsSaving] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const [form, setForm] = useState(() => ({
    carName: car?.carName || "",
    dailyRate: String(car?.dailyRate || ""),
    carType: car?.carType || "",
    imageUrl: car?.imageUrl || "",
    seatCapacity: String(car?.seatCapacity || ""),
    pickupLocation: car?.pickupLocation || "",
    description: car?.description || "",
    isAvailable: car?.isAvailable ?? true,
  }));

  if (!shouldRender || !car) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "imageUrl") setPreviewError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateCar(car._id, {
        ...form,
        dailyRate: Number(form.dailyRate),
        seatCapacity: Number(form.seatCapacity),
      });
      toast.success("Car updated successfully! 🚗");
      onSaved(result.car);
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update car.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputBase =
    "w-full bg-base-300/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200";
  const iconWrapper =
    "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-base-content/30 group-focus-within:text-primary/70 transition-colors duration-200";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        className="absolute inset-0 bg-black/70 transition-all duration-300"
        style={{
          opacity: animated ? 1 : 0,
          backdropFilter: animated ? "blur(8px)" : "blur(0px)",
          WebkitBackdropFilter: animated ? "blur(8px)" : "blur(0px)",
        }}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-lg my-8 rounded-2xl border border-white/[0.08] bg-[#111111]/95 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-280 origin-center"
        style={{
          transitionTimingFunction: SPRING_OUT,
          opacity: animated ? 1 : 0,
          transform: animated
            ? "scale(1) translateY(0)"
            : "scale(0.92) translateY(12px)",
        }}
      >
        <div className="flex items-center justify-between px-6 md:px-8 pt-6 md:pt-8 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Pencil
                className="w-[18px] h-[18px] text-primary"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-base-content">
                Edit Car
              </h3>
              <p className="text-[11px] text-base-content/40">
                Update your vehicle details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer disabled:opacity-30"
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 space-y-5 max-h-[60vh] overflow-y-auto"
        >
          <div className="group relative">
            <span className={iconWrapper}>
              <Car className="w-4 h-4" strokeWidth={1.5} />
            </span>
            <input
              type="text"
              name="carName"
              value={form.carName}
              onChange={handleChange}
              placeholder="Car Name"
              required
              className={inputBase}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group relative">
              <span className={iconWrapper}>
                <DollarSign className="w-4 h-4" strokeWidth={1.5} />
              </span>
              <input
                type="number"
                name="dailyRate"
                value={form.dailyRate}
                onChange={handleChange}
                placeholder="Daily Rate"
                required
                min="1"
                className={inputBase}
              />
            </div>
            <div className="group relative">
              <span className={iconWrapper}>
                <ListFilter className="w-4 h-4" strokeWidth={1.5} />
              </span>
              <select
                name="carType"
                value={form.carType}
                onChange={handleChange}
                required
                className={`${inputBase} appearance-none`}
              >
                <option value="" disabled>
                  Car Type
                </option>
                {CAR_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="group relative">
              <span className={iconWrapper}>
                <ImageIcon className="w-4 h-4" strokeWidth={1.5} />
              </span>
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="Image URL"
                required
                className={inputBase}
              />
            </div>
            {form.imageUrl && !previewError && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-base-300 border border-white/[0.06]">
                <Image
                  src={form.imageUrl}
                  alt="Preview"
                  fill
                  sizes="400px"
                  className="object-cover"
                  onError={() => setPreviewError(true)}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group relative">
              <span className={iconWrapper}>
                <Users className="w-4 h-4" strokeWidth={1.5} />
              </span>
              <input
                type="number"
                name="seatCapacity"
                value={form.seatCapacity}
                onChange={handleChange}
                placeholder="Seats"
                required
                min="1"
                className={inputBase}
              />
            </div>
            <div className="group relative">
              <span className={iconWrapper}>
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
              </span>
              <input
                type="text"
                name="pickupLocation"
                value={form.pickupLocation}
                onChange={handleChange}
                placeholder="Location"
                required
                className={inputBase}
              />
            </div>
          </div>

          <div className="group relative">
            <span className={`${iconWrapper} items-start pt-3.5`}>
              <FileText className="w-4 h-4" strokeWidth={1.5} />
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              required
              rows={3}
              className={`${inputBase} resize-none pt-3.5`}
            />
          </div>

          <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-base-300/30 border border-white/[0.06] cursor-pointer hover:bg-base-300/50 hover:border-white/[0.12] transition-all duration-200">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/20 bg-base-300 text-primary focus:ring-primary/30 accent-primary"
            />
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${form.isAvailable ? "bg-emerald-400" : "bg-red-400"}`}
              />
              <span className="text-sm font-medium text-base-content/70">
                {form.isAvailable ? "Available" : "Not Available"}
              </span>
            </div>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-5 py-3 rounded-xl border border-white/[0.08] text-sm font-medium text-base-content/50 hover:text-base-content hover:border-white/[0.15] hover:bg-white/[0.04] active:scale-[0.97] transition-all duration-200 cursor-pointer disabled:opacity-30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-5 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/40 active:scale-[0.97] transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                  Saving...
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" strokeWidth={2} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MyCarCard({ car, onEdit, onDelete, isExiting }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className={`group relative rounded-2xl border border-white/[0.07] bg-base-200 overflow-hidden flex flex-col h-full transition-all duration-500 hover:border-white/[0.14] ${
        isExiting
          ? "opacity-0 scale-[0.92] translate-y-3 pointer-events-none"
          : "opacity-100 scale-100 translate-y-0 hover:-translate-y-1.5"
      }`}
      style={{
        transitionTimingFunction: isExiting
          ? "cubic-bezier(0.4, 0, 1, 1)"
          : `cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div
        className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-all duration-700 pointer-events-none z-10"
        aria-hidden="true"
      />

      <div className="relative aspect-video overflow-hidden bg-base-300">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 skeleton-shimmer" />
        )}
        {!imgError ? (
          <Image
            src={car.imageUrl}
            alt={car.carName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 ease-out ${
              imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            } group-hover:scale-110`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-10 h-10 text-base-content/20" strokeWidth={1} />
          </div>
        )}
        <div
          className="absolute inset-0 bg-linear-to-t from-base-200/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  car.isAvailable ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span
                className={
                  car.isAvailable ? "text-emerald-400/70" : "text-red-400/70"
                }
              >
                {car.isAvailable ? "Available" : "Not Available"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1 min-w-0 shrink">
              <span className="text-xl font-bold text-primary font-heading tracking-tight">
                {formatRate(car.dailyRate)}
              </span>
              <span className="text-xs text-base-content/40 whitespace-nowrap">
                / day
              </span>
            </div>
            <Link
              href={`/cars/${car._id}`}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-base-content/60 border border-white/10 hover:text-primary hover:border-primary/40 hover:bg-primary/5 active:scale-95 transition-all duration-300 group/btn"
              style={{ transitionTimingFunction: SPRING_OUT }}
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(car)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-primary bg-primary/5 border border-primary/15 hover:bg-primary/10 hover:border-primary/30 active:scale-[0.97] transition-all duration-300 cursor-pointer"
              style={{ transitionTimingFunction: SPRING_OUT }}
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
              Edit
            </button>
            <button
              onClick={() => onDelete(car)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/5 border border-red-500/15 hover:bg-red-500/10 hover:border-red-500/30 active:scale-[0.97] transition-all duration-300 cursor-pointer"
              style={{ transitionTimingFunction: SPRING_OUT }}
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              Remove
            </button>
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

export default function MyAddedCarsPage({ params }) {
  const router = useRouter();
  const { uid } = use(params);
  const { data: session, isPending: authPending } = useSession();

  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editCar, setEditCar] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteCar, setDeleteCar] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deletingIds, setDeletingIds] = useState(new Set());

  useEffect(() => {
    if (!authPending && !session?.user) {
      router.replace("/login");
    }
  }, [session, authPending, router]);

  useEffect(() => {
    if (!authPending && session?.user && session.user.id !== uid) {
      router.replace(`/my-added-cars/${session.user.id}`);
    }
  }, [session, authPending, uid, router]);

  useEffect(() => {
    if (!session?.user || session.user.id !== uid) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const [data] = await Promise.all([
          fetchUserCars(uid),
          new Promise((r) => setTimeout(r, 300)),
        ]);

        if (!cancelled) {
          setCars(data);
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
  }, [session, uid]);

  const handleEdit = (car) => {
    setEditCar(car);
    setEditOpen(true);
  };

  const handleDelete = (car) => {
    setDeleteCar(car);
    setDeleteOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setTimeout(() => setEditCar(null), 350);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setTimeout(() => setDeleteCar(null), 350);
  };

  const handleCarUpdated = (updatedCar) => {
    setCars((prev) =>
      prev.map((c) => (c._id === updatedCar._id ? updatedCar : c)),
    );
  };

  const handleCarDeleted = (carId) => {
    setDeletingIds((prev) => new Set([...prev, carId]));
    setTimeout(() => {
      setCars((prev) => prev.filter((c) => c._id !== carId));
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(carId);
        return next;
      });
    }, 450);
  };

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

  if (session.user.id !== uid) {
    return (
      <>
        <Navbar />
        <main className="relative min-h-screen bg-base-100" />
      </>
    );
  }

  const resultsCount = cars.length;

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

        /* Staggered children inside grids */
        .stagger-children > * {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .stats-card {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .max-h-\\[60vh\\]::-webkit-scrollbar {
          width: 3px;
        }
        .max-h-\\[60vh\\]::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        select option {
          background: #111;
          color: #F4F4F5;
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
                Personal Fleet
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
                  COLLECTION.
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
              Manage the vehicles you&apos;ve contributed to the fleet. Edit
              details or remove them as needed.
            </p>
          </div>
        </section>

        {!isLoading && !error && resultsCount > 0 && (
          <section className="relative z-10 pb-8 md:pb-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <StatsBar cars={cars} />
            </div>
          </section>
        )}

        <section className="relative z-10 pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 stagger-children">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard
                    key={i}
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
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
                    fetchUserCars(uid)
                      .then((data) => {
                        setCars(data);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {cars.map((car, index) => (
                  <div
                    key={car._id}
                    className="animate-fade-up h-full"
                    style={{
                      animationDelay: `${60 + Math.min(index * 55, 380)}ms`,
                    }}
                  >
                    <MyCarCard
                      car={car}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isExiting={deletingIds.has(car._id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>

      <EditCarModal
        car={editCar}
        isOpen={editOpen}
        onClose={handleEditClose}
        onSaved={handleCarUpdated}
      />

      <DeleteConfirmModal
        car={deleteCar}
        isOpen={deleteOpen}
        onClose={handleDeleteClose}
        onDeleted={handleCarDeleted}
      />
    </>
  );
}
