import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "CarbonLoop | Turning Institutional Surplus into Circular Value",
  description:
    "Institutional circular asset management, reverse logistics, and internal surplus redistribution platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-canvas text-ink">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased bg-canvas text-ink selection:bg-forest/20 selection:text-forest flex flex-col">
        <RoleProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="border-t border-border bg-surface py-6 mt-12 text-center text-xs text-ink-muted">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-ink">CARBONLOOP</span>
                <span>— Institutional Reverse Logistics & ESG Circularity Platform</span>
              </div>
              <div className="text-ink-muted">
                Engineered with Next.js, Node/Express, PostgreSQL, Python AI & OR-Tools
              </div>
            </div>
          </footer>
        </RoleProvider>
      </body>
    </html>
  );
}
