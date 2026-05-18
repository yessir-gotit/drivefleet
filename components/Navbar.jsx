"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Car,
  Plus,
  CalendarDays,
  Menu,
  X,
  LogIn,
  UserPlus,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home        },
  { href: "/cars", label: "Explore Cars", icon: Car         },
  { href: "/cars/new", label: "Add Car", icon: Plus        },
  { href: "/dashboard/bookings", label: "My Bookings", icon: CalendarDays },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        "border-b border-white/6",
        scrolled
          ? "bg-black/10 backdrop-blur-2xl"
          : "bg-transparent",
      ].join(" ")}
    >
      {/*  Main bar  */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-17">

  
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          onClick={closeMobile}
        >

          <span className="font-heading font-extrabold tracking-tight text-[#F4F4F5] text-2xl">
            Drive<span className="text-primary">Fleet</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                    active
                      ? "text-[#F4F4F5] bg-white/6"
                      : "text-[#F4F4F5]/50 hover:text-[#F4F4F5] hover:bg-white/4",
                  ].join(" ")}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" strokeWidth={2} />
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-primary rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>


        <div className="hidden md:flex items-center gap-2.5">
          {/* TODO: replace with real auth session check */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium text-[#F4F4F5]/55 border border-white/[0.10] hover:border-white/20 hover:text-[#F4F4F5] hover:bg-white/[0.04] transition-all duration-200"
          >
            <LogIn className="w-3.5 h-3.5" strokeWidth={2} />
            Log In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-primary hover:bg-primary/90 hover:-translate-y-px hover:shadow-[0_0_24px_rgba(0,102,255,0.4)] transition-all duration-200"
          >
            <UserPlus className="w-3.5 h-3.5" strokeWidth={2} />
            Sign Up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.10] text-[#F4F4F5]/60 hover:text-[#F4F4F5] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen
            ? <X    className="w-4 h-4" strokeWidth={2} />
            : <Menu className="w-4 h-4" strokeWidth={2} />
          }
        </button>
      </div>


      <div
        className={[
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="bg-[#0d0d0d] border-b border-white/[0.06] px-4 py-4 space-y-1">

          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                className={[
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-white/[0.06] text-[#F4F4F5]"
                    : "text-[#F4F4F5]/50 hover:text-[#F4F4F5] hover:bg-white/[0.04]",
                ].join(" ")}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                {label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                )}
              </Link>
            );
          })}

  
          <div className="h-px bg-white/6 my-3" />

          {/* Mobile auth */}
          <Link
            href="/login"
            onClick={closeMobile}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-[#F4F4F5]/55 border border-white/[0.10] hover:border-white/20 hover:text-[#F4F4F5] hover:bg-white/[0.04] transition-all duration-200"
          >
            <LogIn className="w-4 h-4" strokeWidth={2} />
            Log In
          </Link>
          <Link
            href="/register"
            onClick={closeMobile}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0066FF]/90 transition-all duration-200 mt-2"
          >
            <UserPlus className="w-4 h-4" strokeWidth={2} />
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}