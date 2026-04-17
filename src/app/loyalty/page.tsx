"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface HistoryEntry {
  points: number;
  action: string;
  description: string;
  created_at: string;
}

interface Reward {
  discount_code: string;
  points_used: number;
  redeemed: boolean;
  created_at: string;
}

interface Balance {
  points: number;
  total_spent: number;
  history: HistoryEntry[];
  rewards: Reward[];
}

const POINTS_TO_REWARD = 50;

export default function LoyaltyPage() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<string | null>(null);

  const searchParams =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const isVerify = searchParams?.get("verify") === "true";

  useEffect(() => {
    if (session) {
      fetch("/api/points/balance")
        .then((r) => r.json())
        .then(setBalance);
    }
  }, [session]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("resend", { email, redirect: false });
    setSent(true);
    setLoading(false);
  };

  const handleRedeem = async () => {
    setRedeeming(true);
    const res = await fetch("/api/points/redeem", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setRedeemResult(`Your discount code: ${data.discountCode}`);
      setBalance((prev) => (prev ? { ...prev, points: data.newPoints } : prev));
    } else {
      setRedeemResult(data.error || "Something went wrong");
    }
    setRedeeming(false);
  };

  const progress = balance
    ? Math.min(((balance.points % POINTS_TO_REWARD) / POINTS_TO_REWARD) * 100, 100)
    : 0;
  const pointsToNext = balance
    ? POINTS_TO_REWARD - (balance.points % POINTS_TO_REWARD)
    : POINTS_TO_REWARD;
  const hasReward = balance ? balance.points >= POINTS_TO_REWARD : false;
  const activeRewards = balance?.rewards.filter((r) => !r.redeemed) ?? [];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <Navbar />

      {/* Sign-out bar when logged in */}
      {session && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">{session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="text-xs text-gray-400 hover:text-[#111111] font-semibold uppercase tracking-widest transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="text-[#FFD700] text-5xl mb-4">★</div>
          <h1
            className="text-5xl md:text-6xl text-[#111111] mb-3"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            Loyalty Rewards
          </h1>
          <p className="text-[#555555] text-base">
            Every £1 spent = 1 point · 50 points ={" "}
            <strong className="text-[#111111]">£5 off</strong> your next order
          </p>
        </div>

        {/* Verify email state */}
        {isVerify && !session && (
          <div className="bg-white border border-gray-200 rounded p-6 text-center mb-8 shadow-sm">
            <p className="text-2xl mb-2">📧</p>
            <p className="font-bold text-[#111111] text-lg">Check your email</p>
            <p className="text-gray-500 text-sm mt-1">
              We sent you a magic link. Click it to sign in — no password needed.
            </p>
          </div>
        )}

        {!session ? (
          <>
            {/* How it works */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { step: "1", text: "Order at the drive-thru" },
                { step: "2", text: "Scan your receipt QR code" },
                { step: "3", text: "Collect points, earn £5 off" },
              ].map(({ step, text }) => (
                <div
                  key={step}
                  className="text-center p-4 bg-white rounded border border-gray-200 shadow-sm"
                >
                  <div
                    className="text-3xl text-[#FFD700] mb-1"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {step}
                  </div>
                  <p className="text-sm text-[#444444]">{text}</p>
                </div>
              ))}
            </div>

            {/* Sign In */}
            {!sent ? (
              <div className="bg-white rounded p-6 shadow-sm border border-gray-200">
                <h2
                  className="text-2xl text-[#111111] mb-1"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                >
                  Sign Up / Login
                </h2>
                <p className="text-gray-500 text-sm mb-5">
                  Enter your email and we&apos;ll send you a magic link — no password needed.
                </p>
                <form onSubmit={handleSignIn} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-base bg-[#F5F5F0]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3 text-base disabled:opacity-60"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {loading ? "Sending..." : "Send Magic Link"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded p-8 text-center shadow-sm">
                <p className="text-4xl mb-3">📧</p>
                <p className="font-bold text-[#111111] text-xl mb-2">Check your email!</p>
                <p className="text-gray-500">
                  We sent a magic link to <strong>{email}</strong>. Click it to access your
                  rewards.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Points Balance Card */}
            <div className="bg-[#111111] text-white rounded p-6 mb-6">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-1">
                    Your Points
                  </p>
                  <p
                    className="text-7xl text-[#FFD700] leading-none"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {balance?.points ?? 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs uppercase tracking-widest">Total Spent</p>
                  <p className="text-white font-bold text-xl mt-1">
                    £{parseFloat(String(balance?.total_spent ?? 0)).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>{balance?.points ?? 0} pts</span>
                  <span>
                    {hasReward ? "Reward available!" : `${pointsToNext} pts to next £5 reward`}
                  </span>
                </div>
                <div className="bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#FFD700] h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Active reward codes */}
            {activeRewards.length > 0 && (
              <div className="mb-6 space-y-3">
                {activeRewards.map((r) => (
                  <div key={r.discount_code} className="bg-[#FFD700] rounded p-5 text-center">
                    <p className="text-xs font-bold text-[#111111] uppercase tracking-[0.2em] mb-2">
                      £5 Discount Code
                    </p>
                    <p
                      className="text-4xl text-[#111111]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
                    >
                      {r.discount_code}
                    </p>
                    <p className="text-xs text-[#333333] mt-2 font-medium">
                      Show this at the drive-thru window
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Redeem button */}
            {hasReward && !redeemResult && (
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="w-full btn-primary py-4 text-lg mb-6 disabled:opacity-60"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {redeeming ? "Generating..." : "Redeem 50 Points for £5 Off"}
              </button>
            )}

            {redeemResult && (
              <div className="bg-white border border-gray-200 rounded p-4 text-center mb-6 shadow-sm">
                <p className="text-[#111111] font-semibold">{redeemResult}</p>
              </div>
            )}

            {/* Points History */}
            {balance && balance.history.length > 0 && (
              <div>
                <h2
                  className="text-2xl text-[#111111] mb-4"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                >
                  Points History
                </h2>
                <div className="space-y-2">
                  {balance.history.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 px-4 bg-white rounded border border-gray-200"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#111111]">
                          {entry.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(entry.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`font-bold text-xl ml-4 ${
                          entry.points > 0 ? "text-green-600" : "text-red-500"
                        }`}
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {entry.points > 0 ? "+" : ""}
                        {entry.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {balance && balance.history.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🧾</p>
                <p className="font-semibold">No points earned yet.</p>
                <p className="text-sm mt-1">Scan your next receipt QR code to start earning!</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#111111] text-gray-600 text-center py-6 px-4 text-sm mt-10">
        <Link href="/menu" className="text-[#FFD700] hover:underline font-semibold">
          View Menu
        </Link>
        <span className="mx-3">·</span>
        <span>Open Daily 6PM – 2AM</span>
      </footer>
    </div>
  );
}
