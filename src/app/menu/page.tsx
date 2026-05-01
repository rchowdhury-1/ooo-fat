"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";

/* ── Types ── */
interface ApiItem {
  id: string;
  name: string;
  price: number;
  price_label: string;
  description: string;
  subtitle: string;
  image_url: string;
  position: number;
}

interface ApiCategory {
  id: string;
  name: string;
  emoji: string;
  note: string;
  position: number;
  items: ApiItem[];
}

/* ── Price display helper ── */
function fmtPrice(item: ApiItem) {
  if (item.price_label) return item.price_label;
  return `£${Number(item.price).toFixed(2)}`;
}

/* ─────────────────────────────────────────────
   VISUAL MENU COMPONENT
───────────────────────────────────────────── */

function VisualMenu({ categories }: { categories: ApiCategory[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Flatten items that have an image, carrying category name for display override
  const visualItems = categories.flatMap((c) =>
    c.items.filter((i) => i.image_url).map((i) => ({ ...i, _catName: c.name }))
  );

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
  }, [visualItems.length]);

  if (visualItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[#9A9A8A] text-sm">
        No items with photos yet.
      </div>
    );
  }

  return (
    <div className="relative" style={{ height: "calc(100dvh - 112px)" }}>
      <div ref={containerRef} className="menu-scroll-container" style={{ height: "calc(100dvh - 112px)" }}>
        {visualItems.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="menu-snap-item relative flex flex-col"
            style={{ height: "calc(100dvh - 112px)" }}
          >
            {/* Photo — 75% */}
            <div className="relative overflow-hidden" style={{ flex: "0 0 75%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0D0D0D]/70 to-transparent" />
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
                {item._catName === "Sides" ? "Sides" : item.name}
              </h2>
              {item.subtitle && (
                <p className="text-[#9A9A8A] text-sm leading-snug">{item.subtitle}</p>
              )}
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
            onClick={() => itemRefs.current[i]?.scrollIntoView({ behavior: "smooth" })}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-2 h-5 bg-[#E8B84B]"
                : "w-1.5 h-1.5 bg-[#9A9A8A]/40 hover:bg-[#9A9A8A]"
            }`}
          />
        ))}
      </div>

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

function PricingMenu({ categories }: { categories: ApiCategory[] }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-20">
      {categories.map((cat) => (
        <div key={cat.id} className="mb-8">
          <h3
            className="text-[#E8B84B] text-base font-black uppercase tracking-wide mb-1 pb-2 border-b border-[#E8B84B]/20"
            style={{ fontFamily: "var(--font-archivo), sans-serif" }}
          >
            {cat.emoji} {cat.name}
          </h3>
          {cat.note && (
            <p className="text-[#9A9A8A] text-xs mb-3 italic leading-snug">{cat.note}</p>
          )}
          <div className="space-y-0">
            {cat.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 py-3 border-b border-[#1F1F1F]"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[#F5F5F0] font-semibold text-base leading-snug">
                    {item.name}
                  </p>
                  {item.description && (
                    <p className="text-[#9A9A8A] text-sm mt-0.5">{item.description}</p>
                  )}
                </div>
                <p
                  className="text-[#E8B84B] font-black text-base shrink-0"
                  style={{ fontFamily: "var(--font-archivo), sans-serif" }}
                >
                  {fmtPrice(item)}
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
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0D0D0D] min-h-[100dvh] pt-16">
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
      <div
        className="no-scrollbar"
        style={{ height: "calc(100dvh - 112px)", overflowY: "auto" }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#9A9A8A] text-sm tracking-widest uppercase">Loading…</p>
          </div>
        ) : activeTab === "visual" ? (
          <VisualMenu categories={categories} />
        ) : (
          <PricingMenu categories={categories} />
        )}
      </div>
    </div>
  );
}
