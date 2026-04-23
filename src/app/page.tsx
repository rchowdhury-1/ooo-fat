import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const featuredItems = [
  {
    name: "Single Smash",
    price: "£5",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  },
  {
    name: "Double Smash",
    price: "£7",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600",
  },
  {
    name: "Chicken Burger",
    price: "£5",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600",
  },
  {
    name: "Beef Loaded Fries",
    price: "£5",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600",
  },
];

export default function HomePage() {
  return (
    <main className="bg-[#0D0D0D]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden noise-overlay">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center animate-hero-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/80 via-[#0D0D0D]/30 to-[#0D0D0D]/90" />

        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-16">
          <Image
            src="/images/logo.jpeg"
            width={200}
            height={200}
            alt="Ooo..FAT!"
            className="rounded-full mb-6 shadow-2xl ring-2 ring-[#E8B84B]/30 w-24 h-24 md:w-40 md:h-40"
          />

          <p className="text-[#E8B84B] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Open 7 Days a Week 6PM – 2AM&nbsp;&nbsp;·&nbsp;&nbsp;Drive-Thru Only&nbsp;&nbsp;·&nbsp;&nbsp;Birmingham
          </p>

          <h1
            className="text-[#F5F5F0] mb-4 leading-none"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontSize: "clamp(2.6rem, 11vw, 7rem)",
              letterSpacing: "0.03em",
            }}
          >
            Smashed to Order.
          </h1>

          <p className="text-[#9A9A8A] text-base md:text-xl mb-8 max-w-xs md:max-w-md font-light">
            Angus beef&nbsp;·&nbsp;Brioche bun&nbsp;·&nbsp;No compromises.
          </p>

          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            <Link href="/menu" className="btn-primary text-base px-8 py-4">
              View Menu
            </Link>
            <Link href="/#about" className="btn-outline text-base px-8 py-4">
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-[#E8B84B]/60 to-transparent" />
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="bg-[#0D0D0D] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#E8B84B] text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Our Story
          </p>
          <h2
            className="text-[#F5F5F0] mb-6 leading-tight"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontSize: "clamp(2rem, 6vw, 4rem)",
              letterSpacing: "0.03em",
            }}
          >
            Born in Birmingham
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-[#9A9A8A] text-base md:text-lg leading-relaxed mb-4">
                Ooo..FAT! started with one simple obsession — the perfect smash burger. We source
                fresh Angus beef, smash it thin on a screaming-hot griddle, and stack it on a
                pillowy brioche bun with American cheese, crisp lettuce, gherkins, and your sauce
                of choice.
              </p>
              <p className="text-[#9A9A8A] text-base md:text-lg leading-relaxed mb-8">
                No frozen patties. No shortcuts. Just real food, fast, every night from 6PM until
                2AM. Pull up to the drive-thru window and taste what a smash burger should be.
              </p>
              <div className="flex flex-row flex-nowrap justify-start items-center gap-6">
                {[
                  { label: "Angus Beef", icon: "🥩" },
                  { label: "Brioche Bun", icon: "🍔" },
                  { label: "Drive-Thru", icon: "🚗" },
                ].map(({ label, icon }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 shrink-0">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9A9A8A] whitespace-nowrap">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400"
                alt="Smash burger"
                className="rounded-2xl w-full h-40 md:h-48 object-cover col-span-2"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400"
                alt="Fries"
                className="rounded-2xl w-full h-32 object-cover"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400"
                alt="Loaded fries"
                className="rounded-2xl w-full h-32 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Items ── */}
      <section className="bg-[#1A1A1A] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#E8B84B] text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Our Menu
          </p>
          <h2
            className="text-[#F5F5F0] mb-10"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontSize: "clamp(2rem, 6vw, 4rem)",
              letterSpacing: "0.03em",
            }}
          >
            What We Do Best
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {featuredItems.map((item) => (
              <div
                key={item.name}
                className="bg-[#1F1F1F] rounded-2xl overflow-hidden group border border-[#E8B84B]/10 hover:border-[#E8B84B]/30 transition-all duration-300"
              >
                <div className="h-40 md:h-52 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <p className="text-[#F5F5F0] font-bold text-sm md:text-base">{item.name}</p>
                  <p
                    className="text-[#E8B84B] text-xl font-black mt-0.5"
                    style={{ fontFamily: "var(--font-archivo), sans-serif" }}
                  >
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/menu" className="btn-primary text-base px-10 py-4">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section id="location" className="py-20 px-4 bg-[#0D0D0D]">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-[#F5F5F0] text-center mb-10"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontSize: "clamp(2rem, 6vw, 4rem)",
              letterSpacing: "0.03em",
            }}
          >
            Find Us
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-[#E8B84B]/10">
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
          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-[#9A9A8A]">
            <div className="flex items-start gap-2">
              <span className="text-[#E8B84B] text-lg shrink-0 mt-0.5">📍</span>
              <span className="font-semibold text-sm text-center">878 Kingsbury Rd, Birmingham B24 9PT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#E8B84B] text-lg shrink-0">🕕</span>
              <span className="font-semibold text-sm">Open 7 Days a Week · 6PM – 2AM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0D0D0D] border-t border-[#E8B84B]/10 text-[#9A9A8A] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-[#E8B84B]/10">
            <p
              className="text-[#E8B84B] text-3xl"
              style={{ fontFamily: "var(--font-permanent-marker), cursive" }}
            >
              Ooo..FAT!
            </p>
            <div className="flex gap-6">
              <Link href="/menu" className="text-[#9A9A8A] hover:text-[#E8B84B] transition-colors text-xs font-bold tracking-[0.2em] uppercase">Menu</Link>
              <a href="/#about" className="text-[#9A9A8A] hover:text-[#E8B84B] transition-colors text-xs font-bold tracking-[0.2em] uppercase">About</a>
              <a href="/#location" className="text-[#9A9A8A] hover:text-[#E8B84B] transition-colors text-xs font-bold tracking-[0.2em] uppercase">Location</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
            <div>
              <p className="mb-1">Smash Burgers · Birmingham · Drive-Thru</p>
              <p>Open 7 Days a Week · 6PM – 2AM</p>
            </div>
            <p className="text-[#1F1F1F] text-xs">&copy; {new Date().getFullYear()} Ooo..FAT!</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
