import { MetadataRoute } from "next";

const BASE_URL = "https://chessio.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app/", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
