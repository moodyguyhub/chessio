"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChessioLogo } from "@/components/brand/ChessioLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Registration successful, redirect to login
      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <ChessioLogo variant="horizontal" className="h-8 w-auto" />
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-50">
            Create your account
          </h1>
          <p className="mt-2 text-neutral-400">
            Start your chess journey today
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-50 placeholder:text-neutral-500 focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-50 placeholder:text-neutral-500 focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-50 placeholder:text-neutral-500 focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition-colors"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-amber-300 text-neutral-950 font-semibold hover:bg-amber-200 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-amber-300 hover:text-amber-200">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
