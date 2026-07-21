import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "BURGUES Operaciones",
  description:
    "Plataforma de gestión de operaciones de comercio electrónico",
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: [
    {
      media: "(prefers-color-scheme: dark)",
      color: "#0a0a0a",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="dark"
      suppressHydrationWarning
    >
      <body
        className="antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}

        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={3000}
        />

        {process.env.NODE_ENV === "production" && (
          <Analytics />
        )}
      </body>
    </html>
  );
}