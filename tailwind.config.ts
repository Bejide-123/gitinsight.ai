import type { Config } from "tailwindcss";

import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // =========================
      // COLORS (Monolith Engineering Aesthetic)
      // =========================
      colors: {
        // Base Foundation
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        background: "#050505", // Deepest Black
        foreground: "#FFFFFF", // Pure White

        // Surface System (Charcoal Gray hierarchy)
        surface: {
          DEFAULT: "#121212", // Primary surface
          dim: "#0A0A0A",
          bright: "#1A1A1A",
        },

        "surface-container": {
          lowest: "#050505",
          low: "#0D0D0D",
          DEFAULT: "#121212",
          high: "#1A1A1A",
          highest: "#2A2A2A",
        },

        // Text Hierarchy
        "on-surface": {
          DEFAULT: "#FFFFFF", // 100% opacity
          variant: "rgba(255, 255, 255, 0.6)", // 60% opacity
          disabled: "rgba(255, 255, 255, 0.4)", // 40% opacity
        },

        "on-background": "#FFFFFF",

        // Borders & Outlines
        outline: {
          DEFAULT: "rgba(255, 255, 255, 0.15)", // 0.5px equivalent
          variant: "rgba(255, 255, 255, 0.10)",
          hover: "rgba(255, 255, 255, 0.20)",
        },

        // Primary (Light accent system)
        primary: {
          DEFAULT: "#FFFFFF",
          foreground: "#050505",
        },

        "primary-container": "#2A2A2A",
        "on-primary-container": "#FFFFFF",

        // Secondary (Slate accents)
        secondary: {
          DEFAULT: "#2A2A2A",
          foreground: "#FFFFFF",
        },

        "secondary-container": "#1A1A1A",
        "on-secondary-container": "rgba(255, 255, 255, 0.6)",

        // Tertiary (same as primary for monochromatic)
        tertiary: {
          DEFAULT: "#FFFFFF",
          foreground: "#050505",
        },

        // Error states
        error: {
          DEFAULT: "#FF6B6B",
          foreground: "#050505",
        },

        "error-container": "#3D0000",
        "on-error-container": "#FFB4AB",

        // Muted & Accent
        muted: {
          DEFAULT: "#1A1A1A",
          foreground: "rgba(255, 255, 255, 0.6)",
        },

        accent: {
          DEFAULT: "#2A2A2A",
          foreground: "#FFFFFF",
        },

        // Popover & Card
        popover: {
          DEFAULT: "#121212",
          foreground: "#FFFFFF",
        },

        card: {
          DEFAULT: "#121212",
          foreground: "#FFFFFF",
        },

        // Destructive
        destructive: {
          DEFAULT: "#FF6B6B",
          foreground: "#050505",
        },
      },

      // =========================
      // TYPOGRAPHY (Space Grotesk + Inter)
      // =========================
      fontFamily: {
        heading: ["var(--font-space)", "Space Grotesk", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        code: ["var(--font-space)", "Space Grotesk", "monospace"],
      },

      fontSize: {
        // Headings (Space Grotesk)
        h1: [
          "48px",
          {
            lineHeight: "1.1",
            letterSpacing: "0.05em",
            fontWeight: "500",
          },
        ],

        h2: [
          "32px",
          {
            lineHeight: "1.2",
            letterSpacing: "0.04em",
            fontWeight: "500",
          },
        ],

        h3: [
          "24px",
          {
            lineHeight: "1.3",
            letterSpacing: "0.03em",
            fontWeight: "500",
          },
        ],

        // Body (Inter)
        "body-lg": [
          "18px",
          {
            lineHeight: "1.6",
            letterSpacing: "-0.01em",
            fontWeight: "400",
          },
        ],

        "body-md": [
          "15px",
          {
            lineHeight: "1.6",
            letterSpacing: "0",
            fontWeight: "400",
          },
        ],

        // Labels
        "label-caps": [
          "12px",
          {
            lineHeight: "1.0",
            letterSpacing: "0.15em",
            fontWeight: "600",
            textTransform: "uppercase",
          },
        ],

        // Code
        code: [
          "14px",
          {
            lineHeight: "1.5",
            letterSpacing: "0",
            fontWeight: "400",
          },
        ],
      },

      // =========================
      // SPACING (4px baseline grid)
      // =========================
      spacing: {
        unit: "4px",
        
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "48px",

        gutter: "24px",
        margin: "32px",
      },

      // =========================
      // MAX WIDTH
      // =========================
      maxWidth: {
        container: "1280px",
      },

      // =========================
      // BORDER RADIUS (Soft-Technical)
      // =========================
      borderRadius: {
        sm: "0.125rem", // 2px
        DEFAULT: "0.25rem", // 4px - base engineered feel
        md: "0.375rem", // 6px
        lg: "0.5rem", // 8px - large containers
        xl: "0.75rem", // 12px
        full: "9999px",
      },

      // =========================
      // SHADOWS (Ambient shadows)
      // =========================
      boxShadow: {
        // Ambient shadow (30-60px blur, 40% opacity)
        ambient: "0px 30px 60px rgba(0, 0, 0, 0.4)",

        // Glass material shadow
        glass: "0px 8px 32px rgba(0, 0, 0, 0.35)",

        // Micro-glow for hover/focus states
        glow: "0 0 20px rgba(255, 255, 255, 0.05)",

        // Strong glow for primary actions
        "glow-strong": "0 0 30px rgba(255, 255, 255, 0.1)",
      },

      // =========================
      // BACKDROP BLUR (Glassmorphism)
      // =========================
      backdropBlur: {
        glass: "12px",
        "glass-strong": "20px",
      },

      // =========================
      // BACKGROUND OPACITY
      // =========================
      backgroundOpacity: {
        glass: "0.05", // 5% white for glass layers
      },

      // =========================
      // BORDER WIDTH
      // =========================
      borderWidth: {
        hairline: "0.5px", // Technical precision borders
      },

      // =========================
      // OPACITY
      // =========================
      opacity: {
        primary: "1.0", // 100%
        secondary: "0.6", // 60%
        tertiary: "0.4", // 40%
        disabled: "0.4",
        subtle: "0.08",
      },

      // =========================
      // Z INDEX
      // =========================
      zIndex: {
        base: "1",
        dropdown: "10",
        sticky: "20",
        overlay: "30",
        modal: "40",
        popover: "50",
        toast: "60",
      },

      // =========================
      // ANIMATIONS (Precise, no bounce)
      // =========================
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.2, 0, 0, 1)", // Precise easing
      },

      transitionDuration: {
        fast: "200ms",
        normal: "300ms",
      },

      keyframes: {
        // Fade in with subtle upward motion
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        // Glow pulse for interactive states
        glowPulse: {
          "0%, 100%": {
            opacity: "0.05",
          },
          "50%": {
            opacity: "0.1",
          },
        },

        // Shimmer effect for loading states
        shimmer: {
          "0%": {
            backgroundPosition: "-1000px 0",
          },
          "100%": {
            backgroundPosition: "1000px 0",
          },
        },

        // Slide in from right (for modals/sidebars)
        slideInRight: {
          "0%": {
            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },

        // Slide in from bottom (for toasts)
        slideInBottom: {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
      },

      animation: {
        fadeIn: "fadeIn 300ms cubic-bezier(0.2, 0, 0, 1)",
        glowPulse: "glowPulse 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        slideInRight: "slideInRight 300ms cubic-bezier(0.2, 0, 0, 1)",
        slideInBottom: "slideInBottom 300ms cubic-bezier(0.2, 0, 0, 1)",
      },

      // =========================
      // BACKGROUND IMAGES
      // =========================
      backgroundImage: {
        // Glass gradient (5% white)
        "glass-gradient":
          "linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",

        // Microscopic noise texture (for tactile quality)
        noise: "url('/noise.png')",

        // Shimmer for loading states
        shimmer:
          "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)",
      },

      // =========================
      // BACKGROUND SIZE
      // =========================
      backgroundSize: {
        shimmer: "1000px 100%",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;