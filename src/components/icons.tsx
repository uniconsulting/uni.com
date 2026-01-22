import * as React from "react";

// Вставь сюда КОД ИКОНКИ звонка из Header.tsx (как есть)
export function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
return (
   <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M8.7 10.3c1.3 2.5 3.5 4.7 6 6l1.9-1.9c.3-.3.8-.4 1.2-.2 1.1.4 2.3.7 3.6.8.6.1 1 .6 1 1.2V20c0 .7-.6 1.2-1.3 1.2C11 21.2 2.8 13 2.8 2.9 2.8 2.2 3.4 1.6 4.1 1.6H7c.6 0 1.1.4 1.2 1 .1 1.2.4 2.5.8 3.6.1.4 0 .9-.3 1.2L6.9 9.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
   </svg> 
  );
}

// (опционально) то же самое для Telegram, если захочешь унифицировать
export function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <g transform="translate(-1.5 0)">
      <path
        d="M21.7 3.9L2.9 11.2c-.9.4-.9 1.6.1 1.9l4.7 1.5 1.8 5.7c.3.9 1.4 1.1 2 .4l2.6-3.2 5 3.7c.8.6 2 .1 2.2-.9l3.2-15.6c.2-1.1-.9-2-2-1.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.7 14.7l13-8.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
