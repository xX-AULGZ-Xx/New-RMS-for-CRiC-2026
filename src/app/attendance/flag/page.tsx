"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { saveAttendanceBatchAction } from "@/lib/actions";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  UserX,
  AlertTriangle,
  Send,
  Save,
  Fingerprint,
  Smartphone,
  Check,
  Search,
  Users,
  Filter,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Flame
} from "lucide-react";

type StudentItem = {
  id: string;
  code: string;
  name: string;
  phone: string;
  status: "PRESENT" | "LATE" | "LEAVE" | "ABSENT";
  source: string;
};

export default function AttendanceFlagPage() {
  const [selectedClass, setSelectedClass] = useState("IT101");
  const [date, setDate] = useState("2026-10-05");
  const [activeTab, setActiveTab] = useState<"MOBILE" | "BIOMETRIC">("MOBILE");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const [students, setStudents] = useState<StudentItem[]>([
    { id: "std-1", code: "6920901001", name: "นายกิตติคุณ มั่นคง", phone: "089-111-2221", status: "PRESENT", source: "TEACHER_APP" },
    { id: "std-2", code: "6920901002", name: "นางสาวณิชา ภักดี", phone: "089-111-2222", status: "PRESENT", source: "TEACHER_APP" },
    { id: "std-3", code: "6920901003", name: "นายธนดล เจริญพร", phone: "089-111-2223", status: "LATE", source: "TEACHER_APP" },
    { id: "std-4", code: "6920901004", name: "นางสาวบุษกร รุ่งเรือง", phone: "089-111-2224", status: "ABSENT", source: "TEACHER_APP" },
    { id: "std-5", code: "6920901005", name: "นายวรพจน์ สุขสวัสดิ์", phone: "089-111-2225", status: "PRESENT", source: "TEACHER_APP" },
  ]);

  // 1-Click: Set all to PRESENT
  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "PRESENT" })));
  };

  const setStudentStatus = (id: string, status: "PRESENT" | "LATE" | "LEAVE" | "ABSENT") => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleSave = async () => {
    setIsSaved(true);
    await saveAttendanceBatchAction({
      classroomId: selectedClass,
      records: students.map((s) => ({
        studentId: s.id,
        status: s.status,
      })),
    });
    setTimeout(() => setIsSaved(false), 4000);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.includes(searchQuery)
  );

  // Stats
  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;
  const leaveCount = students.filter((s) => s.status === "LEAVE").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;
  const attendanceRate = Math.round((presentCount / students.length) * 100);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6 pb-12 pt-2">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold">
          <Link href="/attendance" className="hover:text-emerald-300 transition-colors flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ศูนย์ระบบเช็คชื่อ</span>
          </Link>
          <span>/</span>
          <span className="text-emerald-400">เช็คชื่อหน้าเสาธง & โฮมรูม</span>
        </div>

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>พัฒนากิจการนักเรียนฯ</span>
              <span>•</span>
              <span className="text-emerald-400">Flag Ceremony Fast Check 2569</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight flex items-center space-x-3">
              <span>เช็คชื่อเข้าแถวหน้าเสาธง & โฮมรูม</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 font-mono font-medium">
                1-Click Fast Check
              </span>
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTab("MOBILE")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "MOBILE"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>ครูเช็คผ่านแอป</span>
            </button>
            <button
              onClick={() => setActiveTab("BIOMETRIC")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "BIOMETRIC"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span>ดึงจากเครื่องสแกนเดิม</span>
            </button>
          </div>
        </div>

        {/* Fast Action & Save Bar */}
        <div className="glass-island p-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs font-bold px-3.5 py-2 rounded-xl glass-input text-white focus:outline-none"
            >
              <option value="IT101" className="bg-[#111827]">ปวช. 1/1 - เทคโนโลยีสารสนเทศ</option>
              <option value="AC101" className="bg-[#111827]">ปวช. 1/2 - การบัญชี</option>
              <option value="MK201" className="bg-[#111827]">ปวช. 2/1 - การตลาด</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-xs font-mono font-bold px-3 py-2 rounded-xl glass-input text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={markAllPresent}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>มาครบทุกคน (1-Click)</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>บันทึกผลเข้าแถว</span>
            </button>
          </div>
        </div>

        {/* Save Success Alert */}
        {isSaved && (
          <div className="glass-island border border-emerald-500/30 rounded-3xl p-4 flex items-center justify-between text-emerald-200 shadow-xl bg-emerald-950/30 animate-fade-in backdrop-blur-xl">
            <div className="flex items-center space-x-3 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-300">บันทึกสถิติการเข้าแถวสำเร็จ!</p>
                <p className="text-slate-300 text-xs">ข้อมูลถูกซิงค์ไปยังงานพัฒนากิจการนักเรียนนักศึกษาเรียบร้อยแล้ว</p>
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

        {/* Apple Bento Summary Grid with Activity Rings */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Apple Watch Style Activity Ring Card */}
          <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center space-x-5 relative overflow-hidden">
            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-700 ease-out"
                  strokeDasharray={`${attendanceRate}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-sm font-black text-white">{attendanceRate}%</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">อัตราเข้าแถว</span>
              <h3 className="font-bold text-white text-base mt-0.5">กิจกรรมหน้าเสาธง</h3>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>มา {presentCount} จาก {students.length} คน</span>
              </p>
            </div>
          </div>

          {/* Stat 1: มา */}
          <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">มาตรงเวลา</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{presentCount} <span className="text-xs font-normal text-slate-400">คน</span></div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold">
              <Check className="w-5 h-5" />
            </div>
          </div>

          {/* Stat 2: สาย */}
          <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">มาสาย</span>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">{lateCount} <span className="text-xs font-normal text-slate-400">คน</span></div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Stat 3: ขาด */}
          <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ขาดแถว</span>
              <div className="text-2xl font-black font-mono text-rose-400 mt-1">{absentCount} <span className="text-xs font-normal text-slate-400">คน</span></div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
              <UserX className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Student Attendance Bento Grid Table */}
        <div className="glass-island rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
          <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">รายชื่อนักศึกษา กลุ่มเรียน ปวช. 1/1</h3>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ หรือ รหัสนักศึกษา..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs rounded-xl glass-input w-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredStudents.map((s, idx) => (
              <div
                key={s.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{s.name}</span>
                      <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {s.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">เบอร์โทรติดต่อ: {s.phone}</p>
                  </div>
                </div>

                {/* 4 Status Toggle Pills */}
                <div className="flex items-center space-x-1.5 bg-white/5 p-1 rounded-2xl border border-white/10 self-end sm:self-auto">
                  <button
                    onClick={() => setStudentStatus(s.id, "PRESENT")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      s.status === "PRESENT"
                        ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    มา
                  </button>
                  <button
                    onClick={() => setStudentStatus(s.id, "LATE")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      s.status === "LATE"
                        ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    สาย
                  </button>
                  <button
                    onClick={() => setStudentStatus(s.id, "LEAVE")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      s.status === "LEAVE"
                        ? "bg-blue-500 text-white font-black shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    ลา
                  </button>
                  <button
                    onClick={() => setStudentStatus(s.id, "ABSENT")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      s.status === "ABSENT"
                        ? "bg-rose-500 text-white font-black shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    ขาด
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
