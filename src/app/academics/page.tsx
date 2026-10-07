"use client";

import { useState, useEffect, useRef } from "react";
import AppShell from "@/components/AppShell";
import {
  GraduationCap,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  Save,
  Search,
  BookOpen,
  TrendingUp,
  FileCheck2,
  BarChart2,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit3,
  Printer,
  AlertCircle,
  FileText,
  Sliders,
  Check,
  X,
  RefreshCw,
  Building2,
  UserCheck,
  AlertTriangle,
  MoveRight,
  Eye
} from "lucide-react";
import { formatThaiDate } from "@/lib/thai-date";
import {
  getClassSchedulesAction,
  saveClassScheduleAction,
  deleteClassScheduleAction,
  checkScheduleConflictAction,
  getCourseScoreWeightAction,
  saveCourseScoreWeightAction,
  getTeachingLogsAction,
  saveTeachingLogAction,
  getAttendanceStatsForTeachingLogAction,
  ScheduleItem,
  ScoreWeightData,
  TeachingLogItem,
} from "@/lib/academic-actions";
import { getAcademicCalendarAction } from "@/lib/settings-actions";

type ScoreItem = {
  id: string;
  code: string;
  name: string;
  affective: number;
  task: number;
  midterm: number;
  final: number;
};

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<"SCHEDULE" | "GRADING" | "TEACHING_LOG">("SCHEDULE");

  // Feedback banner state
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ==========================================
  // TAB 1: TIMETABLE SCHEDULE STATE
  // ==========================================
  const [scheduleViewMode, setScheduleViewMode] = useState<"CLASSROOM" | "TEACHER">("CLASSROOM");
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("ALL");
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>("ALL");
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [classrooms, setClassrooms] = useState<Array<{ id: string; name: string; code: string; level: string }>>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

  // Schedule Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    courseCode: "20204-2001",
    courseName: "การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่",
    classroomId: "",
    teacherName: "อาจารย์สมชาย ปัญญาดี",
    dayOfWeek: 1, // 1 = จันทร์
    periodStart: 1,
    periodEnd: 2,
    roomNumber: "Lab IT 1 (Mobile Lab)",
    colorTheme: "cyan",
  });
  const [scheduleConflictMsg, setScheduleConflictMsg] = useState<string | null>(null);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  // ==========================================
  // TAB 2: SCORE WEIGHTS & GRADING STATE
  // ==========================================
  const [selectedCourseCode, setSelectedCourseCode] = useState("20204-2001");
  const [scoreWeight, setScoreWeight] = useState<ScoreWeightData>({
    courseCode: "20204-2001",
    courseName: "การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่",
    academicTerm: "1/2569",
    affectiveWeight: 20,
    taskWeight: 40,
    midtermWeight: 20,
    finalWeight: 20,
    totalWeight: 100,
  });
  const [isSavingWeight, setIsSavingWeight] = useState(false);

  const [scores, setScores] = useState<ScoreItem[]>([
    { id: "1", code: "6920901001", name: "นายกิตติคุณ มั่นคง", affective: 19, task: 38, midterm: 18, final: 17 },
    { id: "2", code: "6920901002", name: "นางสาวณิชา ภักดี", affective: 20, task: 39, midterm: 19, final: 18 },
    { id: "3", code: "6920901003", name: "นายธนดล เจริญพร", affective: 16, task: 34, midterm: 15, final: 14 },
    { id: "4", code: "6920901004", name: "นางสาวบุษกร รุ่งเรือง", affective: 15, task: 32, midterm: 14, final: 12 },
    { id: "5", code: "6920901005", name: "นายวรพจน์ สุขสวัสดิ์", affective: 18, task: 36, midterm: 17, final: 16 },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  // ==========================================
  // TAB 3: TEACHING LOG STATE
  // ==========================================
  const [selectedLogWeek, setSelectedLogWeek] = useState(1);
  const [teachingLogs, setTeachingLogs] = useState<TeachingLogItem[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isSavingLog, setIsSavingLog] = useState(false);
  const [logForm, setLogForm] = useState({
    id: "",
    courseCode: "20204-2001",
    courseName: "การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่",
    weekNumber: 1,
    date: "2026-08-17",
    topic: "ปฐมนิเทศรายวิชาและสภาพแวดล้อมการพัฒนาแอปพลิเคชัน",
    learningOutcome: "นักศึกษาสามารถติดตั้งชุดเครื่องมือพัฒนาโปรแกรมและสร้างโครงการแรกได้สำเร็จ 100%",
    totalStudents: 5,
    presentCount: 5,
    absentCount: 0,
    lateCount: 0,
    leaveCount: 0,
    problems: "เครื่องคอมพิวเตอร์บางเครื่องสเปก RAM ต่ำ ทำให้การรัน Emulator ช้าเล็กน้อย",
    solutions: "ให้นักศึกษาเชื่อมต่อมือถือจริงผ่านสาย USB Debugging แทนการใช้ Emulator",
    teacherName: "อาจารย์สมชาย ปัญญาดี",
  });
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printLogData, setPrintLogData] = useState<any>(null);

  // Academic Calendar Info for Weeks (from MySQL)
  const [calendarInfo, setCalendarInfo] = useState<{ totalWeeks: number; startDate: string }>({
    totalWeeks: 18,
    startDate: "2026-08-17",
  });

  // Load Initial Data
  useEffect(() => {
    loadSchedules();
    loadScoreWeight();
    loadTeachingLogs();
    loadCalendar();
  }, []);

  const loadSchedules = async () => {
    setIsLoadingSchedules(true);
    const res = await getClassSchedulesAction({
      classroomId: selectedClassroomId !== "ALL" ? selectedClassroomId : undefined,
      teacherName: selectedTeacherName !== "ALL" ? selectedTeacherName : undefined,
    });
    if (res.success && res.schedules) {
      setSchedules(res.schedules);
      if (res.classrooms && res.classrooms.length > 0) {
        setClassrooms(res.classrooms);
        if (!scheduleForm.classroomId && res.classrooms[0]) {
          setScheduleForm((prev) => ({ ...prev, classroomId: res.classrooms[0].id }));
        }
      }
    }
    setIsLoadingSchedules(false);
  };

  const loadScoreWeight = async (code: string = selectedCourseCode) => {
    const res = await getCourseScoreWeightAction(code, "1/2569");
    if (res.success && res.data) {
      setScoreWeight(res.data);
    }
  };

  const loadTeachingLogs = async () => {
    setIsLoadingLogs(true);
    const res = await getTeachingLogsAction({ courseCode: selectedCourseCode });
    if (res.success && res.logs) {
      setTeachingLogs(res.logs);
      // If log exists for current selected week, populate it
      const existing = res.logs.find((l) => l.weekNumber === selectedLogWeek);
      if (existing) {
        setLogForm({
          id: existing.id,
          courseCode: existing.courseCode,
          courseName: existing.courseName,
          weekNumber: existing.weekNumber,
          date: existing.date,
          topic: existing.topic,
          learningOutcome: existing.learningOutcome,
          totalStudents: existing.totalStudents,
          presentCount: existing.presentCount,
          absentCount: existing.absentCount,
          lateCount: existing.lateCount,
          leaveCount: existing.leaveCount,
          problems: existing.problems,
          solutions: existing.solutions,
          teacherName: existing.teacherName,
        });
      }
    }
    setIsLoadingLogs(false);
  };

  const loadCalendar = async () => {
    const res = await getAcademicCalendarAction();
    if (res.success && res.vc) {
      setCalendarInfo({
        totalWeeks: res.vc.totalWeeks || 18,
        startDate: res.vc.startDate || "2026-08-17",
      });
    }
  };

  // Re-fetch schedules when filter changes
  useEffect(() => {
    loadSchedules();
  }, [selectedClassroomId, selectedTeacherName]);

  // Compute Grade based on VEC Standard
  const calculateGrade = (total: number) => {
    if (total >= 80) return "4.0";
    if (total >= 75) return "3.5";
    if (total >= 70) return "3.0";
    if (total >= 65) return "2.5";
    if (total >= 60) return "2.0";
    if (total >= 55) return "1.5";
    if (total >= 50) return "1.0";
    return "0";
  };

  const handleScoreChange = (id: string, field: "affective" | "task" | "midterm" | "final", val: string) => {
    let max = 100;
    if (field === "affective") max = scoreWeight.affectiveWeight;
    else if (field === "task") max = scoreWeight.taskWeight;
    else if (field === "midterm") max = scoreWeight.midtermWeight;
    else if (field === "final") max = scoreWeight.finalWeight;

    const num = Math.max(0, Math.min(max, Number(val) || 0));
    setScores((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: num } : s)));
  };

  // Save Score Weights
  const handleSaveScoreWeight = async () => {
    setIsSavingWeight(true);
    const res = await saveCourseScoreWeightAction({
      courseCode: scoreWeight.courseCode,
      courseName: scoreWeight.courseName,
      affectiveWeight: scoreWeight.affectiveWeight,
      taskWeight: scoreWeight.taskWeight,
      midtermWeight: scoreWeight.midtermWeight,
      finalWeight: scoreWeight.finalWeight,
    });
    setIsSavingWeight(false);

    if (res.success) {
      setFeedback({ type: "success", message: res.message || "บันทึกการตั้งค่าสัดส่วนคะแนนสำเร็จ" });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: "error", message: res.error || "เกิดข้อผิดพลาดในการบันทึกสัดส่วนคะแนน" });
    }
  };

  // Export to STD02 CSV
  const exportStd02 = () => {
    const headers = `รหัสนักเรียน,ชื่อ-สกุล,จิตพิสัย(${scoreWeight.affectiveWeight}),ภาระงาน(${scoreWeight.taskWeight}),กลางภาค(${scoreWeight.midtermWeight}),ปลายภาค(${scoreWeight.finalWeight}),รวม(100),ระดับผลการเรียน(เกรด)\n`;
    const rows = scores
      .map((s) => {
        const total = s.affective + s.task + s.midterm + s.final;
        const grade = calculateGrade(total);
        return `${s.code},${s.name},${s.affective},${s.task},${s.midterm},${s.final},${total},${grade}`;
      })
      .join("\n");

    const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `STD02_${selectedCourseCode}_CRiC_2569.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedback({
      type: "success",
      message: `ส่งออกไฟล์มาตรฐาน ศธ.02 (${selectedCourseCode}) สำเร็จเรียบร้อยแล้ว`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handle Schedule Modal Open/Save
  const handleOpenAddSchedule = (day?: number, period?: number) => {
    setEditingScheduleId(null);
    setScheduleConflictMsg(null);
    setScheduleForm({
      courseCode: selectedCourseCode,
      courseName: selectedCourseCode === "20204-2001" ? "การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่" : "การพัฒนาโปรแกรมประยุกต์บนคลาวด์",
      classroomId: classrooms[0]?.id || "",
      teacherName: "อาจารย์สมชาย ปัญญาดี",
      dayOfWeek: day || 1,
      periodStart: period || 1,
      periodEnd: period ? Math.min(10, period + 1) : 2,
      roomNumber: "Lab IT 1 (Mobile Lab)",
      colorTheme: "cyan",
    });
    setIsScheduleModalOpen(true);
  };

  const handleEditSchedule = (s: ScheduleItem) => {
    setEditingScheduleId(s.id);
    setScheduleConflictMsg(null);
    setScheduleForm({
      courseCode: s.courseCode,
      courseName: s.courseName,
      classroomId: s.classroomId,
      teacherName: s.teacherName,
      dayOfWeek: s.dayOfWeek,
      periodStart: s.periodStart,
      periodEnd: s.periodEnd,
      roomNumber: s.roomNumber,
      colorTheme: s.colorTheme,
    });
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSchedule(true);
    setScheduleConflictMsg(null);

    const res = await saveClassScheduleAction({
      id: editingScheduleId || undefined,
      ...scheduleForm,
    });

    setIsSavingSchedule(false);
    if (res.success) {
      setIsScheduleModalOpen(false);
      loadSchedules();
      setFeedback({ type: "success", message: "บันทึกคาบเรียนในตารางสอนเรียบร้อยแล้ว!" });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setScheduleConflictMsg(res.error || "เกิดข้อผิดพลาดในการบันทึกตารางสอน");
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("คุณต้องการลบคาบเรียนนี้ออกจากตารางสอนหรือไม่?")) return;
    const res = await deleteClassScheduleAction(id);
    if (res.success) {
      setIsScheduleModalOpen(false);
      loadSchedules();
      setFeedback({ type: "success", message: "ลบคาบเรียนเรียบร้อยแล้ว" });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  // Handle Teaching Log Submit
  const handleSaveTeachingLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLog(true);

    const res = await saveTeachingLogAction({
      ...logForm,
      id: logForm.id || undefined,
      weekNumber: selectedLogWeek,
    });

    setIsSavingLog(false);
    if (res.success) {
      loadTeachingLogs();
      setFeedback({ type: "success", message: res.message || "บันทึกแบบบันทึกหลังการสอนเรียบร้อยแล้ว!" });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: "error", message: res.error || "เกิดข้อผิดพลาดในการบันทึก" });
    }
  };

  // Pull attendance stats for log
  const handleAutoPullAttendance = async () => {
    const stats = await getAttendanceStatsForTeachingLogAction(selectedCourseCode, selectedLogWeek);
    setLogForm((prev) => ({
      ...prev,
      totalStudents: stats.totalStudents,
      presentCount: stats.presentCount,
      absentCount: stats.absentCount,
      lateCount: stats.lateCount,
      leaveCount: stats.leaveCount,
    }));
    setFeedback({
      type: "success",
      message: `ดึงยอดเช็คชื่อสัปดาห์ที่ ${selectedLogWeek} สำเร็จ (มา: ${stats.presentCount}, ขาด: ${stats.absentCount})`,
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Filtered and stats
  const filteredScores = scores.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.includes(searchQuery)
  );

  const gradeCounts = scores.reduce((acc: any, s) => {
    const total = s.affective + s.task + s.midterm + s.final;
    const g = calculateGrade(total);
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const totalWeightSum =
    Number(scoreWeight.affectiveWeight) +
    Number(scoreWeight.taskWeight) +
    Number(scoreWeight.midtermWeight) +
    Number(scoreWeight.finalWeight);

  const daysOfWeek = [
    { num: 1, name: "วันจันทร์", short: "จ." },
    { num: 2, name: "วันอังคาร", short: "อ." },
    { num: 3, name: "วันพุธ", short: "พ." },
    { num: 4, name: "วันพฤหัสบดี", short: "พฤ." },
    { num: 5, name: "วันศุกร์", short: "ศ." },
  ];

  const periods = [
    { p: 1, time: "08:30-09:30" },
    { p: 2, time: "09:30-10:30" },
    { p: 3, time: "10:30-11:30" },
    { p: 4, time: "11:30-12:30" },
    { p: 5, time: "13:00-14:00" },
    { p: 6, time: "14:00-15:00" },
    { p: 7, time: "15:00-16:00" },
    { p: 8, time: "16:00-17:00" },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>ฝ่ายวิชาการและงานพัฒนาหลักสูตร</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400">CRiC Academic Master Hub 2569</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight flex items-center space-x-3">
              <span>ระบบงานวิชาการและการจัดการเรียนการสอน</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-mono font-medium">
                VEC Vocational Suite
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {activeTab === "GRADING" && (
              <button
                onClick={exportStd02}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 border border-emerald-400/30"
              >
                <Download className="w-4 h-4" />
                <span>ส่งออกไฟล์มาตรฐาน ศธ.02</span>
              </button>
            )}
            {activeTab === "SCHEDULE" && (
              <button
                onClick={() => handleOpenAddSchedule()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 border border-cyan-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>จัดคาบเรียนใหม่ลงตาราง</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Feedback Alert Banner */}
        {feedback && (
          <div
            className={`glass-island border rounded-3xl p-4 flex items-center justify-between text-xs shadow-xl animate-fade-in backdrop-blur-xl ${
              feedback.type === "success"
                ? "border-emerald-500/30 text-emerald-200 bg-emerald-950/40"
                : "border-rose-500/30 text-rose-200 bg-rose-950/40"
            }`}
          >
            <div className="flex items-center space-x-3">
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <span className="font-bold text-sm">{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs font-bold px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              ปิด
            </button>
          </div>
        )}

        {/* Navigation Tabs (Apple Capsule Design) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 glass-island p-2 rounded-2xl border border-white/10 shadow-lg">
          {[
            { id: "SCHEDULE", label: "จัดตารางเรียน & ตารางสอน", icon: Calendar, badge: `${schedules.length} คาบ` },
            { id: "GRADING", label: "บันทึกคะแนน & การตั้งค่าการเก็บคะแนน", icon: Award, badge: `${totalWeightSum}%` },
            { id: "TEACHING_LOG", label: "บันทึกหลังการสอน (สอศ.)", icon: FileText, badge: `${teachingLogs.length} สัปดาห์` },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white shadow-md border border-white/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: TIMETABLE SCHEDULE                                      */}
        {/* ============================================================== */}
        {activeTab === "SCHEDULE" && (
          <div className="space-y-6">
            {/* Schedule Filter & View Mode Bar */}
            <div className="glass-island p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex flex-wrap items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex bg-black/40 border border-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => {
                      setScheduleViewMode("CLASSROOM");
                      setSelectedTeacherName("ALL");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      scheduleViewMode === "CLASSROOM"
                        ? "bg-cyan-500 text-slate-950 font-black shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    ตารางเรียนตามห้อง
                  </button>
                  <button
                    onClick={() => {
                      setScheduleViewMode("TEACHER");
                      setSelectedClassroomId("ALL");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      scheduleViewMode === "TEACHER"
                        ? "bg-purple-500 text-white font-black shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    ตารางสอนตามครู
                  </button>
                </div>

                {/* Filter Selector */}
                {scheduleViewMode === "CLASSROOM" ? (
                  <select
                    value={selectedClassroomId}
                    onChange={(e) => setSelectedClassroomId(e.target.value)}
                    className="text-xs font-bold px-3 py-2 rounded-xl glass-input text-white focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-[#111827]">
                      ทุกกลุ่มเรียน (แสดงภาพรวม)
                    </option>
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#111827]">
                        {c.name} ({c.level})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={selectedTeacherName}
                    onChange={(e) => setSelectedTeacherName(e.target.value)}
                    className="text-xs font-bold px-3 py-2 rounded-xl glass-input text-white focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-[#111827]">
                      ครูผู้สอนทุกคน (ภาพรวม)
                    </option>
                    <option value="อาจารย์สมชาย ปัญญาดี" className="bg-[#111827]">
                      อาจารย์สมชาย ปัญญาดี
                    </option>
                    <option value="อาจารย์พรทิพย์ สุนทรภู่" className="bg-[#111827]">
                      อาจารย์พรทิพย์ สุนทรภู่
                    </option>
                    <option value="นายประสิทธิ์ นวัตกรรม" className="bg-[#111827]">
                      นายประสิทธิ์ นวัตกรรม
                    </option>
                  </select>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>คลิกช่องคาบเรียนเพื่อเพิ่มหรือแก้ไขรายวิชาในตาราง</span>
              </div>
            </div>

            {/* Interactive Timetable Grid */}
            <div className="glass-island rounded-3xl border border-white/10 p-5 shadow-2xl overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px] text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-300">
                    <th className="py-3 px-3 text-center w-24 bg-white/5 rounded-tl-2xl font-bold">วัน / คาบ</th>
                    {periods.map((p) => (
                      <th key={p.p} className="py-2 px-2 text-center border-l border-white/5 font-mono">
                        <div className="font-bold text-white">คาบที่ {p.p}</div>
                        <div className="text-[10px] text-slate-400">{p.time}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {daysOfWeek.map((day) => (
                    <tr key={day.num} className="hover:bg-white/[0.02] transition-colors">
                      {/* Day Label */}
                      <td className="py-4 px-3 text-center font-bold text-white bg-white/[0.03]">
                        <div className="text-sm">{day.short}</div>
                        <div className="text-[10px] text-slate-400">{day.name}</div>
                      </td>

                      {/* Period Slots 1 to 8 */}
                      {periods.map((period) => {
                        // Find if any schedule covers this period
                        const item = schedules.find(
                          (s) => s.dayOfWeek === day.num && period.p >= s.periodStart && period.p <= s.periodEnd
                        );

                        // If item starts at this period, render the cell with colSpan
                        if (item && item.periodStart === period.p) {
                          const span = item.periodEnd - item.periodStart + 1;
                          const themeColor =
                            item.colorTheme === "emerald"
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:border-emerald-400"
                              : item.colorTheme === "purple"
                              ? "bg-purple-500/20 border-purple-500/40 text-purple-300 hover:border-purple-400"
                              : item.colorTheme === "amber"
                              ? "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:border-amber-400"
                              : item.colorTheme === "rose"
                              ? "bg-rose-500/20 border-rose-500/40 text-rose-300 hover:border-rose-400"
                              : item.colorTheme === "blue"
                              ? "bg-blue-500/20 border-blue-500/40 text-blue-300 hover:border-blue-400"
                              : "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:border-cyan-400";

                          return (
                            <td
                              key={period.p}
                              colSpan={span}
                              onClick={() => handleEditSchedule(item)}
                              className="p-1.5 border-l border-white/5 cursor-pointer"
                            >
                              <div
                                className={`h-full p-2.5 rounded-2xl border transition-all hover:scale-[1.01] shadow-md ${themeColor} flex flex-col justify-between`}
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-black/40">
                                      {item.courseCode}
                                    </span>
                                    <span className="text-[10px] font-mono opacity-80">
                                      คาบ {item.periodStart}-{item.periodEnd}
                                    </span>
                                  </div>
                                  <div className="font-bold text-white text-xs line-clamp-1">
                                    {item.courseName}
                                  </div>
                                </div>

                                <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] opacity-90">
                                  <span>
                                    {scheduleViewMode === "CLASSROOM" ? item.teacherName : item.classroomName}
                                  </span>
                                  <span className="font-mono text-cyan-200">{item.roomNumber}</span>
                                </div>
                              </div>
                            </td>
                          );
                        }

                        // If covered by previous span, don't render another td
                        if (item && period.p > item.periodStart) {
                          return null;
                        }

                        // Empty period slot
                        return (
                          <td
                            key={period.p}
                            onClick={() => handleOpenAddSchedule(day.num, period.p)}
                            className="p-1 border-l border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group"
                          >
                            <div className="h-20 rounded-xl border border-dashed border-white/5 group-hover:border-cyan-500/30 flex items-center justify-center transition-all">
                              <Plus className="w-4 h-4 text-white/10 group-hover:text-cyan-400 transition-colors" />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SCORE WEIGHTS & GRADING                                 */}
        {/* ============================================================== */}
        {activeTab === "GRADING" && (
          <div className="space-y-6">
            {/* Score Weight Configuration Card */}
            <div className="glass-island p-6 rounded-3xl border border-white/10 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-5 h-5 text-cyan-400" />
                    <h2 className="font-bold text-white text-base">การตั้งค่าสัดส่วนการเก็บคะแนน (Score Weights 100%)</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    กำหนดเกณฑ์น้ำหนักคะแนนตามแผนการจัดการเรียนรู้ สอศ. ประจำภาคเรียนที่ {scoreWeight.academicTerm}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold font-mono border ${
                      totalWeightSum === 100
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                        : "bg-rose-500/15 text-rose-300 border-rose-400/30"
                    }`}
                  >
                    ผลรวม: {totalWeightSum}% {totalWeightSum === 100 ? "✓ ครบถ้วน" : "⚠️ ยังไม่ครบ 100"}
                  </span>

                  <button
                    onClick={handleSaveScoreWeight}
                    disabled={isSavingWeight || totalWeightSum !== 100}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                  >
                    {isSavingWeight ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>บันทึกสัดส่วนคะแนน</span>
                  </button>
                </div>
              </div>

              {/* Sliders & Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. จิตพิสัย */}
                <div className="p-4 rounded-2xl glass-card border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">1. จิตพิสัย / คุณธรรม</span>
                    <span className="font-mono font-bold text-sm text-white">{scoreWeight.affectiveWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={scoreWeight.affectiveWeight}
                    onChange={(e) =>
                      setScoreWeight({ ...scoreWeight, affectiveWeight: Number(e.target.value) })
                    }
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">เวลาเรียน, การแต่งกาย, ความรับผิดชอบ</p>
                </div>

                {/* 2. ภาระงาน/ปฏิบัติ */}
                <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300">2. ภาระงาน / ปฏิบัติการ</span>
                    <span className="font-mono font-bold text-sm text-white">{scoreWeight.taskWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={scoreWeight.taskWeight}
                    onChange={(e) =>
                      setScoreWeight({ ...scoreWeight, taskWeight: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">ใบงาน, โครงงาน, การทดลองในห้องแล็บ</p>
                </div>

                {/* 3. สอบกลางภาค */}
                <div className="p-4 rounded-2xl glass-card border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">3. สอบกลางภาค</span>
                    <span className="font-mono font-bold text-sm text-white">{scoreWeight.midtermWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={scoreWeight.midtermWeight}
                    onChange={(e) =>
                      setScoreWeight({ ...scoreWeight, midtermWeight: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">การวัดผลกลางภาคเรียน (สัปดาห์ที่ 9)</p>
                </div>

                {/* 4. สอบปลายภาค */}
                <div className="p-4 rounded-2xl glass-card border border-blue-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300">4. สอบปลายภาค</span>
                    <span className="font-mono font-bold text-sm text-white">{scoreWeight.finalWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={scoreWeight.finalWeight}
                    onChange={(e) =>
                      setScoreWeight({ ...scoreWeight, finalWeight: Number(e.target.value) })
                    }
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">การวัดผลสัมฤทธิ์ปลายภาคเรียน</p>
                </div>
              </div>
            </div>

            {/* Student Scores Table */}
            <div className="glass-island rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
              <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">ตารางกรอกคะแนนนักศึกษา & ตัดเกรด สอศ. 8 ระดับ</h3>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ค้นหารหัส หรือชื่อนักศึกษา..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-xs rounded-2xl glass-input w-52 sm:w-64 text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.04] border-b border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-4 text-center">ลำดับ</th>
                      <th className="px-5 py-4">รหัสนักศึกษา</th>
                      <th className="px-5 py-4">ชื่อ - นามสกุล</th>
                      <th className="px-3 py-4 text-center">จิตพิสัย ({scoreWeight.affectiveWeight})</th>
                      <th className="px-3 py-4 text-center">ภาระงาน ({scoreWeight.taskWeight})</th>
                      <th className="px-3 py-4 text-center">กลางภาค ({scoreWeight.midtermWeight})</th>
                      <th className="px-3 py-4 text-center">ปลายภาค ({scoreWeight.finalWeight})</th>
                      <th className="px-4 py-4 text-center">รวม (100)</th>
                      <th className="px-4 py-4 text-center">เกรด ศธ.02</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredScores.map((s, idx) => {
                      const total = s.affective + s.task + s.midterm + s.final;
                      const grade = calculateGrade(total);

                      return (
                        <tr key={s.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="px-5 py-3 text-center text-slate-500 font-mono text-xs">{idx + 1}</td>
                          <td className="px-5 py-3 font-mono font-bold text-cyan-300">{s.code}</td>
                          <td className="px-5 py-3 font-semibold text-white">{s.name}</td>
                          <td className="px-3 py-3 text-center">
                            <input
                              type="number"
                              value={s.affective}
                              onChange={(e) => handleScoreChange(s.id, "affective", e.target.value)}
                              className="w-16 text-center text-xs font-mono font-bold py-1.5 rounded-xl glass-input text-purple-300"
                            />
                          </td>
                          <td className="px-3 py-3 text-center">
                            <input
                              type="number"
                              value={s.task}
                              onChange={(e) => handleScoreChange(s.id, "task", e.target.value)}
                              className="w-16 text-center text-xs font-mono font-bold py-1.5 rounded-xl glass-input text-emerald-300"
                            />
                          </td>
                          <td className="px-3 py-3 text-center">
                            <input
                              type="number"
                              value={s.midterm}
                              onChange={(e) => handleScoreChange(s.id, "midterm", e.target.value)}
                              className="w-16 text-center text-xs font-mono font-bold py-1.5 rounded-xl glass-input text-cyan-300"
                            />
                          </td>
                          <td className="px-3 py-3 text-center">
                            <input
                              type="number"
                              value={s.final}
                              onChange={(e) => handleScoreChange(s.id, "final", e.target.value)}
                              className="w-16 text-center text-xs font-mono font-bold py-1.5 rounded-xl glass-input text-blue-300"
                            />
                          </td>
                          <td className="px-4 py-3 text-center font-mono font-black text-white text-base">{total}</td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-xl text-xs font-black font-mono shadow-sm border ${
                                Number(grade) >= 3.0
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : Number(grade) >= 2.0
                                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                                  : Number(grade) >= 1.0
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                  : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                              }`}
                            >
                              {grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TEACHING LOG (บันทึกหลังการสอน สอศ.)                    */}
        {/* ============================================================== */}
        {activeTab === "TEACHING_LOG" && (
          <div className="space-y-6">
            {/* Week Selector Bar */}
            <div className="glass-island p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-slate-300">เลือกสัปดาห์ที่สอน:</span>
                <select
                  value={selectedLogWeek}
                  onChange={(e) => {
                    const w = Number(e.target.value);
                    setSelectedLogWeek(w);
                    const existing = teachingLogs.find((l) => l.weekNumber === w);
                    if (existing) {
                      setLogForm({
                        id: existing.id,
                        courseCode: existing.courseCode,
                        courseName: existing.courseName,
                        weekNumber: existing.weekNumber,
                        date: existing.date,
                        topic: existing.topic,
                        learningOutcome: existing.learningOutcome,
                        totalStudents: existing.totalStudents,
                        presentCount: existing.presentCount,
                        absentCount: existing.absentCount,
                        lateCount: existing.lateCount,
                        leaveCount: existing.leaveCount,
                        problems: existing.problems,
                        solutions: existing.solutions,
                        teacherName: existing.teacherName,
                      });
                    } else {
                      setLogForm((prev) => ({
                        ...prev,
                        id: "",
                        weekNumber: w,
                        topic: `แผนการจัดการเรียนรู้ที่ ${w} : การสอนประจำสัปดาห์`,
                      }));
                    }
                  }}
                  className="text-xs font-bold px-3 py-2 rounded-xl glass-input text-white focus:outline-none cursor-pointer"
                >
                  {[...Array(calendarInfo.totalWeeks)].map((_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-[#111827]">
                      สัปดาห์ที่ {i + 1} (จาก {calendarInfo.totalWeeks} สัปดาห์)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleAutoPullAttendance}
                  className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>ดึงยอดเข้าเรียนจากคาบสอนอัตโนมัติ</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPrintLogData(logForm);
                    setIsPrintModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl glass-card hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ดูแบบพิมพ์ทางการ (Print Sheet)</span>
                </button>
              </div>
            </div>

            {/* Teaching Log Form */}
            <form onSubmit={handleSaveTeachingLog} className="glass-island p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center space-x-2">
                    <span>แบบบันทึกหลังการจัดการเรียนรู้ (สัปดาห์ที่ {selectedLogWeek})</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                      {selectedCourseCode}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">แบบฟอร์มมาตรฐานตามระเบียบงานวิชาการ สอศ.</p>
                </div>

                <button
                  type="submit"
                  disabled={isSavingLog}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSavingLog ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{isSavingLog ? "กำลังบันทึก..." : "บันทึกข้อมูลหลังการสอน"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">แผนการจัดการเรียนรู้ / เรื่องที่สอน</label>
                  <input
                    type="text"
                    required
                    value={logForm.topic}
                    onChange={(e) => setLogForm({ ...logForm, topic: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-2xl glass-input text-white focus:outline-none"
                    placeholder="เช่น การสร้างหน้าจอ Login ด้วย React Native"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">วันที่ทำการสอน</label>
                  <input
                    type="date"
                    required
                    value={logForm.date}
                    onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Attendance Counts Box */}
              <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>สรุปจำนวนนักเรียนนักศึกษาในคาบเรียน</span>
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">นักเรียนทั้งหมด</span>
                    <input
                      type="number"
                      value={logForm.totalStudents}
                      onChange={(e) => setLogForm({ ...logForm, totalStudents: Number(e.target.value) })}
                      className="w-full text-center font-mono font-black text-white text-base bg-transparent mt-1 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <span className="text-[10px] text-emerald-300 font-bold block">มาเรียน</span>
                    <input
                      type="number"
                      value={logForm.presentCount}
                      onChange={(e) => setLogForm({ ...logForm, presentCount: Number(e.target.value) })}
                      className="w-full text-center font-mono font-black text-emerald-300 text-base bg-transparent mt-1 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                    <span className="text-[10px] text-rose-300 font-bold block">ขาดเรียน</span>
                    <input
                      type="number"
                      value={logForm.absentCount}
                      onChange={(e) => setLogForm({ ...logForm, absentCount: Number(e.target.value) })}
                      className="w-full text-center font-mono font-black text-rose-300 text-base bg-transparent mt-1 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <span className="text-[10px] text-amber-300 font-bold block">มาสาย</span>
                    <input
                      type="number"
                      value={logForm.lateCount}
                      onChange={(e) => setLogForm({ ...logForm, lateCount: Number(e.target.value) })}
                      className="w-full text-center font-mono font-black text-amber-300 text-base bg-transparent mt-1 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <span className="text-[10px] text-blue-300 font-bold block">ลา</span>
                    <input
                      type="number"
                      value={logForm.leaveCount}
                      onChange={(e) => setLogForm({ ...logForm, leaveCount: Number(e.target.value) })}
                      className="w-full text-center font-mono font-black text-blue-300 text-base bg-transparent mt-1 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">ผลการจัดการเรียนรู้ (Learning Outcomes)</label>
                <textarea
                  rows={3}
                  value={logForm.learningOutcome}
                  onChange={(e) => setLogForm({ ...logForm, learningOutcome: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl glass-input text-white focus:outline-none"
                  placeholder="นักศึกษามีความรู้ ความเข้าใจ และสามารถปฏิบัติงานได้ตามจุดประสงค์เชิงพฤติกรรมอย่างไร..."
                />
              </div>

              {/* Problems & Solutions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ปัญหาและอุปสรรค</label>
                  <textarea
                    rows={3}
                    value={logForm.problems}
                    onChange={(e) => setLogForm({ ...logForm, problems: e.target.value })}
                    className="w-full text-xs p-3 rounded-2xl glass-input text-white focus:outline-none"
                    placeholder="ปัญหาด้านอุปกรณ์ นักศึกษา หรือเนื้อหา..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">แนวทางแก้ไข / การสอนซ่อมเสริม / ข้อเสนอแนะ</label>
                  <textarea
                    rows={3}
                    value={logForm.solutions}
                    onChange={(e) => setLogForm({ ...logForm, solutions: e.target.value })}
                    className="w-full text-xs p-3 rounded-2xl glass-input text-white focus:outline-none"
                    placeholder="วิธีการแก้ไขหรือการมอบหมายงานซ่อมเสริม..."
                  />
                </div>
              </div>

              <div className="pt-2 text-right text-xs text-slate-400">
                ลงชื่อครูผู้สอน: <span className="text-white font-bold">{logForm.teacherName}</span>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* SCHEDULE MODAL (ADD / EDIT)                                    */}
        {/* ============================================================== */}
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-island max-w-lg w-full rounded-3xl border border-white/20 p-6 shadow-2xl space-y-5 animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span>{editingScheduleId ? "แก้ไขคาบเรียนในตาราง" : "จัดคาบเรียนใหม่ลงตาราง"}</span>
                </h3>
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {scheduleConflictMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{scheduleConflictMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">กลุ่มเรียน (ห้อง)</label>
                  <select
                    value={scheduleForm.classroomId}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, classroomId: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                  >
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#111827]">
                        {c.name} ({c.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">รหัสวิชา</label>
                    <input
                      type="text"
                      required
                      value={scheduleForm.courseCode}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, courseCode: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ครูผู้สอน</label>
                    <input
                      type="text"
                      required
                      value={scheduleForm.teacherName}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, teacherName: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อรายวิชา</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.courseName}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, courseName: e.target.value })}
                    className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">วันในสัปดาห์</label>
                    <select
                      value={scheduleForm.dayOfWeek}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, dayOfWeek: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                    >
                      {daysOfWeek.map((d) => (
                        <option key={d.num} value={d.num} className="bg-[#111827]">
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">คาบเริ่มต้น</label>
                    <select
                      value={scheduleForm.periodStart}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, periodStart: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none font-mono"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                        <option key={p} value={p} className="bg-[#111827]">
                          คาบที่ {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">คาบสิ้นสุด</label>
                    <select
                      value={scheduleForm.periodEnd}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, periodEnd: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none font-mono"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                        <option key={p} value={p} className="bg-[#111827]">
                          คาบที่ {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ห้องเรียน / ห้องแล็บ</label>
                    <input
                      type="text"
                      required
                      value={scheduleForm.roomNumber}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, roomNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">สีแถบรายวิชา</label>
                    <select
                      value={scheduleForm.colorTheme}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, colorTheme: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                    >
                      <option value="cyan" className="bg-[#111827]">ฟ้าคราม (Cyan)</option>
                      <option value="purple" className="bg-[#111827]">ม่วง (Purple)</option>
                      <option value="emerald" className="bg-[#111827]">เขียว (Emerald)</option>
                      <option value="amber" className="bg-[#111827]">ส้มทอง (Amber)</option>
                      <option value="rose" className="bg-[#111827]">แดงกุหลาบ (Rose)</option>
                      <option value="blue" className="bg-[#111827]">น้ำเงิน (Blue)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  {editingScheduleId ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteSchedule(editingScheduleId)}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 font-bold flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบคาบเรียน</span>
                    </button>
                  ) : <div />}

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsScheduleModalOpen(false)}
                      className="px-4 py-2 rounded-xl glass-card hover:bg-white/10 text-slate-300 font-bold"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingSchedule}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold flex items-center space-x-1.5 shadow-md disabled:opacity-50"
                    >
                      {isSavingSchedule ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>บันทึกคาบเรียน</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* OFFICIAL PRINT VIEW MODAL                                      */}
        {/* ============================================================== */}
        {isPrintModalOpen && printLogData && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 max-w-2xl w-full rounded-2xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-prompt">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border font-bold text-xs text-slate-700">
                    ตรา สอศ.
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-slate-900">แบบบันทึกหลังการจัดการเรียนรู้</h2>
                    <p className="text-xs text-slate-500">วิทยาลัยอาชีวศึกษาเชียงราย (CRiC) • ประจำภาคเรียนที่ 1/2569</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
                <div><strong>รหัสวิชา:</strong> {printLogData.courseCode}</div>
                <div><strong>ชื่อวิชา:</strong> {printLogData.courseName}</div>
                <div><strong>สัปดาห์ที่สอน:</strong> สัปดาห์ที่ {printLogData.weekNumber}</div>
                <div><strong>วันที่สอน:</strong> {formatThaiDate(printLogData.date)}</div>
                <div className="col-span-2"><strong>หัวข้อการสอน:</strong> {printLogData.topic}</div>
              </div>

              <div className="text-xs space-y-3 border-b border-slate-200 pb-4">
                <div>
                  <strong>สรุปเวลาเรียน:</strong> นักเรียนทั้งหมด {printLogData.totalStudents} คน • 
                  มาเรียน <strong className="text-emerald-700">{printLogData.presentCount}</strong> คน • 
                  ขาดเรียน <strong className="text-rose-700">{printLogData.absentCount}</strong> คน • 
                  มาสาย {printLogData.lateCount} คน • 
                  ลา {printLogData.leaveCount} คน
                </div>
                <div>
                  <strong>1. ผลการจัดการเรียนรู้:</strong>
                  <p className="mt-1 text-slate-700 bg-slate-50 p-2.5 rounded-lg border">{printLogData.learningOutcome || "ไม่มีบันทึก"}</p>
                </div>
                <div>
                  <strong>2. ปัญหาและอุปสรรค:</strong>
                  <p className="mt-1 text-slate-700 bg-slate-50 p-2.5 rounded-lg border">{printLogData.problems || "ไม่มีบันทึก"}</p>
                </div>
                <div>
                  <strong>3. แนวทางแก้ไข / การสอนซ่อมเสริม:</strong>
                  <p className="mt-1 text-slate-700 bg-slate-50 p-2.5 rounded-lg border">{printLogData.solutions || "ไม่มีบันทึก"}</p>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 text-xs">
                <div>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center space-x-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>สั่งพิมพ์เอกสาร</span>
                  </button>
                </div>
                <div className="text-right space-y-1">
                  <div>ลงชื่อ..........................................................ครูผู้สอน</div>
                  <div className="font-bold">({printLogData.teacherName})</div>
                  <div className="text-slate-500 text-[11px]">วันที่ {formatThaiDate(printLogData.date)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
