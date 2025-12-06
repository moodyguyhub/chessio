import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { ChessioLogo } from "@/components/brand/ChessioLogo";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Only allow logged-in users
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  // Check if user is admin
  const user = await db.user.findUnique({ 
    where: { id: session.user.id }, 
    select: { role: true, email: true } 
  });
  
  if (user?.role !== 'ADMIN') {
    redirect('/app'); // Redirect non-admins to dashboard
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-slate-900/50 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <ChessioLogo variant="horizontal" className="h-8" />
          <p className="text-xs text-slate-500 mt-2">Admin Control Room</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/seo"
            className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            🔍 SEO & Keywords
          </Link>
          <Link
            href="/admin/content"
            className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            📝 Content Ideas
          </Link>
          <Link
            href="/admin/ai"
            className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            🤖 AI Workbench
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="mb-3 text-xs text-slate-500">
            Signed in as <span className="text-slate-400">{user.email}</span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/app"
              className="flex-1 px-3 py-2 text-xs text-center text-slate-400 hover:text-white border border-white/10 rounded-lg transition-colors"
            >
              Back to App
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
              className="flex-1"
            >
              <button
                type="submit"
                className="w-full px-3 py-2 text-xs text-slate-400 hover:text-white border border-white/10 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
