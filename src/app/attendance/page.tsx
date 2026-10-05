"use client";

import { useState } from "react";
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
  MessageSquare,
  Search,
  Bell,
  Users,
  Filter
} from "lucide-react";

type StudentItem = {
  id: string;
  code: string;
  name: string;
  phone: string;
  status: "PRESENT" | "LATE" | "LEAVE" | "ABSENT";
  source: string;
};

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("IT101");
  const [date, setDate] = useState("2026-10-05");
  const [activeTab, setActiveTab] = useState<"MOBILE" | "BIOMETRIC">("MOBILE");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showLinePreview, setShowLinePreview] = useState(false);

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
    const hasAbsent = students.some((s) => s.status === "ABSENT");
    if (hasAbsent) {
      setShowLinePreview(true);
    }
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
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>พัฒนากิจการนักเรียนฯ</span>
              <span>•</span>
              <span className="text-emerald-400">Smart Attendance 2569</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              เช็คชื่อหน้าเสาธง & โฮมรูม (Fast Check)
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTab("MOBILE")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === "MOBILE"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>ครูเช็คผ่านมือถือ (1-Click)</span>
            </button>

            <button
              onClick={() => setActiveTab("BIOMETRIC")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === "BIOMETRIC"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>Sync เครื่องสแกนนิ้วเดิม</span>
            </button>
          </div>
        </div>

        {/* LINE Alert Smartphone Simulator */}
        {showLinePreview && (
          <div className="glass-island rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-2xl animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  LINE
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">การแจ้งเตือนผู้ปกครองอัตโนมัติ (LINE Official Account)</h3>
                  <p className="text-xs text-emerald-400">ระบบตรวจพบนักเรียนขาดแถว และจำลองการส่ง Webhook เข้าไลน์ผู้ปกครอง</p>
                </div>
              </div>
              <button
                onClick={() => setShowLinePreview(false)}
                className="text-xs font-bold px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors self-start md:self-auto"
              >
                ปิดหน้าต่าง
              </button>
            </div>

            <div className="mt-4 max-w-md mx-auto glass-card border border-emerald-400/30 rounded-3xl p-5 shadow-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-bold pb-2 border-b border-white/10">
                <span>🔔 วิทยาลัยอาชีวศึกษา CRiC</span>
                <span className="font-mono text-[10px] text-slate-400">08:15 น.</span>
              </div>
              <p className="text-white font-semibold pt-1">
                เรียน ผู้ปกครองของ <span className="text-amber-400">นางสาวบุษกร รุ่งเรือง</span>
              </p>
              <p className="text-slate-300 leading-relaxed font-sarabun">
                ขอแจ้งให้ทราบว่า ในวันนี้ (5 ต.ค. 2569) นักศึกษายังไม่ได้เข้าร่วมกิจกรรมหน้าเสาธง/โฮมรูมของวิทยาลัย หากมีเหตุจำเป็นโปรดยื่นใบลาผ่านระบบ New RMS
              </p>
              <div className="pt-2 text-[10px] text-slate-400 font-mono">
                ฝ่ายพัฒนากิจการนักเรียนนักศึกษา • โทร. 053-711234
              </div>
            </div>
          </div>
        )}

        {/* Toolbar & Filters */}
        <div className="glass-island p-5 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                กลุ่มเรียน
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs font-bold p-2.5 rounded-2xl glass-input"
              >
                <option value="IT101" className="bg-slate-900">ปวช. 1/1 แผนกเทคโนโลยีสารสนเทศ</option>
                <option value="IT201" className="bg-slate-900">ปวช. 2/1 แผนกเทคโนโลยีสารสนเทศ</option>
                <option value="ACC101" className="bg-slate-900">ปวช. 1/1 แผนกการบัญชี</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                วันที่
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-xs font-bold p-2 rounded-2xl glass-input"
              />
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                ค้นหานักศึกษา
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ หรือ รหัสนักเรียน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-2xl glass-input w-full sm:w-56"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2 md:pt-0">
            <button
              onClick={markAllPresent}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold text-xs flex items-center space-x-1.5 border border-emerald-500/30 transition-all"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>มาครบทุกคน (1-Click)</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/25 ring-1 ring-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการเช็คชื่อ</span>
            </button>
          </div>
        </div>

        {/* Live Counters Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card glass-card-hover p-4 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400">มาเข้าแถว</span>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">{presentCount}</p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>

          <div className="glass-card glass-card-hover p-4 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400">มาสาย</span>
              <p className="text-2xl font-black text-amber-400 mt-0.5">{lateCount}</p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ⏳
            </div>
          </div>

          <div className="glass-card glass-card-hover p-4 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400">มีใบลา</span>
              <p className="text-2xl font-black text-cyan-400 mt-0.5">{leaveCount}</p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-blue-500/20 text-cyan-400 flex items-center justify-center font-bold">
              📄
            </div>
          </div>

          <div className="glass-card glass-card-hover p-4 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400">ขาดแถว (LINE)</span>
              <p className="text-2xl font-black text-rose-400 mt-0.5">{absentCount}</p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              ✕
            </div>
          </div>
        </div>

        {/* Student Cards List */}
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h3 className="font-bold text-white text-sm">
              รายชื่อนักศึกษา ปวช. 1/1 (อาจารย์สมชาย ปัญญาดี - ครูที่ปรึกษา)
            </h3>
            <span className="text-xs font-bold text-slate-400">พบ {filteredStudents.length} คน</span>
          </div>

          <div className="divide-y divide-white/5">
            {filteredStudents.map((student, idx) => (
              <div
                key={student.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 text-slate-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{student.name}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-white/10 text-cyan-300 font-semibold border border-white/10">
                        {student.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">เบอร์ผู้ปกครอง: {student.phone}</p>
                  </div>
                </div>

                {/* 4 Status Toggle Buttons */}
                <div className="flex items-center space-x-1.5 self-end sm:self-center">
                  <button
                    onClick={() => setStudentStatus(student.id, "PRESENT")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      student.status === "PRESENT"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 ring-1 ring-white/30 scale-105"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    มา
                  </button>
                  <button
                    onClick={() => setStudentStatus(student.id, "LATE")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      student.status === "LATE"
                        ? "bg-amber-600 text-white shadow-lg shadow-amber-600/40 ring-1 ring-white/30 scale-105"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    สาย
                  </button>
                  <button
                    onClick={() => setStudentStatus(student.id, "LEAVE")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      student.status === "LEAVE"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-1 ring-white/30 scale-105"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    ลา
                  </button>
                  <button
                    onClick={() => setStudentStatus(student.id, "ABSENT")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      student.status === "ABSENT"
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-1 ring-white/30 scale-105"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
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
