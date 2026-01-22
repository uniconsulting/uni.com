import type { ReactNode } from "react";

import "../styles/globals.css";

export const metadata = {
  title: "Uni Landing",
  description: "Premium landing for Uni",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ru">
    <body>{children}</body>
  </html>
);

export default RootLayout;
