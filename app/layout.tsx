import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/providers/cart-provider";
import { getCategories, MappedCategories } from "@/lib/categories";
import { SessionWrapper } from "@/components/session-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reality Code - Software Marketplace",
  description: "Discover and purchase high-quality software applications",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Header categories={categories} />
                <main className="flex-1">{children}</main>
                <Footer categories={categories} />
              </div>
              <Toaster />
            </CartProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
