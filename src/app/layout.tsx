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
      <body className="min-h-screen">
        {/* Global background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Base PNG */}
          <Image
            src="/bg/landing-bg.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Optional soft tint (если нужно “свести” фон по тону) */}
          <div className="absolute inset-0 bg-white/10" />

          {/* SVG pattern overlay */}
          <div
            className="
              absolute inset-0
              opacity-[0.16]
              bg-[url('/bg/landing-pattern.svg')]
              bg-no-repeat 
              bg-center 
              bg-cover
              bg-[length:900px_900px]
              pointer-events-none
            "
            aria-hidden="true"
          />

          {/* Optional vignette / gradients for depth */}
          <div
            className="absolute inset-0 opacity-70 pointer-events-none"
            style={{
              background:
                "radial-gradient(900px 520px at 20% 0%, rgba(255,255,255,0.35), transparent 60%), radial-gradient(900px 520px at 80% 100%, rgba(199,63,64,0.10), transparent 65%)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Page content */}
        <div className="relative z-0">{children}</div>
      </body>
    </html>
  );
}
