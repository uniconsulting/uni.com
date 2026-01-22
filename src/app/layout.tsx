import "../styles/globals.css";
import localFont from "next/font/local";

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
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <html lang="ru" className={garet.variable}>
      <body
        className="bg-uni min-h-screen text-[rgba(255,255,255,0.96)] antialiased"
        style={
          {
            // задаём корректные пути для public-ассетов с учётом basePath
            ["--japan-pattern-url" as any]: `${basePath}/bg/japan-pattern-01.svg`,
            ["--grain-url" as any]: `${basePath}/bg/grain.png`,
          } as any
        }
      >
        {children}
      </body>
    </html>
  );
}
