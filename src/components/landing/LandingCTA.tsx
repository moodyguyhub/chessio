"use client";

import Link from "next/link";

interface LandingCTAProps {
  isLoggedIn?: boolean;
}

export function LandingCTA({ isLoggedIn = false }: LandingCTAProps) {
  const href = isLoggedIn ? "/dashboard" : "/login?redirect=/dashboard";
  const label = isLoggedIn ? "Go to Dashboard" : "Start your first lesson";

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-medium text-neutral-950 shadow-md hover:bg-amber-200 hover:shadow-lg transition"
    >
      {label}
    </Link>
  );
}
