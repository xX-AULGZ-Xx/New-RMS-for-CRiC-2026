"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
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
  MessageSquare
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
  const [isSaved, setIsSaved] = useState(false);
  const [lineAlertSent, setLineAlertSent] = useState(false);

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
    // If any student is ABSENT, simulate sending LINE parent alert
    const hasAbsent = students.some((s) => s.status === "ABSENT");
    if (hasAbsent) {
      setLineAlertSent(true);
    }
  };

  // Stats
  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;
  const leaveCount = students.filter((s) => s.status === "LEAVE").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase">
              <span>พัฒนากิจการนักเรียนฯ</span>
              <span>•</span>
              <span className="text-emerald-600">Smart Attendance 2026</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              ระบบเช็คชื่อเข้าแถวหน้าเสาธง & กิจกรรมโฮมรูม
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab("MOBILE")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "MOBILE"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>ครูเช็คผ่านมือถือ (1-Click)</span>
            </button>

            <button
              onClick={() => setActiveTab("BIOMETRIC")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "BIOMETRIC"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
              <span>Sync เครื่องสแกนนิ้วเดิม</span>
            </button>
          </div>
        </div>

        {/* LINE Alert Toast */}
        {lineAlertSent && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3 text-emerald-800">
              <MessageSquare className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-sm">ส่งการแจ้งเตือนไปยังผู้ปกครองผ่าน LINE Official Account แล้ว!</p>
                <p className="text-emerald-700">
                  แจ้งเตือนนักศึกษาขาดแถว: นางสาวบุษกร รุ่งเรือง (รหัส 6920901004) สู่เบอร์ผู้ปกครอง 089-111-2224
                </p>
              </div>
            </div>
            <button
              onClick={() => setLineAlertSent(false)}
              className="text-xs font-bold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              ปิด
            </button>
          </div>
        )}

        {/* Filter & Action Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                ห้องเรียน / กลุ่ม
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-sm font-semibold p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="IT101">ปวช. 1/1 แผนกเทคโนโลยีสารสนเทศ</option>
                <option value="IT201">ปวช. 2/1 แผนกเทคโนโลยีสารสนเทศ</option>
                <option value="ACC101">ปวช. 1/1 แผนกการบัญชี</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                วันที่บันทึก
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-sm font-semibold p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={markAllPresent}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>มาครบทุกคน (1-Click)</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการเช็คชื่อ</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-center">
            <span className="text-xs font-semibold text-slate-500">มาแถว</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{presentCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-center">
            <span className="text-xs font-semibold text-slate-500">มาสาย</span>
            <p className="text-2xl font-black text-amber-500 mt-1">{lateCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-center">
            <span className="text-xs font-semibold text-slate-500">มีใบลา</span>
            <p className="text-2xl font-black text-blue-600 mt-1">{leaveCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-center">
            <span className="text-xs font-semibold text-slate-500">ขาดแถว (แจ้ง LINE)</span>
            <p className="text-2xl font-black text-rose-600 mt-1">{absentCount}</p>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              รายชื่อนักศึกษา ปวช. 1/1 (อาจารย์สมชาย ปัญญาดี - ครูที่ปรึกษา)
            </h3>
            <span className="text-xs text-slate-500">จำนวนทั้งหมด {students.length} คน</span>
          </div>

          <div className="divide-y divide-slate-100">
            {students.map((student, idx) => (
              <div
                key={student.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 text-xs font-bold text-slate-400">{idx + 1}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{student.name}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {student.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">เบอร์ผู้ปกครอง: {student.phone}</p>
                  </div>
                </div>

                {/* 4 Status Toggle Buttons */}
                <div className="flex items-center space-x-1.5 self-end sm:self-center">
                  <button
                    onClick={() => setStudentStatus(student.id, "PRESENT")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === "PRESENT"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    มา
                  </button>
                  <button
                    onClick={() => setStudentStatus(student.id, "LATE")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === "LATE"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    สาย
                  </button>
                  <button
                    onClick={() => setStudentStatus(student.id, "LEAVE")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === "LEAVE"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    ลา
                  </button>
                  <button
                    onClick={() => setStudentStatus(student.id, "ABSENT")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === "ABSENT"
                        ? "bg-rose-600 text-white shadow-sm"
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
      </main>
    </div>
  );
}
