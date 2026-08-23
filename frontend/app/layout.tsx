import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import { AssetProvider } from "@/context/AssetContext";
import { ShortageProvider } from "@/context/ShortageContext";
import { Navbar } from "@/components/layout/Navbar";
import { AICopilotWidget } from "@/components/ai/AICopilotWidget";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CarbonLoop | Turning Institutional Surplus into Circular Value",
  description:
    "Institutional circular asset management, reverse logistics, and internal surplus redistribution platform for ITER SOA University, Bhubaneswar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable} bg-canvas text-ink`}>
      <body className="min-h-screen antialiased bg-canvas text-ink selection:bg-forest/20 selection:text-forest flex flex-col font-sans">
        <RoleProvider>
          <AssetProvider>
            <ShortageProvider>
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
                {children}
              </main>
              <footer className="border-t border-border bg-surface py-6 mt-8 sm:mt-12 text-center text-xs text-ink-muted">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-ink">CARBONLOOP</span>
                    <span>— ITER, Siksha 'O' Anusandhan University, Bhubaneswar</span>
                  </div>
                  <div className="text-ink-muted">
                    Engineered with Next.js, Node/Express, PostgreSQL, Python AI & OR-Tools
                  </div>
                </div>
              </footer>

              {/* Global Floating AI Copilot Widget */}
              <AICopilotWidget />
            </ShortageProvider>
          </AssetProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
