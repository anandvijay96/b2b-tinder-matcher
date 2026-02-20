/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Background Colors
        bgBase: "#F8FAFC",
        bgSurface: "#FFFFFF",
        bgSurfaceSecondary: "#F1F5F9",

        // Primary Colors (Professional B2B blue)
        primary: {
          DEFAULT: "#1E3A5F",
          light: "#E8EFF7",
          dark: "#142942",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#1E3A5F",
          700: "#142942",
        },

        // Accent (Teal — differentiation, trust)
        accent: {
          DEFAULT: "#0D9488",
          light: "#CCFBF1",
          dark: "#0F766E",
        },

        // Semantic Colors
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",

        // Text Colors
        textPrimary: "#0F172A",
        textSecondary: "#475569",
        textMuted: "#94A3B8",
        textInverse: "#FFFFFF",

        // Border
        borderLight: "#E2E8F0",
        borderMedium: "#CBD5E1",

        // Match-specific
        matchGold: "#F59E0B",
        swipeRight: "#22C55E",
        swipeLeft: "#EF4444",
        superLike: "#3B82F6",
      },
      fontFamily: {
        sans: ["System"],
      },
      fontSize: {
        heading1: ["28px", { lineHeight: "36px", fontWeight: "700" }],
        heading2: ["22px", { lineHeight: "30px", fontWeight: "600" }],
        heading3: ["18px", { lineHeight: "26px", fontWeight: "600" }],
        body: ["15px", { lineHeight: "22px", fontWeight: "400" }],
        bodyMedium: ["15px", { lineHeight: "22px", fontWeight: "500" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "400" }],
        captionMedium: ["13px", { lineHeight: "18px", fontWeight: "500" }],
        small: ["11px", { lineHeight: "14px", fontWeight: "400" }],
      },
      spacing: {
        "4.5": "18px",
        "13": "52px",
        "15": "60px",
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06)",
        elevated: "0 4px 16px rgba(0,0,0,0.10)",
        swipeCard: "0 8px 32px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
