"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.replace("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-4">
      <Link
        href="/"
        className="text-[#FFD700] text-4xl mb-8 block"
        style={{ fontFamily: "var(--font-permanent-marker), cursive" }}
      >
        Ooo..FAT!
      </Link>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <h1
          className="text-white text-3xl mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          Admin Login
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Business dashboard — authorised access only
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111111] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-sm"
              placeholder="admin@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111111] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-sm"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-900/50 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD700] text-[#111111] font-black py-3 rounded-lg uppercase tracking-widest text-sm hover:bg-[#e6c800] transition-colors disabled:opacity-60 mt-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <Link
          href="/"
          className="block mt-6 text-center text-xs text-gray-700 hover:text-gray-400 transition-colors"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
