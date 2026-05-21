"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error: authError } = await signIn.email({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      const message = authError.message || "Failed to sign in. Please check your credentials.";
      setError(message);
      toast.error(message);
      setIsLoading(false);
    } else {
      toast.success("Logged in successfully! Welcome back.");
      router.push("/");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    toast.info("Redirecting to Google...");
    await signIn.social({
      provider: "google",
      callbackURL: window.location.origin + "/",
    });
  };

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
          className="absolute inset-0 z-[1]"
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
          className="absolute bottom-0 left-0 right-0 h-40 z-[1] bg-linear-to-t from-base-100 to-transparent"
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
              Welcome Back
            </span>
            <span className="h-px w-8 bg-white/20" aria-hidden="true" />
          </div>

          <div
            className="animate-in text-center"
            style={{ animationDelay: "80ms" }}
          >
            <h1 className="font-heading font-bold tracking-[-0.04em] leading-[0.95] select-none flex flex-wrap items-baseline justify-center gap-x-6 md:gap-x-8">
              <span className="text-[clamp(2.5rem,8vw,6rem)] text-base-content">
                WELCOME
              </span>
              <span
                className="text-[clamp(2.5rem,8vw,6rem)]"
                style={{
                  WebkitTextStroke: "1.5px rgba(244,244,245,0.3)",
                  color: "transparent",
                }}
              >
                BACK.
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
            Log back into your DriveFleet account and pick up where you left off.
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
                  Log in to your account
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSignIn}>

                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-base-content/30 group-focus-within:text-primary/70 transition-colors duration-200">
                    <Mail className="w-4 h-4" strokeWidth={2} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    aria-label="Email Address"
                    className="w-full bg-base-300/50 border border-white/10 rounded-xl px-4 py-3.5 pl-10 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                  />
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
                    placeholder="Password"
                    aria-label="Password"
                    className="w-full bg-base-300/50 border border-white/10 rounded-xl px-4 py-3.5 pl-10 pr-11 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-base-content/30 hover:text-base-content/60 transition-colors duration-200 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" strokeWidth={2} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={2} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between -mt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <span className="relative shrink-0">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer sr-only"
                        aria-label="Remember me"
                      />
                      <span
                        className={`block w-4 h-4 rounded border transition-all duration-200 ${
                          rememberMe
                            ? "bg-primary border-primary"
                            : "border-white/20 bg-base-300/50 group-hover:border-white/30"
                        } flex items-center justify-center`}
                      >
                        {rememberMe && (
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
                    <span className="text-sm text-base-content/50 group-hover:text-base-content/65 transition-colors duration-200">
                      Remember me
                    </span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary/70 hover:text-primary transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-glow w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-white text-sm font-semibold tracking-wide hover:bg-primary/90 hover:-translate-y-px hover:shadow-[0_0_36px rgba(0,102,255,0.5)] transition-all duration-300 cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                  ) : (
                    <LogIn className="w-4 h-4" strokeWidth={2} />
                  )}
                  {isLoading ? "Signing In..." : "Log In"}
                  {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />}
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

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2.5 px-16 py-3 rounded-xl border border-white/10 text-sm font-medium text-base-content/55 hover:text-base-content hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                Don&rsquo;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary font-medium hover:text-primary/80 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
