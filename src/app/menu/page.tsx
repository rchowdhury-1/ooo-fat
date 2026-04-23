"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";

/* ─────────────────────────────────────────────
   VISUAL MENU DATA
───────────────────────────────────────────── */

const visualItems = [
  {
    name: "Single Smash",
    subtitle: "Angus beef · American cheese · Brioche",
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
    subtitle: "Crispy chicken · Lettuce · Mayo · Brioche",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800",
  },
  {
    name: "Mix Burger",
    subtitle: "Beef & chicken · American cheese · Brioche",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
  },
  {
    name: "Cheese Fries",
    subtitle: "Skin on fries · Cheese sauce",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800",
  },
  {
    name: "Beef Loaded Fries",
    subtitle: "Cheese sauce · Hannibal sauce · Jalapeños",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800",
  },
  {
    name: "Chicken Loaded Fries",
    subtitle: "Chicken · Cheese sauce · Jalapeños",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800",
  },
  {
    name: "Chicken Popcorn",
    subtitle: "Crispy bites · Perfect snack",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800",
  },
  {
    name: "Chicken Tenders",
    subtitle: "3 golden crispy tenders",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800",
  },
  {
    name: "Soft Drink",
    subtitle: "Pepsi · Rio · Tango · Mango · Guava · Irn Bru",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800",
  },
];

/* ─────────────────────────────────────────────
   PRICING MENU DATA
───────────────────────────────────────────── */

const pricingMenu = [
  {
    section: "🍔 Smash Burger",
    note: "Smashed Angus beef with American cheese, lettuce, mayonnaise, gherkins and sauce of choice in a brioche bun",
    items: [
      { name: "Single Patty", price: "£5.00", desc: "" },
      { name: "Double Patty", price: "£7.00", desc: "" },
      { name: "Triple Patty", price: "£9.00", desc: "" },
    ],
  },
  {
    section: "🍗 Chicken Burger",
    note: "Chicken with lettuce and mayonnaise in a brioche bun",
    items: [
      { name: "Single", price: "£5.00", desc: "" },
      { name: "Double", price: "£7.00", desc: "" },
    ],
  },
  {
    section: "🔀 Mix Burger",
    note: "American cheese, lettuce, mayonnaise, gherkins and sauce of choice",
    items: [
      { name: "Single Patty", price: "£7.00", desc: "" },
      { name: "Double Patty", price: "£9.00", desc: "" },
      { name: "Triple Patty", price: "£11.00", desc: "" },
    ],
  },
  {
    section: "🧀 Extra Toppings",
    note: "",
    items: [
      { name: "Onions", price: "+£1.00", desc: "" },
      { name: "Extra Chicken", price: "+£2.00", desc: "" },
      { name: "Extra Beef", price: "+£2.00", desc: "" },
      { name: "Cheese Bites", price: "+£2.00", desc: "" },
      { name: "Jalapeños", price: "Free", desc: "" },
    ],
  },
  {
    section: "🍱 Make It A Meal",
    note: "",
    items: [
      { name: "Skin On Fries & Drink", price: "+£2.50", desc: "" },
      { name: "Cheese Fries & Drink", price: "+£3.50", desc: "" },
      { name: "Beef Loaded Fries & Drink", price: "+£5.00", desc: "" },
      { name: "Chicken Loaded Fries & Drink", price: "+£5.00", desc: "" },
      { name: "Mix Loaded Fries & Drink", price: "+£7.00", desc: "" },
      { name: "Strip Loaded Fries & Drink", price: "+£8.50", desc: "" },
      { name: "Mix Loaded Fries with Strips & Drink", price: "+£10.50", desc: "" },
    ],
  },
  {
    section: "🍟 Sides",
    note: "",
    items: [
      { name: "Chicken Popcorn", price: "£3.50", desc: "" },
      { name: "Cheese Bites (5pcs)", price: "£3.50", desc: "" },
      { name: "Chicken Tenders (3pcs)", price: "£5.00", desc: "" },
    ],
  },
  {
    section: "🍟 Fries",
    note: "All loaded fries come with cheese sauce, Hannibal sauce and jalapeños",
    items: [
      { name: "Cheese Fries", price: "£3.50", desc: "" },
      { name: "Chicken Loaded Fries", price: "£5.00", desc: "" },
      { name: "Beef Loaded Fries", price: "£5.00", desc: "" },
      { name: "Mix Loaded Fries", price: "£7.00", desc: "" },
      { name: "Strip Loaded Fries", price: "£8.50", desc: "" },
      { name: "Mix Loaded Strip Fries", price: "£10.50", desc: "" },
    ],
  },
  {
    section: "🥫 Dips",
    note: "",
    items: [
      { name: "Algerian · BBQ · Ketchup · Mayo · Hot Chilli · Sweet Chilli", price: "£0.50 each", desc: "" },
    ],
  },
  {
    section: "🥤 Drinks",
    note: "",
    items: [
      { name: "Water", price: "£1.20", desc: "" },
      { name: "Rio", price: "£1.50", desc: "" },
      { name: "Tango Orange", price: "£1.50", desc: "" },
      { name: "Mango", price: "£1.50", desc: "" },
      { name: "Guava", price: "£1.50", desc: "" },
      { name: "Irn Bru", price: "£1.50", desc: "" },
      { name: "Pepsi", price: "£1.50", desc: "" },
      { name: "Pepsi Max", price: "£1.50", desc: "" },
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
    <div className="relative" style={{ height: "calc(100dvh - 112px)" }}>
      {/* Scroll container */}
      <div ref={containerRef} className="menu-scroll-container" style={{ height: "calc(100dvh - 112px)" }}>
        {visualItems.map((item, i) => (
          <div
            key={item.name}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="menu-snap-item relative flex flex-col"
            style={{ height: "calc(100dvh - 112px)" }}
          >
            {/* Photo — 75% */}
            <div className="relative overflow-hidden" style={{ flex: "0 0 75%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              {/* Top vignette */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0D0D0D]/70 to-transparent" />
              {/* Bottom vignette */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
            </div>

            {/* Info — 25% */}
            <div
              className="bg-[#0D0D0D] flex flex-col justify-center px-6 pb-2"
              style={{ flex: "0 0 25%" }}
            >
              <h2
                className="text-[#F5F5F0] leading-tight mb-1"
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
                  letterSpacing: "0.02em",
                }}
              >
                {item.name}
              </h2>
              <p className="text-[#9A9A8A] text-sm leading-snug">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll position dots */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
        {visualItems.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to item ${i + 1}`}
            onClick={() => {
              itemRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-2 h-5 bg-[#E8B84B]"
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
    <div className="max-w-2xl mx-auto px-4 py-8 pb-20">
      {pricingMenu.map((section) => (
        <div key={section.section} className="mb-8">
          <h3
            className="text-[#E8B84B] text-base font-black uppercase tracking-wide mb-1 pb-2 border-b border-[#E8B84B]/20"
            style={{ fontFamily: "var(--font-archivo), sans-serif" }}
          >
            {section.section}
          </h3>
          {section.note && (
            <p className="text-[#9A9A8A] text-xs mb-3 italic leading-snug">{section.note}</p>
          )}
          <div className="space-y-0">
            {section.items.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-4 py-3 border-b border-[#1F1F1F]"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[#F5F5F0] font-semibold text-base leading-snug">{item.name}</p>
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

      {/* Tab switcher */}
      <div className="sticky top-16 z-30 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#E8B84B]/10">
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
