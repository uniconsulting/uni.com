import * as React from "react";

// Вставь сюда КОД ИКОНКИ звонка из Header.tsx (как есть)
export function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      {/* ... path(ы) из Header ... */}
    </svg>
  );
}

// (опционально) то же самое для Telegram, если захочешь унифицировать
export function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      {/* ... path(ы) ... */}
    </svg>
  );
}
