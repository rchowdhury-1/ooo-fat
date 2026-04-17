import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const featuredItems = [
  {
    name: "Single Smash",
    price: "£4.00",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
  },
  {
    name: "Double Smash",
    price: "£6.00",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
  },
  {
    name: "Chicken Burger",
    price: "£5.00",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop",
  },
  {
    name: "Loaded Fries",
    price: "£5.00",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop",
  },
];

export default function HomePage() {
  return (
    <main>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center">
        {/* Background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col items-center text-center">
          <Image
            src="/images/logo.jpeg"
            width={200}
            height={200}
            alt="Ooo..FAT!"
            className="rounded-full mb-8 shadow-2xl"
          />
          <p className="text-[#FFD700] text-xs font-bold tracking-[0.3em] uppercase mb-5">
            Open Daily 6PM – 2AM · Drive-Thru Only · Birmingham
          </p>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-lg font-light">
            Smashed Angus Beef. Brioche Bun. No Compromises.
          </p>
          <Link href="/menu" className="btn-primary text-lg px-10 py-4">
            View Menu
          </Link>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="bg-[#F5F5F0] py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-5xl md:text-6xl text-[#111111] mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            Born in Birmingham
          </h2>
          <p className="text-[#444444] text-lg leading-relaxed mb-5">
            Ooo..FAT! started with one simple obsession — the perfect smash burger. We source
            fresh Angus beef, smash it thin on a screaming-hot griddle, and stack it on a pillowy
            brioche bun with American cheese, crisp lettuce, gherkins, and your sauce of choice.
          </p>
          <p className="text-[#444444] text-lg leading-relaxed">
            No frozen patties. No shortcuts. Just real food, fast, every night from 6PM until 2AM.
            Pull up to the drive-thru window and taste what a smash burger should be.
          </p>
          <div className="mt-12 flex justify-center flex-wrap gap-14">
            {[
              { label: "Fresh Angus Beef", icon: "🥩" },
              { label: "Brioche Bun", icon: "🍔" },
              { label: "Drive-Thru Only", icon: "🚗" },
            ].map(({ label, icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{icon}</span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#555555]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Items ── */}
      <section className="bg-[#111111] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl md:text-6xl text-white mb-2"
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
                className="bg-[#1a1a1a] rounded overflow-hidden group"
              >
                <div className="h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="text-white font-bold text-sm md:text-base leading-snug">
                    {item.name}
                  </p>
                  <p
                    className="text-[#FFD700] font-bold mt-1"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem" }}
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
      <section className="bg-[#F5F5F0] py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-[#FFD700] text-5xl mb-5">★</div>
          <h2
            className="text-5xl md:text-6xl text-[#111111] mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            Loyalty Rewards
          </h2>
          <p className="text-[#444444] text-lg mb-2">
            Earn rewards every visit.{" "}
            <strong className="text-[#111111]">£5 off every £50 spent.</strong>
          </p>
          <p className="text-[#888888] mb-8 text-sm tracking-wide">
            Every £1 = 1 point · 50 points = £5 reward · No app needed
          </p>
          <Link href="/loyalty" className="btn-primary text-lg px-10 py-4">
            Join the Loyalty Program
          </Link>
        </div>
      </section>

      {/* ── Location ── */}
      <section id="location" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-5xl md:text-6xl text-[#111111] text-center mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            Find Us
          </h2>
          <p className="text-center text-gray-400 mb-8 text-xs font-bold tracking-[0.25em] uppercase">
            Birmingham, UK
          </p>
          <div className="rounded overflow-hidden shadow-lg">
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
              style={{ fontFamily: "var(--font-permanent-marker), cursive", letterSpacing: "0.05em" }}
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
