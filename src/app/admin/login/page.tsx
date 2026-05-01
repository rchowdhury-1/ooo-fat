"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Incorrect PIN");
      setPin("");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p
          className="text-[#E8B84B] text-3xl text-center mb-2"
          style={{ fontFamily: "var(--font-permanent-marker), cursive" }}
        >
          Ooo..FAT!
        </p>
        <p className="text-[#9A9A8A] text-xs text-center tracking-widest uppercase mb-8">
          Admin Access
        </p>

        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#E8B84B]/10">
          <label className="block text-[#9A9A8A] text-xs font-bold tracking-widest uppercase mb-2">
            PIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            autoFocus
            className="w-full bg-[#0D0D0D] border border-[#E8B84B]/20 rounded-xl px-4 py-3 text-[#F5F5F0] text-lg tracking-widest text-center focus:outline-none focus:border-[#E8B84B]/60 mb-4"
          />
          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full bg-[#E8B84B] text-[#0D0D0D] font-black uppercase tracking-widest rounded-xl py-3 hover:bg-[#C9A235] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
