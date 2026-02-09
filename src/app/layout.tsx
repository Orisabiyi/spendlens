import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import QueryProvider from "@/components/query-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendLens — AI Receipt Scanner & Expense Tracker",
  description:
    "Scan receipts with AI, automatically categorize expenses, and track your spending with beautiful analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
