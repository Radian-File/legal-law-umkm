import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          deep: "#0A1F44",
          ink: "#00081E",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          teal: "#1AC9E6",
          calm: "#48E1FE",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          soft: "#F3F4F5",
          elevated: "#FFFFFF",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "#198754",
          soft: "#E8F7EE",
          foreground: "#0D4A2F",
        },
        warning: {
          DEFAULT: "#F59E0B",
          soft: "#FFF3D6",
          foreground: "#7A4B00",
        },
        danger: {
          DEFAULT: "#BA1A1A",
          soft: "#FFDAD6",
          foreground: "#93000A",
        },
        surface: {
          DEFAULT: "#F8F9FA",
          low: "#F3F4F5",
          container: "#EDEEEF",
          high: "#E7E8E9",
          highest: "#E1E3E4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        ambient: "0px 4px 20px rgba(10, 31, 68, 0.04), 0px 10px 40px rgba(10, 31, 68, 0.08)",
        subtle: "0px 8px 24px rgba(10, 31, 68, 0.06)",
      },
      backgroundImage: {
        "cta-gradient": "linear-gradient(135deg, #00081E 0%, #0A1F44 100%)",
      },
      letterSpacing: {
        authority: "0.05em",
        editorial: "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
