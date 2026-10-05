import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "New RMS | ระบบบริหารจัดการสถานศึกษาอาชีวศึกษา CRiC 2026",
  description: "ระบบสารสนเทศเพื่อการบริหารจัดการสถานศึกษาอาชีวศึกษา ยุคใหม่ ทันสมัย สะดวก รวดเร็ว สถาปัตยกรรม 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50/70 text-slate-800 antialiased font-prompt selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
