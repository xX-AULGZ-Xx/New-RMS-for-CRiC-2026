import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
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
  Building2
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Fetch real counts from Database
  const [
    docsPendingCount,
    studentCount,
    personnelCount,
    departmentCount,
    recentDocs,
    todayAttendanceCount,
  ] = await Promise.all([
    prisma.document.count({ where: { status: { in: ["ROUTING", "DRAFT"] } } }),
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-md">
                ปีการศึกษา 2569
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-emerald-600 font-medium flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                ระบบฐานข้อมูลออนไลน์ปกติ
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              แผงควบคุมหลัก (Executive Dashboard)
            </h1>
            <p className="text-sm text-slate-500">
              วิทยาลัยอาชีวศึกษา CRiC - ยินดีต้อนรับ ดร.สมเกียรติ ยิ่งเจริญ (ผู้อำนวยการ)
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/edoc"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>เกษียณหนังสือ ({docsPendingCount})</span>
            </Link>
            <Link
              href="/attendance"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>เช็คชื่อเข้าแถว</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">หนังสือรอเกษียณ</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">{docsPendingCount}</span>
              <span className="text-xs text-rose-500 font-medium">รอการลงนาม</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">สารบรรณอิเล็กทรอนิกส์</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">นักเรียน/นักศึกษา</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">{studentCount}</span>
              <span className="text-xs text-emerald-600 font-medium">บันทึกแล้ว {todayAttendanceCount} ราย</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">ระบบเช็คชื่อหน้าเสาธง</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">ครูและบุคลากร</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">{personnelCount}</span>
              <span className="text-xs text-emerald-600 font-medium">GPS Geofence</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">ลงเวลาและขอลาออนไลน์</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">แผนกวิชา / สาขา</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">{departmentCount}</span>
              <span className="text-xs text-indigo-600 font-medium">หลักสูตร สอศ.</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">พร้อมเชื่อมต่อ ศธ.02</p>
          </div>
        </div>

        {/* Main Content Grid: Recent Documents & Quick Action */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent E-Documents (Left 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">เอกสารสารบรรณและเส้นทางเกษียณล่าสุด</h2>
                <p className="text-xs text-slate-500">แสดงลำดับขั้นการพิจารณาและลงลายมือชื่อ</p>
              </div>
              <Link
                href="/edoc"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
              >
                <span>ดูทั้งหมด</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentDocs.map((doc) => {
                const isApproved = doc.status === "APPROVED";
                return (
                  <div key={doc.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {doc.docNumber || "รอออกเลข"}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isApproved
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {isApproved ? "อนุมัติแล้ว" : "อยู่ระหว่างเกษียณ"}
                          </span>
                          {doc.priority === "URGENT" && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                              ด่วน
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-slate-900 text-sm mt-1.5 line-clamp-1">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                          {doc.abstractContent}
                        </p>
                      </div>

                      <Link
                        href={`/edoc?id=${doc.id}`}
                        className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        เปิดเอกสาร
                      </Link>
                    </div>

                    {/* Routing Steps Progress */}
                    <div className="flex items-center space-x-2 pt-1 text-xs text-slate-500 overflow-x-auto">
                      <span className="font-semibold text-slate-600">เส้นทาง:</span>
                      {doc.routings.map((r, i) => (
                        <div key={r.id} className="flex items-center space-x-1.5 flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] ${
                              r.isCompleted
                                ? "bg-emerald-50 text-emerald-700 font-semibold"
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

          {/* Quick Actions & System Info (Right 1 col) */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-md">
              <h3 className="font-bold text-lg mb-1">เมนูด่วนสำหรับผู้บริหาร</h3>
              <p className="text-xs text-blue-200 mb-4">
                ลงนามและตรวจสอบงานได้ทันทีผ่านสมาร์ทโฟน
              </p>

              <div className="space-y-2.5">
                <Link
                  href="/edoc"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur"
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-cyan-300" />
                    <span>เกษียณหนังสือด่วน</span>
                  </div>
                  <span className="text-xs bg-rose-500 px-2 py-0.5 rounded-full font-bold">
                    {docsPendingCount}
                  </span>
                </Link>

                <Link
                  href="/attendance"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur"
                >
                  <div className="flex items-center space-x-2.5">
                    <CalendarCheck className="w-4 h-4 text-emerald-300" />
                    <span>ตรวจสอบแถวหน้าเสาธง</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </Link>

                <Link
                  href="/academics"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur"
                >
                  <div className="flex items-center space-x-2.5">
                    <GraduationCap className="w-4 h-4 text-amber-300" />
                    <span>ส่งออกข้อมูล ศธ.02</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </Link>
              </div>
            </div>

            {/* Quick College Info */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">การเชื่อมต่อและพิกัดสถานศึกษา</h4>
              <div className="text-xs text-slate-600 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">สถานศึกษา:</span>
                  <span className="font-medium">วิทยาลัยอาชีวศึกษา CRiC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">พิกัด GPS:</span>
                  <span className="font-mono">19.9072 N, 99.8325 E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">รัศมี Geofence:</span>
                  <span className="font-mono">200 เมตร</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wi-Fi สถานศึกษา:</span>
                  <span className="font-mono">CRIC-STAFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
