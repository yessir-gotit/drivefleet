"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import {
  User,
  Mail,
  Image as ImageLucide,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { signUp, signIn, signOut } from "@/lib/auth-client";

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", bars: 0, color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;

  if (score === 0) return { score: 0, label: "", bars: 0, color: "" };
  if (score <= 1)
    return { score: 1, label: "Weak", bars: 1, color: "bg-red-500" };
  if (score === 2)
    return { score: 2, label: "Fair", bars: 2, color: "bg-yellow-500" };
  return { score: 3, label: "Strong", bars: 3, color: "bg-green-500" };
}

const PASSWORD_CRITERIA = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains an uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Contains a lowercase letter", test: (p) => /[a-z]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoUrl: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "photoUrl") setPreviewError(false);
    if (error) setError("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate all fields are filled
    const emptyFields = [];
    if (!form.name.trim()) emptyFields.push("Full Name");
    if (!form.email.trim()) emptyFields.push("Email");
    if (!form.photoUrl.trim()) emptyFields.push("Photo URL");
    if (!form.password) emptyFields.push("Password");

    if (emptyFields.length > 0) {
      const message = `Please fill in the following required fields: ${emptyFields.join(", ")}.`;
      setError(message);
      toast.error(message);
      setIsLoading(false);
      return;
    }

    if (!termsAccepted) {
      const message = "You must accept the Terms & Conditions to create an account.";
      setError(message);
      toast.error(message);
      setIsLoading(false);
      return;
    }

    await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      image: form.photoUrl || undefined,
    }, {
      onSuccess: async () => {
        toast.success("Account created successfully! Please log in to continue.");
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login");
            },
          },
        });
      },
      onError: (ctx) => {
        const message = ctx.error?.message || "Failed to create account. Please try again.";
        setError(message);
        toast.error(message);
        setIsLoading(false);
      },
    });
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    await signIn.social({
      provider: "google",
      callbackURL: window.location.origin + "/",
    });
  };

  const strength = getPasswordStrength(form.password);

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
      `}</style>

      <Navbar />
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-base-100 pt-10">

        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2670&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.05] blur-[2px] scale-105"
          />
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

        <div className="ambient-glow z-[1]" aria-hidden="true" />

        <div
          className="absolute bottom-0 left-0 right-0 h-40 z-1 bg-linear-to-t from-base-100 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 right-0 h-40 z-[1] bg-linear-to-b from-base-100/80 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col items-center">
  
          <div
            className="animate-in flex items-center gap-3 mb-8 md:mb-10"
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-px w-8 bg-white/20" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-base-content/40">
              Join The Fleet
            </span>
            <span className="h-px w-8 bg-white/20" aria-hidden="true" />
          </div>


          <div
            className="animate-in text-center"
            style={{ animationDelay: "80ms" }}
          >
            <h1 className="font-heading font-bold tracking-[-0.04em] leading-[0.95] select-none flex flex-wrap items-baseline justify-center gap-x-6 md:gap-x-8">
              <span className="text-[clamp(2.5rem,8vw,6rem)] text-base-content">
                JOIN
              </span>
              <span
                className="text-[clamp(2.5rem,8vw,6rem)]"
                style={{
                  WebkitTextStroke: "1.5px rgba(244,244,245,0.3)",
                  color: "transparent",
                }}
              >
                THE
              </span>
              <span className="text-[clamp(2.5rem,8vw,6rem)] text-primary">
                FLEET.
              </span>
            </h1>
          </div>

          <div
            className="animate-in w-14 h-px bg-primary/60 mt-6 md:mt-8 mb-6 md:mb-8"
            style={{ animationDelay: "120ms" }}
            aria-hidden="true"
          />

          <p
            className="animate-in text-sm md:text-base text-base-content/45 font-light leading-relaxed max-w-md text-center px-2 mb-10 md:mb-14"
            style={{ animationDelay: "160ms" }}
          >
            Create your DriveFleet account and unlock a world of premium
            automotive experiences.
          </p>

          <div
            className="animate-in w-full max-w-lg"
            style={{ animationDelay: "240ms" }}
          >
            <div className="glass-premium rounded-2xl p-7 md:p-10">
              <div className="mb-8 text-center">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-base-content">
                  Welcome to DriveFleet
                </h2>
                <p className="mt-1.5 text-sm text-base-content/50">
                  Create your account below
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSignUp}>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-base-content/30 group-focus-within:text-primary/70 transition-colors duration-200">
                    <User className="w-4 h-4" strokeWidth={2} />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name *"
                    required
                    aria-label="Full Name"
                    className="w-full bg-base-300/50 border border-white/10 rounded-xl px-4 py-3.5 pl-10 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-base-content/30 group-focus-within:text-primary/70 transition-colors duration-200">
                    <Mail className="w-4 h-4" strokeWidth={2} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email *"
                    required
                    aria-label="Email Address"
                    className="w-full bg-base-300/50 border border-white/10 rounded-xl px-4 py-3.5 pl-10 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                  />
                </div>

                <div>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-base-content/30 group-focus-within:text-primary/70 transition-colors duration-200">
                      <ImageLucide className="w-4 h-4" strokeWidth={2} />
                    </span>
                    <input
                      type="url"
                      name="photoUrl"
                      value={form.photoUrl}
                      onChange={handleChange}
                      placeholder="Photo URL *"
                      required
                      aria-label="Profile Photo URL"
                      className="w-full bg-base-300/50 border border-white/10 rounded-xl px-4 py-3.5 pl-10 pr-4 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>

                  {form.photoUrl && !previewError && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0 bg-base-300">
                        <Image
                          src={form.photoUrl}
                          alt="Profile preview"
                          fill
                          unoptimized
                          sizes="40px"
                          className="object-cover"
                          onError={() => setPreviewError(true)}
                        />
                      </div>
                      <span className="text-xs text-base-content/40">
                        Profile preview
                      </span>
                    </div>
                  )}
                  {form.photoUrl && previewError && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0 bg-base-300 flex items-center justify-center">
                        <ImageLucide
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

                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-base-content/30 group-focus-within:text-primary/70 transition-colors duration-200">
                    <Lock className="w-4 h-4" strokeWidth={2} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password *"
                    required
                    aria-label="Password"
                    className="w-full bg-base-300/50 border border-white/10 rounded-xl px-4 py-3.5 pl-10 pr-11 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-base-content/30 hover:text-base-content/60 transition-colors duration-200 cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" strokeWidth={2} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={2} />
                    )}
                  </button>
                </div>

                {form.password && (
                  <div className="space-y-1.5 -mt-1">
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((bar) => (
                        <div
                          key={bar}
                          className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                            bar <= strength.score
                              ? strength.color
                              : "bg-white/8"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs font-medium tracking-wide ${strength.color.replace(
                        "bg-",
                        "text-",
                      )}`}
                    >
                      {strength.label}
                    </p>
                  </div>
                )}

                {form.password && (
                  <ul className="space-y-2 -mt-1">
                    {PASSWORD_CRITERIA.map((criterion, index) => {
                      const met = criterion.test(form.password);
                      return (
                        <li key={index} className="flex items-center gap-2.5">
                          <span
                            className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                              met
                                ? "bg-green-500/15 text-green-500"
                                : "bg-white/8 text-base-content/25"
                            }`}
                          >
                            {met ? (
                              <Check className="w-2.5 h-2.5" strokeWidth={3} />
                            ) : (
                              <X className="w-2.5 h-2.5" strokeWidth={2.5} />
                            )}
                          </span>
                          <span
                            className={`text-xs transition-all duration-300 ${
                              met ? "text-green-400/90" : "text-base-content/35"
                            }`}
                          >
                            {criterion.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <label className="flex items-start gap-3 cursor-pointer group">
                  <span className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="peer sr-only"
                      aria-label="Accept Terms and Conditions"
                    />
                    <span
                      className={`block w-4 h-4 rounded border transition-all duration-200 ${
                        termsAccepted
                          ? "bg-primary border-primary"
                          : "border-white/20 bg-base-300/50 group-hover:border-white/30"
                      } flex items-center justify-center`}
                    >
                      {termsAccepted && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                  </span>
                  <span className="text-sm text-base-content/50 group-hover:text-base-content/65 transition-colors duration-200 leading-relaxed">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                    >
                      Terms & Conditions
                    </Link>
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn-glow w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-white text-sm font-semibold tracking-wide hover:bg-primary/90 hover:-translate-y-px hover:shadow-[0_0_36px_rgba(0,102,255,0.5)] transition-all duration-300 cursor-pointer"
                >
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/8" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-xs text-base-content/40 bg-base-100/60 backdrop-blur-sm">
                    or continue with
                  </span>
                </div>
              </div>

          
              <div className="max-w-2xl w-1/2 flex justify-center align-middle mx-auto">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2.5 px-16 py-3 rounded-xl border border-white/10 text-sm font-medium text-base-content/55 hover:text-base-content hover:border-white/20 hover:bg-white/4 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3-3C17.2 1.2 14.8 0 12 0 7.4 0 3.4 2.7 1.3 6.6l3.5 2.8C6 6.6 8.8 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.3-2.3H12v4.6h6.5c-.3 1.5-1.2 2.8-2.5 3.6l3.9 3c2.3-2.1 3.6-5.2 3.6-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6 14.6c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8L2.5 4.2C.9 6.7 0 9.7 0 12.8c0 3.1.9 6.1 2.5 8.6L6 14.6z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.3 0 6-1.1 8-3l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.2 0-6-2.2-7-5.2l-3.5 2.8C3.5 21.3 7.5 24 12 24z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-base-content/45">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium hover:text-primary/80 transition-colors duration-200"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
