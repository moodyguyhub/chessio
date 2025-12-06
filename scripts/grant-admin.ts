import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL not set");

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function grantAdminToGitHubUsers() {
  console.log("🔧 Granting ADMIN role to GitHub users...\n");

  const result = await prisma.user.updateMany({
    where: {
      accounts: {
        some: {
          provider: "github"
        }
      }
    },
    data: {
      role: "ADMIN"
    }
  });

  console.log(`✅ Updated ${result.count} user(s) to ADMIN role`);
  
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true, name: true, role: true }
  });
  
  console.log("\n👑 Current admins:");
  admins.forEach(admin => {
    console.log(`  - ${admin.name || admin.email} (${admin.email})`);
  });
  
  await prisma.$disconnect();
}

grantAdminToGitHubUsers().catch(console.error);
