import Link from "next/link";
import {
  FileText,
  CalendarCheck,
  MapPin,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
  Layers,
  Cpu,
  Smartphone,
  Server,
  Zap,
  Activity
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>ระบบสารสนเทศเพื่อการบริหารจัดการสถานศึกษาอาชีวศึกษา ยุคใหม่ 2569</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            New RMS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">CRiC 2026</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            ยกระดับการบริหารสถานศึกษาด้วยสถาปัตยกรรมคลาวด์และโมบายล์เฟิร์ส สะดวก รวดเร็ว เชื่อมต่องานสารบรรณดิจิทัล เช็คชื่อหน้าเสาธงไฮบริด ลงเวลา GPS Geofencing และผลการเรียน ศธ.02 สอศ.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>เข้าสู่แผงควบคุมหลัก (Dashboard)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/edoc"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm backdrop-blur border border-white/10 transition-all hover:border-white/20"
            >
              <FileText className="w-4 h-4 text-cyan-300" />
              <span>ทดลองเกษียณหนังสือ E-Doc</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-400 text-xs font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PostgreSQL 16 & Redis 7 พร้อมใช้งาน</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>รองรับ Mobile Web & Tablet</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>สถาปัตยกรรม Next.js 15 App Router</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Modules Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Module 1 */}
        <Link
          href="/edoc"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">E-Document</span>
              <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-full">ด่วน</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
              สารบรรณ & เกษียณหนังสือ
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ลงนามดิจิทัลบนหน้าจอสัมผัสคู่รหัส PIN 6 หลัก ประทับตราเวลา และออก QR Code ตรวจสอบความถูกต้อง
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
            <span>เข้าสู่ระบบสารบรรณ</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Module 2 */}
        <Link
          href="/attendance"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Student Affairs</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded-full">1-Click</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-emerald-600 transition-colors">
              เช็คชื่อเข้าแถว Fast Check
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ปุ่มมาครบทุกคนในคลิกเดียว รองรับเครื่องสแกนนิ้วเดิม และส่งแจ้งเตือนสถานะขาดแถวเข้า LINE ผู้ปกครอง
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>เข้าสู่ระบบเช็คชื่อ</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Module 3 */}
        <Link
          href="/hr"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-xs">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">HR & Leave</span>
              <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.2 rounded-full">Geofence</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-amber-600 transition-colors">
              ลงเวลา GPS & ขอลาออนไลน์
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ตรวจสอบตำแหน่ง GPS รัศมีวิทยาลัย CRiC และ Wi-Fi ประจำสถานศึกษา พร้อมระบบยื่นใบลาอนุมัติฉับไว
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
            <span>เข้าสู่ระบบบุคคล</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Module 4 */}
        <Link
          href="/academics"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Academics</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded-full">ศธ.02 Sync</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-indigo-600 transition-colors">
              คะแนนสมรรถนะ & ศธ.02
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ตัดเกรดอิงเกณฑ์ สอศ. อัตโนมัติ พร้อมปุ่มส่งออกไฟล์รูปแบบมาตรฐานนำเข้าสู่ระบบ ศธ.02 ได้ทันที
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
            <span>เข้าสู่ระบบวิชาการ</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>

      {/* College Info & Live Architecture Status */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ความปลอดภัยและความน่าเชื่อถือ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ออกแบบเพื่อการปฏิบัติงานจริงในสถานศึกษาอาชีวศึกษา
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              ระบบถูกสร้างขึ้นเพื่อแก้ปัญหาความล่าช้าของระบบ RMS เดิม โดยลดขั้นตอนงานเอกสารกระดาษ สามารถลงนามได้จากทุกที่ทุกเวลาบนสมาร์ทโฟนอย่างถูกต้องตามระเบียบสารบรรณ
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">มาตรฐานลายมือชื่ออิเล็กทรอนิกส์</h4>
                  <p className="text-xs text-slate-500">เก็บค่า Hash (SHA-256) และบันทึก Audit Log วันที่/เวลา/IP Address ทุกครั้ง</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">บูรณาการข้อมูลแบบไร้รอยต่อ</h4>
                  <p className="text-xs text-slate-500">เชื่อมโยงระหว่างฝ่ายบริหาร วิชาการ พัฒนากิจการฯ และแผนงานในแพลตฟอร์มเดียว</p>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Card */}
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Server className="w-48 h-48 text-blue-400" />
            </div>

            <div className="relative space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">โครงสร้างเทคโนโลยี (Tech Stack 2026)</h3>
                  <p className="text-xs text-slate-400">Next.js 15 • PostgreSQL 16 • Redis 7 • Docker</p>
                </div>
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ระบบออนไลน์ปกติ</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-slate-400 block text-[10px]">Frontend UI</span>
                  <span className="font-bold text-white text-sm">Next.js 15 + Tailwind</span>
                  <span className="text-blue-400 block text-[10px] mt-1">App Router + PWA</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-slate-400 block text-[10px]">Database</span>
                  <span className="font-bold text-white text-sm">PostgreSQL 16</span>
                  <span className="text-emerald-400 block text-[10px] mt-1">Prisma ORM Managed</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-slate-400 block text-[10px]">Queue & Cache</span>
                  <span className="font-bold text-white text-sm">Redis 7 Alpine</span>
                  <span className="text-amber-400 block text-[10px] mt-1">Background Tasks</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-slate-400 block text-[10px]">Location Check</span>
                  <span className="font-bold text-white text-sm">GPS Geofencing</span>
                  <span className="text-purple-400 block text-[10px] mt-1">CRiC Campus &plusmn; 200m</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-slate-400 block text-[10px]">Notification</span>
                  <span className="font-bold text-white text-sm">LINE Official API</span>
                  <span className="text-emerald-400 block text-[10px] mt-1">Parent Instant Alerts</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-slate-400 block text-[10px]">National Sync</span>
                  <span className="font-bold text-white text-sm">ศธ.02 (สอศ.)</span>
                  <span className="text-cyan-400 block text-[10px] mt-1">Direct CSV/Excel Export</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
