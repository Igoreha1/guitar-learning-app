import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({ subsets: ["cyrillic", "latin"] });
const openSans = Open_Sans({ subsets: ["cyrillic", "latin"] });

export const metadata: Metadata = {
  title: "ГитарСинхро - Разборы песен и уроки на гитаре",
  description: "Подробные разборы песен с аккордами, уроки на гитаре для начинающих",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.className} ${openSans.className} antialiased`}>
        <ThemeProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}