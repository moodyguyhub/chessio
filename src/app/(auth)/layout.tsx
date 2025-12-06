import type { Metadata } from "next";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function generateMetadata(): Promise<Metadata> {
  // Use login page SEO for the entire auth group
  const seo = await db.seoPage.findUnique({ where: { slug: "login" } });
  
  if (!seo) {
    return {
      title: "Sign In – Chessio",
      description: "Sign in to continue your chess learning journey."
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
    },
    twitter: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
    }
  };
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
