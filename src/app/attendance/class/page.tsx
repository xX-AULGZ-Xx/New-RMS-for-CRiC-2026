"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  GraduationCap,
  CalendarCheck,
  Calendar,
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
  TrendingDown,
  RefreshCw,
  Layers,
  Flag
} from "lucide-react";
import { formatThaiDate } from "@/lib/thai-date";
import {
  getAcademicCalendarAction,
  saveClassPeriodAttendanceBatchAction,
} from "@/lib/settings-actions";

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
  const [educationLevel, setEducationLevel] = useState<"VC" | "HVC">("VC");
  const [courseCode, setCourseCode] = useState("20204-2001");
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [date, setDate] = useState("2026-08-17");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);

  // Synchronized Academic Calendar Settings from MySQL Database
  const [calendarSettings, setCalendarSettings] = useState({
    academicYear: "2569",
    semester: "1",
    vc: {
      totalWeeks: 18,
      startDate: "2026-08-17",
      endDate: "2026-12-18",
      midtermWeek: 9,
      midtermDate: "2026-10-12",
      finalWeek: 18,
      finalDate: "2026-12-14",
      gradeDeadline: "2026-12-25",
      status: "OPEN",
      note: "จัดการเรียนการสอนในสถานศึกษาเต็มเวลา 18 สัปดาห์ ตามระเบียบ สอศ. 2569",
    },
    hvc: {
      totalWeeks: 15,
      startDate: "2026-08-17",
      endDate: "2026-11-27",
      midtermWeek: 8,
      midtermDate: "2026-10-05",
      finalWeek: 15,
      finalDate: "2026-11-23",
      gradeDeadline: "2026-12-04",
      status: "OPEN",
      note: "เรียนในสถานศึกษา 15 สัปดาห์ + เตรียมฝึกงาน/ปฏิบัติงานในสถานประกอบการ 3 สัปดาห์",
    },
  });

  // Active term config based on selected level (VC / HVC)
  const currentTermConfig = educationLevel === "VC" ? calendarSettings.vc : calendarSettings.hvc;
  const maxWeeks = currentTermConfig.totalWeeks || (educationLevel === "VC" ? 18 : 15);

  // Calculate start (Monday) and end (Friday) dates for a specific week number
  const getWeekRange = (weekNum: number, startIso: string) => {
    if (!startIso) return { startStr: "", endStr: "" };
    const start = new Date(startIso + "T00:00:00");
    if (isNaN(start.getTime())) return { startStr: "", endStr: "" };

    const monday = new Date(start);
    monday.setDate(monday.getDate() + (weekNum - 1) * 7);

    const friday = new Date(monday);
    friday.setDate(friday.getDate() + 4);

    const formatYmd = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    return {
      startStr: formatYmd(monday),
      endStr: formatYmd(friday),
    };
  };

  // Automatically update date when teaching week is selected
  const handleWeekChange = (newWeek: string) => {
    setSelectedWeek(newWeek);
    const weekNum = parseInt(newWeek, 10);
    if (!isNaN(weekNum) && weekNum >= 1) {
      const range = getWeekRange(weekNum, currentTermConfig.startDate);
      if (range.startStr) setDate(range.startStr);
    }
  };

  // Fetch academic calendar directly from MySQL on mount
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await getAcademicCalendarAction();
        if (res.success && res.vc && res.hvc) {
          setCalendarSettings({
            academicYear: res.academicYear || "2569",
            semester: res.semester || "1",
            vc: res.vc,
            hvc: res.hvc,
          });

          // Default to week 1 or active config
          const config = educationLevel === "VC" ? res.vc : res.hvc;
          const range = getWeekRange(1, config.startDate);
          if (range.startStr) setDate(range.startStr);
        }
      } catch (err) {
        console.error("Failed to load academic calendar:", err);
      } finally {
        setIsLoadingCalendar(false);
      }
    };
    fetchCalendar();
  }, []);

  // When education level changes, sync week & date
  useEffect(() => {
    const weekNum = parseInt(selectedWeek, 10) || 1;
    if (weekNum > maxWeeks) {
      setSelectedWeek(String(maxWeeks));
      const range = getWeekRange(maxWeeks, currentTermConfig.startDate);
      if (range.startStr) setDate(range.startStr);
    } else {
      const range = getWeekRange(weekNum, currentTermConfig.startDate);
      if (range.startStr) setDate(range.startStr);
    }
  }, [educationLevel, maxWeeks, currentTermConfig.startDate]);

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

  // Save period attendance to MySQL
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await saveClassPeriodAttendanceBatchAction({
        courseCode,
        courseName:
          educationLevel === "VC"
            ? "การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่ (Mobile App Dev)"
            : "การพัฒนาโปรแกรมประยุกต์บนคลาวด์ (Cloud Application Dev)",
        period: Number(selectedWeek) * 2 - 1,
        weekNumber: Number(selectedWeek),
        date,
        records: students.map((s) => ({
          studentCode: s.code,
          studentName: s.name,
          status: s.currentStatus,
        })),
      });

      if (res.success) {
        setSaveMessage(res.message || "บันทึกผลการเข้าเรียนรายวิชาลงฐานข้อมูลเรียบร้อยแล้ว!");
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 5000);
      } else {
        alert("ข้อผิดพลาด: " + res.error);
      }
    } catch (err: any) {
      alert("ข้อผิดพลาด: " + err.message);
    } finally {
      setIsSaving(false);
    }
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
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>ฝ่ายวิชาการ & งานวัดผล</span>
              <span>•</span>
              <span className="text-cyan-400">สอศ. เกณฑ์เวลาเรียน 80%</span>
              <span>•</span>
              <span className="text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20 font-medium">
                {formatThaiDate(date, { showDayOfWeek: true })}
              </span>
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
              <span>มาครบคาบที่ {Number(selectedWeek) * 2 - 1}-{Number(selectedWeek) * 2} (1-Click)</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? "กำลังบันทึกลงฐานข้อมูล..." : "บันทึกผลการเข้าเรียน"}</span>
            </button>
          </div>
        </div>

        {/* Save Success Alert */}
        {isSaved && (
          <div className="glass-island border border-emerald-500/30 rounded-3xl p-4 flex items-center justify-between text-emerald-200 shadow-xl bg-emerald-950/30 animate-fade-in backdrop-blur-xl">
            <div className="flex items-center space-x-3 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-300">
                  {saveMessage || "บันทึกสถิติการเข้าเรียนรายวิชาสำเร็จ!"}
                </p>
                <p className="text-slate-300 text-xs">
                  บันทึกลงตาราง ClassPeriodAttendance (MySQL) คำนวณเปอร์เซ็นต์เวลาเรียนสะสมและอัปเดตสิทธิ์สอบ 80% เรียบร้อยแล้ว
                </p>
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

        {/* Synchronized Academic Calendar Status Bar */}
        <div className="glass-card p-4 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-blue-950/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <span className="font-bold text-white">
                ซิงก์กำหนดการเปิด-ปิดภาคเรียน {calendarSettings.semester}/{calendarSettings.academicYear} ({educationLevel === "VC" ? "ปวช." : "ปวส."})
              </span>
              <span className="text-slate-400 ml-2">
                (ทั้งหมด {maxWeeks} สัปดาห์)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
              📅 เปิดเทอม: <strong className="text-emerald-300 font-bold">{formatThaiDate(currentTermConfig.startDate, { format: "short" })}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
              🏁 ปิดเทอม: <strong className="text-cyan-300 font-bold">{formatThaiDate(currentTermConfig.endDate, { format: "short" })}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
              ⚡ กลางภาค: สัปดาห์ที่ {currentTermConfig.midtermWeek}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
              🏆 ปลายภาค: สัปดาห์ที่ {currentTermConfig.finalWeek}
            </span>
          </div>
        </div>

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
                <span className="text-xs text-slate-400 font-medium">ภาคเรียนที่ {calendarSettings.semester}/{calendarSettings.academicYear} • 3 หน่วยกิต (2-2-3)</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  educationLevel === "VC"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/25"
                    : "bg-purple-500/15 text-purple-300 border-purple-400/25"
                }`}>
                  สัปดาห์ที่ {selectedWeek} / {maxWeeks} (ระดับ {educationLevel === "VC" ? "ปวช." : "ปวส."})
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/25">
                  เกณฑ์ผ่านเวลาเรียน 80%
                </span>
              </div>
              <h3 className="font-bold text-white text-lg mt-1">
                {educationLevel === "VC" ? "การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่ (Mobile App Dev)" : "การพัฒนาโปรแกรมประยุกต์บนคลาวด์ (Cloud Application Dev)"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                กลุ่มเรียน: {educationLevel === "VC" ? `ปวช. 1/1 แผนกวิชา IT (${maxWeeks} สัปดาห์)` : `ปวส. 1/1 แผนกวิชา IT (${maxWeeks} สัปดาห์)`} • ครูผู้สอน: อาจารย์สมชาย ปัญญาดี
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Level Toggle: ปวช. 18 สัปดาห์ vs ปวส. 15 สัปดาห์ */}
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">หลักสูตร & สัปดาห์เรียน</label>
              <div className="flex bg-black/40 border border-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setEducationLevel("VC");
                    setCourseCode("20204-2001");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    educationLevel === "VC"
                      ? "bg-emerald-500 text-slate-950 font-black shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ปวช. ({calendarSettings.vc.totalWeeks}w)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEducationLevel("HVC");
                    setCourseCode("30204-2001");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    educationLevel === "HVC"
                      ? "bg-purple-500 text-white font-black shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ปวส. ({calendarSettings.hvc.totalWeeks}w)
                </button>
              </div>
            </div>

            {/* Synchronized Week Selector */}
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                สัปดาห์ที่สอน (1 - {maxWeeks})
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => handleWeekChange(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-xl glass-input text-white focus:outline-none cursor-pointer"
              >
                {[...Array(maxWeeks)].map((_, i) => {
                  const weekNum = i + 1;
                  const range = getWeekRange(weekNum, currentTermConfig.startDate);
                  const shortStart = formatThaiDate(range.startStr, { format: "short" });
                  const shortEnd = formatThaiDate(range.endStr, { format: "short" });
                  const isMidterm = weekNum === currentTermConfig.midtermWeek;
                  const isFinal = weekNum === currentTermConfig.finalWeek;

                  return (
                    <option key={weekNum} value={weekNum} className="bg-[#111827]">
                      สัปดาห์ที่ {weekNum} ({shortStart} - {shortEnd})
                      {isMidterm ? " ⚡ สอบกลางภาค" : isFinal ? " 🏁 สอบปลายภาค" : ` (คาบ ${weekNum * 2 - 1}-${weekNum * 2})`}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Thai Date Badge & Picker */}
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                วันที่สอนประจำสัปดาห์ที่ {selectedWeek} (พ.ศ.)
              </label>
              <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-cyan-500/30 hover:border-cyan-400 transition shadow-inner">
                <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-bold text-cyan-300">
                  {formatThaiDate(date, { showDayOfWeek: true })}
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="คลิกเพื่อเลือกหรือปรับเปลี่ยนวันที่"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Warning Metrics Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">นักศึกษาทั้งหมด</span>
              <p className="text-2xl font-black text-white mt-1">{students.length} คน</p>
              <span className="text-[11px] text-emerald-400 font-bold mt-1 inline-block">ลงทะเบียนครบถ้วน</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center font-black">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
            <div>
              <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">กลุ่มเสี่ยง มส. (80-84%)</span>
              <p className="text-2xl font-black text-amber-300 mt-1">{riskCount} คน</p>
              <span className="text-[11px] text-amber-400 font-bold mt-1 inline-block">ขาดได้อีกไม่เกิน 1-2 คาบ</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
            <div>
              <span className="text-rose-300 text-xs font-bold uppercase tracking-wider">หมดสิทธิ์สอบ (&lt;80%)</span>
              <p className="text-2xl font-black text-rose-400 mt-1">{ineligibleCount} คน</p>
              <span className="text-[11px] text-rose-400 font-bold mt-1 inline-block">ต้องยื่นคำร้อง มส. ต่องานวัดผล</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-black">
              <UserX className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Student Attendance List */}
        <div className="glass-island rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="font-bold text-white text-base">
                รายชื่อนักศึกษา & บันทึกเวลาเรียนคาบที่ {Number(selectedWeek) * 2 - 1}-{Number(selectedWeek) * 2}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                สัปดาห์ที่ {selectedWeek} จาก {maxWeeks} สัปดาห์ • ประจำวันที่ {formatThaiDate(date, { showDayOfWeek: true })}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ หรือ รหัสนักเรียน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs glass-input text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-300 border-b border-white/10 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-bold">รหัสนักศึกษา</th>
                  <th className="py-3 px-4 font-bold">ชื่อ - นามสกุล</th>
                  <th className="py-3 px-4 font-bold text-center">สถิติเวลาเรียนสะสม</th>
                  <th className="py-3 px-4 font-bold text-center">% เวลาเรียน</th>
                  <th className="py-3 px-4 font-bold text-center">สถานะสิทธิ์สอบ</th>
                  <th className="py-3 px-4 font-bold text-center">
                    เช็คชื่อคาบ {Number(selectedWeek) * 2 - 1}-{Number(selectedWeek) * 2}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((s) => {
                  const rate = getAttendanceRate(s.attendedPeriods, s.totalPeriods);
                  const elig = getEligibilityStatus(rate);

                  return (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                        {s.code}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className="text-emerald-400 font-bold">{s.attendedPeriods}</span>
                        <span className="text-slate-500"> / </span>
                        <span className="text-slate-300">{s.totalPeriods}</span>
                        <span className="text-slate-500 text-[10px] ml-1">คาบ</span>
                        {s.absentPeriods > 0 && (
                          <span className="text-rose-400 text-[10px] ml-2 font-bold">
                            (ขาด {s.absentPeriods})
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center space-x-2">
                          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                            <div
                              className={`h-full rounded-full transition-all ${
                                rate >= 85 ? "bg-emerald-400" : rate >= 80 ? "bg-amber-400" : "bg-rose-500"
                              }`}
                              style={{ width: `${Math.min(100, rate)}%` }}
                            />
                          </div>
                          <span className={`font-mono font-bold text-xs ${
                            rate >= 85 ? "text-emerald-300" : rate >= 80 ? "text-amber-300" : "text-rose-400"
                          }`}>
                            {rate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-bold border ${elig.color}`}>
                          {elig.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex bg-black/40 p-1 rounded-xl border border-white/10">
                          <button
                            type="button"
                            onClick={() => setStatus(s.id, "PRESENT")}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              s.currentStatus === "PRESENT"
                                ? "bg-emerald-500 text-slate-950 font-black shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            มา
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(s.id, "LATE")}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              s.currentStatus === "LATE"
                                ? "bg-amber-500 text-slate-950 font-black shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            สาย
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(s.id, "LEAVE")}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              s.currentStatus === "LEAVE"
                                ? "bg-blue-500 text-white font-black shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            ลา
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(s.id, "ABSENT")}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              s.currentStatus === "ABSENT"
                                ? "bg-rose-600 text-white font-black shadow-md"
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
