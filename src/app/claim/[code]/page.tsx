"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";

type Params = { code: string };

interface ClaimResult {
  success?: boolean;
  error?: string;
  stampEarned?: boolean;
  newStamps?: number;
  stampsInCycle?: number;
  spendAmount?: number;
  freeBurgerCode?: string | null;
}

const STAMPS_PER_REWARD = 8;

export default function ClaimPage({ params }: { params: Promise<Params> }) {
  const { code } = use(params);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/points/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <Image
          src="/images/logo.jpeg"
          width={80}
          height={80}
          alt="Ooo..FAT!"
          className="rounded-full"
        />
      </Link>

      <div className="w-full max-w-sm bg-white rounded overflow-hidden shadow-2xl">
        {/* Header strip */}
        <div className="bg-[#FFD700] px-6 py-5 text-center">
          <p
            className="text-2xl text-[#111111]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
          >
            Claim Your Stamp
          </p>
          <p className="text-[#333333] text-xs font-semibold mt-1 tracking-wide">
            Buy 7 Burgers, Get the 8th Free
          </p>
        </div>

        <div className="px-6 py-8">
          {!result ? (
            <>
              <p className="text-[#555555] text-sm mb-5 text-center">
                Enter your email to claim your loyalty stamp from this receipt.
              </p>
              <form onSubmit={handleClaim} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3.5 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-base bg-[#F5F5F0]"
                  autoComplete="email"
                  inputMode="email"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 text-xl disabled:opacity-60"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {loading ? "Claiming..." : "Claim Stamp"}
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-4">
                First time? We&apos;ll create your free loyalty account automatically.
              </p>
            </>
          ) : result.success ? (
            <div className="text-center">
              {/* Free burger earned! */}
              {result.freeBurgerCode ? (
                <>
                  <div className="text-5xl mb-3">🎉</div>
                  <p
                    className="text-3xl text-[#111111] mb-1"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                  >
                    Free Burger Earned!
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    You&apos;ve collected all 8 stamps — enjoy your free Single Patty!
                  </p>
                  <div className="bg-[#FFD700] rounded-lg p-4 mb-4">
                    <p className="text-xs font-bold text-[#111111] uppercase tracking-widest mb-1">
                      Your Free Burger Code
                    </p>
                    <p
                      className="text-3xl text-[#111111]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
                    >
                      {result.freeBurgerCode}
                    </p>
                    <p className="text-xs text-[#333333] mt-1 font-medium">
                      Show at the drive-thru window
                    </p>
                  </div>
                </>
              ) : result.stampEarned ? (
                <>
                  <div className="text-6xl mb-4">🍔</div>
                  <p
                    className="text-3xl text-[#111111] mb-1"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                  >
                    Stamp Added!
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">✅</div>
                  <p
                    className="text-3xl text-[#111111] mb-1"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                  >
                    Order Recorded
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    No stamp this time — stamps are only awarded for burger orders.
                  </p>
                </>
              )}

              {/* Stamp progress */}
              <div className="bg-[#111111] rounded-lg p-4 mt-4">
                <p className="text-gray-400 text-xs mb-3 uppercase tracking-[0.2em] font-semibold">
                  Your Stamp Card
                </p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {Array.from({ length: STAMPS_PER_REWARD }).map((_, i) => {
                    const stampsInCycle = (result.newStamps ?? 0) % STAMPS_PER_REWARD;
                    const filled = i < stampsInCycle;
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xl ${
                          filled ? "bg-[#FFD700]" : "bg-gray-800 border border-gray-700"
                        }`}
                      >
                        {filled ? "🍔" : <span className="text-gray-600 text-xs font-bold">{i + 1}</span>}
                      </div>
                    );
                  })}
                </div>
                <p className="text-gray-400 text-xs">
                  {(result.newStamps ?? 0) % STAMPS_PER_REWARD} / 8 stamps this cycle
                </p>
              </div>

              <Link
                href="/loyalty"
                className="block mt-5 text-[#111111] font-bold text-sm underline underline-offset-4"
              >
                View your loyalty card →
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-4">
                {result.error?.includes("already been claimed") ? "⚠️" : "❌"}
              </div>
              <p
                className="text-2xl text-[#111111] mb-2"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {result.error?.includes("already been claimed") ? "Already Claimed" : "Oops!"}
              </p>
              <p className="text-gray-500 text-sm mb-6">{result.error}</p>
              {!result.error?.includes("already been claimed") && (
                <button
                  onClick={() => setResult(null)}
                  className="btn-primary w-full py-3"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Try Again
                </button>
              )}
              <Link
                href="/loyalty"
                className="block mt-4 text-[#111111] font-bold text-sm underline underline-offset-4"
              >
                View my loyalty card
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
