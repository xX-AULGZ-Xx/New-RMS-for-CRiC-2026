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
  Activity,
  ChevronRight,
  Fingerprint,
  Radio,
  Clock
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-prompt relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Ambient background glows for macOS Glassmorphism */}
      <div className="fixed top-0 left-1/3 w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/2 left-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none -z-10"></div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold tracking-wide uppercase backdrop-blur-xl shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>ระบบสารสนเทศเพื่อการบริหารจัดการสถานศึกษาอาชีวศึกษา ยุคใหม่ 2569</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-white">
            New RMS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">CRiC 2026</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            ยกระดับระบบ RMS แบบดั้งเดิม สู่สถาปัตยกรรม Apple Bento Dark Glassmorphism ที่ทันสมัย ปลอดภัย และสะดวกรวดเร็ว เชื่อมต่องานสารบรรณดิจิทัล เช็คชื่อหน้าเสาธง 1-Click ลงเวลา GPS Geofencing และตัดเกรด ศธ.02 สอศ.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 border border-white/20"
            >
              <span>เข้าสู่แผงควบคุมหลัก (Dashboard)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/edoc"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl glass-island hover:bg-white/10 text-white font-semibold text-sm backdrop-blur-xl border border-white/15 transition-all hover:border-white/25"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>ทดลองเกษียณหนังสือ E-Doc</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-400 text-xs font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">PostgreSQL 16 & Redis 7 พร้อมใช้งาน</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">Mobile & iPad Pencil รองรับเต็มรูปแบบ</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">Next.js 15 App Router</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Modules Bento Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Module 1 */}
        <Link
          href="/edoc"
          className="glass-card p-6 rounded-3xl border border-white/10 hover:border-cyan-500/40 shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">E-Document</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold px-2 py-0.5 rounded-full">ด่วนที่สุด</span>
            </div>
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-cyan-400 transition-colors">
              สารบรรณ & เกษียณหนังสือ
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ลงนามดิจิทัลเสมือน Apple Pencil คู่รหัส PIN 6 หลัก ประทับตราเวลา และออก QR Code ตรวจสอบความถูกต้อง
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-cyan-400">
            <span>เข้าสู่ระบบสารบรรณ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Module 2 */}
        <Link
          href="/attendance"
          className="glass-card p-6 rounded-3xl border border-white/10 hover:border-emerald-500/40 shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Student Affairs</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">1-Click</span>
            </div>
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-emerald-400 transition-colors">
              เช็คชื่อเข้าแถว Fast Check
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ปุ่มมาครบทุกคนในคลิกเดียว วงแหวน Activity Rings แบบ Apple Watch และแจ้งเตือนสถานะขาดแถวเข้า LINE ผู้ปกครอง
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>เข้าสู่ระบบเช็คชื่อ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Module 3 */}
        <Link
          href="/hr"
          className="glass-card p-6 rounded-3xl border border-white/10 hover:border-amber-500/40 shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">HR & Leave</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2 py-0.5 rounded-full">Apple Radar</span>
            </div>
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-amber-400 transition-colors">
              ลงเวลา GPS & ขอลาออนไลน์
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              หน้าจอเรดาร์สไตล์ Apple Find My ตรวจจับรัศมีสถานศึกษา 200m เช็คอิน 1 แตะ และยื่นขออนุมัติวันลาออนไลน์
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400">
            <span>เข้าสู่ระบบบุคคล</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Module 4 */}
        <Link
          href="/academics"
          className="glass-card p-6 rounded-3xl border border-white/10 hover:border-indigo-500/40 shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Academics</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold px-2 py-0.5 rounded-full">ศธ.02 Sync</span>
            </div>
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-indigo-400 transition-colors">
              คะแนนสมรรถนะ & ศธ.02
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ตัดเกรดอิงเกณฑ์ สอศ. อัตโนมัติ พร้อมปุ่มส่งออกไฟล์รูปแบบมาตรฐานนำเข้าสู่ระบบ ศธ.02 ได้ทันที
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-indigo-400">
            <span>เข้าสู่ระบบวิชาการ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>

      {/* College Info & Live Architecture Status */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>ความปลอดภัยและความน่าเชื่อถือระดับราชการ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ออกแบบเพื่อการปฏิบัติงานจริงในสถานศึกษาอาชีวศึกษา
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              แก้ปัญหาความล่าช้าของระบบ RMS เดิมอย่างสิ้นเชิง ด้วยหน้าต่างตรวจพิจารณาแบบ Floating Paper Reader บนสมาร์ทโฟนและแท็บเล็ต พร้อมระบบลงนามคู่รหัส PIN 6 หลัก ป้องกันการปลอมแปลงเอกสาร
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">มาตรฐานลายมือชื่ออิเล็กทรอนิกส์</h4>
                  <p className="text-xs text-slate-400">บันทึก Audit Log วันที่/เวลา/IP Address และฝัง QR Seal ตรวจสอบความถูกต้องได้ทุกเอกสาร</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">บูรณาการข้อมูลแบบไร้รอยต่อ</h4>
                  <p className="text-xs text-slate-400">เชื่อมโยงระหว่างฝ่ายบริหาร วิชาการ พัฒนากิจการฯ และแผนงานในแพลตฟอร์มเดียว</p>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Card */}
          <div className="lg:col-span-7 glass-island rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Server className="w-48 h-48 text-cyan-400" />
            </div>

            <div className="relative space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
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
                <div className="p-3.5 rounded-2xl glass-card border border-white/10">
                  <span className="text-slate-400 block text-[10px]">Frontend UI</span>
                  <span className="font-bold text-white text-sm">Next.js 15 + Tailwind</span>
                  <span className="text-cyan-400 block text-[10px] mt-1">App Router + Dark Glass</span>
                </div>

                <div className="p-3.5 rounded-2xl glass-card border border-white/10">
                  <span className="text-slate-400 block text-[10px]">Database</span>
                  <span className="font-bold text-white text-sm">PostgreSQL 16</span>
                  <span className="text-emerald-400 block text-[10px] mt-1">Port 5435 (Docker)</span>
                </div>

                <div className="p-3.5 rounded-2xl glass-card border border-white/10">
                  <span className="text-slate-400 block text-[10px]">Queue & Cache</span>
                  <span className="font-bold text-white text-sm">Redis 7 Alpine</span>
                  <span className="text-amber-400 block text-[10px] mt-1">Port 6385 (Docker)</span>
                </div>

                <div className="p-3.5 rounded-2xl glass-card border border-white/10">
                  <span className="text-slate-400 block text-[10px]">Location Check</span>
                  <span className="font-bold text-white text-sm">GPS Geofencing</span>
                  <span className="text-purple-400 block text-[10px] mt-1">Apple Radar &plusmn; 200m</span>
                </div>

                <div className="p-3.5 rounded-2xl glass-card border border-white/10">
                  <span className="text-slate-400 block text-[10px]">Notification</span>
                  <span className="font-bold text-white text-sm">LINE Official API</span>
                  <span className="text-emerald-400 block text-[10px] mt-1">แจ้งเตือนผู้ปกครองฉับไว</span>
                </div>

                <div className="p-3.5 rounded-2xl glass-card border border-white/10">
                  <span className="text-slate-400 block text-[10px]">National Sync</span>
                  <span className="font-bold text-white text-sm">ศธ.02 (สอศ.)</span>
                  <span className="text-cyan-400 block text-[10px] mt-1">Direct CSV/Excel Export</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-xs text-slate-500">
        <p>วิทยาลัยอาชีวศึกษา CRiC • ระบบ New RMS 2569 สถาปัตยกรรม Apple Dark Glassmorphism</p>
      </footer>
    </div>
  );
}
