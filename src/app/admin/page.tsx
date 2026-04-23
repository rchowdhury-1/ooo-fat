"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Stats {
  totalCustomers: number;
  totalStampsIssued: number;
  totalRewardsRedeemed: number;
  totalQrCodes: number;
  claimedQrCodes: number;
  burgerStampsAwarded: number;
}

interface Customer {
  id: string;
  email: string;
  name: string | null;
  stamps: number;
  total_spent: number;
  created_at: string;
}

interface QrCode {
  id: string;
  code: string;
  spend_amount: number;
  includes_burger: boolean;
  stamp_value: number;
  claimed_at: string | null;
  created_at: string;
  claimed_by_email: string | null;
}

interface GeneratedQr {
  code: string;
  claimUrl: string;
  qrDataUrl: string;
  stampValue: number;
  includesBurger: boolean;
  spendAmount: number;
}

interface RewardEntry {
  id: string;
  email: string;
  discount_code: string;
  stamps_used: number;
  redeemed: boolean;
  created_at: string;
}

interface HistoryEntry {
  id: string;
  email: string;
  stamps: number;
  action: string;
  description: string;
  created_at: string;
}

type Tab = "stats" | "generate" | "customers" | "qrcodes" | "adjust" | "rewards" | "history";

const ACTION_LABELS: Record<string, string> = {
  earn: "Stamp Earned",
  admin_adjust: "Admin Adjust",
  reward: "Reward Issued",
  redeem: "Reward Redeemed",
};

