import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <html lang="ru">
      <body
        className="bg-uni"
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
