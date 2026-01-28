import "../styles/globals.css";
import localFont from "next/font/local";
import Image from "next/image";

const garet = localFont({
  variable: "--font-garet",
  display: "swap",
  src: [
    { path: "../fonts/Garet-Book.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Garet-Book.woff", weight: "400", style: "normal" },
    { path: "../fonts/Garet-Heavy.woff2", weight: "800", style: "normal" },
    { path: "../fonts/Garet-Heavy.woff", weight: "800", style: "normal" },
  ],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {/* слой градиентов поверх базового цвета */}
        <div className="page-gradients" aria-hidden />

        {children}
      </body>
    </html>
  );
}
