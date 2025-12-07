import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        chessio: {
          // light mode (can mostly stay as is)
          bg: "#f8fafc",
          card: "#ffffff",
          text: "#0f172a",

          // 🌙 dark mode – updated to match hero
          // page background = classy warm black
          "bg-dark": "#050814",

          // main surfaces/panels (dashboard cards, lesson shells)
          "surface-dark": "#090f1f",

          // slightly brighter cards (modals, floating panels)
          "card-dark": "#111827",

          // primary brand = golden yellow (like hero CTA)
          primary: "#facc15",
          "primary-dark": "#eab308",

          // text on dark – a bit warmer & brighter
          "text-dark": "#f9fafb",

          muted: "#6b7280",
          "muted-dark": "#9ca3af",

          border: "#e2e8f0",
          "border-dark": "#1f2933",

          success: "#22c55e",
          danger: "#dc2626",
          warning: "#f97316",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
