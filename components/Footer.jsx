import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-base-100 border-t border-white/6">
      <div className="py-16 md:py-24">
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 max-w-7xl mx-auto px-4 md:px-8">
          <div>
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="font-heading font-extrabold text-xl">
                Drive<span className="text-primary">Fleet</span>
              </span>
            </Link>

            <p className="mt-3 text-sm text-base-content/50 leading-relaxed max-w-[200px]">
              Curated vehicles for those who demand more from every journey.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Github"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-base-content/50 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-base-content/50 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-base-content/50 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1.5"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-base-content/50 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Linkedin"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-base-content/50 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase font-semibold text-base-content/35 mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/cars"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  Browse All Cars
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?category=luxury"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  Luxury Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?category=electric"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  Electric Vehicles
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?type=daily"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  Daily Rentals
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?type=lease"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  Long-Term Lease
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase font-semibold text-base-content/35 mb-5">
              Account
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/register"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/bookings"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/profile"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/listings/new"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  Add a Listing
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/listings"
                  className="text-sm text-base-content/55 hover:text-white transition-colors duration-200"
                >
                  Manage Listings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase font-semibold text-base-content/35 mb-5">
              Get in Touch
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 shrink-0 flex items-center justify-center text-primary">
                  <MapPin className="w-4 h-4" />
                </span>
                <span className="text-sm text-base-content/55 leading-relaxed">
                  123 Fleet Avenue, Dhaka 1212, Bangladesh
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 shrink-0 flex items-center justify-center text-primary">
                  <Phone className="w-4 h-4" />
                </span>
                <a
                  href="tel:+8801700000000"
                  className="text-sm text-base-content/55 hover:text-white transition-colors"
                >
                  +880 170 000 0000
                </a>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 shrink-0 flex items-center justify-center text-primary">
                  <Mail className="w-4 h-4" />
                </span>
                <a
                  href="mailto:hello@drivefleet.com"
                  className="text-sm text-base-content/55 hover:text-white transition-colors"
                >
                  hello@drivefleet.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] py-5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-base-content/30">
            &copy; 2026 DriveFleet. All rights reserved.
          </span>
          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="text-xs text-base-content/30 hover:text-base-content/60 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-base-content/30 hover:text-base-content/60 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-xs text-base-content/30 hover:text-base-content/60 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      <span
        className="absolute bottom-0 right-15 translate-x-1/4 font-heading font-black text-[16rem] text-white/[0.018] leading-none select-none pointer-events-none z-0"
        aria-hidden="true"
      >
        DF
      </span>
    </footer>
  );
}
