import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const featuredItems = [
  {
    name: "Single Smash",
    price: "£4.00",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
  },
  {
    name: "Double Smash",
    price: "£6.00",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
  },
  {
    name: "Chicken Burger",
    price: "£5.00",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400",
  },
  {
    name: "Loaded Fries",
    price: "£5.00",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400",
  },
];

export default function HomePage() {
  return (
    <main>
      <Navbar />

      {/* ── Hero (dark) ── */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Full-bleed food photo with slow zoom */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center animate-hero-zoom"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/85" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <Image
            src="/images/logo.jpeg"
            width={200}
            height={200}
            alt="Ooo..FAT!"
            className="rounded-full mb-5 shadow-2xl ring-4 ring-[#e6a317]/30 w-32 h-32 md:w-[180px] md:h-[180px]"
          />

          <p className="text-[#e6a317] text-[10px] md:text-xs font-bold tracking-[0.25em] md:tracking-[0.35em] uppercase mb-3 leading-relaxed">
            Open Daily 6PM – 2AM<br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            Drive-Thru Only · Birmingham
          </p>

          <h1
            className="text-white mb-3 leading-none"
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "clamp(2.8rem, 10vw, 7rem)",
              letterSpacing: "0.04em",
            }}
          >
            Smashed to Order.
          </h1>

          <p className="text-gray-300 text-base md:text-xl mb-7 max-w-xs md:max-w-md font-light">
            Angus beef · Brioche bun · No compromises.
          </p>

          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            <Link href="/menu" className="btn-primary text-lg px-10 py-4">
              View Menu
            </Link>
            <Link
              href="/loyalty"
              className="text-[#e6a317] border-2 border-[#e6a317] px-10 py-4 text-lg font-black uppercase tracking-widest hover:bg-[#e6a317] hover:text-[#1a1a1a] transition-colors"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
            >
              ★ Loyalty
            </Link>
          </div>
        </div>
      </section>

      {/* ── About (cream) ── */}
      <section id="about" className="bg-[#f5f0e8] py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-[#e6a317] text-xs font-bold tracking-[0.3em] uppercase mb-3">
              Our Story
            </p>
            <h2
              className="text-5xl md:text-6xl text-[#1a1a1a] mb-6"
              style={{ fontFamily: "'Archivo Black', sans-serif", letterSpacing: "0.05em" }}
            >
              Born in Birmingham
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              Ooo..FAT! started with one simple obsession — the perfect smash burger. We source
              fresh Angus beef, smash it thin on a screaming-hot griddle, and stack it on a pillowy
              brioche bun with American cheese, crisp lettuce, gherkins, and your sauce of choice.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              No frozen patties. No shortcuts. Just real food, fast, every night from 6PM until 2AM.
              Pull up to the drive-thru window and taste what a smash burger should be.
            </p>
            <div className="flex flex-wrap gap-10">
              {[
                { label: "Fresh Angus Beef", icon: "🥩" },
                { label: "Brioche Bun", icon: "🍔" },
                { label: "Drive-Thru Only", icon: "🚗" },
              ].map(({ label, icon }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{icon}</span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo stack */}
          <div className="hidden md:flex flex-1 grid grid-cols-2 gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400"
              alt="Smash burger"
              className="rounded w-full h-44 object-cover col-span-2"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400"
              alt="Fries"
              className="rounded w-full h-32 object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400"
              alt="Loaded fries"
              className="rounded w-full h-32 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Featured Items (dark) ── */}
      <section className="bg-[#1a1a1a] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#e6a317] text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Our Menu
          </p>
          <h2
            className="text-5xl md:text-6xl text-white mb-2"
            style={{ fontFamily: "'Archivo Black', sans-serif", letterSpacing: "0.03em" }}
          >
            What We Do Best
          </h2>
          <p className="text-gray-400 mb-10 text-xs font-bold tracking-[0.25em] uppercase">
            Premium street food · Birmingham
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredItems.map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-48 overflow-hidden bg-[#1a1a1a] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="p-4 border-t-2 border-[#e6a317]">
                  <p className="text-[#1a1a1a] font-bold text-sm md:text-base leading-snug">
                    {item.name}
                  </p>
                  <p
                    className="text-[#c4362a] text-2xl font-bold mt-1"
                    style={{ fontFamily: "'Archivo Black', sans-serif" }}
                  >
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/menu" className="btn-primary text-lg px-12 py-4">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ── Loyalty Teaser (cream) ── */}
      <section className="bg-[#f5f0e8] py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 max-w-[260px] md:max-w-none mx-auto mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`w-full aspect-square rounded-lg flex items-center justify-center text-lg md:text-base ${
                  i < 5
                    ? "bg-[#e6a317]"
                    : "bg-[#e0dbd3] border border-[#ccc7be]"
                }`}
              >
                {i < 5 ? "🍔" : ""}
              </div>
            ))}
          </div>

          <h2
            className="text-5xl md:text-6xl text-[#1a1a1a] mb-4"
            style={{ fontFamily: "'Archivo Black', sans-serif", letterSpacing: "0.05em" }}
          >
            Every 8th Burger Free
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            Order a burger · Scan your receipt · Collect stamps
          </p>
          <p className="text-gray-500 mb-8 text-sm tracking-wide">
            8 stamps = free Single Patty (£4 value) · No app needed
          </p>
          <Link href="/loyalty" className="btn-primary text-lg px-10 py-4">
            Join Our Loyalty Program
          </Link>
        </div>
      </section>

      {/* ── Location (dark) ── */}
      <section id="location" className="py-20 px-4 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#e6a317] text-xs font-bold tracking-[0.3em] uppercase mb-2 text-center">
            Come Find Us
          </p>
          <h2
            className="text-5xl md:text-6xl text-white text-center mb-2"
            style={{ fontFamily: "'Archivo Black', sans-serif", letterSpacing: "0.05em" }}
          >
            Find Us
          </h2>
          <p className="text-center text-gray-400 mb-8 text-xs font-bold tracking-[0.25em] uppercase">
            Birmingham, UK
          </p>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://maps.google.com/maps?q=878+Kingsbury+Rd,+Birmingham+B24+9PT&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Ooo..FAT! Location"
            />
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-[#e6a317] text-xl">📍</span>
              <span className="font-semibold">878 Kingsbury Rd, Birmingham B24 9PT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#e6a317] text-xl">🕕</span>
              <span className="font-semibold">Open Daily 6PM – 2AM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer (dark) ── */}
      <footer className="bg-[#1a1a1a] text-gray-500 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-800">
            <p
              className="text-[#e6a317] text-3xl"
              style={{ fontFamily: "var(--font-permanent-marker), cursive" }}
            >
              Ooo..FAT!
            </p>
            <div className="flex gap-8">
              <Link href="/menu" className="text-gray-400 hover:text-white transition-colors text-xs font-bold tracking-[0.2em] uppercase">
                Menu
              </Link>
              <Link href="/loyalty" className="text-gray-400 hover:text-white transition-colors text-xs font-bold tracking-[0.2em] uppercase">
                Loyalty
              </Link>
              <a href="/#about" className="text-gray-400 hover:text-white transition-colors text-xs font-bold tracking-[0.2em] uppercase">
                About
              </a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
            <div>
              <p className="mb-1">Smash Burgers · Birmingham · Drive-Thru</p>
              <p>Open Daily 6PM – 2AM</p>
            </div>
            <p className="text-gray-700">&copy; {new Date().getFullYear()} Ooo..FAT! All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
