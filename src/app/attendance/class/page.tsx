"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  GraduationCap,
  CalendarCheck,
  CheckCircle2,
  Clock,
  UserX,
  AlertTriangle,
  Save,
  Check,
  Search,
  BookOpen,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  HelpCircle,
  TrendingDown
} from "lucide-react";

type ClassAttendanceStudent = {
  id: string;
  code: string;
  name: string;
  totalPeriods: number;     // จำนวนคาบทั้งหมด เช่น 36 คาบ
  attendedPeriods: number;  // จำนวนคาบที่เข้าเรียน
  absentPeriods: number;    // จำนวนคาบที่ขาด
  currentStatus: "PRESENT" | "LATE" | "LEAVE" | "ABSENT"; // สถานะคาบปัจจุบัน
};

export default function AttendanceClassPage() {
  const [courseCode, setCourseCode] = useState("30204-2001");
  const [selectedWeek, setSelectedWeek] = useState("8");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const [students, setStudents] = useState<ClassAttendanceStudent[]>([
    { id: "std-1", code: "6920901001", name: "นายกิตติคุณ มั่นคง", totalPeriods: 36, attendedPeriods: 34, absentPeriods: 2, currentStatus: "PRESENT" },
    { id: "std-2", code: "6920901002", name: "นางสาวณิชา ภักดี", totalPeriods: 36, attendedPeriods: 36, absentPeriods: 0, currentStatus: "PRESENT" },
    { id: "std-3", code: "6920901003", name: "นายธนดล เจริญพร", totalPeriods: 36, attendedPeriods: 30, absentPeriods: 6, currentStatus: "LATE" },
    { id: "std-4", code: "6920901004", name: "นางสาวบุษกร รุ่งเรือง", totalPeriods: 36, attendedPeriods: 27, absentPeriods: 9, currentStatus: "ABSENT" },
    { id: "std-5", code: "6920901005", name: "นายวรพจน์ สุขสวัสดิ์", totalPeriods: 36, attendedPeriods: 32, absentPeriods: 4, currentStatus: "PRESENT" },
  ]);

  // 1-Click Fast Check: Set all to present in this period
  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, currentStatus: "PRESENT" })));
  };

  const setStatus = (id: string, st: "PRESENT" | "LATE" | "LEAVE" | "ABSENT") => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, currentStatus: st } : s))
    );
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  const getAttendanceRate = (attended: number, total: number) => {
    return Math.round((attended / total) * 100);
  };

  const getEligibilityStatus = (rate: number) => {
    if (rate >= 85) return { status: "NORMAL", label: "ปกติ (มีสิทธิ์สอบ)", color: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25" };
    if (rate >= 80) return { status: "RISK", label: "เสี่ยง มส. (เตือน)", color: "bg-amber-500/15 text-amber-300 border-amber-400/25" };
    return { status: "INELIGIBLE", label: "หมดสิทธิ์สอบ (มส.)", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" };
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.includes(searchQuery)
  );

  const ineligibleCount = students.filter(
    (s) => getAttendanceRate(s.attendedPeriods, s.totalPeriods) < 80
  ).length;

  const riskCount = students.filter((s) => {
    const rate = getAttendanceRate(s.attendedPeriods, s.totalPeriods);
    return rate >= 80 && rate < 85;
  }).length;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6 pb-12 pt-2">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold">
          <Link href="/attendance" className="hover:text-cyan-300 transition-colors flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ศูนย์ระบบเช็คชื่อ</span>
          </Link>
          <span>/</span>
          <span className="text-cyan-400">เช็คชื่อรายวิชา & สิทธิ์สอบ 80%</span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>ฝ่ายวิชาการ & งานวัดผล</span>
              <span>•</span>
              <span className="text-cyan-400">สอศ. เกณฑ์เวลาเรียน 80%</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight flex items-center space-x-3">
              <span>เช็คชื่อรายวิชา & คำนวณสิทธิ์สอบ 80% (มส.)</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 font-mono font-medium">
                VEC Exam Eligibility
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={markAllPresent}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>มาเรียนครบคาบนี้ (1-Click)</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>บันทึกผลการเข้าเรียน</span>
            </button>
          </div>
        </div>

        {/* Save Success Alert */}
        {isSaved && (
          <div className="glass-island border border-emerald-500/30 rounded-3xl p-4 flex items-center justify-between text-emerald-200 shadow-xl bg-emerald-950/30 animate-fade-in backdrop-blur-xl">
            <div className="flex items-center space-x-3 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-300">บันทึกสถิติการเข้าเรียนรายวิชาสำเร็จ!</p>
                <p className="text-slate-300 text-xs">ระบบคำนวณเปอร์เซ็นต์เวลาเรียนสะสมและอัปเดตสิทธิ์สอบ 80% เรียบร้อยแล้ว</p>
              </div>
            </div>
            <button
              onClick={() => setIsSaved(false)}
              className="text-xs font-bold px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl border border-emerald-500/30 transition-colors"
            >
              ปิด
            </button>
          </div>
        )}

        {/* Course Info Card & Selector */}
        <div className="glass-island p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center font-bold flex-shrink-0 shadow-inner">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
                  {courseCode}
                </span>
                <span className="text-xs text-slate-400 font-medium">ภาคเรียนที่ 1/2569 • 3 หน่วยกิต (2-2-3)</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/25">
                  เกณฑ์ผ่านเวลาเรียน 80%
                </span>
              </div>
              <h3 className="font-bold text-white text-lg mt-1">
                การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่ (Mobile App Dev)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                กลุ่มเรียน: ปวช. 1/1 แผนกวิชา IT • ครูผู้สอน: อาจารย์สมชาย ปัญญาดี
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">สัปดาห์ที่สอน</label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-xl glass-input text-white focus:outline-none"
              >
                {[...Array(18)].map((_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-[#111827]">
                    สัปดาห์ที่ {i + 1} (คาบที่ {i * 2 + 1}-{i * 2 + 2})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Warning Metrics Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">มีสิทธิ์สอบปกติ</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {students.length - riskCount - ineligibleCount} <span className="text-xs font-normal text-slate-400">คน (&ge;85%)</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">เสี่ยง มส. (แจ้งเตือน)</span>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {riskCount} <span className="text-xs font-normal text-slate-400">คน (80-84%)</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">หมดสิทธิ์สอบ (มส.)</span>
              <div className="text-2xl font-black font-mono text-rose-400 mt-1">
                {ineligibleCount} <span className="text-xs font-normal text-slate-400">คน (&lt;80%)</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
              <UserX className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Students Table with Live 80% Calculation */}
        <div className="glass-island rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
          <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">
                ตารางบันทึกการเข้าเรียนสัปดาห์ที่ {selectedWeek} และคำนวณสิทธิ์สอบสะสม
              </h3>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหารหัส หรือชื่อนักศึกษา..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs rounded-xl glass-input w-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-prompt">
              <thead className="bg-white/[0.04] border-b border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">รหัสนักศึกษา</th>
                  <th className="px-5 py-4">ชื่อ - นามสกุล</th>
                  <th className="px-4 py-4 text-center">ชั่วโมงเข้าเรียน</th>
                  <th className="px-4 py-4 text-center">ขาดสะสม</th>
                  <th className="px-4 py-4 text-center">% เวลาเรียนสะสม</th>
                  <th className="px-4 py-4 text-center">สถานะสิทธิ์สอบ (สอศ.)</th>
                  <th className="px-5 py-4 text-center">เช็คชื่อคาบนี้</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((s) => {
                  const rate = getAttendanceRate(s.attendedPeriods, s.totalPeriods);
                  const elig = getEligibilityStatus(rate);

                  return (
                    <tr key={s.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-cyan-300">
                        {s.code}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-bold text-white">
                        {s.name}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-300">
                        {s.attendedPeriods} / {s.totalPeriods} คาบ
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-xs font-bold text-rose-400">
                        {s.absentPeriods} คาบ
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-mono text-sm font-black text-white">
                          {rate}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-xl border ${elig.color}`}>
                          {elig.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        <div className="inline-flex items-center space-x-1 bg-white/5 p-1 rounded-2xl border border-white/10">
                          <button
                            onClick={() => setStatus(s.id, "PRESENT")}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                              s.currentStatus === "PRESENT"
                                ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            มา
                          </button>
                          <button
                            onClick={() => setStatus(s.id, "LATE")}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                              s.currentStatus === "LATE"
                                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            สาย
                          </button>
                          <button
                            onClick={() => setStatus(s.id, "LEAVE")}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                              s.currentStatus === "LEAVE"
                                ? "bg-blue-500 text-white font-black shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            ลา
                          </button>
                          <button
                            onClick={() => setStatus(s.id, "ABSENT")}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                              s.currentStatus === "ABSENT"
                                ? "bg-rose-500 text-white font-black shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            ขาด
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
