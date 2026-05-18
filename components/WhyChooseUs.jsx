import {
  ShieldCheck,
  Zap,
  RefreshCcw,
  Headphones,
  BadgeDollarSign,
  BadgeCheck,
  Star,
  Users,
  Car,
} from "lucide-react";

const cards = [
  {
    icon: ShieldCheck,
    title: "Verified Fleet",
    body: "Every vehicle undergoes a rigorous 50-point inspection before it's listed. Safety and quality, guaranteed.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    body: "Reserve your vehicle in under 2 minutes. No back-and-forth, no waiting — just confirm and go.",
  },
  {
    icon: RefreshCcw,
    title: "Free Cancellation",
    body: "Plans change. Cancel any booking up to 24 hours before pickup at absolutely no charge.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    body: "Our concierge team is available around the clock — by chat, phone, or email — wherever your journey takes you.",
  },
  {
    icon: BadgeDollarSign,
    title: "Transparent Pricing",
    body: "The price you see is the price you pay. No hidden fees, no surprises at the counter.",
  },
  {
    icon: BadgeCheck,
    title: "Insured Rides",
    body: "Comprehensive insurance coverage is included on every rental, so you can drive with total peace of mind.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-base-200 py-24 md:py-36">
  
      <span
        className="absolute top-0 left-0 font-heading font-black text-[18rem] text-white/2.5 leading-none select-none pointer-events-none z-0"
        aria-hidden="true"
      >
        03
      </span>


      <div
        className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-radial from-primary/10 to-transparent filter blur-[80px] pointer-events-none z-0"
        aria-hidden="true"
      />


      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">

        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
      
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-12 bg-primary/40" />
            <span className="text-xs tracking-[0.2em] uppercase font-semibold text-primary">
              Why DriveFleet
            </span>
            <span className="h-px w-12 bg-primary/40" />
          </div>

          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-base-content">
            Everything You Need,
            <br />
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: "1.5px rgba(244,244,245,0.3)",
              }}
            >
              Nothing You Don&rsquo;t.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-5 text-base-content/50 text-lg max-w-xl leading-relaxed">
            Six reasons thousands of drivers choose DriveFleet for every journey
            — from weekend escapes to cross-country adventures.
          </p>
        </div>

        {/* card grid  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-4">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-white/[0.07] bg-base-200 p-7 overflow-hidden hover:border-white/[0.14] hover:-translate-y-1.5 transition-all duration-500"
                style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
              >
                {/* top left hover animation*/}
                <div
                  className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-all duration-500 pointer-events-none"
                  aria-hidden="true"
                />

   
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:border-primary/35 transition-all duration-300">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>

                <h3 className="font-heading text-lg font-bold tracking-tight text-base-content mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-base-content/50 leading-relaxed">
                  {card.body}
                </p>


                <div
                  className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>


        <div className="flex items-center justify-center gap-8 flex-wrap mt-14">

          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-semibold text-base-content">
              4.9/5
            </span>
            <span className="text-sm text-base-content">
              Average Rating
            </span>
          </div>

          <span className="w-px h-4 bg-white/10 hidden md:block" aria-hidden="true" />


          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-base-content">
              12,000+ Happy Renters
            </span>
          </div>

          <span className="w-px h-4 bg-white/10 hidden md:block" aria-hidden="true" />


          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-base-content">
              500+ Vehicles Available
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
