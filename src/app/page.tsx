import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#111111] text-white px-4">
        {/* Opening hours bar */}
        <div className="absolute top-0 left-0 right-0 bg-[#FFD700] text-[#111111] text-center py-2.5 text-sm font-semibold tracking-widest uppercase z-10">
          Open Daily 6PM – 2AM · Drive-Thru Only
        </div>

        {/* Logo */}
        <div className="animate-pulse-subtle mt-16 mb-6 text-center">
          <div className="logo-circle">
            <h1
              className="text-8xl md:text-[10rem] text-[#FFD700] leading-none tracking-wider"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Ooo..FAT!
            </h1>
          </div>
        </div>

        <p className="text-xl md:text-2xl text-gray-300 text-center max-w-lg mb-2 font-light tracking-wide">
          Smashed Angus Beef. Brioche Bun. No Compromises.
        </p>
        <p className="text-sm text-gray-500 mb-10 tracking-widest uppercase">Drive-Thru · Birmingham</p>

        <Link
          href="/menu"
          className="btn-primary text-lg px-10 py-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          View Menu
        </Link>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* About */}
      <section className="bg-[#FFFBEB] py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-5xl text-[#111111] mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            Born in Birmingham
          </h2>
          <p className="text-[#333333] text-lg leading-relaxed mb-6">
            Ooo..FAT! started with one simple obsession — the perfect smash burger. We source fresh Angus beef,
            smash it thin on a screaming-hot griddle, and stack it on a pillowy brioche bun with American cheese,
            crisp lettuce, gherkins, and your sauce of choice.
          </p>
          <p className="text-[#333333] text-lg leading-relaxed">
            No frozen patties. No shortcuts. Just real food, fast, every night from 6PM until 2AM.
            Pull up to the drive-thru window and taste what a smash burger should be.
          </p>
          <div className="mt-10 flex justify-center flex-wrap gap-10 text-[#111111]">
            {[
              { label: "Fresh Angus Beef", icon: "🥩" },
              { label: "Brioche Bun", icon: "🍔" },
              { label: "Drive-Thru Only", icon: "🚗" },
            ].map(({ label, icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{icon}</span>
                <span className="text-sm font-semibold uppercase tracking-widest text-[#333333]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-5xl text-[#111111] text-center mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            Find Us
          </h2>
          <p className="text-center text-gray-500 mb-8 tracking-widest uppercase text-sm">Birmingham, UK</p>
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <iframe
              src="https://maps.google.com/maps?q=0x4870bb1eac019927:0xd2a6095bd7a5747f&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ooo..FAT! Location"
            />
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-[#333333]">
            <div className="flex items-center gap-2">
              <span className="text-[#FFD700] text-xl">📍</span>
              <span className="font-semibold">Birmingham, UK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#FFD700] text-xl">🕕</span>
              <span className="font-semibold">Open Daily 6PM – 2AM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty Teaser */}
      <section className="bg-[#111111] py-20 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-[#FFD700] text-5xl mb-4">★</div>
          <h2
            className="text-5xl md:text-6xl text-[#FFD700] mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            Loyalty Rewards
          </h2>
          <p className="text-gray-300 text-lg mb-2">
            Earn rewards every visit.{" "}
            <strong className="text-[#FFD700]">£5 off every £50 spent.</strong>
          </p>
          <p className="text-gray-500 mb-8 text-sm tracking-wide">
            Every £1 = 1 point · 50 points = £5 reward · No app needed
          </p>
          <Link
            href="/loyalty"
            className="btn-primary text-lg px-10 py-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Join the Loyalty Program
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-gray-600 text-center py-8 px-4 text-sm">
        <p
          className="text-[#FFD700] text-2xl mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
        >
          Ooo..FAT!
        </p>
        <p className="mb-1">Smash Burgers · Birmingham · Drive-Thru</p>
        <p>Open Daily 6PM – 2AM</p>
        <p className="mt-4 text-gray-700">&copy; {new Date().getFullYear()} Ooo..FAT! All rights reserved.</p>
      </footer>
    </main>
  );
}
