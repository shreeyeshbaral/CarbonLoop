import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "375px",     // Small phones (iPhone SE, compact devices)
      sm: "640px",     // Large phones & small tablets
      md: "768px",     // iPad / Tablets portrait
      lg: "1024px",    // Tablets landscape & laptops
      xl: "1280px",    // Standard desktop screens
      "2xl": "1536px", // Wide enterprise monitors
    },
    extend: {
      colors: {
        canvas: "#F7F4EC",       // Primary warm coffee-white background
        surface: "#FFFDF8",      // Crisp elevated card background
        surfaceSubtle: "#EFE9DD",// Slightly deeper container background
        border: "#DCD8CC",       // Subtle warm border color
        ink: {
          DEFAULT: "#18201B",    // Primary charcoal text
          muted: "#6B716B",      // Secondary muted body/captions
          subtle: "#9BA19B",     // Faint labels/dividers
        },
        forest: {
          DEFAULT: "#176B3A",    // Primary green
          dark: "#0F4D28",
          hover: "#13572E",
          light: "#E4F3E8",      // Soft green background badge
        },
        leaf: {
          DEFAULT: "#2E9B59",    // Secondary vibrant green
          light: "#EAF7EE",
        },
        amber: {
          DEFAULT: "#E98A3A",    // Shortage / In-transit alert / warning
          hover: "#D67B2F",
          light: "#FDF2E8",
        },
        crimson: {
          DEFAULT: "#C84B31",    // Urgent shortage / Rejection / Action needed
          light: "#FBECE9",
        },
        sand: {
          DEFAULT: "#D8D2C2",
          light: "#F5F1E9",
        }
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(24, 32, 27, 0.04), 0 1px 2px -1px rgba(24, 32, 27, 0.04)",
        elevated: "0 4px 12px 0 rgba(24, 32, 27, 0.06), 0 2px 4px -2px rgba(24, 32, 27, 0.04)",
        hover: "0 8px 24px -4px rgba(23, 107, 58, 0.08), 0 4px 8px -2px rgba(24, 32, 27, 0.04)",
      },
      borderRadius: {
        card: "14px",
        badge: "8px",
      }
    },
  },
  plugins: [],
};

export default config;
