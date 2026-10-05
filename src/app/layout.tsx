import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "New RMS | ระบบบริหารจัดการสถานศึกษาอาชีวศึกษา CRiC 2026",
  description: "ระบบสารสนเทศเพื่อการบริหารจัดการสถานศึกษาอาชีวศึกษา ยุคใหม่ ทันสมัย สะดวก รวดเร็ว",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
