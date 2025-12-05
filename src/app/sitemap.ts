import { MetadataRoute } from "next";
import { allLessons } from "@/lib/lessons";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://chessio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Lesson pages
  const lessonPages: MetadataRoute.Sitemap = allLessons.map((lesson) => ({
    url: `${BASE_URL}/lessons/${lesson.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...lessonPages];
}
