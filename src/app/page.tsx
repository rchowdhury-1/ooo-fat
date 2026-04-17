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

      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Full-bleed food photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        {/* Dark overlay — light in centre so food photo shows, dark at edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/85" />

        {/* Content — centred over photo */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          {/* Logo */}
          <Image
            src="/images/logo.jpeg"
            width={200}
            height={200}
            alt="Ooo..FAT!"
            className="rounded-full mb-6 shadow-2xl ring-4 ring-[#FFD700]/30"
          />

          {/* Label */}
          <p className="text-[#FFD700] text-xs font-bold tracking-[0.35em] uppercase mb-4">
            Open Daily 6PM – 2AM · Drive-Thru Only · Birmingham
          </p>

          {/* Headline */}
          <h1
            className="text-white mb-3 leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.5rem, 10vw, 7rem)",
              letterSpacing: "0.04em",
            }}
          >
            Smashed to Order.
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-md font-light">
            Angus beef · Brioche bun · No compromises.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/menu" className="btn-primary text-lg px-10 py-4">
              View Menu
            </Link>
            <Link
              href="/loyalty"
              className="text-[#FFD700] border-2 border-[#FFD700] px-10 py-4 text-lg font-black uppercase tracking-widest hover:bg-[#FFD700] hover:text-[#111111] transition-colors"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              ★ Loyalty
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="bg-[#111111] py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-[#FFD700] text-xs font-bold tracking-[0.3em] uppercase mb-3">
              Our Story
            </p>
            <h2
              className="text-5xl md:text-6xl text-white mb-6"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              Born in Birmingham
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-5">
              Ooo..FAT! started with one simple obsession — the perfect smash burger. We source
              fresh Angus beef, smash it thin on a screaming-hot griddle, and stack it on a pillowy
              brioche bun with American cheese, crisp lettuce, gherkins, and your sauce of choice.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
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
          <div className="flex-1 grid grid-cols-2 gap-3 max-w-sm md:max-w-none">
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

      {/* ── Featured Items ── */}
      <section className="bg-[#F5F5F0] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#FFD700] text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Our Menu
          </p>
          <h2
            className="text-5xl md:text-6xl text-[#111111] mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.03em" }}
          >
            What We Do Best
          </h2>
          <p className="text-gray-500 mb-10 text-xs font-bold tracking-[0.25em] uppercase">
            Premium street food · Birmingham
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredItems.map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-48 overflow-hidden bg-[#111111]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 border-t-2 border-[#FFD700]">
                  <p className="text-[#111111] font-bold text-sm md:text-base leading-snug">
                    {item.name}
                  </p>
                  <p
                    className="text-[#FFD700] font-bold mt-1"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
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

      {/* ── Loyalty Teaser ── */}
      <section className="bg-[#111111] py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Stamp card preview */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${
                  i < 5
                    ? "bg-[#FFD700]"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                {i < 5 ? "🍔" : ""}
              </div>
            ))}
          </div>

          <h2
            className="text-5xl md:text-6xl text-white mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            Every 8th Burger Free
          </h2>
          <p className="text-gray-400 text-lg mb-2">
            Order a burger · Scan your receipt · Collect stamps
          </p>
          <p className="text-gray-600 mb-8 text-sm tracking-wide">
            8 stamps = free Single Patty (£4 value) · No app needed
          </p>
          <Link href="/loyalty" className="btn-primary text-lg px-10 py-4">
            Join Our Loyalty Program
          </Link>
        </div>
      </section>

      {/* ── Location ── */}
      <section id="location" className="py-20 px-4 bg-[#F5F5F0]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#FFD700] text-xs font-bold tracking-[0.3em] uppercase mb-2 text-center">
            Come Find Us
          </p>
          <h2
            className="text-5xl md:text-6xl text-[#111111] text-center mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
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
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-8 text-[#333333]">
            <div className="flex items-center gap-2">
              <span className="text-[#FFD700] text-xl">📍</span>
              <span className="font-semibold">878 Kingsbury Rd, Birmingham B24 9PT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#FFD700] text-xl">🕕</span>
              <span className="font-semibold">Open Daily 6PM – 2AM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#111111] text-gray-500 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-800">
            <p
              className="text-[#FFD700] text-3xl"
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
