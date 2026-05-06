import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["cyrillic", "latin"] });
const openSans = Open_Sans({ subsets: ["cyrillic", "latin"] });

export const metadata: Metadata = {
  title: "GuitarSync - Разборы песен и уроки на гитаре",
  description: "Подробные разборы песен с аккордами, уроки на гитаре для начинающих",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} ${openSans.className} antialiased`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}