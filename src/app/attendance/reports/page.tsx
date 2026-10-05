"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  FileText,
  BarChart3,
  Calendar,
  Download,
  Filter,
  ArrowLeft,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  UserX,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { formatThaiDate } from "@/lib/thai-date";

type DeptStat = {
  department: string;
  totalStudents: number;
  presentRate: number; // %
  lateRate: number;    // %
  absentRate: number;  // %
  atRiskCount: number; // จำนวนคนเสี่ยง มผ.
};

type RiskStudent = {
  id: string;
  code: string;
  name: string;
  department: string;
  level: string;
  advisor: string;
  advisorPhone: string;
  attendedDays: number;
  totalDays: number;
  percentage: number;
};

export default function AttendanceReportsPage() {
  const [selectedSemester, setSelectedSemester] = useState("1/2569");
  const [selectedPeriod, setSelectedPeriod] = useState<"WEEKLY" | "MONTHLY" | "SEMESTER">("MONTHLY");
  const [selectedMonth, setSelectedMonth] = useState("ตุลาคม 2569");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("ALL");

  const deptStats: DeptStat[] = [
    { department: "แผนกวิชาเทคโนโลยีสารสนเทศ", totalStudents: 240, presentRate: 94.2, lateRate: 4.1, absentRate: 1.7, atRiskCount: 2 },
    { department: "แผนกวิชาการบัญชี", totalStudents: 310, presentRate: 91.5, lateRate: 5.5, absentRate: 3.0, atRiskCount: 5 },
    { department: "แผนกวิชาช่างไฟฟ้ากำลัง", totalStudents: 280, presentRate: 88.0, lateRate: 7.2, absentRate: 4.8, atRiskCount: 8 },
    { department: "แผนกวิชาช่างยนต์", totalStudents: 350, presentRate: 84.6, lateRate: 9.8, absentRate: 5.6, atRiskCount: 14 },
    { department: "แผนกวิชาการตลาด", totalStudents: 190, presentRate: 89.4, lateRate: 6.3, absentRate: 4.3, atRiskCount: 4 },
    { department: "แผนกวิชาอิเล็กทรอนิกส์", totalStudents: 160, presentRate: 87.5, lateRate: 8.0, absentRate: 4.5, atRiskCount: 6 },
  ];

  const riskStudents: RiskStudent[] = [
    { id: "std-r1", code: "6920901004", name: "นางสาวบุษกร รุ่งเรือง", department: "การบัญชี", level: "ปวช.3/2", advisor: "อ.สุดา ใจดี", advisorPhone: "081-234-5678", attendedDays: 28, totalDays: 40, percentage: 70.0 },
    { id: "std-r2", code: "6920901003", name: "นายธนดล เจริญพร", department: "ช่างยนต์", level: "ปวช.2/3", advisor: "อ.ประสิทธิ์ สุขภาพ", advisorPhone: "089-987-6543", attendedDays: 31, totalDays: 40, percentage: 77.5 },
    { id: "std-r3", code: "6920901029", name: "นายเอกชัย รักษ์ดี", department: "ช่างยนต์", level: "ปวช.1/1", advisor: "อ.ประสิทธิ์ สุขภาพ", advisorPhone: "089-987-6543", attendedDays: 29, totalDays: 40, percentage: 72.5 },
    { id: "std-r4", code: "6920901045", name: "นายชินวัตร วิริยะ", department: "ช่างไฟฟ้ากำลัง", level: "ปวส.1/2", advisor: "อ.สมศักดิ์ แซ่ตั้ง", advisorPhone: "086-555-1234", attendedDays: 30, totalDays: 40, percentage: 75.0 },
  ];

  const filteredDepts = selectedDeptFilter === "ALL"
    ? deptStats
    : deptStats.filter(d => d.department.includes(selectedDeptFilter));

  const overallTotal = deptStats.reduce((acc, d) => acc + d.totalStudents, 0);
  const overallAvgPresent = (deptStats.reduce((acc, d) => acc + d.presentRate * d.totalStudents, 0) / overallTotal).toFixed(1);
  const totalRiskCount = deptStats.reduce((acc, d) => acc + d.atRiskCount, 0);

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/attendance"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-xs transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              กลับหน้าเลือกโหมดเช็คชื่อ
            </Link>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-white/90 text-xs font-semibold">งานพัฒนากิจการนักเรียนนักศึกษา (Student Affairs)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("กำลังส่งออกรายงาน PDF ประจำเดือน...")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์รายงานสรุป (PDF)</span>
            </button>
            <button
              onClick={() => alert("กำลังส่งออกไฟล์สถิติ Excel (.xlsx)...")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>ส่งออก Excel</span>
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-purple-950/40 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Student Affairs Analytics
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-white/10 text-amber-300 border border-white/15 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  สถิติล่าสุด: {formatThaiDate(new Date(), { showDayOfWeek: true })}
                </span>
                <span className="text-xs text-white/50">เกณฑ์ สอศ. ผ่านกิจกรรม &ge; 80%</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <FileText className="w-7 h-7 text-amber-400" />
                รายงานสถิติการเข้าแถวและกิจกรรมนักศึกษา
              </h1>
              <p className="text-sm text-white/60 mt-1 max-w-2xl">
                สรุปเปอร์เซ็นต์การเข้าร่วมกิจกรรมหน้าเสาธงและโฮมรูม แยกตามแผนกวิชา ชั้นปี และรายบุคคล สำหรับงานพัฒนากิจการนักเรียนนักศึกษา วิทยาลัยเทคนิค/อาชีวศึกษา
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Period Mode Toggle */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-1 flex">
                <button
                  onClick={() => setSelectedPeriod("WEEKLY")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedPeriod === "WEEKLY" ? "bg-amber-500 text-black font-semibold" : "text-white/60 hover:text-white"
                  }`}
                >
                  รายสัปดาห์
                </button>
                <button
                  onClick={() => setSelectedPeriod("MONTHLY")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedPeriod === "MONTHLY" ? "bg-amber-500 text-black font-semibold" : "text-white/60 hover:text-white"
                  }`}
                >
                  รายเดือน
                </button>
                <button
                  onClick={() => setSelectedPeriod("SEMESTER")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedPeriod === "SEMESTER" ? "bg-amber-500 text-black font-semibold" : "text-white/60 hover:text-white"
                  }`}
                >
                  ทั้งภาคเรียน
                </button>
              </div>

              {/* Month Selector */}
              <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="ตุลาคม 2569" className="bg-slate-900 text-white">ตุลาคม 2569</option>
                  <option value="กันยายน 2569" className="bg-slate-900 text-white">กันยายน 2569</option>
                  <option value="สิงหาคม 2569" className="bg-slate-900 text-white">สิงหาคม 2569</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 text-xs mb-1">
              <span>นักศึกษาทั้งหมด</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{overallTotal.toLocaleString()} <span className="text-xs font-normal text-white/50">คน</span></div>
            <div className="text-[11px] text-white/50 mt-1">
              6 แผนกวิชา • ปวช. และ ปวส.
            </div>
          </div>

          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 text-xs mb-1">
              <span>เฉลี่ยเข้าแถวทั้งวิทยาลัย</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">{overallAvgPresent}%</div>
            <div className="text-[11px] text-emerald-400/80 mt-1">
              สูงกว่าเกณฑ์ขั้นต่ำ สอศ. (+9.2%)
            </div>
          </div>

          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 text-xs mb-1">
              <span>เสี่ยงไม่ผ่านกิจกรรม (&lt;80%)</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-400">{totalRiskCount} <span className="text-xs font-normal text-white/50">คน</span></div>
            <div className="text-[11px] text-rose-400/80 mt-1">
              ต้องดำเนินการเข้าค่ายชดเชยกิจกรรม
            </div>
          </div>

          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 text-xs mb-1">
              <span>แผนกที่เข้าแถวสูงสุด</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-cyan-400 truncate">เทคโนโลยีสารสนเทศ</div>
            <div className="text-[11px] text-cyan-300/80 mt-1">
              สถิติเข้าแถว 94.2%
            </div>
          </div>
        </div>

        {/* Section 1: Department Breakdown Table & Progress Bars */}
        <div className="rounded-2xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                สถิติการเข้าร่วมกิจกรรมแยกตามแผนกวิชา ({selectedMonth})
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                เปรียบเทียบสัดส่วน มาตรงเวลา, สาย, ขาด และจำนวนนักศึกษาที่อยู่ในกลุ่มเสี่ยง มผ.
              </p>
            </div>

            {/* Quick Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">กรองแผนก:</span>
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                <option value="ALL">ทั้งหมดทุกแผนก</option>
                <option value="เทคโนโลยีสารสนเทศ">เทคโนโลยีสารสนเทศ</option>
                <option value="การบัญชี">การบัญชี</option>
                <option value="ช่างไฟฟ้ากำลัง">ช่างไฟฟ้ากำลัง</option>
                <option value="ช่างยนต์">ช่างยนต์</option>
                <option value="การตลาด">การตลาด</option>
                <option value="อิเล็กทรอนิกส์">อิเล็กทรอนิกส์</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="bg-white/5 text-white/60 border-b border-white/10 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">แผนกวิชา</th>
                  <th className="py-3 px-3 text-center">นักศึกษา (คน)</th>
                  <th className="py-3 px-4">แถบวัดเปอร์เซ็นต์การเข้าแถว</th>
                  <th className="py-3 px-3 text-center">มา (%)</th>
                  <th className="py-3 px-3 text-center">สาย (%)</th>
                  <th className="py-3 px-3 text-center">ขาด (%)</th>
                  <th className="py-3 px-3 text-center">เสี่ยง มผ. (&lt;80%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDepts.map((d, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      {d.department}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-white/70">
                      {d.totalStudents}
                    </td>
                    <td className="py-3 px-4 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-3 rounded-full bg-black/40 overflow-hidden flex">
                          <div
                            style={{ width: `${d.presentRate}%` }}
                            className="bg-emerald-500 h-full"
                            title={`มา: ${d.presentRate}%`}
                          />
                          <div
                            style={{ width: `${d.lateRate}%` }}
                            className="bg-amber-500 h-full"
                            title={`สาย: ${d.lateRate}%`}
                          />
                          <div
                            style={{ width: `${d.absentRate}%` }}
                            className="bg-rose-500 h-full"
                            title={`ขาด: ${d.absentRate}%`}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-emerald-400 font-mono w-10 text-right">
                          {d.presentRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-semibold font-mono">
                      {d.presentRate}%
                    </td>
                    <td className="py-3 px-3 text-center text-amber-400 font-mono">
                      {d.lateRate}%
                    </td>
                    <td className="py-3 px-3 text-center text-rose-400 font-mono">
                      {d.absentRate}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        d.atRiskCount > 0 ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300"
                      }`}>
                        {d.atRiskCount} คน
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: At-Risk Students List (ติดตามผู้เรียนเสี่ยง มผ. กิจกรรม) */}
        <div className="rounded-2xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                รายชื่อนักศึกษาที่มีความเสี่ยงไม่ผ่านกิจกรรมหน้าเสาธง (&lt; 80%)
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                รายชื่อที่ต้องประสานงานครูที่ปรึกษาและงานพัฒนากิจการนักเรียนนักศึกษาเพื่อดำเนินการเข้าค่ายเสริมสร้างวินัย
              </p>
            </div>
            <span className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full font-semibold">
              ทั้งหมด {riskStudents.length} รายการ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="bg-white/5 text-white/60 border-b border-white/10 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">รหัสนักศึกษา</th>
                  <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                  <th className="py-3 px-3">แผนกวิชา / ชั้นปี</th>
                  <th className="py-3 px-3 text-center">มา / ทั้งหมด (วัน)</th>
                  <th className="py-3 px-3 text-center">เปอร์เซ็นต์</th>
                  <th className="py-3 px-4">ครูที่ปรึกษา</th>
                  <th className="py-3 px-3 text-center">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {riskStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.03] transition">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {s.code}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {s.name}
                    </td>
                    <td className="py-3 px-3 text-white/70">
                      {s.department} • {s.level}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="text-rose-400 font-bold">{s.attendedDays}</span> / {s.totalDays}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {s.percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/80">
                      <div>{s.advisor}</div>
                      <div className="text-[11px] text-white/40">{s.advisorPhone}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => alert(`โทรประสานงานครูที่ปรึกษา: ${s.advisor} (${s.advisorPhone})`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition"
                      >
                        <PhoneCall className="w-3 h-3 text-amber-400" />
                        <span>ติดต่อครู</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
