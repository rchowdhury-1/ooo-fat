"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const menuSections = [
  {
    id: "smash-burgers",
    title: "SMASH BURGERS",
    dark: true,
    description: "Smashed Angus beef topped with American cheese, lettuce, gherkins & sauce of your choice in a Brioche Bun",
    items: [
      { name: "Single Patty", price: "£4.00" },
      { name: "Double Patty", price: "£6.00" },
      { name: "Triple Patty", price: "£8.00" },
    ],
  },
  {
    id: "sauces",
    title: "CHOOSE YOUR SAUCE",
    subtitle: "(Free with every burger)",
    dark: false,
    items: [
      { name: "Classic", price: "Free" },
      { name: "Ketchup", price: "Free" },
      { name: "Mayonnaise", price: "Free" },
      { name: "Spicy Algerian", price: "Free" },
      { name: "BBQ", price: "Free" },
    ],
  },
  {
    id: "toppings",
    title: "EXTRA TOPPINGS",
    dark: true,
    items: [
      { name: "Caramelised Onions", price: "+£1.00" },
      { name: "Jalapeños", price: "+£1.00" },
      { name: "Chilli Cheese Bites", price: "+£2.00" },
    ],
  },
  {
    id: "chicken-burger",
    title: "CHICKEN BURGER",
    dark: false,
    description: "Crispy chicken tenders topped with lettuce and mayonnaise in a brioche bun",
    items: [{ name: "Chicken Burger", price: "£5.00" }],
  },
  {
    id: "sides",
    title: "SIDES",
    dark: true,
    items: [
      { name: "Skin On Fries", price: "£1.50" },
      { name: "Cheese Fries", price: "£3.00" },
      { name: "Chicken Popcorn", price: "£3.00" },
      { name: "Chilli Cheese Bites", price: "£3.00" },
      { name: "Chicken Tenders (3)", price: "£4.50" },
      { name: "Loaded Fries (Beef or Chicken)", price: "£5.00" },
    ],
  },
  {
    id: "meal-deal",
    title: "MAKE IT A MEAL",
    subtitle: "+£2.00",
    dark: false,
    description: "Add skin on fries, dip of your choice & soft drink to any burger",
    items: [],
  },
  {
    id: "dips",
    title: "DIPS",
    subtitle: "£0.30 each",
    dark: true,
    items: [
      { name: "Sweet Chilli", price: "£0.30" },
      { name: "Hot Chilli", price: "£0.30" },
      { name: "Ketchup", price: "£0.30" },
      { name: "Mayonnaise", price: "£0.30" },
      { name: "Spicy Algerian", price: "£0.30" },
    ],
  },
  {
    id: "beverages",
    title: "BEVERAGES",
    dark: false,
    items: [
      { name: "Water Bottle", price: "£1.20" },
      { name: "Soft Drink", price: "£1.50" },
    ],
  },
];

export default function MenuPage() {
  const [activeSection, setActiveSection] = useState("smash-burgers");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: "smash-burgers", label: "Burgers" },
    { id: "chicken-burger", label: "Chicken" },
    { id: "sides", label: "Sides" },
    { id: "dips", label: "Extras" },
    { id: "beverages", label: "Drinks" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#111111] shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link
              href="/"
              className="text-2xl text-[#FFD700]"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
            >
              Ooo..FAT!
            </Link>
            <span className="text-gray-400 text-xs tracking-widest uppercase hidden sm:block">
              Open Daily 6PM – 2AM
            </span>
          </div>

          {/* Category Nav */}
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-widest whitespace-nowrap rounded transition-all ${
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
      </header>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div
          key={section.id}
          id={section.id}
          ref={(el) => { sectionRefs.current[section.id] = el; }}
          className={section.dark ? "bg-[#111111] text-white" : "bg-white text-[#333333]"}
        >
          <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Section Header */}
            <div className="flex items-baseline gap-4 mb-2">
              <h2
                className={`text-4xl ${section.dark ? "text-[#FFD700]" : "text-[#111111]"}`}
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
              >
                {section.title}
              </h2>
              {section.subtitle && (
                <span className={`text-sm font-semibold ${section.dark ? "text-gray-400" : "text-gray-500"}`}>
                  {section.subtitle}
                </span>
              )}
            </div>

            {section.description && (
              <p className={`text-sm mb-6 max-w-xl leading-relaxed ${section.dark ? "text-gray-400" : "text-gray-500"}`}>
                {section.description}
              </p>
            )}

            {/* Items */}
            {section.items.length > 0 && (
              <div className="space-y-0 divide-y divide-opacity-10">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className={`flex items-center justify-between py-4 ${
                      section.dark ? "divide-gray-800" : "divide-gray-100"
                    }`}
                  >
                    <span
                      className={`text-lg font-medium ${section.dark ? "text-white" : "text-[#111111]"}`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`text-lg font-bold ml-4 ${
                        item.price === "Free" ? "text-green-400" : section.dark ? "text-[#FFD700]" : "text-[#111111]"
                      }`}
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.04em" }}
                    >
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Meal deal special callout */}
            {section.id === "meal-deal" && (
              <div className="border-2 border-[#FFD700] rounded-lg p-4 bg-[#FFFBEB] mt-4">
                <p className="text-[#111111] font-semibold text-base">
                  Add skin on fries + dip of your choice + soft drink to any burger for just{" "}
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem" }}>+£2.00</span>
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className={`h-0.5 ${section.dark ? "bg-[#FFD700] opacity-20" : "bg-gray-100"}`} />
        </div>
      ))}

      {/* Bottom CTA */}
      <section className="bg-[#111111] py-12 px-4 text-center">
        <p
          className="text-[#FFD700] text-4xl mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          Earn Points on Every Order
        </p>
        <p className="text-gray-400 mb-6 text-sm">Every £1 spent = 1 point · 50 points = £5 reward</p>
        <Link href="/loyalty" className="btn-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
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
