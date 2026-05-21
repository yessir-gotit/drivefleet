"use client";

import Image from "next/image";
import { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Car,
  Plus,
  CalendarDays,
  X,
  LogIn,
  UserPlus,
  Loader2,
  User,
  LogOut,
  ChevronDown,
  FolderOpen,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";


const mainNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/exploreCars", label: "Explore Cars", icon: Car },
];

const profileLinks = [
  { href: "/addCar", label: "Add Car", icon: Plus },
  { href: "/dashboard/bookings", label: "My Bookings", icon: CalendarDays },
  { href: "/my-added-cars", label: "My Added Cars", icon: FolderOpen, dynamic: true },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const dropdownRef = useRef(null);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);


  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMenus = () => {
    setMobileOpen(false);
    setDropdownOpen(false);
  };

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out",
          scrolled
            ? "bg-black/10 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
      >
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 flex items-center h-16 md:h-[72px]">
          
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
              onClick={closeMenus}
            >
              
              <span className="font-heading font-extrabold tracking-tight text-[#F4F4F5] text-2xl">
                Drive<span className="text-primary">Fleet</span>
              </span>
            </Link>
          </div>

          <ul className="hidden md:flex items-center justify-center gap-1 list-none m-0 p-0">
            {mainNavLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenus}
                    className={[
                      "relative flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300",
                      active
                        ? "text-white bg-white/[0.08] shadow-[0_0_20px_rgba(0,102,255,0.08)]"
                        : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]",
                    ].join(" ")}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                    {label}
                    {active && (
                      <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-5 h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(0,102,255,0.6)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex-1 flex justify-end items-center gap-3">
            
            <div className="hidden md:flex items-center gap-3">
              {isPending ? (
                <div className="flex items-center px-3">
                  <Loader2 className="w-4 h-4 animate-spin text-white/30" strokeWidth={2} />
                </div>
              ) : session?.user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className={[
                      "flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer",
                      dropdownOpen
                        ? "bg-white/[0.08] border-white/[0.15] shadow-[0_0_24px_rgba(0,102,255,0.1)]"
                        : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12]",
                    ].join(" ")}
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        height={28}
                        width={28}
                        className="w-7 h-7 object-cover rounded-full ring-2 ring-white/10"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-primary/20">
                        <User className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                      </div>
                    )}
                    <span className="text-[13px] font-medium text-white/70 max-w-[90px] truncate">
                      {session.user.name?.split(" ")[0] || "User"}
                    </span>
                    <ChevronDown
                      className={[
                        "w-3.5 h-3.5 text-white/30 transition-transform duration-300",
                        dropdownOpen && "rotate-180",
                      ].join(" ")}
                      strokeWidth={2}
                    />
                  </button>

                  <div
                    className={[
                      "absolute right-0 top-full mt-2 w-60 rounded-2xl bg-[#111111]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 origin-top-right",
                      dropdownOpen
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none",
                    ].join(" ")}
                  >
                    <div className="px-4 py-3.5 border-b border-white/[0.06]">
                      <p className="text-sm font-semibold text-white/90 truncate">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-[11px] text-white/30 truncate mt-0.5">
                        {session.user.email}
                      </p>
                    </div>

                    <div className="p-1.5">
                      {profileLinks.map(({ href, label, icon: Icon, dynamic }) => {
                        const resolvedHref = dynamic && session?.user ? `/my-added-cars/${session.user.id}` : href;
                        const active = isActive(dynamic ? "/my-added-cars" : href);
                        return (
                          <Link
                            key={href}
                            href={resolvedHref}
                            onClick={closeMenus}
                            className={[
                              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                              active
                                ? "bg-white/[0.08] text-white"
                                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]",
                            ].join(" ")}
                          >
                            <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                            {label}
                            {active && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(0,102,255,0.6)]" />
                            )}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="h-px bg-white/[0.06] mx-3" />

                    <div className="p-1.5 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 shrink-0" strokeWidth={2} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenus}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium text-white/50 border border-white/[0.08] hover:text-white/80 hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <LogIn className="w-3.5 h-3.5" strokeWidth={2} />
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenus}
                    className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,102,255,0.35)] hover:-translate-y-[1px] transition-all duration-300"
                  >
                    <UserPlus className="w-3.5 h-3.5" strokeWidth={2} />
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={[
                "md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer",
                mobileOpen
                  ? "bg-white/[0.08] border-white/[0.15] text-white"
                  : "bg-transparent border-white/[0.08] text-white/50 hover:text-white/80 hover:border-white/[0.12]",
              ].join(" ")}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-[16px] h-[14px]">
                <span
                  className={[
                    "absolute left-0 w-full h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center",
                    mobileOpen ? "top-[6px] rotate-45" : "top-0",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 top-[6px] w-full h-[1.5px] bg-current rounded-full transition-all duration-200",
                    mobileOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 w-full h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center",
                    mobileOpen ? "top-[6px] -rotate-45" : "top-[12px]",
                  ].join(" ")}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-400",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <div
        className={[
          "fixed top-0 right-0 z-50 w-[280px] h-full md:hidden transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="h-full bg-[#0A0A0A]/98 backdrop-blur-2xl border-l border-white/[0.06] flex flex-col">
          <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.06]">
            <span className="font-heading font-bold text-white/60 text-sm uppercase tracking-[0.15em]">
              Navigation
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
            {mainNavLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-white/[0.07] text-white"
                      : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]",
                  ].join(" ")}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.8} />
                  {label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,102,255,0.6)]" />
                  )}
                </Link>
              );
            })}

            {session?.user && (
              <>
                <div className="h-px bg-white/[0.06] my-4" />
                <p className="px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20 mb-2">
                  Account
                </p>
                {profileLinks.map(({ href, label, icon: Icon, dynamic }) => {
                  const resolvedHref = dynamic && session?.user ? `/my-added-cars/${session.user.id}` : href;
                  const active = isActive(dynamic ? "/my-added-cars" : href);
                  return (
                    <Link
                      key={href}
                      href={resolvedHref}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-white/[0.07] text-white"
                          : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]",
                      ].join(" ")}
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.8} />
                      {label}
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,102,255,0.6)]" />
                      )}
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          <div className="px-4 pb-6 pt-3 border-t border-white/[0.06]">
            {isPending ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-white/30" strokeWidth={2} />
              </div>
            ) : session?.user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      height={32}
                      width={32}
                      className="w-8 h-8 object-cover rounded-full ring-2 ring-white/10"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-primary/20 shrink-0">
                      <User className="w-4 h-4 text-primary" strokeWidth={2} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white/80 truncate">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-[11px] text-white/30 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400/60 border border-red-400/10 hover:text-red-400 hover:border-red-400/25 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" strokeWidth={2} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 border border-white/[0.08] hover:text-white/80 hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" strokeWidth={2} />
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" strokeWidth={2} />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(Navbar);
