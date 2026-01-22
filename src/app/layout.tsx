import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "ЮНИ",
  description: "ЮНИ - ИИ в каждый бизнес",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-uni">{children}</body>
    </html>
  );
}
