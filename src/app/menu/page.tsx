"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const visualItems = [
  {
    name: "Single Smash",
    subtitle: "Single patty · Brioche · American cheese",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
  },
  {
    name: "Double Smash",
    subtitle: "Two smashed patties · Double cheese",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
  },
  {
    name: "Triple Smash",
    subtitle: "Triple patty · For the brave",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800",
  },
  {
    name: "Chicken Burger",
    subtitle: "Crispy chicken · Brioche · Slaw",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800",
  },
  {
    name: "Skin On Fries",
    subtitle: "Fresh cut · Seasoned",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800",
  },
  {
    name: "Cheese Fries",
    subtitle: "Skin on fries · Cheese sauce",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800",
  },
  {
    name: "Loaded Fries",
    subtitle: "Fully loaded · The real deal",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800",
  },
  {
    name: "Chicken Popcorn",
    subtitle: "Crispy bites · Perfect snack",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800",
  },
  {
    name: "Chicken Tenders",
    subtitle: "3 for £4.50 · Golden & crispy",
    image: "https://images.unsplash.com/photo-1587814213670-c7c7e2a1ad8b?w=800",
  },
  {
    name: "Soft Drink",
    subtitle: "Ice cold · Various flavours",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800",
  },
];

const pricingMenu = [
  {
    section: "🍔 Smash Burgers",
    items: [
      { name: "Single Smash", price: "£4.00", desc: "Single smashed patty, American cheese, lettuce, gherkins" },
      { name: "Double Smash", price: "£6.00", desc: "Two smashed patties, double cheese, all the good stuff" },
      { name: "Triple Smash", price: "£8.00", desc: "Triple patty, triple cheese — legend only" },
    ],
  },
  {
    section: "🍗 Chicken",
    items: [
      { name: "Chicken Burger", price: "£5.00", desc: "Crispy chicken fillet, brioche, slaw, sauce" },
    ],
  },
  {
    section: "🍟 Sides",
    items: [
      { name: "Skin On Fries", price: "£1.50", desc: "Fresh cut skin-on fries, seasoned" },
      { name: "Cheese Fries", price: "£3.00", desc: "Skin on fries with cheese sauce" },
      { name: "Chicken Popcorn", price: "£3.00", desc: "Crispy chicken bites" },
      { name: "Chilli Cheese Bites", price: "£3.00", desc: "Jalapeño and cheese bites" },
      { name: "Chicken Tenders", price: "£4.50", desc: "3 golden crispy tenders" },
      { name: "Loaded Fries", price: "£5.00", desc: "Fully loaded with toppings" },
    ],
  },
  {
    section: "🧀 Extra Toppings",
    items: [
      { name: "Caramelised Onions", price: "+£1.00", desc: "" },
      { name: "Jalapeños", price: "+£1.00", desc: "" },
      { name: "Chilli Cheese Bites", price: "+£2.00", desc: "" },
    ],
  },
  {
    section: "🥫 Sauces",
    items: [
      { name: "Classic / Ketchup / Mayo", price: "Free", desc: "" },
      { name: "Spicy Algerian", price: "Free", desc: "" },
      { name: "BBQ", price: "Free", desc: "" },
    ],
  },
  {
    section: "🍱 Make It A Meal",
    items: [
      { name: "Add Fries, Dip & Soft Drink", price: "+£2.00", desc: "Add to any burger" },
    ],
  },
  {
    section: "🥛 Dips",
    items: [
      { name: "Sweet Chilli / Hot Chilli / Ketchup", price: "£0.30", desc: "" },
      { name: "Mayo / Spicy Algerian", price: "£0.30", desc: "" },
    ],
  },
  {
    section: "🥤 Beverages",
    items: [
      { name: "Water", price: "£1.20", desc: "" },
      { name: "Soft Drink", price: "£1.50", desc: "Various flavours" },
    ],
  },
];

/* ─────────────────────────────────────────────
   VISUAL MENU COMPONENT
───────────────────────────────────────────── */

function VisualMenu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = itemRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    itemRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative" style={{ height: "calc(100dvh - 64px)" }}>
      {/* Scroll container */}
      <div ref={containerRef} className="menu-scroll-container" style={{ height: "calc(100dvh - 64px)" }}>
        {visualItems.map((item, i) => (
          <div
            key={item.name}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="menu-snap-item relative flex flex-col"
            style={{ height: "calc(100dvh - 64px)" }}
          >
            {/* Photo — 75% */}
            <div className="relative flex-1 overflow-hidden" style={{ flexBasis: "75%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              {/* Top vignette */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0D0D0D]/60 to-transparent" />
              {/* Bottom vignette */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
            </div>

            {/* Info — 25% */}
            <div
              className="bg-[#0D0D0D] flex flex-col justify-center px-6 pb-4"
              style={{ flexBasis: "25%" }}
            >
              <h2
                className="text-[#F5F5F0] leading-tight mb-1"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  fontSize: "clamp(1.8rem, 6vw, 3rem)",
                  letterSpacing: "0.02em",
                }}
              >
                {item.name}
              </h2>
              <p className="text-[#9A9A8A] text-sm md:text-base">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll position dots */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        {visualItems.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to item ${i + 1}`}
            onClick={() => {
              itemRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-2 h-6 bg-[#E8B84B]"
                : "w-1.5 h-1.5 bg-[#9A9A8A]/40 hover:bg-[#9A9A8A]"
            }`}
          />
        ))}
      </div>

      {/* Swipe hint on first load */}
      {activeIndex === 0 && (
        <div className="absolute bottom-[27%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 animate-bounce pointer-events-none">
          <p className="text-[#9A9A8A] text-xs tracking-widest uppercase">Scroll</p>
          <div className="w-px h-6 bg-gradient-to-b from-[#E8B84B]/60 to-transparent" />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRICING MENU COMPONENT
───────────────────────────────────────────── */

function PricingMenu() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
      {pricingMenu.map((section) => (
        <div key={section.section} className="mb-8">
          <h3
            className="text-[#E8B84B] text-lg font-black uppercase tracking-wide mb-3 pb-2 border-b border-[#E8B84B]/20"
            style={{ fontFamily: "var(--font-archivo), sans-serif" }}
          >
            {section.section}
          </h3>
          <div className="space-y-1">
            {section.items.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-4 py-3 border-b border-[#1F1F1F]"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[#F5F5F0] font-semibold text-base">{item.name}</p>
                  {item.desc && (
                    <p className="text-[#9A9A8A] text-sm mt-0.5">{item.desc}</p>
                  )}
                </div>
                <p
                  className="text-[#E8B84B] font-black text-base shrink-0"
                  style={{ fontFamily: "var(--font-archivo), sans-serif" }}
                >
                  {item.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<"visual" | "pricing">("visual");

  return (
    <div className="bg-[#0D0D0D] min-h-[100dvh]">
      <Navbar />

      {/* Tab switcher — sits right below navbar */}
      <div
        className="sticky top-16 z-30 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#E8B84B]/10"
      >
        <div className="flex max-w-2xl mx-auto">
          {(["visual", "pricing"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3.5 text-sm font-black uppercase tracking-widest transition-all duration-200 border-b-2 ${
                activeTab === tab
                  ? "border-[#E8B84B] text-[#E8B84B]"
                  : "border-transparent text-[#9A9A8A] hover:text-[#F5F5F0]"
              }`}
              style={{ fontFamily: "var(--font-archivo), sans-serif", minHeight: "44px" }}
            >
              {tab === "visual" ? "Menu" : "Prices"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "visual" ? <VisualMenu /> : <PricingMenu />}
    </div>
  );
}
