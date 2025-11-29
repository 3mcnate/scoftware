import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-expect-error - allow side-effect global CSS import in Next.js root layout
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import TanstackQueryProvider from "@/components/providers/tanstack-query-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SC Outfitters",
  description: "SC Outfitters Trips Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <AuthProvider>
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </AuthProvider>
				<Toaster position="top-right"/>
      </body>
    </html>
  );
}
