import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduManage - Educational Management System",
  description: "Modern Next.js application for educational management. Built with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: ["EduManage", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "education", "management", "React"],
  authors: [{ name: "Development Team" }],
  icons: {
    icon: "/favicon.ico", // Using default favicon
  },
  openGraph: {
    title: "EduManage",
    description: "Educational management with modern React stack",
    url: "http://localhost:3000",
    siteName: "EduManage",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduManage",
    description: "Educational management with modern React stack",
  },
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
