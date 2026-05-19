"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import {
  Car,
  DollarSign,
  ListFilter,
  Image as ImageIcon,
  Users,
  MapPin,
  FileText,
  ArrowRight,
  Loader2,
  ChevronDown,
} from "lucide-react";

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

const INITIAL_FORM = {
  carName: "",
  dailyRate: "",
  carType: "",
  imageUrl: "",
  seatCapacity: "",
  pickupLocation: "",
  description: "",
  isAvailable: true,
};

function validateForm(form) {
  const errors = {};

  if (!form.carName.trim() || form.carName.trim().length < 2) {
    errors.carName = "Car name must be at least 2 characters.";
  }

  if (!form.dailyRate || Number(form.dailyRate) <= 0) {
    errors.dailyRate = "Please enter a valid daily rent price.";
  }

  if (!form.carType) {
    errors.carType = "Please select a car type.";
  }

  if (!form.imageUrl.trim()) {
    errors.imageUrl = "Image URL is required.";
  } else {
    try {
      new URL(form.imageUrl);
    } catch {
      errors.imageUrl = "Please enter a valid URL (e.g. https://...)";
    }
  }

  if (!form.seatCapacity || Number(form.seatCapacity) < 1) {
    errors.seatCapacity = "Seat capacity must be at least 1.";
  }

  if (!form.pickupLocation.trim() || form.pickupLocation.trim().length < 3) {
    errors.pickupLocation = "Pickup location must be at least 3 characters.";
  }

  if (!form.description.trim() || form.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  return errors;
}

export default function AddCarPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [previewError, setPreviewError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (name === "imageUrl") setPreviewError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add car");
      }

      toast.success("Car added to fleet successfully! 🚗");
      router.push("/");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  //  Shared input class
  const inputBase =
    "w-full bg-base-300/50 border border-white/10 rounded-xl px-4 py-3.5 pl-10 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200";

  const inputError =
    "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/30";

  const iconWrapper =
    "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-base-content/30 group-focus-within:text-primary/70 transition-colors duration-200";

  const fieldErrorStyles = (fieldName) =>
    `${inputBase} ${errors[fieldName] ? inputError : ""}`;

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
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 102, 255, 0.15); }
          50%      { box-shadow: 0 0 36px rgba(0, 102, 255, 0.3);  }
        }
        .btn-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        /* ── Subtle Dot Grid Texture ── */
        .dot-grid {
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        /* ── Watermark Monogram ── */
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

        /* ── Custom Toggle ── */
        .toggle-track {
          width: 44px;
          height: 24px;
          border-radius: 9999px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #ffffff;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .toggle-track.active .toggle-thumb {
          transform: translateX(20px);
        }

        /*  Custom Select  */
        .custom-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        .custom-select option {
          background: #1C1C1E;
          color: #F4F4F5;
        }

        /*  Textarea  */
        .custom-textarea {
          min-height: 120px;
          resize: vertical;
        }

        /*  Per-field error  */
        .field-error {
          font-size: 0.75rem;
          color: #f87171;
          margin-top: 4px;
          padding-left: 4px;
        }
      `}</style>

      <Navbar />

      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-base-100 pt-10">
        <div className="absolute inset-0 z-0 dot-grid" aria-hidden="true" />

        {/* Ambient Glow */}
        <div className="ambient-glow z-[1]" aria-hidden="true" />

        {/*  Main Content  */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col items-center">
          {/*  Eyebrow  */}
          <div
            className="animate-in flex items-center gap-3 mb-8 md:mb-10"
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-px w-8 bg-white/20" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-base-content/40">
              Fleet Management
            </span>
            <span className="h-px w-8 bg-white/20" aria-hidden="true" />
          </div>

          {/*  Hero Typography  */}
          <div
            className="animate-in text-center"
            style={{ animationDelay: "80ms" }}
          >
            <h1 className="font-heading font-bold tracking-[-0.04em] leading-[0.95] select-none flex flex-wrap items-baseline justify-center gap-x-6 md:gap-x-8">
              <span className="text-[clamp(2.6rem,7vw,5rem)] text-base-content">
                ADD TO
              </span>
              <span className="text-[clamp(2.6rem,7vw,5rem)] text-primary">
                FLEET.
              </span>
            </h1>
          </div>

          {/*  Divider  */}
          <div
            className="animate-in w-14 h-px bg-primary/60 mt-6 md:mt-8 mb-6 md:mb-8"
            style={{ animationDelay: "120ms" }}
            aria-hidden="true"
          />

          {/*  Tagline  */}
          <p
            className="animate-in text-sm md:text-base text-base-content/45 font-light leading-relaxed max-w-md text-center px-2 mb-10 md:mb-14"
            style={{ animationDelay: "160ms" }}
          >
            Add a new vehicle to your DriveFleet inventory and start earning.
          </p>

          {/*  Form Card  */}
          <div
            className="animate-in w-full max-w-2xl"
            style={{ animationDelay: "240ms" }}
          >
            <div className="glass-premium rounded-2xl p-7 md:p-10">
              {/* Card Header */}
              <div className="mb-8 text-center">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-base-content">
                  Vehicle Details
                </h2>
                <p className="mt-1.5 text-sm text-base-content/50">
                  Fill in the information below
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid md:grid-cols-2 gap-5">
                  {/*  Column 1  */}

                  {/*  Car Name */}
                  <div className="relative">
                    <div className="relative group">
                      <span className={iconWrapper}>
                        <Car className="w-4 h-4" strokeWidth={2} />
                      </span>
                      <input
                        type="text"
                        name="carName"
                        value={form.carName}
                        onChange={handleChange}
                        placeholder="Car Name *"
                        required
                        aria-label="Car Name"
                        className={fieldErrorStyles("carName")}
                      />
                    </div>
                    {errors.carName && (
                      <p className="field-error">{errors.carName}</p>
                    )}
                  </div>

                  {/*  Daily Rent Price */}
                  <div className="relative">
                    <div className="relative group">
                      <span className={iconWrapper}>
                        <DollarSign className="w-4 h-4" strokeWidth={2} />
                      </span>
                      <input
                        type="number"
                        name="dailyRate"
                        value={form.dailyRate}
                        onChange={handleChange}
                        placeholder="Daily Rent Price *"
                        required
                        min="0"
                        step="0.01"
                        aria-label="Daily Rent Price"
                        className={fieldErrorStyles("dailyRate")}
                      />
                    </div>
                    {errors.dailyRate && (
                      <p className="field-error">{errors.dailyRate}</p>
                    )}
                  </div>

                  {/*  Car Type  */}
                  <div className="relative">
                    <div className="relative group">
                      <span className={iconWrapper}>
                        <ListFilter className="w-4 h-4" strokeWidth={2} />
                      </span>
                      <select
                        name="carType"
                        value={form.carType}
                        onChange={handleChange}
                        required
                        aria-label="Car Type"
                        className={`${fieldErrorStyles("carType")} custom-select pr-10`}
                      >
                        <option value="" disabled>
                          Car Type *
                        </option>
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
                    {errors.carType && (
                      <p className="field-error">{errors.carType}</p>
                    )}
                  </div>

                  {/*  Seat Capacity */}
                  <div className="relative">
                    <div className="relative group">
                      <span className={iconWrapper}>
                        <Users className="w-4 h-4" strokeWidth={2} />
                      </span>
                      <input
                        type="number"
                        name="seatCapacity"
                        value={form.seatCapacity}
                        onChange={handleChange}
                        placeholder="Seat Capacity *"
                        required
                        min="1"
                        step="1"
                        aria-label="Seat Capacity"
                        className={fieldErrorStyles("seatCapacity")}
                      />
                    </div>
                    {errors.seatCapacity && (
                      <p className="field-error">{errors.seatCapacity}</p>
                    )}
                  </div>

                  {/*  Column 2  */}

                  {/*  Pickup Location */}
                  <div className="relative">
                    <div className="relative group">
                      <span className={iconWrapper}>
                        <MapPin className="w-4 h-4" strokeWidth={2} />
                      </span>
                      <input
                        type="text"
                        name="pickupLocation"
                        value={form.pickupLocation}
                        onChange={handleChange}
                        placeholder="Pickup Location *"
                        required
                        aria-label="Pickup Location"
                        className={fieldErrorStyles("pickupLocation")}
                      />
                    </div>
                    {errors.pickupLocation && (
                      <p className="field-error">{errors.pickupLocation}</p>
                    )}
                  </div>

                  {/*  Image URL */}
                  <div>
                    <div>
                      <div className="relative group">
                        <span className={iconWrapper}>
                          <ImageIcon className="w-4 h-4" strokeWidth={2} />
                        </span>
                        <input
                          type="url"
                          name="imageUrl"
                          value={form.imageUrl}
                          onChange={handleChange}
                          placeholder="Image URL *"
                          required
                          aria-label="Car Image URL"
                          className={fieldErrorStyles("imageUrl")}
                        />
                      </div>
                      {errors.imageUrl && (
                        <p className="field-error">{errors.imageUrl}</p>
                      )}
                    </div>

                    {/* Image Preview */}
                    {form.imageUrl && !previewError && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-base-300">
                          <Image
                            src={form.imageUrl}
                            alt="Car preview"
                            width={150}
                            height={200}
                            className="object-cover"
                            onError={() => setPreviewError(true)}
                          />
                        </div>
                        <span className="text-xs text-base-content/40">
                          Image preview
                        </span>
                      </div>
                    )}
                    {form.imageUrl && previewError && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-base-300 flex items-center justify-center">
                          <ImageIcon
                            className="w-4 h-4 text-base-content/30"
                            strokeWidth={2}
                          />
                        </div>
                        <span className="text-xs text-base-content/30">
                          Invalid image URL
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/*  Description  */}
                <div className="relative">
                  <div className="relative group">
                    <span className={`${iconWrapper} items-start pt-4`}>
                      <FileText className="w-4 h-4" strokeWidth={2} />
                    </span>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Description * (min. 10 characters)"
                      required
                      aria-label="Car Description"
                      className={`${fieldErrorStyles("description")} custom-textarea pl-10`}
                    />
                  </div>
                  {errors.description && (
                    <p className="field-error">{errors.description}</p>
                  )}
                </div>

                {/*  Availability Toggle */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-base-content/70">
                    Available for rent
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.isAvailable}
                    aria-label="Availability Status"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        isAvailable: !prev.isAvailable,
                      }))
                    }
                    className={`toggle-track ${form.isAvailable ? "active bg-primary" : "bg-base-300/70"}`}
                  >
                    <span className="toggle-thumb" />
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-glow w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-white text-sm font-semibold tracking-wide hover:bg-primary/90 hover:-translate-y-px hover:shadow-[0_0_36px_rgba(0,102,255,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                  ) : (
                    <Car className="w-4 h-4" strokeWidth={2} />
                  )}
                  {isLoading ? "Adding to Fleet..." : "Add to Fleet"}
                  {!isLoading && (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
