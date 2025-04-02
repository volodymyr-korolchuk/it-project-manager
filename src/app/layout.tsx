import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/query-provider";

import "./globals.css";

const poppins = Poppins({ 
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: "Nexora",
  description: "A modern project management application for IT teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          poppins.className, 
          "antialiased min-h-screen bg-background text-foreground"
        )}
      >
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
