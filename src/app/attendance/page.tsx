"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  CalendarCheck,
  GraduationCap,
  ScanLine,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Search,
  ExternalLink,
  Flame,
  Check,
  BookOpen,
  Building,
  BellRing,
  Calendar
} from "lucide-react";
import { formatThaiDate } from "@/lib/thai-date";

export default function AttendanceHubPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "flag",
      title: "เช็คชื่อหน้าเสาธง & โฮมรูม",
      subtitle: "Flag Ceremony & Homeroom",
      description: "บันทึกเวลาแถวเคารพธงชาติและกิจกรรมโฮมรูมตอนเช้า ด้วยระบบ 1-Click Fast Check, ตรวจสอบ Apple Activity Rings และเชื่อมโยงไบโอเมตริกซ์",
      href: "/attendance/flag",
      badge: "Fast Check 1-Click",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      icon: CalendarCheck,
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-400/30",
      glowColor: "from-emerald-500/10 to-teal-500/10",
      stats: `${formatThaiDate(new Date(), { format: "short" })} • เฉลี่ยเข้าแถว 94.2%`,
      actionText: "เปิดระบบเช็คชื่อหน้าเสาธง",
    },
    {
      id: "class",
      title: "เช็คชื่อรายวิชา & สิทธิ์สอบ 80%",
      subtitle: "Class Attendance & VEC 80%",
      description: "บันทึกการเข้าเรียนรายคาบตามตารางสอน พร้อมระบบคำนวณสิทธิ์สอบปลายภาค 80% (เกณฑ์ สอศ. มส.) แบบ Real-time แจ้งเตือนกลุ่มเสี่ยงทันที",
      href: "/attendance/class",
      badge: "เกณฑ์ สอศ. มส.",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
      icon: GraduationCap,
      iconBg: "bg-cyan-500/20 text-cyan-400 border-cyan-400/30",
      glowColor: "from-cyan-500/10 to-blue-500/10",
      stats: "ปกติ >=80% • เสี่ยง มส. 80-84% • มส. <80%",
      actionText: "เปิดระบบเช็คชื่อรายวิชา",
    },
    {
      id: "gate",
      title: "สแกนเนอร์ประตูวิทยาลัย Smart Gate",
      subtitle: "RFID & QR Turnstile Terminal",
      description: "จำลองการแตะบัตรนักเรียน RFID 13.56MHz และกล้องสแกน QR Code หน้าประตูวิทยาลัย ควบคุมประตูปีกผีเสื้อ และแจ้งเตือนผู้ปกครองผ่าน LINE OA อัตโนมัติ",
      href: "/attendance/gate",
      badge: "Real-time Gate",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      icon: ScanLine,
      iconBg: "bg-indigo-500/20 text-indigo-400 border-indigo-400/30",
      glowColor: "from-indigo-500/10 to-purple-500/10",
      stats: "3 จุดประตูหลัก • ความหน่วงเฉลี่ย 12ms",
      actionText: "เปิดระบบสแกนเนอร์ Smart Gate",
    },
    {
      id: "reports",
      title: "รายงานสถิติงานพัฒนากิจการฯ",
      subtitle: "Student Affairs Analytics",
      description: "สรุปเปอร์เซ็นต์การเข้าแถวรายสัปดาห์/รายเดือน แยกตามแผนกวิชา ชั้นปี และรายบุคคล สำหรับงานพัฒนากิจการนักเรียนนักศึกษา พร้อมส่งออก Excel และ PDF",
      href: "/attendance/reports",
      badge: "ส่งออก Excel & PDF",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      icon: BarChart3,
      iconBg: "bg-amber-500/20 text-amber-400 border-amber-400/30",
      glowColor: "from-amber-500/10 to-orange-500/10",
      stats: "6 แผนกวิชา • ติดตามกลุ่มเสี่ยง มผ. กิจกรรม",
      actionText: "เปิดคลังรายงานและสถิติ",
    },
  ];

  const filteredCategories = searchQuery.trim() === ""
    ? categories
    : categories.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <AppShell>
      <div className="space-y-8 pb-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-indigo-950/40 border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Smart Attendance Hub
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-300 border border-white/15 flex items-center gap-1.5 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {formatThaiDate(new Date(), { showDayOfWeek: true })}
                </span>
                <span className="text-xs text-white/50 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  เกณฑ์ สอศ. 2569 ครบวงจร
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                ระบบเช็คชื่อ & ควบคุมเวลาเรียนอัจฉริยะ
              </h1>
              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                ศูนย์กลางบันทึกเวลาเรียนและกิจกรรมนักศึกษา รองรับการเช็คชื่อหน้าเสาธง, เช็คชื่อรายคาบพร้อมตัดสิทธิ์สอบ มส. 80%, สแกนเนอร์บัตรนักเรียน Smart Gate และรายงานสรุปสถิติสำหรับผู้บริหาร
              </p>
            </div>

            {/* Quick Summary Pill Island */}
            <div className="flex flex-col gap-3 min-w-[240px]">
              <div className="rounded-2xl p-4 bg-black/40 border border-white/10 backdrop-blur-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-white/50">เข้าแถววันนี้</div>
                  <div className="text-lg font-bold text-white">94.2% <span className="text-xs text-emerald-400 font-normal">(ปกติ)</span></div>
                </div>
              </div>

              <div className="rounded-2xl p-4 bg-black/40 border border-white/10 backdrop-blur-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-white/50">เกณฑ์สิทธิ์สอบ</div>
                  <div className="text-lg font-bold text-white">&ge; 80% <span className="text-xs text-cyan-400 font-normal">สอศ.</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="ค้นหาหมวดหมู่การเช็คชื่อ เช่น หน้าเสาธง, รายวิชา, Smart Gate, สถิติ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 backdrop-blur-xl transition"
          />
        </div>

        {/* Apple Bento Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group relative rounded-3xl p-7 bg-slate-900/40 hover:bg-slate-900/70 border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
              >
                {/* Background Ambient Glow */}
                <div className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-gradient-to-br ${cat.glowColor} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-2xl p-3 border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg ${cat.iconBg}`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                      {cat.subtitle}
                    </span>
                    <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <span>{cat.title}</span>
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-white/60 leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Footer: Stats + Action CTA */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-white/50 text-[11px]">
                    {cat.stats}
                  </span>

                  <div className="flex items-center gap-1.5 font-semibold text-white/80 group-hover:text-white transition-colors">
                    <span>{cat.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-cyan-400" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Highlights / Guide Section */}
        <div className="rounded-3xl p-6 bg-slate-900/30 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">คู่มือและระเบียบเกณฑ์การเช็คชื่อตามระเบียบ สอศ. 2569</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-white/70">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>การเข้าแถวหน้าเสาธง</span>
              </div>
              <p className="text-white/50 text-[11px] leading-relaxed">
                นักศึกษาต้องเข้าร่วมกิจกรรมหน้าเสาธงและโฮมรูมไม่น้อยกว่า 80% ของเวลาทั้งหมดในแต่ละภาคเรียน หากต่ำกว่าเกณฑ์จะต้องเข้าค่ายปรับปรุงพฤติกรรม
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>การคำนวณสิทธิ์สอบ 80% (มส.)</span>
              </div>
              <p className="text-white/50 text-[11px] leading-relaxed">
                การเข้าเรียนในรายวิชาต้องไม่น้อยกว่า 80% ของเวลาเรียนทั้งหมด (เช่น วิชา 36 คาบ ต้องเข้าไม่น้อยกว่า 29 คาบ) หากขาดเรียนเกิน 7 คาบ จะหมดสิทธิ์สอบทันที
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Smart Gate & LINE Notify</span>
              </div>
              <p className="text-white/50 text-[11px] leading-relaxed">
                เมื่อนักศึกษาแตะบัตรผ่านประตูกั้น Turnstile ข้อมูลเวลาจะถูกบันทึกและส่งแจ้งเตือนสถานะ (ตรงเวลา / สาย) ถึงผู้ปกครองผ่าน LINE OA โดยอัตโนมัติ
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
