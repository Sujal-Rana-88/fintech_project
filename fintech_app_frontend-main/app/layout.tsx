import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ClientAuthGuard from "@/components/ClientAuthGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinDash - Modern Trading Dashboard",
  description: "A modern fintech trading dashboard with glassmorphism design",
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ClientAuthGuard>
            {children}
          </ClientAuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
