"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "Login failed.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-lg border border-white/15 bg-white/[0.075] p-6 shadow-2xl backdrop-blur"
        >
          <div className="mb-6">
            <Link href="/" className="logo mb-6">
              <span className="logo-mark">E</span>
              <span>EasySub</span>
            </Link>
            <h1 className="text-2xl font-black tracking-normal text-white">Admin Login</h1>
          </div>

          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-bold text-slate-200">Email</span>
            <input
              className="h-12 w-full rounded-lg border border-white/15 bg-slate-950/50 px-3 text-white outline-none ring-0 transition focus:border-gold"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="mb-5 block">
            <span className="mb-2 block text-sm font-bold text-slate-200">Password</span>
            <input
              className="h-12 w-full rounded-lg border border-white/15 bg-slate-950/50 px-3 text-white outline-none ring-0 transition focus:border-gold"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? (
            <p className="mb-4 rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 font-black text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={18} aria-hidden="true" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
