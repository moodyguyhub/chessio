import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { SoundProvider } from "@/lib/sound/SoundProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chessio.io"),
  title: "Chessio — Learn Chess the Fun Way",
  description: "Master chess from zero with friendly, bite-sized lessons. No pressure, just progress.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${nunito.variable} font-sans antialiased bg-chessio-bg-dark text-chessio-text-dark`}>
        <SoundProvider>
          {children}
        </SoundProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
