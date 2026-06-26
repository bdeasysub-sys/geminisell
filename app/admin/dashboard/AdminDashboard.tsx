"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Download,
  Loader2,
  LogOut,
  Mail,
  PackageCheck,
  PackageOpen,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  Upload
} from "lucide-react";

type Summary = {
  availableLinks: number;
  soldLinks: number;
  totalOrders: number;
};

type LinkItem = {
  id: number;
  link: string;
  status: "available" | "sold";
  assignedTo: string | null;
  paymentId: string | null;
  assignedAt: string | null;
  createdAt: string;
};

type OrderItem = {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  paymentId: string;
  linkId: number;
  assignedLink: string;
  createdAt: string;
};

type Tab = "available" | "sold" | "orders";

type ApiErrorPayload = {
  error?: {
    message?: string;
  };
};

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("available");
  const [summary, setSummary] = useState<Summary>({
    availableLinks: 0,
    soldLinks: 0,
    totalOrders: 0
  });
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [linkQuery, setLinkQuery] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [newLink, setNewLink] = useState("");
  const [bulkCsv, setBulkCsv] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const visibleLinkStatus = activeTab === "available" ? "available" : "sold";

  const loadSummary = useCallback(async () => {
    const payload = await requestJson<{ summary: Summary }>("/api/admin/summary");
    setSummary(payload.summary);
  }, []);

  const loadLinks = useCallback(async () => {
    const params = new URLSearchParams({
      status: visibleLinkStatus,
      q: linkQuery,
      limit: "50"
    });
    const payload = await requestJson<{ links: LinkItem[] }>(`/api/admin/links?${params}`);
    setLinks(payload.links);
  }, [linkQuery, visibleLinkStatus]);

  const loadOrders = useCallback(async () => {
    const params = new URLSearchParams({
      search: orderSearch,
      limit: "50"
    });
    const payload = await requestJson<{ orders: OrderItem[] }>(`/api/admin/orders?${params}`);
    setOrders(payload.orders);
  }, [orderSearch]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await loadSummary();

      if (activeTab === "orders") {
        await loadOrders();
      } else {
        await loadLinks();
      }
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Unable to refresh dashboard.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, loadLinks, loadOrders, loadSummary]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const tabCounts = useMemo(
    () => ({
      available: summary.availableLinks,
      sold: summary.soldLinks,
      orders: summary.totalOrders
    }),
    [summary]
  );

  async function handleAddLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await requestJson("/api/admin/links", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ link: newLink })
      });
      setNewLink("");
      setMessage("Link added.");
      await refresh();
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "Unable to add link.");
    } finally {
      setSaving(false);
    }
  }

  async function handleBulkUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = await requestJson<{ uploaded: number; skipped: number }>("/api/admin/links/bulk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ csv: bulkCsv })
      });
      setBulkCsv("");
      setMessage(`Uploaded ${payload.uploaded} links. Skipped ${payload.skipped} duplicates.`);
      await refresh();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload CSV.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCsvFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBulkCsv(await file.text());
  }

  async function handleDeleteLink(id: number) {
    if (!window.confirm("Delete this available link?")) return;
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await requestJson(`/api/admin/links/${id}`, { method: "DELETE" });
      setMessage("Link deleted.");
      await refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete link.");
    } finally {
      setSaving(false);
    }
  }

  async function handleResendEmail(id: number) {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await requestJson(`/api/admin/orders/${id}/resend-email`, { method: "POST" });
      setMessage("Email sent.");
    } catch (emailError) {
      setError(emailError instanceof Error ? emailError.message : "Unable to resend email.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen px-4 py-6 text-slate-100">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="logo mb-3">
              <span className="logo-mark">E</span>
              <span>EasySub</span>
            </Link>
            <h1 className="text-3xl font-black tracking-normal text-white">Link Pool Management</h1>
            <p className="mt-1 text-sm text-slate-400">{adminEmail}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={refresh}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              <LogOut size={16} aria-hidden="true" />
              Logout
            </button>
          </div>
        </header>

        <section className="mb-5 grid gap-3 md:grid-cols-3">
          <Metric title="Available Links" value={summary.availableLinks} icon={<PackageOpen size={18} />} />
          <Metric title="Sold Links" value={summary.soldLinks} icon={<PackageCheck size={18} />} />
          <Metric title="Orders" value={summary.totalOrders} icon={<Mail size={18} />} />
        </section>

        <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <form
            onSubmit={handleAddLink}
            className="rounded-lg border border-white/15 bg-white/[0.075] p-4 backdrop-blur"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-200">Add Link</span>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={newLink}
                  onChange={(event) => setNewLink(event.target.value)}
                  className="h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-slate-950/50 px-3 text-sm text-white outline-none transition focus:border-gold"
                  placeholder="https://..."
                  required
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gold px-4 text-sm font-black text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={16} aria-hidden="true" />
                  Add
                </button>
              </div>
            </label>
          </form>

          <form
            onSubmit={handleBulkUpload}
            className="rounded-lg border border-white/15 bg-white/[0.075] p-4 backdrop-blur"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-sm font-bold text-slate-200" htmlFor="bulk-csv">
                Bulk Upload CSV
              </label>
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white/15">
                <Upload size={14} aria-hidden="true" />
                Choose CSV
                <input className="sr-only" type="file" accept=".csv,text/csv" onChange={handleCsvFile} />
              </label>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <textarea
                id="bulk-csv"
                value={bulkCsv}
                onChange={(event) => setBulkCsv(event.target.value)}
                className="min-h-11 min-w-0 flex-1 resize-y rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2 text-sm text-white outline-none transition focus:border-gold"
                placeholder="link"
                required
              />
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gold px-4 text-sm font-black text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload size={16} aria-hidden="true" />
                Upload
              </button>
            </div>
          </form>
        </section>

        {message ? (
          <p className="mb-4 rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mb-4 rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
            {error}
          </p>
        ) : null}

        <section className="rounded-lg border border-white/15 bg-white/[0.075] backdrop-blur">
          <div className="flex flex-col gap-3 border-b border-white/10 p-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["available", "sold", "orders"] as Tab[]).map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`h-10 rounded-lg px-3 text-sm font-black transition ${
                    activeTab === tab
                      ? "bg-gold text-ink"
                      : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  {tabLabel(tab)} ({tabCounts[tab]})
                </button>
              ))}
            </div>

            {activeTab === "orders" ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <SearchBox
                  value={orderSearch}
                  onChange={setOrderSearch}
                  onSubmit={loadOrders}
                  placeholder="Search customer"
                />
                <a
                  href="/api/admin/orders/export"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <Download size={16} aria-hidden="true" />
                  Export CSV
                </a>
              </div>
            ) : (
              <SearchBox
                value={linkQuery}
                onChange={setLinkQuery}
                onSubmit={loadLinks}
                placeholder="Search links"
              />
            )}
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center text-slate-300">
              <Loader2 className="animate-spin" size={24} aria-hidden="true" />
            </div>
          ) : activeTab === "orders" ? (
            <OrdersTable orders={orders} onResend={handleResendEmail} saving={saving} />
          ) : (
            <LinksTable links={links} onDelete={handleDeleteLink} canDelete={activeTab === "available"} />
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <article className="rounded-lg border border-white/15 bg-white/[0.075] p-4 backdrop-blur">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sky-300/30 bg-sky-500/15 text-sky-100">
        {icon}
      </div>
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <p className="text-3xl font-black text-white">{value}</p>
    </article>
  );
}

