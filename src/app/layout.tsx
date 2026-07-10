import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Laundry Management System",
  description: "Modern laundry management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="h-full flex flex-col font-sans relative">
        <div className="fixed inset-0 z-[-1] bg-[url('/images/bg-pattern.png')] bg-repeat bg-center opacity-[0.03] pointer-events-none" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
