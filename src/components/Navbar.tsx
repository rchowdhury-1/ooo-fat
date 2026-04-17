"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.jpeg"
              width={60}
              height={60}
              alt="Ooo..FAT!"
              className="rounded-full"
            />
          </Link>

          {/* Desktop centre nav */}
          <nav className="hidden md:flex items-center gap-10 flex-1 justify-center">
            <Link href="/menu" className="text-gray-400 hover:text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors">
              Menu
            </Link>
            <a href="/#about" className="text-gray-400 hover:text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors">
              About
            </a>
            <a href="/#location" className="text-gray-400 hover:text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors">
              Find Us
            </a>
          </nav>

          {/* Desktop Loyalty CTA */}
          <Link
            href="/loyalty"
            className="hidden md:inline-flex items-center gap-1.5 ml-auto bg-[#FFD700] text-[#111111] px-5 py-2.5 font-black uppercase hover:bg-[#F5C800] transition-colors"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.1em" }}
          >
            ★ Loyalty
          </Link>

          {/* Mobile: star + hamburger */}
          <div className="md:hidden ml-auto flex items-center gap-3">
            <Link href="/loyalty" className="text-[#FFD700] text-xl font-black leading-none">★</Link>
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-400 hover:text-white p-1 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden bg-[#0d0d0d] border-t border-gray-800 px-4 py-2">
          {[
            { href: "/menu", label: "Menu" },
            { href: "/#about", label: "About" },
            { href: "/#location", label: "Find Us" },
            { href: "/loyalty", label: "★ Loyalty" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-3 text-gray-300 hover:text-white text-sm font-bold tracking-[0.15em] uppercase border-b border-gray-800 last:border-0 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
