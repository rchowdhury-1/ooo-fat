"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

interface Stats {
  totalCustomers: number;
  totalPointsIssued: number;
  totalRewardsRedeemed: number;
  totalQrCodes: number;
  claimedQrCodes: number;
}

interface Customer {
  id: string;
  email: string;
  name: string | null;
  points: number;
  total_spent: number;
  created_at: string;
}

interface QrCode {
  id: string;
  code: string;
  spend_amount: number;
  points_value: number;
  claimed_at: string | null;
  created_at: string;
  claimed_by_email: string | null;
}

interface GeneratedQr {
  code: string;
  claimUrl: string;
  qrDataUrl: string;
  pointsValue: number;
  spendAmount: number;
}

type Tab = "stats" | "generate" | "customers" | "qrcodes" | "adjust";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin;

  const [tab, setTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [spendAmount, setSpendAmount] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedQr, setGeneratedQr] = useState<GeneratedQr | null>(null);
  const [adjustEmail, setAdjustEmail] = useState("");
  const [adjustPoints, setAdjustPoints] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustResult, setAdjustResult] = useState<string | null>(null);
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && tab === "customers") {
      const url = customerSearch ? `/api/admin/customers?search=${encodeURIComponent(customerSearch)}` : "/api/admin/customers";
      fetch(url).then((r) => r.json()).then(setCustomers);
    }
    if (isAdmin && tab === "qrcodes") {
      fetch("/api/qr/list").then((r) => r.json()).then(setQrCodes);
    }
  }, [isAdmin, tab, customerSearch]);

  const generateQr = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedQr(null);
    const res = await fetch("/api/qr/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spendAmount }),
    });
    const data = await res.json();
    if (data.qrDataUrl) {
      setGeneratedQr(data);
    }
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

  const adjustPointsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdjusting(true);
    setAdjustResult(null);
    const res = await fetch("/api/admin/adjust-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adjustEmail, points: parseInt(adjustPoints), reason: adjustReason }),
    });
    const data = await res.json();
    setAdjustResult(data.success ? `Done. ${adjustEmail} now has ${data.newPoints} points.` : data.error);
    setAdjusting(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-4">
        <span className="text-4xl text-[#FFD700] mb-6" style={{ fontFamily: "var(--font-permanent-marker), cursive" }}>Ooo..FAT! Admin</span>
        <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
          <p className="text-[#333333] mb-5">Sign in with your admin email to continue.</p>
          <button onClick={() => signIn()} className="btn-primary w-full py-3 text-base" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Sign In
          </button>
          <Link href="/" className="block mt-4 text-sm text-gray-400 hover:text-gray-600">← Back to site</Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <p className="text-5xl mb-4">🚫</p>
        <h1 className="text-2xl font-bold text-[#111111] mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">This page is only accessible to admin users.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: "stats", label: "Stats", emoji: "📊" },
    { id: "generate", label: "Generate QR", emoji: "🔖" },
    { id: "customers", label: "Customers", emoji: "👥" },
    { id: "qrcodes", label: "QR Codes", emoji: "🗃" },
    { id: "adjust", label: "Adjust Points", emoji: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Admin Header */}
      <header className="bg-[#111111] sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl text-[#FFD700]" style={{ fontFamily: "var(--font-permanent-marker), cursive" }}>
              Ooo..FAT!
            </Link>
            <span className="text-gray-600 text-sm hidden sm:block">/ Admin</span>
          </div>
          <span className="text-gray-400 text-xs truncate max-w-[180px]">{session.user?.email}</span>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto pb-0 scrollbar-none border-t border-gray-800">
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

        {/* Stats */}
        {tab === "stats" && (
          <div>
            <h2 className="text-3xl text-[#111111] mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>Overview</h2>
            {stats ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Total Customers", value: stats.totalCustomers, color: "text-blue-600" },
                  { label: "Points Outstanding", value: stats.totalPointsIssued.toLocaleString(), color: "text-[#FFD700]" },
                  { label: "Rewards Redeemed", value: stats.totalRewardsRedeemed, color: "text-green-600" },
                  { label: "QR Codes Created", value: stats.totalQrCodes, color: "text-purple-600" },
                  { label: "QR Codes Claimed", value: stats.claimedQrCodes, color: "text-orange-500" },
                  {
                    label: "Claim Rate",
                    value: stats.totalQrCodes > 0 ? `${Math.round(stats.claimedQrCodes / stats.totalQrCodes * 100)}%` : "—",
                    color: "text-gray-700",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm mb-1">{label}</p>
                    <p className={`text-3xl font-bold ${color}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400">Loading...</div>
            )}
          </div>
        )}

        {/* Generate QR */}
        {tab === "generate" && (
          <div className="max-w-md">
            <h2 className="text-3xl text-[#111111] mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>Generate Receipt QR</h2>
            <p className="text-gray-500 text-sm mb-6">Enter the customer&apos;s spend amount to generate a QR code for their receipt.</p>
            <form onSubmit={generateQr} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1">Spend Amount (£)</label>
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
                {spendAmount && !isNaN(parseFloat(spendAmount)) && (
                  <p className="text-xs text-gray-400 mt-1">
                    This will award {Math.floor(parseFloat(spendAmount))} points
                  </p>
                )}
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
                <p className="text-sm text-gray-500 mb-1">QR Code — £{parseFloat(String(generatedQr.spendAmount)).toFixed(2)} spend</p>
                <p className="text-xs text-gray-400 mb-4">{generatedQr.pointsValue} points to be awarded</p>
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

        {/* Customers */}
        {tab === "customers" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <h2 className="text-3xl text-[#111111]" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
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
                      {["Email", "Points", "Total Spent", "Joined"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No customers found</td>
                      </tr>
                    ) : (
                      customers.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-[#111111]">{c.email}</td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-[#FFD700]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}>
                              {c.points || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">£{parseFloat(String(c.total_spent || 0)).toFixed(2)}</td>
                          <td className="px-4 py-3 text-gray-400">
                            {new Date(c.created_at).toLocaleDateString("en-GB")}
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

        {/* QR Codes */}
        {tab === "qrcodes" && (
          <div>
            <h2 className="text-3xl text-[#111111] mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>QR Codes</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#111111] text-gray-300">
                    <tr>
                      {["Code", "Spend", "Points", "Status", "Claimed By", "Date"].map((h) => (
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
                          <td className="px-4 py-3 font-semibold text-[#111111]">£{parseFloat(String(q.spend_amount)).toFixed(2)}</td>
                          <td className="px-4 py-3 text-gray-600">{q.points_value} pts</td>
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

        {/* Adjust Points */}
        {tab === "adjust" && (
          <div className="max-w-md">
            <h2 className="text-3xl text-[#111111] mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>Adjust Points</h2>
            <p className="text-gray-500 text-sm mb-6">Manually add or remove points from a customer account. Use negative numbers to deduct.</p>
            <form onSubmit={adjustPointsSubmit} className="space-y-4">
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
                <label className="block text-sm font-semibold text-[#111111] mb-1">Points to Add / Remove</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10 or -5"
                  value={adjustPoints}
                  onChange={(e) => setAdjustPoints(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1">Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goodwill gesture, Error correction"
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
                adjustResult.startsWith("Done") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {adjustResult}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
