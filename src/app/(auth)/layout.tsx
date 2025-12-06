import type { Metadata } from "next";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function generateMetadata(): Promise<Metadata> {
  // Default metadata
  const defaultMeta = {
    title: "Sign In – Chessio",
    description: "Sign in to continue your chess learning journey."
  };

  try {
    // Use login page SEO for the entire auth group
    const seo = await db.seoPage.findUnique({ where: { slug: "login" } });
    
    if (!seo) {
      return defaultMeta;
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
  } catch (error) {
    // Table doesn't exist yet (before migration) - use defaults
    return defaultMeta;
  }
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
