"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const IMGS = {
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
  chicken: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop",
  fries: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&auto=format&fit=crop",
  drinks: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop",
  loadedFries: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop",
};

interface MenuItem {
  name: string;
  price: string;
  image?: string;
  description?: string;
}

interface ListItem {
  name: string;
  price: string;
}

interface SaucesAddon {
  type: "sauces";
  title: string;
  subtitle: string;
  options: string[];
}

interface ToppingsAddon {
  type: "toppings";
  title: string;
  items: ListItem[];
}

interface MealDealAddon {
  type: "mealDeal";
  title: string;
  subtitle: string;
  description: string;
}

interface ListSection {
  type: "list";
  title: string;
  subtitle?: string;
  items: ListItem[];
}

type Addon = SaucesAddon | ToppingsAddon | MealDealAddon | ListSection;

interface MenuSection {
  id: string;
  title: string;
  description?: string;
  items: MenuItem[];
  addons?: Addon[];
}

const menuSections: MenuSection[] = [
  {
    id: "smash-burgers",
    title: "Smash Burgers",
    description:
      "Smashed Angus beef topped with American cheese, lettuce, gherkins & sauce of your choice in a Brioche Bun",
    items: [
      { name: "Single Patty", price: "£4.00", image: IMGS.burger },
      { name: "Double Patty", price: "£6.00", image: IMGS.burger },
      { name: "Triple Patty", price: "£8.00", image: IMGS.burger },
    ],
    addons: [
      {
        type: "sauces",
        title: "Choose Your Sauce",
        subtitle: "Free with every burger",
        options: ["Classic", "Ketchup", "Mayonnaise", "Spicy Algerian", "BBQ"],
      },
      {
        type: "toppings",
        title: "Extra Toppings",
        items: [
          { name: "Caramelised Onions", price: "+£1.00" },
          { name: "Jalapeños", price: "+£1.00" },
          { name: "Chilli Cheese Bites", price: "+£2.00" },
        ],
      },
    ],
  },
  {
    id: "chicken-burger",
    title: "Chicken Burger",
    description: "Crispy chicken tenders topped with lettuce and mayonnaise in a brioche bun",
    items: [{ name: "Chicken Burger", price: "£5.00", image: IMGS.chicken }],
    addons: [
      {
        type: "mealDeal",
        title: "Make It A Meal",
        subtitle: "+£2.00",
        description: "Add skin on fries, dip of your choice & soft drink to any burger",
      },
    ],
  },
  {
    id: "sides",
    title: "Sides",
    items: [
      { name: "Skin On Fries", price: "£1.50", image: IMGS.fries },
      { name: "Cheese Fries", price: "£3.00", image: IMGS.fries },
      { name: "Chicken Popcorn", price: "£3.00", image: IMGS.chicken },
      { name: "Chilli Cheese Bites", price: "£3.00", image: IMGS.loadedFries },
      { name: "Chicken Tenders (3)", price: "£4.50", image: IMGS.chicken },
      { name: "Loaded Fries", price: "£5.00", image: IMGS.loadedFries },
    ],
  },
  {
    id: "dips",
    title: "Dips",
    items: [],
    addons: [
      {
        type: "list",
        title: "Dips",
        subtitle: "£0.30 each",
        items: [
          { name: "Sweet Chilli", price: "£0.30" },
          { name: "Hot Chilli", price: "£0.30" },
          { name: "Ketchup", price: "£0.30" },
          { name: "Mayonnaise", price: "£0.30" },
          { name: "Spicy Algerian", price: "£0.30" },
        ],
      },
    ],
  },
  {
    id: "beverages",
    title: "Drinks",
    items: [
      { name: "Water Bottle", price: "£1.20", image: IMGS.drinks },
      { name: "Soft Drink", price: "£1.50", image: IMGS.drinks },
    ],
  },
];

const navTabs = [
  { id: "smash-burgers", label: "Burgers" },
  { id: "chicken-burger", label: "Chicken" },
  { id: "sides", label: "Sides" },
  { id: "dips", label: "Dips" },
  { id: "beverages", label: "Drinks" },
];