function SearchBox({
  value,
  onChange,
  onSubmit,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
      className="flex min-w-0 gap-2"
    >
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 min-w-0 rounded-lg border border-white/15 bg-slate-950/50 px-3 text-sm text-white outline-none transition focus:border-gold"
        placeholder={placeholder}
      />
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-lg border border-white/15 bg-white/10 px-3 text-white transition hover:bg-white/15"
        aria-label="Search"
      >
        <Search size={16} aria-hidden="true" />
      </button>
    </form>
  );
}

function LinksTable({
  links,
  onDelete,
  canDelete
}: {
  links: LinkItem[];
  onDelete: (id: number) => void;
  canDelete: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-slate-950/40 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-3 py-3">ID</th>
            <th className="px-3 py-3">Link</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Assigned To</th>
            <th className="px-3 py-3">Payment ID</th>
            <th className="px-3 py-3">Assigned At</th>
            <th className="px-3 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id} className="border-t border-white/10 align-top">
              <td className="px-3 py-3 text-slate-300">{link.id}</td>
              <td className="max-w-[380px] px-3 py-3">
                <a className="break-all text-sky-200 hover:text-sky-100" href={link.link} target="_blank">
                  {link.link}
                </a>
              </td>
              <td className="px-3 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-black ${
                    link.status === "available"
                      ? "bg-emerald-500/15 text-emerald-100"
                      : "bg-gold/15 text-amber-100"
                  }`}
                >
                  {link.status}
                </span>
              </td>
              <td className="px-3 py-3 text-slate-300">{link.assignedTo ?? "-"}</td>
              <td className="px-3 py-3 text-slate-300">{link.paymentId ?? "-"}</td>
              <td className="px-3 py-3 text-slate-300">{formatDate(link.assignedAt)}</td>
              <td className="px-3 py-3 text-right">
                {canDelete ? (
                  <button
                    type="button"
                    onClick={() => onDelete(link.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-300/30 bg-rose-500/10 text-rose-100 transition hover:bg-rose-500/20"
                    aria-label="Delete link"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                ) : (
                  <span className="text-slate-500">-</span>
                )}
              </td>
            </tr>
          ))}
          {links.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-3 py-10 text-center text-slate-400">
                No links found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function OrdersTable({
  orders,
  onResend,
  saving
}: {
  orders: OrderItem[];
  onResend: (id: number) => void;
  saving: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1040px] text-left text-sm">
        <thead className="bg-slate-950/40 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-3 py-3">ID</th>
            <th className="px-3 py-3">Customer</th>
            <th className="px-3 py-3">Email</th>
            <th className="px-3 py-3">Phone</th>
            <th className="px-3 py-3">Payment ID</th>
            <th className="px-3 py-3">Assigned Link</th>
            <th className="px-3 py-3">Purchase Time</th>
            <th className="px-3 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-white/10 align-top">
              <td className="px-3 py-3 text-slate-300">{order.id}</td>
              <td className="px-3 py-3 font-bold text-white">{order.customerName}</td>
              <td className="px-3 py-3 text-slate-300">{order.email}</td>
              <td className="px-3 py-3 text-slate-300">{order.phone}</td>
              <td className="px-3 py-3 text-slate-300">{order.paymentId}</td>
              <td className="max-w-[320px] px-3 py-3">
                <a className="break-all text-sky-200 hover:text-sky-100" href={order.assignedLink} target="_blank">
                  {order.assignedLink}
                </a>
              </td>
              <td className="px-3 py-3 text-slate-300">{formatDate(order.createdAt)}</td>
              <td className="px-3 py-3 text-right">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => onResend(order.id)}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Mail size={14} aria-hidden="true" />
                  Resend
                </button>
              </td>
            </tr>
          ))}
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-10 text-center text-slate-400">
                No orders found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function tabLabel(tab: Tab) {
  if (tab === "available") return "Available";
  if (tab === "sold") return "Sold";
  return "Orders";
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

async function requestJson<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload & T;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Request failed.");
  }

  return payload as T;
}
