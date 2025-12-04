import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Parse the Prisma Postgres URL to get the underlying PostgreSQL connection
function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  // For Prisma Postgres URLs (prisma+postgres://), use the adapter
  if (databaseUrl.startsWith("prisma+postgres://")) {
    // Extract the API key which contains the actual database URL
    try {
      const url = new URL(databaseUrl);
      const apiKey = url.searchParams.get("api_key");
      if (apiKey) {
        const decoded = JSON.parse(Buffer.from(apiKey, "base64").toString());
        const pool = new Pool({ connectionString: decoded.databaseUrl });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
      }
    } catch {
      // Fall through to accelerateUrl approach
    }
    
    // Use accelerateUrl for Prisma Postgres
    return new PrismaClient({
      accelerateUrl: databaseUrl,
    });
  }
  
  // For standard PostgreSQL URLs, use direct connection
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
