"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ChessioLogo } from "@/components/brand/ChessioLogo";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for lesson/puzzle pages.
 * Shows friendly message with retry and escape options.
 */
export default function LessonError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error for debugging (will be visible in Vercel logs)
    console.error("[LessonError]", error.message, error.digest);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col bg-chessio-bg dark:bg-chessio-bg-dark">
      {/* Header */}
      <header className="bg-chessio-card dark:bg-chessio-card-dark border-b border-chessio-border dark:border-chessio-border-dark">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <ChessioLogo variant="horizontal" className="h-8" />
        </div>
      </header>

      {/* Error Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-lg flex items-center">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4 py-8">
              <div className="text-5xl mb-4">😕</div>
              <h3 className="text-xl font-bold text-chessio-text dark:text-chessio-text-dark">
                Something went wrong
              </h3>
              <p className="text-chessio-muted dark:text-chessio-muted-dark">
                We couldn&apos;t load this lesson. This might be a temporary issue.
              </p>
              
              <div className="flex flex-col gap-3 pt-4">
                <Button variant="primary" size="lg" onClick={reset} className="w-full">
                  Try Again
                </Button>
                <Link href="/app" className="w-full">
                  <Button variant="ghost" className="w-full">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>

              {/* Debug info (only in dev) */}
              {process.env.NODE_ENV === "development" && (
                <details className="mt-6 text-left">
                  <summary className="text-xs text-slate-400 cursor-pointer">
                    Error details (dev only)
                  </summary>
                  <pre className="mt-2 p-2 bg-slate-100 dark:bg-slate-900 rounded text-xs overflow-auto">
                    {error.message}
                  </pre>
                </details>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