export default function MenuPage() {
  const [activeSection, setActiveSection] = useState("smash-burgers");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const offset = 130; // navbar (64) + tab bar (~66)
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#F5F5F0] min-h-screen">
      <Navbar />

      {/* Sticky category tabs — sits below the Navbar (top-16) */}
      <div className="sticky top-16 z-40 bg-[#111111] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-none py-2">
          {navTabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`px-5 py-2 text-xs font-bold tracking-[0.15em] uppercase whitespace-nowrap rounded-sm transition-all ${
                activeSection === id
                  ? "bg-[#FFD700] text-[#111111]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {menuSections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            ref={(el) => { sectionRefs.current[section.id] = el; }}
          >
            {/* Section heading */}
            <h2
              className="text-4xl md:text-5xl text-[#111111] mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              {section.title}
            </h2>
            {section.description && (
              <p className="text-sm text-[#666666] mb-7 max-w-xl leading-relaxed">
                {section.description}
              </p>
            )}

            {/* Photo cards grid */}
            {section.items.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {section.items.map((item) => (
                  <div key={item.name} className="bg-[#111111] rounded overflow-hidden group">
                    {item.image && (
                      <div className="h-40 sm:h-48 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-white font-bold text-sm md:text-base leading-snug">
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-gray-500 text-xs mt-1 leading-snug">{item.description}</p>
                      )}
                      <p
                        className="text-[#FFD700] font-bold mt-2"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
                      >
                        {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Addon sections (sauces, toppings, meal deal, lists) */}
            {section.addons && section.addons.length > 0 && (
              <div className="space-y-4">
                {section.addons.map((addon, i) => {
                  if (addon.type === "sauces") {
                    return (
                      <div key={i} className="bg-white rounded p-5 border border-gray-200">
                        <div className="flex items-baseline gap-3 mb-3">
                          <h3
                            className="text-xl text-[#111111]"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                          >
                            {addon.title}
                          </h3>
                          <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                            {addon.subtitle}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {addon.options.map((opt) => (
                            <span
                              key={opt}
                              className="px-3 py-1.5 bg-[#F5F5F0] text-[#333333] text-sm font-semibold rounded-sm border border-gray-200"
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (addon.type === "toppings") {
                    return (
                      <div key={i} className="bg-white rounded p-5 border border-gray-200">
                        <h3
                          className="text-xl text-[#111111] mb-3"
                          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                        >
                          {addon.title}
                        </h3>
                        <div className="divide-y divide-gray-100">
                          {addon.items.map((item) => (
                            <div key={item.name} className="flex justify-between items-center py-2.5">
                              <span className="text-sm font-medium text-[#222222]">{item.name}</span>
                              <span
                                className="text-sm font-bold text-[#111111] ml-4"
                                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}
                              >
                                {item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (addon.type === "mealDeal") {
                    return (
                      <div key={i} className="border-2 border-[#FFD700] bg-[#111111] rounded p-5 flex items-center gap-4">
                        <span
                          className="text-[#FFD700] text-3xl shrink-0"
                          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                          {addon.subtitle}
                        </span>
                        <div>
                          <p
                            className="text-white font-bold text-base"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em", fontSize: "1.1rem" }}
                          >
                            {addon.title}
                          </p>
                          <p className="text-gray-400 text-sm">{addon.description}</p>
                        </div>
                      </div>
                    );
                  }

                  if (addon.type === "list") {
                    return (
                      <div key={i} className="bg-white rounded p-5 border border-gray-200">
                        <div className="flex items-baseline gap-3 mb-3">
                          <h3
                            className="text-xl text-[#111111]"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                          >
                            {addon.title}
                          </h3>
                          {addon.subtitle && (
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              {addon.subtitle}
                            </span>
                          )}
                        </div>
                        <div className="divide-y divide-gray-100">
                          {addon.items.map((item) => (
                            <div key={item.name} className="flex justify-between items-center py-2.5">
                              <span className="text-sm font-medium text-[#222222]">{item.name}</span>
                              <span
                                className="text-sm font-bold text-[#111111] ml-4"
                                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}
                              >
                                {item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="bg-[#111111] py-14 px-4 text-center">
        <p
          className="text-[#FFD700] text-4xl md:text-5xl mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          Earn Points on Every Order
        </p>
        <p className="text-gray-400 mb-6 text-sm tracking-widest uppercase">
          Every £1 spent = 1 point · 50 points = £5 reward
        </p>
        <Link href="/loyalty" className="btn-primary px-10 py-4 text-lg">
          Join Loyalty Program
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-gray-600 text-center py-6 px-4 text-sm">
        <p className="mb-1">Ooo..FAT! · Birmingham · Drive-Thru</p>
        <p>Open Daily 6PM – 2AM</p>
      </footer>
    </div>
  );
}
