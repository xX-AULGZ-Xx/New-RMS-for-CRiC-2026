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

  // Set all students to PRESENT with 1 click
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

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>พัฒนากิจการนักเรียนนักศึกษา</span>
              <span>•</span>
              <span className="text-emerald-600">Smart Attendance 2569</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              เช็คชื่อเข้าแถวหน้าเสาธง & กิจกรรมโฮมรูม
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab("MOBILE")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === "MOBILE"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>ครูเช็คผ่านมือถือ (Fast 1-Click)</span>
            </button>

            <button
              onClick={() => setActiveTab("BIOMETRIC")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === "BIOMETRIC"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
              <span>ดึงข้อมูลเครื่องสแกนเดิม</span>
            </button>
          </div>
        </div>

        {/* LINE Alert Smartphone Simulator */}
        {showLinePreview && (
          <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-800 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-800/80">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  LINE
                </div>
                <div>
                  <h3 className="font-bold text-sm">ตัวอย่างข้อความแจ้งเตือนผู้ปกครอง (LINE Official Account)</h3>
                  <p className="text-xs text-emerald-300">ส่งแจ้งเตือนอัตโนมัติทันทีที่ตรวจพบนักเรียนขาดแถว</p>
                </div>
              </div>
              <button
                onClick={() => setShowLinePreview(false)}
                className="text-xs font-bold px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition-colors self-start md:self-auto"
              >
                ปิดหน้าต่าง
              </button>
            </div>

            <div className="mt-4 max-w-md mx-auto bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-lg text-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold pb-2 border-b border-slate-800">
                <span>🔔 วิทยาลัยอาชีวศึกษา CRiC</span>
                <span className="font-mono text-[10px]">08:15 น.</span>
              </div>
              <p className="text-white font-semibold pt-1">
                เรียน ผู้ปกครองของ <span className="text-amber-300">นางสาวบุษกร รุ่งเรือง</span>
              </p>
              <p className="text-slate-300 leading-relaxed">
                ขอแจ้งให้ทราบว่า ในวันนี้ (5 ต.ค. 2569) นักศึกษายังไม่ได้เข้าร่วมกิจกรรมหน้าเสาธง/โฮมรูมของวิทยาลัย หากมีเหตุจำเป็นโปรดยื่นใบลาผ่านระบบ New RMS
              </p>
              <div className="pt-2 text-[10px] text-slate-400 font-mono">
                ฝ่ายพัฒนากิจการนักเรียนนักศึกษา • โทร. 053-711234
              </div>
            </div>
          </div>
        )}

        {/* Filter & Action Toolbar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                กลุ่มเรียน
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="IT101">ปวช. 1/1 แผนกวิชาเทคโนโลยีสารสนเทศ</option>
                <option value="IT201">ปวช. 2/1 แผนกวิชาเทคโนโลยีสารสนเทศ</option>
                <option value="ACC101">ปวช. 1/1 แผนกวิชาการบัญชี</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                วันที่
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-xs font-bold p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                ค้นหานักศึกษา
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ หรือ รหัสนักเรียน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full sm:w-56"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2 md:pt-0">
            <button
              onClick={markAllPresent}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center space-x-1.5 border border-emerald-200 transition-colors shadow-xs"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>มาครบทุกคน (1-Click)</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการเช็คชื่อ</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500">มาเข้าแถว</span>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">{presentCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500">มาสาย</span>
              <p className="text-2xl font-black text-amber-500 mt-0.5">{lateCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              ⏳
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500">มีใบลา</span>
              <p className="text-2xl font-black text-blue-600 mt-0.5">{leaveCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              📄
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500">ขาดแถว (แจ้ง LINE)</span>
              <p className="text-2xl font-black text-rose-600 mt-0.5">{absentCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              ✕
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm">
              รายชื่อนักศึกษา ปวช. 1/1 (ครูที่ปรึกษา: อาจารย์สมชาย ปัญญาดี)
            </h3>
            <span className="text-xs font-bold text-slate-400">พบ {filteredStudents.length} รายการ</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredStudents.map((student, idx) => (
              <div
                key={student.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{student.name}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                        {student.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">เบอร์ผู้ปกครอง: {student.phone}</p>
                  </div>
                </div>

                {/* 4 Status Toggle Buttons with active colors */}
                <div className="flex items-center space-x-1.5 self-end sm:self-center">
                  <button
                    onClick={() => setStudentStatus(student.id, "PRESENT")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      student.status === "PRESENT"
                        ? "bg-emerald-600 text-white shadow-xs scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    มา
                  </button>
                  <button
                    onClick={() => setStudentStatus(student.id, "LATE")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      student.status === "LATE"
                        ? "bg-amber-500 text-white shadow-xs scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    สาย
                  </button>
                  <button
                    onClick={() => setStudentStatus(student.id, "LEAVE")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      student.status === "LEAVE"
                        ? "bg-blue-600 text-white shadow-xs scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    ลา
                  </button>
                  <button
                    onClick={() => setStudentStatus(student.id, "ABSENT")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      student.status === "ABSENT"
                        ? "bg-rose-600 text-white shadow-xs scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
