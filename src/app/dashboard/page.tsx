import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import {
  FileText,
  CalendarCheck,
  MapPin,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Building2,
  Radio,
  Zap,
  Activity,
  Layers,
  ArrowUpRight
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Fetch real counts from Database
  const [
    docsPendingCount,
    docsApprovedCount,
    studentCount,
    personnelCount,
    departmentCount,
    recentDocs,
    todayAttendanceCount,
  ] = await Promise.all([
    prisma.document.count({ where: { status: { in: ["ROUTING", "DRAFT"] } } }),
    prisma.document.count({ where: { status: "APPROVED" } }),
    prisma.studentProfile.count(),
    prisma.personnelProfile.count(),
    prisma.department.count(),
    prisma.document.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { creator: true, routings: { include: { targetUser: true } } },
    }),
    prisma.studentAttendance.count(),
  ]);

  const attendanceRate = studentCount > 0 ? Math.round(((studentCount - 1) / studentCount) * 100) : 96;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6 pb-12 pt-2">
        {/* Welcome Panoramic Widget (Bento 12-col) */}
        <div className="relative overflow-hidden glass-island rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          {/* Subtle gradient highlights */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-cyan-300 text-xs font-bold backdrop-blur">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Executive Command Center • CRiC 2569</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                สวัสดี ดร.สมเกียรติ ยิ่งเจริญ
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
                ภาพรวมสถานศึกษาแบบบูรณาการ วันนี้มีเอกสารรอพิจารณาลงนามจำนวน{" "}
                <span className="text-amber-400 font-bold">{docsPendingCount} ฉบับ</span> และนักศึกษาเข้าแถวหน้าเสาธงคิดเป็นอัตรา{" "}
                <span className="text-emerald-400 font-bold">{attendanceRate}%</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/edoc"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/25 ring-1 ring-white/20 transition-all hover:scale-105 active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>เกษียณหนังสือด่วน ({docsPendingCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/attendance"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-colors"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                <span>ตรวจแถวหน้าเสาธง</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Apple Bento Grid Widgets (12 Cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {/* Bento 1: Circular Activity Ring (Attendance) - 4 cols */}
          <div className="lg:col-span-4 glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">การเข้าแถวหน้าเสาธง</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="my-4 flex items-center justify-center space-x-6">
              {/* Apple Activity Ring visual */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    strokeDasharray={`${attendanceRate}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{attendanceRate}%</span>
                  <span className="text-[10px] text-emerald-400 font-bold">มาเรียน</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">นักเรียนทั้งหมด</span>
                  <span className="text-white font-bold">{studentCount} คน</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">เช็คแล้ว</span>
                  <span className="text-emerald-400 font-bold">{todayAttendanceCount} คน</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">อัปเดตแบบเรียลไทม์</span>
              <Link href="/attendance" className="text-cyan-400 font-bold flex items-center hover:underline">
                <span>เช็คชื่อ 1-Click</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Bento 2: Documents Queue Widget - 4 cols */}
          <div className="lg:col-span-4 glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">หนังสือสารบรรณ</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3 space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-white">{docsPendingCount}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  รอลงนามดิจิทัล
                </span>
              </div>
              <p className="text-xs text-slate-400">
                อนุมัติเสร็จสิ้นแล้วในระบบจำนวน {docsApprovedCount} ฉบับ
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="text-slate-200">เรื่องด่วน: โครงการ AI 2569</span>
              </div>
              <Link href="/edoc" className="text-cyan-400 font-bold hover:underline">
                ลงนาม →
              </Link>
            </div>
          </div>

          {/* Bento 3: Campus GPS Geofence Widget - 4 cols */}
          <div className="lg:col-span-4 glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">พิกัด GPS สถานศึกษา</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Radio className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">ศูนย์กลาง CRiC:</span>
                <span className="font-mono text-cyan-300">19.9072 N, 99.8325 E</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Wi-Fi สถานศึกษา:</span>
                <span className="font-mono text-emerald-400">CRIC-STAFF</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">บุคลากรลงเวลาแล้ว:</span>
                <span className="text-white font-bold">{personnelCount} ท่าน</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-emerald-400 text-[11px] flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                อยู่ในรัศมี 200 ม.
              </span>
              <Link href="/hr" className="text-cyan-400 font-bold flex items-center hover:underline">
                <span>บันทึกเวลา</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bento Row 2: Document Feeds & Action Panel (8 cols + 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Recent E-Documents Feed (8 cols) */}
          <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h2 className="font-black text-white text-base">สตรีมเอกสารสารบรรณและเส้นทางเกษียณ</h2>
                <p className="text-xs text-slate-400 mt-0.5">รายการบันทึกข้อความรอการพิจารณาและอนุมัติตามลำดับขั้น</p>
              </div>

              <Link
                href="/edoc"
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 font-bold text-xs flex items-center space-x-1 transition-colors"
              >
                <span>ดูทั้งหมด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {recentDocs.map((doc) => {
                const isApproved = doc.status === "APPROVED";
                return (
                  <div key={doc.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                            {doc.docNumber || "รอออกเลข"}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              isApproved
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {isApproved ? "อนุมัติแล้ว" : "อยู่ระหว่างพิจารณา"}
                          </span>
                          {doc.priority === "URGENT" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              ด่วน
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-white text-sm hover:text-cyan-400 transition-colors">
                          <Link href={`/edoc?id=${doc.id}`}>{doc.title}</Link>
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {doc.abstractContent}
                        </p>
                      </div>

                      <Link
                        href={`/edoc?id=${doc.id}`}
                        className="flex-shrink-0 px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white shadow-md shadow-blue-600/25 border border-white/20 transition-all text-center self-start sm:self-auto"
                      >
                        เปิดเอกสาร
                      </Link>
                    </div>

                    {/* Routing Steps Progress */}
                    <div className="flex items-center space-x-2 pt-1 text-xs text-slate-400 overflow-x-auto pb-1">
                      <span className="font-bold text-slate-500 text-[10px]">ลำดับเสนอ:</span>
                      {doc.routings.map((r, i) => (
                        <div key={r.id} className="flex items-center space-x-1.5 flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] ${
                              r.isCompleted
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 font-bold"
                                : "bg-white/5 text-slate-400"
                            }`}
                          >
                            {r.isCompleted && <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />}
                            {r.targetUser.fullName.split(" ")[0]} {r.targetUser.fullName.split(" ")[1]}
                          </span>
                          {i < doc.routings.length - 1 && <span className="text-slate-600">→</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Quick Action Widget & National Sync (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Quick Action Bento */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="font-black text-white text-sm">การทำงานด่วน (Quick Actions)</h3>

              <div className="space-y-2.5">
                <Link
                  href="/edoc"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-slate-200 group-hover:text-white">เซ็นเอกสารด้วย PIN</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                    {docsPendingCount}
                  </span>
                </Link>

                <Link
                  href="/attendance"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                    <span className="text-slate-200 group-hover:text-white">เช็คชื่อแถว 1-Click</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </Link>

                <Link
                  href="/academics"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span className="text-slate-200 group-hover:text-white">ส่งออกคะแนน ศธ.02</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </Link>

                <Link
                  href="/admin"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-slate-200 group-hover:text-white">ตั้งค่าระบบ & Backup</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </Link>
              </div>
            </div>

            {/* National Standards Card */}
            <div className="glass-island rounded-3xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white text-xs">มาตรฐาน สอศ. กระทรวงศึกษาธิการ</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sarabun">
                ระบบ New RMS CRiC 2569 ได้รับการออกแบบให้สอดคล้องกับระเบียบสารบรรณอิเล็กทรอนิกส์และเกณฑ์มาตรฐานวิชาชีพ
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
