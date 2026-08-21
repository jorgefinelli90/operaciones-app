import { Analytics } from "@vercel/analytics/next";
import type {
  Metadata,
  Viewport,
} from "next";
import { Toaster } from "sonner";

import { AuthProvider } from "@/components/auth/AuthProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "BURGUES Operaciones",
  description:
    "Plataforma de gestión de operaciones de E-commerce",
  generator: "Jorge",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: [
    {
      media:
        "(prefers-color-scheme: dark)",
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
        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={3000}
          offset="24px"
          toastOptions={{
            className:
              "z-[9999]",
          }}
        />

        {process.env.NODE_ENV ===
          "production" && (
          <Analytics />
        )}
      </body>
    </html>
  );
}