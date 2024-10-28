import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { fonts } from "./fonts";
import { cn } from "@/utils/cn";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Satsouk App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        fonts.sora.className,
        "bg-zinc-950 text-white"
      )}>
        <Toaster position="bottom-left" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
