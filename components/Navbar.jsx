"use client";
import Image from "next/image";
// Todo: gotta make it tablet friendly
import { useState, useEffect, memo } from "react";
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
  Loader2,
  User,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

const navLinks = [
  { href: "/", label: "Home", icon: Home        },
  { href: "/cars", label: "Explore Cars", icon: Car         },
  { href: "/cars/new", label: "Add Car", icon: Plus        },
  { href: "/dashboard/bookings", label: "My Bookings", icon: CalendarDays },
];

function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSignOut = async () => {
    closeMobile();
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

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
          {isPending ? (
            <div className="flex items-center gap-2 px-4 py-1.5">
              <Loader2 className="w-4 h-4 animate-spin text-[#F4F4F5]/40" strokeWidth={2} />
            </div>
          ) : session?.user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/6">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    height={20}
                    width={20}
                    className="w-5 h-5 object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                  </div>
                )}
                <span className="text-sm font-medium text-[#F4F4F5]/80 max-w-[100px] truncate">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-[#F4F4F5]/40 border border-white/[0.06] hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
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
          {isPending ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#F4F4F5]/40" strokeWidth={2} />
            </div>
          ) : session?.user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    height={20}
                    width={20}
                    className="w-5 h-5 object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary" strokeWidth={2} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#F4F4F5]/80 truncate">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs text-[#F4F4F5]/40 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400/70 border border-red-400/15 hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" strokeWidth={2} />
                Sign Out
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default memo(Navbar);