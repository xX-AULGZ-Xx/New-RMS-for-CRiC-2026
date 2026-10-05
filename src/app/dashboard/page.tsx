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
  TrendingUp,
  Building2,
  Sparkles,
  ChevronRight,
  Filter,
  BarChart3,
  Calendar
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
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: { creator: true, routings: { include: { targetUser: true } } },
    }),
    prisma.studentAttendance.count(),
  ]);

  // Attendance rate simulation (e.g. 96.4%)
  const attendanceRate = studentCount > 0 ? ((studentCount - 1) / studentCount * 100).toFixed(1) : "96.4";

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Executive Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 rounded-full backdrop-blur">
                  ภาคเรียนที่ 1 / ปีการศึกษา 2569
                </span>
                <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                  ระบบเชื่อมต่อ PostgreSQL สมบูรณ์
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                ยินดีต้อนรับ ดร.สมเกียรติ ยิ่งเจริญ
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                ผู้อำนวยการวิทยาลัยอาชีวศึกษา CRiC • วันนี้มีหนังสือราชการรอการพิจารณาเกษียณและลงนามจำนวน{" "}
                <span className="font-bold text-amber-300">{docsPendingCount} ฉบับ</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/edoc"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>พิจารณาลงนาม ({docsPendingCount})</span>
              </Link>
              <Link
                href="/attendance"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur border border-white/10 transition-colors"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-300" />
                <span>ตรวจแถวหน้าเสาธง</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">หนังสือรอเกษียณ</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">{docsPendingCount}</span>
              <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                รอลงนาม
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
              <span>อนุมัติแล้ว: {docsApprovedCount} ฉบับ</span>
              <Link href="/edoc" className="text-blue-600 font-semibold hover:underline">จัดการ →</Link>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">การเข้าแถววันนี้</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">{attendanceRate}%</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                อัตราการมาเรียน
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
              <span>นักเรียนทั้งหมด {studentCount} คน</span>
              <Link href="/attendance" className="text-emerald-600 font-semibold hover:underline">เช็คชื่อ →</Link>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">บุคลากรลงเวลา</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">{personnelCount}</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                อยู่ในสถานศึกษา
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
              <span>รัศมี GPS &le; 200 เมตร</span>
              <Link href="/hr" className="text-amber-600 font-semibold hover:underline">บันทึกเวลา →</Link>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">แผนกวิชา / สาขา</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">{departmentCount}</span>
              <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                พร้อมส่ง ศธ.02
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
              <span>หลักสูตร สอศ. 2569</span>
              <Link href="/academics" className="text-indigo-600 font-semibold hover:underline">ตัดเกรด →</Link>
            </div>
          </div>
        </div>

        {/* Attendance Trend Bar & Recent Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent E-Documents (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg">รายการหนังสือราชการล่าสุด (E-Documents)</h2>
                <p className="text-xs text-slate-500 mt-0.5">แสดงลำดับขั้นและสถานะการพิจารณาเกษียณหนังสือ</p>
              </div>

              <Link
                href="/edoc"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors self-start sm:self-auto"
              >
                <span>จัดการหนังสือทั้งหมด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentDocs.map((doc) => {
                const isApproved = doc.status === "APPROVED";
                return (
                  <div key={doc.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {doc.docNumber || "รอออกเลข"}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              isApproved
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isApproved ? "อนุมัติเรียบร้อย" : "รอการลงนาม"}
                          </span>
                          {doc.priority === "URGENT" && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                              ด่วน
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                          <Link href={`/edoc?id=${doc.id}`}>{doc.title}</Link>
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {doc.abstractContent}
                        </p>
                      </div>

                      <Link
                        href={`/edoc?id=${doc.id}`}
                        className="flex-shrink-0 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors text-center"
                      >
                        พิจารณา
                      </Link>
                    </div>

                    {/* Routing Steps Progress */}
                    <div className="flex items-center space-x-2 pt-1 text-xs text-slate-500 overflow-x-auto pb-1">
                      <span className="font-bold text-slate-600 text-[11px]">สายการเสนอ:</span>
                      {doc.routings.map((r, i) => (
                        <div key={r.id} className="flex items-center space-x-1.5 flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] ${
                              r.isCompleted
                                ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {r.isCompleted && <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />}
                            {r.targetUser.fullName.split(" ")[0]} {r.targetUser.fullName.split(" ")[1]}
                          </span>
                          {i < doc.routings.length - 1 && <span className="text-slate-300">→</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Weekly Attendance & Fast Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Weekly Attendance Rate Chart Bar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">สถิติเข้าแถวสัปดาห์นี้</h3>
                  <p className="text-[11px] text-slate-400">อัตราเฉลี่ย 95.8% (จ.-ศ.)</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>

              {/* Day Bars */}
              <div className="space-y-2.5 pt-2 text-xs">
                {[
                  { day: "จันทร์ (วันนี้)", rate: 98, color: "bg-emerald-500" },
                  { day: "อังคาร", rate: 96, color: "bg-emerald-500" },
                  { day: "พุธ", rate: 94, color: "bg-emerald-500" },
                  { day: "พฤหัสบดี", rate: 95, color: "bg-emerald-500" },
                  { day: "ศุกร์", rate: 96, color: "bg-emerald-500" },
                ].map((d, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold text-slate-600 text-[11px]">
                      <span>{d.day}</span>
                      <span className="font-mono text-slate-800">{d.rate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.rate}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick College Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 text-white shadow-lg space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-sm">ข้อมูลสถานศึกษา (CRiC)</h4>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">สังกัด:</span>
                  <span className="font-semibold text-white">สอศ. (อาชีวศึกษา)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">พิกัดสถานศึกษา:</span>
                  <span className="font-mono text-cyan-300">19.9072 N, 99.8325 E</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Wi-Fi ออฟฟิเชียล:</span>
                  <span className="font-mono text-emerald-400">CRIC-STAFF</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">มาตรฐานเกรด:</span>
                  <span className="font-semibold text-amber-300">ศธ.02 สอศ. Compatible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
