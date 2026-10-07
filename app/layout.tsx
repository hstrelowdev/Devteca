import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Suspense } from "react";
import { SearchInput } from "@/components/my/search-input";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devteca",
  description: "Biblioteca de recursos para developers",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 p-4">
            <div className="mb-6 flex items-center gap-2">
              <SidebarTrigger />
              <Suspense fallback={null}>
                <SearchInput />
              </Suspense>
            </div>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
