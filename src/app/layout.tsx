import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tech Wiki - Aprende Desarrollo y UX/UI",
  description: "Diccionario interactivo de conceptos de desarrollo web, UX/UI y tecnología",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <div className="flex flex-1 bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 max-w-4xl mx-auto bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
