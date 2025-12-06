import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });
        
        if (!user || !user.passwordHash) {
          return null;
        }
        
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && user.email) {
        try {
          const profileName = profile?.name as string | undefined;
          const profileImage = profile?.image as string | undefined;

          // Upsert minimal fields to avoid schema mismatch on prod DB
          await db.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name || profileName || user.email,
              image: user.image || profileImage || null,
            },
            create: {
              email: user.email,
              name: user.name || profileName || user.email,
              image: user.image || profileImage || null,
            },
          });
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.email) token.email = user.email;
      if (user?.id) token.id = user.id;

      if (account?.provider === "github" && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: { id: true, email: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        if (token.email) session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

/**
 * Hash a password for storage
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
