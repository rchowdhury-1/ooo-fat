"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/#about", label: "About" },
    { href: "/#location", label: "Location" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-[#0D0D0D]/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        {/* Gold accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#E8B84B]/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image
                src="/images/logo.webp"
                width={36}
                height={36}
                alt="Ooo..FAT!"
                className="rounded-full ring-1 ring-[#E8B84B]/30"
              />
              <span
                className="text-[#E8B84B] text-xl leading-none"
                style={{ fontFamily: "var(--font-permanent-marker), cursive" }}
              >
                Ooo..FAT!
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition-all duration-200 ${
                    pathname === href
                      ? "text-[#E8B84B]"
                      : "text-[#9A9A8A] hover:text-[#F5F5F0]"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link href="/menu" className="ml-4 btn-primary text-xs px-5 py-2">
                Order Now
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 rounded-lg"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-[#E8B84B] transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#E8B84B] transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#E8B84B] transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-[#0D0D0D]/98 backdrop-blur-xl" />
        <div className="relative flex flex-col items-center justify-center h-full gap-2 px-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="w-full text-center py-4 text-2xl font-black uppercase tracking-widest text-[#F5F5F0] hover:text-[#E8B84B] transition-colors duration-200 border-b border-[#E8B84B]/10"
              style={{ fontFamily: "var(--font-archivo), sans-serif" }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/menu"
            onClick={() => setMenuOpen(false)}
            className="btn-primary w-full text-center text-base mt-6"
          >
            View Menu
          </Link>
        </div>
      </div>
    </>
  );
}
