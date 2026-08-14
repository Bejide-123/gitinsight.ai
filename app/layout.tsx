// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "GitInsight",
    template: "%s | GitInsight",
  },
  icons: {
    icon: "/GitInsight2.png",
  },
  description: "Unleash the power of your GitHub data with GitInsight.",
  keywords: ["GitHub", "analytics", "developer tools", "GitInsight"],
  authors: [{ name: "GitInsight Team" }],
  metadataBase: new URL("https://gitinsight.com"),
};

// ✅ important for responsive behavior
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-[#050505] text-white">
        <QueryProvider>
          <AuthProvider>
            {/* Layout wrapper makes scaling easier later */}
            <div className="flex flex-col min-h-screen">
              <ConditionalNavbar />
              <main className="flex-1">{children}</main>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}