import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "BookNook | A Small Online Library",
  description: "A cozy community library inspired by classic vintage literature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#120e0c] text-[#f7f2eb]">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#221a16",
              color: "#f7f2eb",
              border: "1px solid #3d2d25",
            },
          }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