export default function AdminPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<"loading" | "authed">("loading");

  const [tab, setTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsError, setStatsError] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [rewards, setRewards] = useState<RewardEntry[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const [spendAmount, setSpendAmount] = useState("");
  const [includesBurger, setIncludesBurger] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedQr, setGeneratedQr] = useState<GeneratedQr | null>(null);

  const [adjustEmail, setAdjustEmail] = useState("");
  const [adjustStamps, setAdjustStamps] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustResult, setAdjustResult] = useState<string | null>(null);
  const [adjusting, setAdjusting] = useState(false);

  // Auth check on mount
  useEffect(() => {
    fetch("/api/admin/auth/verify")
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setAuthState("authed");
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  // Load stats once authed
  useEffect(() => {
    if (authState === "authed") {
      fetch("/api/admin/stats")
        .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
        .then((data) => { setStats(data); setStatsError(false); })
        .catch((err) => { console.error("[stats]", err); setStatsError(true); });
    }
  }, [authState]);

  // Load tab-specific data
  const loadCustomers = useCallback(() => {
    const url = customerSearch
      ? `/api/admin/customers?search=${encodeURIComponent(customerSearch)}`
      : "/api/admin/customers";
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then(setCustomers)
      .catch((err) => console.error("[customers]", err));
  }, [customerSearch]);

  useEffect(() => {
    if (authState !== "authed") return;
    if (tab === "customers") loadCustomers();
    if (tab === "qrcodes")
      fetch("/api/qr/list")
        .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
        .then(setQrCodes)
        .catch((err) => console.error("[qrcodes]", err));
    if (tab === "rewards")
      fetch("/api/admin/rewards")
        .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
        .then(setRewards)
        .catch((err) => console.error("[rewards]", err));
    if (tab === "history")
      fetch("/api/admin/history")
        .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
        .then(setHistory)
        .catch((err) => console.error("[history]", err));
  }, [authState, tab, loadCustomers]);

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const generateQr = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedQr(null);
    const res = await fetch("/api/qr/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spendAmount, includesBurger }),
    });
    const data = await res.json();
    if (data.qrDataUrl) setGeneratedQr(data);
    setGenerating(false);
  };

  const downloadQr = (qr?: GeneratedQr) => {
    const target = qr ?? generatedQr;
    if (!target) return;
    const a = document.createElement("a");
    a.href = target.qrDataUrl;
    a.download = `receipt-qr-${target.code}.png`;
    a.click();
  };

  const adjustStampsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdjusting(true);
    setAdjustResult(null);
    const res = await fetch("/api/admin/adjust-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adjustEmail, stamps: parseInt(adjustStamps), reason: adjustReason }),
    });
    const data = await res.json();
    setAdjustResult(
      data.success
        ? `Done. ${adjustEmail} now has ${data.newStamps} stamps.`
        : data.error
    );
    setAdjusting(false);
  };

  const toggleRedeemed = async (id: string, currentRedeemed: boolean) => {
    const res = await fetch("/api/admin/rewards", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, redeemed: !currentRedeemed }),
    });
    if (res.ok) {
      setRewards((prev) =>
        prev.map((r) => (r.id === id ? { ...r, redeemed: !currentRedeemed } : r))
      );
    }
  };

  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700]" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: "stats", label: "Stats", emoji: "📊" },
    { id: "generate", label: "Generate QR", emoji: "🔖" },
    { id: "customers", label: "Customers", emoji: "👥" },
    { id: "qrcodes", label: "QR Codes", emoji: "🗃" },
    { id: "adjust", label: "Adjust Stamps", emoji: "⚙️" },
    { id: "rewards", label: "Rewards", emoji: "🎁" },
    { id: "history", label: "Stamp Log", emoji: "📋" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <header className="bg-[#111111] sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xl text-[#FFD700]"
              style={{ fontFamily: "var(--font-permanent-marker), cursive" }}
            >
              Ooo..FAT!
            </Link>
            <span className="text-gray-600 text-sm hidden sm:block">/ Admin</span>
          </div>
          <button
            onClick={logout}
            className="text-xs text-gray-500 hover:text-gray-300 font-semibold uppercase tracking-widest transition-colors"
          >
            Sign out
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto pb-0 border-t border-gray-800">
          {tabs.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2.5 text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-all border-b-2 ${
                tab === id
                  ? "border-[#FFD700] text-[#FFD700]"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="mr-1">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Stats ── */}
        {tab === "stats" && (
          <div>
            <h2
              className="text-3xl text-[#111111] mb-6"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              Overview
            </h2>
            {statsError ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
                <p className="font-semibold mb-1">Could not load stats</p>
                <p className="text-red-500">
                  Check the server console for the error. If this is a fresh setup, make sure
                  your database tables exist by visiting{" "}
                  <code className="bg-red-100 px-1 rounded font-mono">/api/init</code> once.
                </p>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Total Customers", value: stats.totalCustomers, color: "text-blue-600" },
                  { label: "Stamps Outstanding", value: stats.totalStampsIssued.toLocaleString(), color: "text-[#FFD700]" },
                  { label: "Free Burgers Redeemed", value: stats.totalRewardsRedeemed, color: "text-green-600" },
                  { label: "QR Codes Created", value: stats.totalQrCodes, color: "text-purple-600" },
                  { label: "QR Codes Claimed", value: stats.claimedQrCodes, color: "text-orange-500" },
                  { label: "Burger Stamps Given", value: stats.burgerStampsAwarded, color: "text-[#FFD700]" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm mb-1">{label}</p>
                    <p
                      className={`text-3xl font-bold ${color}`}
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
                Loading...
              </div>
            )}
          </div>
        )}

        {/* ── Generate QR ── */}
        {tab === "generate" && (
          <div className="max-w-md">
            <h2
              className="text-3xl text-[#111111] mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              Generate Receipt QR
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Enter spend amount and whether the order included a burger. Burger orders earn 1 stamp.
              Every 8th burger is free.
            </p>
            <form onSubmit={generateQr} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1">
                  Spend Amount (£)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="e.g. 12.50"
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">
                  Order includes a burger?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIncludesBurger(true)}
                    className={`flex-1 py-3 rounded-lg border-2 font-bold text-sm uppercase tracking-wide transition-all ${
                      includesBurger
                        ? "bg-[#FFD700] border-[#FFD700] text-[#111111]"
                        : "bg-white border-gray-300 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    🍔 Yes — adds stamp
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncludesBurger(false)}
                    className={`flex-1 py-3 rounded-lg border-2 font-bold text-sm uppercase tracking-wide transition-all ${
                      !includesBurger
                        ? "bg-[#111111] border-[#111111] text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    No burger
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {includesBurger
                    ? "This QR will award 1 stamp when scanned."
                    : "This QR records the visit but awards no stamp."}
                </p>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full btn-primary py-3 text-lg disabled:opacity-60"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {generating ? "Generating..." : "Generate QR Code"}
              </button>
            </form>

            {generatedQr && (
              <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <p className="text-sm text-gray-500 mb-1">
                  QR Code — £{parseFloat(String(generatedQr.spendAmount)).toFixed(2)} spend
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  {generatedQr.includesBurger
                    ? "🍔 Awards 1 burger stamp when scanned"
                    : "No stamp — sides/drinks only"}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedQr.qrDataUrl}
                  alt="QR Code"
                  className="mx-auto mb-4 w-48 h-48 cursor-pointer"
                  onClick={() => downloadQr(generatedQr)}
                  title="Click to download"
                />
                <p className="text-xs text-gray-400 mb-4 font-mono break-all">{generatedQr.claimUrl}</p>
                <button
                  onClick={() => downloadQr()}
                  className="btn-primary w-full py-3"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Download High-Res PNG
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Customers ── */}
        {tab === "customers" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <h2
                className="text-3xl text-[#111111]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
              >
                Customers
              </h2>
              <input
                type="text"
                placeholder="Search by email..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] sm:ml-auto sm:w-64"
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#111111] text-gray-300">
                    <tr>
                      {["Email", "Stamps", "Cycle", "Total Spent", "Joined"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No customers found</td>
                      </tr>
                    ) : (
                      customers.map((c) => {
                        const stampsInCycle = (c.stamps || 0) % 8;
                        const tier =
                          (c.stamps || 0) >= 40
                            ? { label: "Gold", color: "bg-yellow-100 text-yellow-700" }
                            : (c.stamps || 0) >= 16
                            ? { label: "Silver", color: "bg-gray-100 text-gray-600" }
                            : { label: "Regular", color: "bg-blue-50 text-blue-600" };
                        return (
                          <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-[#111111]">
                              <div>{c.email}</div>
                              <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${tier.color}`}>
                                {tier.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className="font-bold text-[#FFD700]"
                                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
                              >
                                {c.stamps || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 8 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-3 h-3 rounded-sm ${i < stampsInCycle ? "bg-[#FFD700]" : "bg-gray-200"}`}
                                  />
                                ))}
                                <span className="text-xs text-gray-400 ml-1">{stampsInCycle}/8</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              £{parseFloat(String(c.total_spent || 0)).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                              {new Date(c.created_at).toLocaleDateString("en-GB")}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── QR Codes ── */}
        {tab === "qrcodes" && (
          <div>
            <h2
              className="text-3xl text-[#111111] mb-6"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              QR Codes
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#111111] text-gray-300">
                    <tr>
                      {["Code", "Spend", "Burger?", "Status", "Claimed By", "Date"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {qrCodes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">No QR codes yet</td>
                      </tr>
                    ) : (
                      qrCodes.map((q) => (
                        <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{q.code.slice(0, 12)}...</td>
                          <td className="px-4 py-3 font-semibold text-[#111111]">
                            £{parseFloat(String(q.spend_amount)).toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            {q.includes_burger ? (
                              <span className="text-base" title="Burger stamp">🍔</span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              q.claimed_at ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {q.claimed_at ? "Claimed" : "Unclaimed"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{q.claimed_by_email || "—"}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(q.created_at).toLocaleDateString("en-GB")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Adjust Stamps ── */}
        {tab === "adjust" && (
          <div className="max-w-md">
            <h2
              className="text-3xl text-[#111111] mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              Adjust Stamps
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Manually add or remove stamps from a customer account. Use negative numbers to deduct.
            </p>
            <form onSubmit={adjustStampsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  placeholder="customer@email.com"
                  value={adjustEmail}
                  onChange={(e) => setAdjustEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1">Stamps to Add / Remove</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1 or -1"
                  value={adjustStamps}
                  onChange={(e) => setAdjustStamps(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1">Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goodwill, Error correction"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-base"
                />
              </div>
              <button
                type="submit"
                disabled={adjusting}
                className="w-full btn-primary py-3 disabled:opacity-60"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {adjusting ? "Saving..." : "Apply Adjustment"}
              </button>
            </form>

            {adjustResult && (
              <div className={`mt-4 p-4 rounded-lg text-sm ${
                adjustResult.startsWith("Done")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {adjustResult}
              </div>
            )}
          </div>
        )}

        {/* ── Rewards ── */}
        {tab === "rewards" && (
          <div>
            <div className="mb-6">
              <h2
                className="text-3xl text-[#111111]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
              >
                Reward Codes
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                All free burger codes issued to customers. Toggle redeemed status after a customer uses a code at the window.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#111111] text-gray-300">
                    <tr>
                      {["Customer", "Code", "Stamps Used", "Status", "Issued", "Action"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rewards.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">No rewards issued yet</td>
                      </tr>
                    ) : (
                      rewards.map((r) => (
                        <tr key={r.id} className={`hover:bg-gray-50 transition-colors ${r.redeemed ? "opacity-60" : ""}`}>
                          <td className="px-4 py-3 text-[#111111] font-medium">{r.email}</td>
                          <td className="px-4 py-3">
                            <span
                              className="font-mono text-sm font-bold text-[#111111] bg-[#F5F5F0] px-2 py-1 rounded"
                            >
                              {r.discount_code}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{r.stamps_used} stamps</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              r.redeemed
                                ? "bg-gray-100 text-gray-500"
                                : "bg-green-100 text-green-700"
                            }`}>
                              {r.redeemed ? "Used" : "Active"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(r.created_at).toLocaleDateString("en-GB")}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleRedeemed(r.id, r.redeemed)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                r.redeemed
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {r.redeemed ? "Mark Active" : "Mark Used"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Stamp Log ── */}
        {tab === "history" && (
          <div>
            <div className="mb-6">
              <h2
                className="text-3xl text-[#111111]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
              >
                Stamp Log
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Full history of all stamp events — earnings, adjustments, and rewards issued.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#111111] text-gray-300">
                    <tr>
                      {["Customer", "Event", "Description", "Stamps", "Date"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No stamp history yet</td>
                      </tr>
                    ) : (
                      history.map((h) => (
                        <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-[#111111] font-medium">{h.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              h.action === "earn"
                                ? "bg-yellow-100 text-yellow-700"
                                : h.action === "admin_adjust"
                                ? "bg-blue-100 text-blue-700"
                                : h.action === "reward"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                            }`}>
                              {ACTION_LABELS[h.action] ?? h.action}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{h.description}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-bold text-base ${
                                h.stamps > 0
                                  ? "text-[#FFD700]"
                                  : h.stamps < 0
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                            >
                              {h.stamps > 0 ? `+${h.stamps}` : h.stamps}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                            {new Date(h.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
