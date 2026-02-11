import type { Metadata } from "next";
import { Toaster } from "sonner";
import QueryProvider from "@/components/query-provider";
import AuthProvider from "@/components/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendLens — AI Receipt Scanner",
  description: "Scan receipts, track expenses, get spending insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}