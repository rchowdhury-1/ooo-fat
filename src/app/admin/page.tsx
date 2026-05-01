"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ── Types ── */
interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  price: number;
  price_label: string;
  description: string;
  visible: boolean;
  position: number;
}

interface Category {
  id: string;
  name: string;
  emoji: string;
  note: string;
  visible: boolean;
  items: MenuItem[];
}

interface Toast {
  id: number;
  msg: string;
  type: "success" | "error";
}

/* ── Price display helper ── */
function fmtPrice(item: MenuItem) {
  if (item.price_label) return item.price_label;
  return `£${Number(item.price).toFixed(2)}`;
}

/* ── Toast component ── */
function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl text-sm font-semibold shadow-lg ${
            t.type === "success"
              ? "bg-[#E8B84B] text-[#0D0D0D]"
              : "bg-red-500 text-white"
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ── Main page ── */
export default function AdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Edit item state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemForm, setEditItemForm] = useState({ name: "", price: "", price_label: "" });

  // Delete confirmation state
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // Add item form per category
  const [addingToCatId, setAddingToCatId] = useState<string | null>(null);
  const [newItemForm, setNewItemForm] = useState({ name: "", price: "", description: "", price_label: "" });

  // Edit category state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatEmoji, setEditCatEmoji] = useState("");

  // Add category state
  const [addingCat, setAddingCat] = useState(false);
  const [newCatForm, setNewCatForm] = useState({ name: "", emoji: "" });

  /* ── Toast helper ── */
  const toast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  /* ── Fetch menu ── */
  async function fetchMenu() {
    try {
      const res = await fetch("/api/admin/menu");
      if (!res.ok) throw new Error();
      setCategories(await res.json());
    } catch {
      toast("Failed to load menu", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMenu(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Logout ── */
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  /* ── Toggle item visibility ── */
  async function toggleItem(item: MenuItem) {
    const res = await fetch(`/api/admin/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !item.visible }),
    });
    if (res.ok) {
      setCategories((cats) =>
        cats.map((c) => ({
          ...c,
          items: c.items.map((i) =>
            i.id === item.id ? { ...i, visible: !item.visible } : i
          ),
        }))
      );
    } else {
      toast("Failed to update", "error");
    }
  }

  /* ── Start editing item ── */
  function startEditItem(item: MenuItem) {
    setEditingItemId(item.id);
    setEditItemForm({
      name: item.name,
      price: item.price_label ? "" : String(item.price),
      price_label: item.price_label,
    });
    setDeletingItemId(null);
  }

  /* ── Save edited item ── */
  async function saveEditItem(item: MenuItem) {
    const body: Record<string, string | number> = { name: editItemForm.name };
    if (editItemForm.price_label) {
      body.price_label = editItemForm.price_label;
    } else {
      body.price = parseFloat(editItemForm.price) || 0;
      body.price_label = "";
    }

    const res = await fetch(`/api/admin/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const updated = await res.json();
      setCategories((cats) =>
        cats.map((c) => ({
          ...c,
          items: c.items.map((i) => (i.id === item.id ? { ...i, ...updated } : i)),
        }))
      );
      setEditingItemId(null);
      toast("Saved");
    } else {
      toast("Failed to save", "error");
    }
  }

  /* ── Delete item ── */
  async function deleteItem(item: MenuItem) {
    const res = await fetch(`/api/admin/items/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((cats) =>
        cats.map((c) => ({ ...c, items: c.items.filter((i) => i.id !== item.id) }))
      );
      setDeletingItemId(null);
      toast("Deleted");
    } else {
      toast("Failed to delete", "error");
    }
  }

  /* ── Add item ── */
  async function addItem(catId: string) {
    if (!newItemForm.name) return;
    const body = {
      category_id: catId,
      name: newItemForm.name,
      price: parseFloat(newItemForm.price) || 0,
      description: newItemForm.description,
      price_label: newItemForm.price_label,
    };
    const res = await fetch("/api/admin/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const created = await res.json();
      setCategories((cats) =>
        cats.map((c) =>
          c.id === catId ? { ...c, items: [...c.items, created] } : c
        )
      );
      setAddingToCatId(null);
      setNewItemForm({ name: "", price: "", description: "", price_label: "" });
      toast("Item added");
    } else {
      toast("Failed to add item", "error");
    }
  }

  /* ── Save category name ── */
  async function saveCat(catId: string) {
    const res = await fetch(`/api/admin/categories/${catId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editCatName, emoji: editCatEmoji }),
    });
    if (res.ok) {
      setCategories((cats) =>
        cats.map((c) =>
          c.id === catId ? { ...c, name: editCatName, emoji: editCatEmoji } : c
        )
      );
      setEditingCatId(null);
      toast("Category saved");
    } else {
      toast("Failed to save category", "error");
    }
  }

  /* ── Toggle category visibility ── */
  async function toggleCat(cat: Category) {
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !cat.visible }),
    });
    if (res.ok) {
      setCategories((cats) =>
        cats.map((c) => (c.id === cat.id ? { ...c, visible: !cat.visible } : c))
      );
    } else {
      toast("Failed to update", "error");
    }
  }

  /* ── Add category ── */
  async function addCategory() {
    if (!newCatForm.name) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCatForm),
    });
    if (res.ok) {
      const created = await res.json();
      setCategories((cats) => [...cats, created]);
      setAddingCat(false);
      setNewCatForm({ name: "", emoji: "" });
      toast("Category added");
    } else {
      toast("Failed to add category", "error");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <p className="text-[#9A9A8A] text-sm tracking-widest uppercase">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <Toasts toasts={toasts} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur border-b border-[#E8B84B]/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p
              className="text-[#E8B84B] text-xl leading-none"
              style={{ fontFamily: "var(--font-permanent-marker), cursive" }}
            >
              Ooo..FAT! Admin
            </p>
            <p className="text-[#9A9A8A] text-[10px] tracking-widest uppercase mt-0.5">
              Menu Management
            </p>
          </div>
          <button
            onClick={logout}
            className="text-[#9A9A8A] hover:text-[#F5F5F0] text-xs font-bold tracking-widest uppercase transition-colors px-3 py-2"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">
        {categories.map((cat) => (
          <section key={cat.id} className="mb-8">
            {/* Category header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E8B84B]/20">
              {editingCatId === cat.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    value={editCatEmoji}
                    onChange={(e) => setEditCatEmoji(e.target.value)}
                    className="w-12 bg-[#1A1A1A] border border-[#E8B84B]/30 rounded-lg px-2 py-1 text-center text-base"
                    placeholder="🍔"
                  />
                  <input
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveCat(cat.id)}
                    className="flex-1 bg-[#1A1A1A] border border-[#E8B84B]/30 rounded-lg px-3 py-1 text-[#F5F5F0] text-sm font-bold focus:outline-none focus:border-[#E8B84B]"
                    autoFocus
                  />
                  <button
                    onClick={() => saveCat(cat.id)}
                    className="text-[#E8B84B] text-xs font-bold px-3 py-1 hover:text-[#C9A235]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCatId(null)}
                    className="text-[#9A9A8A] text-xs px-2 py-1 hover:text-[#F5F5F0]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-base">{cat.emoji}</span>
                  <h2
                    className={`font-black text-sm uppercase tracking-wide flex-1 ${
                      cat.visible ? "text-[#E8B84B]" : "text-[#9A9A8A] line-through"
                    }`}
                    style={{ fontFamily: "var(--font-archivo), sans-serif" }}
                  >
                    {cat.name}
                  </h2>
                  <button
                    onClick={() => {
                      setEditingCatId(cat.id);
                      setEditCatName(cat.name);
                      setEditCatEmoji(cat.emoji);
                    }}
                    className="text-[#9A9A8A] hover:text-[#E8B84B] text-xs px-2 py-1 transition-colors"
                    title="Edit category"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleCat(cat)}
                    className={`text-xs px-2 py-1 transition-colors ${
                      cat.visible
                        ? "text-[#9A9A8A] hover:text-[#F5F5F0]"
                        : "text-[#E8B84B] hover:text-[#C9A235]"
                    }`}
                    title={cat.visible ? "Hide category" : "Show category"}
                  >
                    {cat.visible ? "Hide" : "Show"}
                  </button>
                </>
              )}
            </div>

            {/* Items */}
            <div className="space-y-1">
              {cat.items.map((item) => (
                <div key={item.id}>
                  {editingItemId === item.id ? (
                    /* Edit row */
                    <div className="bg-[#1A1A1A] rounded-xl p-3 border border-[#E8B84B]/30">
                      <div className="flex gap-2 mb-2">
                        <input
                          value={editItemForm.name}
                          onChange={(e) =>
                            setEditItemForm((f) => ({ ...f, name: e.target.value }))
                          }
                          placeholder="Item name"
                          className="flex-1 bg-[#0D0D0D] border border-[#E8B84B]/20 rounded-lg px-3 py-2 text-[#F5F5F0] text-sm focus:outline-none focus:border-[#E8B84B]/60"
                        />
                        <input
                          value={editItemForm.price_label || editItemForm.price}
                          onChange={(e) => {
                            const val = e.target.value;
                            const isCustom = val.includes("£") || val === "Free" || val.startsWith("+");
                            setEditItemForm((f) => ({
                              ...f,
                              price_label: isCustom ? val : "",
                              price: isCustom ? f.price : val,
                            }));
                          }}
                          placeholder="Price (e.g. 5.00 or +£1.00)"
                          className="w-36 bg-[#0D0D0D] border border-[#E8B84B]/20 rounded-lg px-3 py-2 text-[#F5F5F0] text-sm focus:outline-none focus:border-[#E8B84B]/60"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => saveEditItem(item)}
                          className="bg-[#E8B84B] text-[#0D0D0D] text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-[#C9A235] transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingItemId(null)}
                          className="text-[#9A9A8A] text-xs px-4 py-2 hover:text-[#F5F5F0] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : deletingItemId === item.id ? (
                    /* Delete confirm row */
                    <div className="bg-[#1A1A1A] rounded-xl p-3 border border-red-500/30 flex items-center justify-between">
                      <p className="text-[#F5F5F0] text-sm">
                        Delete <span className="font-bold">{item.name}</span>?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteItem(item)}
                          className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeletingItemId(null)}
                          className="text-[#9A9A8A] text-xs px-3 py-2 hover:text-[#F5F5F0] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal row */
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1A1A1A] transition-colors ${
                        !item.visible ? "opacity-40" : ""
                      }`}
                    >
                      <span className="flex-1 text-[#F5F5F0] text-sm">{item.name}</span>
                      <span className="text-[#E8B84B] text-sm font-bold shrink-0 w-20 text-right">
                        {fmtPrice(item)}
                      </span>

                      {/* Visible toggle */}
                      <button
                        onClick={() => toggleItem(item)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                          item.visible ? "bg-[#E8B84B]" : "bg-[#333]"
                        }`}
                        title={item.visible ? "Hide item" : "Show item"}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                            item.visible ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => startEditItem(item)}
                        className="text-[#9A9A8A] hover:text-[#E8B84B] text-xs px-2 py-1 transition-colors shrink-0"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeletingItemId(item.id);
                          setEditingItemId(null);
                        }}
                        className="text-[#9A9A8A] hover:text-red-400 text-xs px-2 py-1 transition-colors shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add item */}
            {addingToCatId === cat.id ? (
              <div className="mt-2 bg-[#1A1A1A] rounded-xl p-3 border border-[#E8B84B]/20">
                <div className="flex gap-2 mb-2">
                  <input
                    value={newItemForm.name}
                    onChange={(e) => setNewItemForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Item name *"
                    autoFocus
                    className="flex-1 bg-[#0D0D0D] border border-[#E8B84B]/20 rounded-lg px-3 py-2 text-[#F5F5F0] text-sm focus:outline-none focus:border-[#E8B84B]/60"
                  />
                  <input
                    value={newItemForm.price_label || newItemForm.price}
                    onChange={(e) => {
                      const val = e.target.value;
                      const isCustom = val.includes("£") || val === "Free" || val.startsWith("+");
                      setNewItemForm((f) => ({
                        ...f,
                        price_label: isCustom ? val : "",
                        price: isCustom ? f.price : val,
                      }));
                    }}
                    placeholder="Price (e.g. 5.00)"
                    className="w-36 bg-[#0D0D0D] border border-[#E8B84B]/20 rounded-lg px-3 py-2 text-[#F5F5F0] text-sm focus:outline-none focus:border-[#E8B84B]/60"
                  />
                </div>
                <input
                  value={newItemForm.description}
                  onChange={(e) => setNewItemForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Description (optional)"
                  className="w-full bg-[#0D0D0D] border border-[#E8B84B]/20 rounded-lg px-3 py-2 text-[#F5F5F0] text-sm focus:outline-none focus:border-[#E8B84B]/60 mb-2"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => addItem(cat.id)}
                    disabled={!newItemForm.name}
                    className="bg-[#E8B84B] text-[#0D0D0D] text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-[#C9A235] transition-colors disabled:opacity-50"
                  >
                    Add Item
                  </button>
                  <button
                    onClick={() => {
                      setAddingToCatId(null);
                      setNewItemForm({ name: "", price: "", description: "", price_label: "" });
                    }}
                    className="text-[#9A9A8A] text-xs px-4 py-2 hover:text-[#F5F5F0] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAddingToCatId(cat.id);
                  setEditingItemId(null);
                  setDeletingItemId(null);
                }}
                className="mt-2 w-full text-left text-[#9A9A8A] hover:text-[#E8B84B] text-xs font-bold tracking-widest uppercase px-3 py-2 rounded-xl hover:bg-[#1A1A1A] transition-all"
              >
                + Add Item
              </button>
            )}
          </section>
        ))}

        {/* Add category */}
        <div className="mt-4 pt-4 border-t border-[#E8B84B]/10">
          {addingCat ? (
            <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#E8B84B]/20">
              <p className="text-[#E8B84B] text-xs font-bold tracking-widest uppercase mb-3">
                New Category
              </p>
              <div className="flex gap-2 mb-3">
                <input
                  value={newCatForm.emoji}
                  onChange={(e) => setNewCatForm((f) => ({ ...f, emoji: e.target.value }))}
                  placeholder="🍔"
                  className="w-12 bg-[#0D0D0D] border border-[#E8B84B]/20 rounded-lg px-2 py-2 text-center text-base focus:outline-none focus:border-[#E8B84B]/60"
                />
                <input
                  value={newCatForm.name}
                  onChange={(e) => setNewCatForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Category name *"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && addCategory()}
                  className="flex-1 bg-[#0D0D0D] border border-[#E8B84B]/20 rounded-lg px-3 py-2 text-[#F5F5F0] text-sm focus:outline-none focus:border-[#E8B84B]/60"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={addCategory}
                  disabled={!newCatForm.name}
                  className="bg-[#E8B84B] text-[#0D0D0D] text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-[#C9A235] transition-colors disabled:opacity-50"
                >
                  Add Category
                </button>
                <button
                  onClick={() => {
                    setAddingCat(false);
                    setNewCatForm({ name: "", emoji: "" });
                  }}
                  className="text-[#9A9A8A] text-xs px-4 py-2 hover:text-[#F5F5F0] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingCat(true)}
              className="w-full text-center text-[#9A9A8A] hover:text-[#E8B84B] text-xs font-bold tracking-widest uppercase py-3 rounded-xl border border-dashed border-[#E8B84B]/20 hover:border-[#E8B84B]/40 transition-all"
            >
              + Add Category
            </button>
          )}
        </div>
      </main>
    </>
  );
}
