import type { Metadata } from "next";
import {Plus_Jakarta_Sans} from "next/font/google";
import "./globals.css";

import {cn} from "@/lib/utils";
import { Toaster } from "sonner";
import SocketProvider from "@/components/providers/SocketProvider";
import SocketInitializer from "@/components/ui/SocketInitializer";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MediSlot",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-black text-white font-sans antialiased",
          fontSans.variable
        )}
      >
        <SocketProvider>
          <SocketInitializer />
          {children}
        </SocketProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
