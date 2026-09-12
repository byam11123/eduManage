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
  title: "EduManage - Multi-tenant Education Management System",
  description: "Multi-tenant education management system for coaching centers, institutes, and academies.",
  keywords: ["EduManage", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "education", "management", "React"],
  authors: [{ name: "Development Team" }],
  icons: {
    icon: "/favicon.ico", // Using default favicon
  },
  openGraph: {
    title: "EduManage - Multi-tenant Education Management System",
    description: "Multi-tenant education management system for coaching centers, institutes, and academies.",
    url: "http://localhost:3000",
    siteName: "EduManage",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduManage - Multi-tenant Education Management System",
    description: "Multi-tenant education management system for coaching centers, institutes, and academies.",
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
