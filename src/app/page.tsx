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
  Lock
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold tracking-wide uppercase backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>ระบบสารสนเทศยุคใหม่เพื่อการอาชีวศึกษา 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            New RMS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">CRiC 2026</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg">
            ระบบบริหารจัดการสถานศึกษาอาชีวศึกษาแบบบูรณาการ ใช้งานสะดวกทั้งบนสมาร์ทโฟนและคอมพิวเตอร์ รองรับงานสารบรรณดิจิทัล เช็คชื่อไฮบริด และเชื่อมโยง ศธ.02 สอศ.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
            >
              <span>เข้าสู่ระบบบริหารจัดการ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/edoc"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur border border-white/10 transition-colors"
            >
              <FileText className="w-4 h-4 text-cyan-300" />
              <span>ทดลองเกษียณหนังสือ E-Doc</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: E-Document */}
        <Link
          href="/edoc"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
            สารบรรณ & เกษียณหนังสือ
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            ลงลายมือชื่อดิจิทัลคู่รหัส PIN 6 หลัก ประทับตราเวลา และออก QR Code ตรวจสอบความถูกต้องของเอกสาร
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600">
            <span>เข้าสู่ระบบงานสารบรรณ</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Student Attendance */}
        <Link
          href="/attendance"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-emerald-600 transition-colors">
            เช็คชื่อนักเรียน Fast 1-Click
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            เช็คชื่อหน้าเสาธงและโฮมรูมบนสมาร์ทโฟน รองรับข้อมูลจากเครื่องสแกนนิ้วเดิม พร้อมแจ้งเตือนผ่าน LINE
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600">
            <span>เข้าสู่ระบบเช็คชื่อ</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: HR Geofencing */}
        <Link
          href="/hr"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-amber-600 transition-colors">
            ลงเวลาปฏิบัติราชการ & ลา
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            ตรวจสอบตำแหน่ง GPS รัศมีวิทยาลัย และ Wi-Fi ประจำสถานศึกษา ขออนุมัติวันลาออนไลน์รวดเร็ว
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-amber-600">
            <span>เข้าสู่ระบบบุคคล</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 4: Academics */}
        <Link
          href="/academics"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
            งานวิชาการ & ศธ.02
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            บันทึกคะแนนเก็บสมรรถนะรายวิชา พร้อมระบบ Export เข้าสู่ระบบ ศธ.02 ออนไลน์ของ สอศ. ได้ทันที
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600">
            <span>เข้าสู่ระบบวิชาการ</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>

      {/* Demo Credentials & Quick Switcher Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <div>
              <h2 className="text-xl font-bold tracking-tight">ข้อมูลผู้ใช้งานสำหรับทดสอบระบบ (Demo Accounts)</h2>
              <p className="text-xs text-slate-400">ระบบจำลองสิทธิ์การเข้าถึงจริงตามโครงสร้างของวิทยาลัยอาชีวศึกษา</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">ผู้อำนวยการ</span>
              <p className="text-sm font-semibold text-white mt-1">ดร.สมเกียรติ ยิ่งเจริญ</p>
              <p className="text-xs text-slate-400 font-mono mt-2">director@cric.ac.th</p>
              <p className="text-xs text-slate-400 font-mono">รหัส/PIN: 123456</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">รอง ผอ.วิชาการ</span>
              <p className="text-sm font-semibold text-white mt-1">นายวิเชียร มุ่งมั่น</p>
              <p className="text-xs text-slate-400 font-mono mt-2">deputy.academic@cric.ac.th</p>
              <p className="text-xs text-slate-400 font-mono">รหัส/PIN: 123456</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">หัวหน้าแผนก IT</span>
              <p className="text-sm font-semibold text-white mt-1">นายประสิทธิ์ นวัตกรรม</p>
              <p className="text-xs text-slate-400 font-mono mt-2">head.it@cric.ac.th</p>
              <p className="text-xs text-slate-400 font-mono">รหัส/PIN: 123456</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">ครูผู้สอน / ที่ปรึกษา</span>
              <p className="text-sm font-semibold text-white mt-1">อ.สมชาย ปัญญาดี</p>
              <p className="text-xs text-slate-400 font-mono mt-2">teacher.somchai@cric.ac.th</p>
              <p className="text-xs text-slate-400 font-mono">รหัส/PIN: 123456</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
