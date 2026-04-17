"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";

type Params = { code: string };

export default function ClaimPage({ params }: { params: Promise<Params> }) {
  const { code } = use(params);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    error?: string;
    pointsEarned?: number;
    newTotal?: number;
    spendAmount?: number;
  } | null>(null);

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
            Claim Your Points
          </p>
          <p className="text-[#333333] text-xs font-semibold mt-1 tracking-wide">
            Every £1 = 1 point · 50 points = £5 off
          </p>
        </div>

        <div className="px-6 py-8">
          {!result ? (
            <>
              <p className="text-[#555555] text-sm mb-5 text-center">
                Enter your email to claim your points from this receipt.
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
                  {loading ? "Claiming..." : "Claim Points"}
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-4">
                First time? We&apos;ll create your free loyalty account automatically.
              </p>
            </>
          ) : result.success ? (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <p
                className="text-3xl text-[#111111] mb-1"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
              >
                Points Claimed!
              </p>
              <div className="bg-[#F5F5F0] rounded p-4 my-5 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest font-semibold">
                  Points earned
                </p>
                <p
                  className="text-5xl text-[#FFD700]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  +{result.pointsEarned}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  From £{parseFloat(String(result.spendAmount)).toFixed(2)} spend
                </p>
              </div>
              <div className="bg-[#111111] rounded p-4 my-3">
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-[0.2em] font-semibold">
                  Total Points Balance
                </p>
                <p
                  className="text-4xl text-[#FFD700]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {result.newTotal}
                </p>
              </div>
              <Link
                href="/loyalty"
                className="block mt-5 text-[#111111] font-bold text-sm underline underline-offset-4"
              >
                View your rewards →
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
                View my rewards
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
