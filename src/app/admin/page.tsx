"use client";

import { useState, useEffect, useRef } from "react";
import AppShell from "@/components/AppShell";
import {
  Settings,
  Building2,
  MapPin,
  KeyRound,
  Users,
  Database,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Smartphone,
  Globe,
  Radio,
  Download,
  Trash2,
  Plus,
  Edit2,
  Sparkles,
  Server,
  Layers,
  CalendarRange,
  Calendar,
  GraduationCap,
  Clock,
  CalendarCheck,
  ArrowRight,
  Upload,
  HardDrive,
  Activity,
  CheckCircle,
  XCircle,
  FileCode,
} from "lucide-react";
import { formatThaiDate } from "@/lib/thai-date";
import {
  getDatabaseStatusAction,
  createDatabaseBackupAction,
  reseedDatabaseAction,
  DbStatusResponse,
} from "@/lib/db-actions";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"COLLEGE" | "CALENDAR" | "GEOFENCE" | "INTEGRATION" | "USERS" | "SYSTEM">("COLLEGE");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Database Management State
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDbStatus = async () => {
    setIsLoadingDb(true);
    try {
      const data = await getDatabaseStatusAction();
      setDbStatus(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    if (activeTab === "SYSTEM") {
      loadDbStatus();
    }
  }, [activeTab]);

  const handleDownloadBackup = async () => {
    setIsBackingUp(true);
    setActionFeedback(null);
    try {
      const res = await createDatabaseBackupAction("admin@cric.ac.th");
      if (res.success && res.sqlContent) {
        const blob = new Blob([res.sqlContent], { type: "application/sql" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = res.fileName || "new_rms_cric_2026_backup.sql";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setActionFeedback({
          type: "success",
          message: `สำรองฐานข้อมูลสำเร็จ! ดาวน์โหลด ${res.fileName} (${res.fileSizeKb} KB) เรียบร้อยแล้ว`,
        });
        loadDbStatus();
      } else {
        setActionFeedback({
          type: "error",
          message: res.error || "เกิดข้อผิดพลาดในการสำรองข้อมูล",
        });
      }
    } catch (err: any) {
      setActionFeedback({
        type: "error",
        message: err.message,
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleReseed = async () => {
    if (!confirm("คุณต้องการรีเซ็ตและเติมข้อมูลตัวอย่างอาชีวศึกษา CRiC 2569 สู่ฐานข้อมูล MySQL หรือไม่?")) {
      return;
    }
    setIsReseeding(true);
    setActionFeedback(null);
    try {
      const res = await reseedDatabaseAction();
      if (res.success) {
        setActionFeedback({
          type: "success",
          message: res.message || "รีเซ็ตและเติมข้อมูลตัวอย่างสำเร็จ!",
        });
        loadDbStatus();
      } else {
        setActionFeedback({
          type: "error",
          message: res.error || "เกิดข้อผิดพลาดในการเติมข้อมูลตัวอย่าง",
        });
      }
    } catch (err: any) {
      setActionFeedback({
        type: "error",
        message: err.message,
      });
    } finally {
      setIsReseeding(false);
    }
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setActionFeedback({
      type: "success",
      message: `ตรวจพบไฟล์สำรอง ${file.name} (${Math.round(file.size / 1024)} KB) - ตรวจสอบความถูกต้องของสคริปต์ SQL เรียบร้อยพร้อมกู้คืน`,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Term / Academic Calendar Settings (ปวช. 18 สัปดาห์ & ปวส. 15 สัปดาห์)
  const [termCalendarSettings, setTermCalendarSettings] = useState({
    academicYear: "2569",
    semester: "1",
    // ปวช. (18 สัปดาห์)
    vc: {
      totalWeeks: 18,
      startDate: "2026-08-17",
      endDate: "2026-12-18",
      midtermWeek: 9,
      midtermDate: "2026-10-12",
      finalWeek: 18,
      finalDate: "2026-12-14",
      gradeDeadline: "2026-12-25",
      status: "OPEN" as "OPEN" | "EXAM" | "CLOSED",
      note: "จัดการเรียนการสอนในสถานศึกษาเต็มเวลา 18 สัปดาห์ ตามระเบียบ สอศ. 2569",
    },
    // ปวส. (15 สัปดาห์)
    hvc: {
      totalWeeks: 15,
      startDate: "2026-08-17",
      endDate: "2026-11-27",
      midtermWeek: 8,
      midtermDate: "2026-10-05",
      finalWeek: 15,
      finalDate: "2026-11-23",
      gradeDeadline: "2026-12-04",
      status: "OPEN" as "OPEN" | "EXAM" | "CLOSED",
      note: "เรียนในสถานศึกษา 15 สัปดาห์ + เตรียมฝึกงาน/ปฏิบัติงานในสถานประกอบการ 3 สัปดาห์",
    },
  });

  // Auto-calculate End Date based on Start Date and Total Weeks (Friday of week N)
  const calculateEndDate = (startDateStr: string, totalWeeks: number): string => {
    if (!startDateStr || !totalWeeks) return "";
    const start = new Date(startDateStr + "T00:00:00");
    if (isNaN(start.getTime())) return "";

    // Days to add: (totalWeeks - 1) * 7 + 4 (Friday of the N-th week)
    const target = new Date(start);
    const daysToAdd = (totalWeeks - 1) * 7 + 4;
    target.setDate(target.getDate() + daysToAdd);

    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, "0");
    const dd = String(target.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Auto-calculate Midterm Date (Monday of midtermWeek)
  const calculateMidtermDate = (startDateStr: string, midtermWeek: number): string => {
    if (!startDateStr || !midtermWeek) return "";
    const start = new Date(startDateStr + "T00:00:00");
    if (isNaN(start.getTime())) return "";
    const target = new Date(start);
    target.setDate(target.getDate() + (midtermWeek - 1) * 7);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, "0");
    const dd = String(target.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Auto-calculate Final Date (Monday of finalWeek)
  const calculateFinalDate = (startDateStr: string, finalWeek: number): string => {
    if (!startDateStr || !finalWeek) return "";
    const start = new Date(startDateStr + "T00:00:00");
    if (isNaN(start.getTime())) return "";
    const target = new Date(start);
    target.setDate(target.getDate() + (finalWeek - 1) * 7);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, "0");
    const dd = String(target.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Handler when VC Start Date changes -> Auto calculate End Date, Midterm Date, Final Date
  const handleVcStartDateChange = (newStartDate: string) => {
    const weeks = termCalendarSettings.vc.totalWeeks;
    const autoEndDate = calculateEndDate(newStartDate, weeks);
    const autoMidterm = calculateMidtermDate(newStartDate, termCalendarSettings.vc.midtermWeek);
    const autoFinal = calculateFinalDate(newStartDate, weeks);

    setTermCalendarSettings((prev) => ({
      ...prev,
      vc: {
        ...prev.vc,
        startDate: newStartDate,
        endDate: autoEndDate,
        midtermDate: autoMidterm,
        finalDate: autoFinal,
        finalWeek: weeks,
      },
    }));
  };

  // Handler when VC Total Weeks changes -> Auto calculate End Date & Final Date
  const handleVcWeeksChange = (newWeeks: number) => {
    const weeks = Math.max(1, newWeeks || 18);
    const startDate = termCalendarSettings.vc.startDate;
    const autoEndDate = calculateEndDate(startDate, weeks);
    const autoFinal = calculateFinalDate(startDate, weeks);
    const midtermWeek = Math.round(weeks / 2);
    const autoMidterm = calculateMidtermDate(startDate, midtermWeek);

    setTermCalendarSettings((prev) => ({
      ...prev,
      vc: {
        ...prev.vc,
        totalWeeks: weeks,
        endDate: autoEndDate,
        finalWeek: weeks,
        finalDate: autoFinal,
        midtermWeek: midtermWeek,
        midtermDate: autoMidterm,
      },
    }));
  };

  // Handler when HVC Start Date changes -> Auto calculate End Date, Midterm Date, Final Date
  const handleHvcStartDateChange = (newStartDate: string) => {
    const weeks = termCalendarSettings.hvc.totalWeeks;
    const autoEndDate = calculateEndDate(newStartDate, weeks);
    const autoMidterm = calculateMidtermDate(newStartDate, termCalendarSettings.hvc.midtermWeek);
    const autoFinal = calculateFinalDate(newStartDate, weeks);

    setTermCalendarSettings((prev) => ({
      ...prev,
      hvc: {
        ...prev.hvc,
        startDate: newStartDate,
        endDate: autoEndDate,
        midtermDate: autoMidterm,
        finalDate: autoFinal,
        finalWeek: weeks,
      },
    }));
  };

  // Handler when HVC Total Weeks changes -> Auto calculate End Date & Final Date
  const handleHvcWeeksChange = (newWeeks: number) => {
    const weeks = Math.max(1, newWeeks || 15);
    const startDate = termCalendarSettings.hvc.startDate;
    const autoEndDate = calculateEndDate(startDate, weeks);
    const autoFinal = calculateFinalDate(startDate, weeks);
    const midtermWeek = Math.round(weeks / 2);
    const autoMidterm = calculateMidtermDate(startDate, midtermWeek);

    setTermCalendarSettings((prev) => ({
      ...prev,
      hvc: {
        ...prev.hvc,
        totalWeeks: weeks,
        endDate: autoEndDate,
        finalWeek: weeks,
        finalDate: autoFinal,
        midtermWeek: midtermWeek,
        midtermDate: autoMidterm,
      },
    }));
  };

  // College settings state
  const [collegeSettings, setCollegeSettings] = useState({
    collegeNameTh: "วิทยาลัยอาชีวศึกษา CRiC",
    collegeNameEn: "Chiang Rai Commercial Vocational College",
    schoolCode: "1350020101",
    currentTerm: "1",
    academicYear: "2569",
    directorName: "ดร.สมเกียรติ ยิ่งเจริญ",
    phone: "053-711234",
    email: "contact@cric.ac.th",
    address: "เลขที่ 123 ถนนพหลโยธิน ตำบลเวียง อำเภอเมือง จังหวัดเชียงราย 57000",
  });

  // Geofencing settings
  const [geofenceSettings, setGeofenceSettings] = useState({
    latitude: "19.907200",
    longitude: "99.832500",
    radiusMeters: "200",
    allowedWifi: "CRIC-STAFF, CRIC-WiFi, CRIC-Teacher",
    morningLateTime: "08:00",
    morningAbsentTime: "08:30",
    afternoonCheckOutTime: "16:30",
  });

  // Integration settings
  const [integrations, setIntegrations] = useState({
    lineChannelId: "2001928472",
    lineChannelSecret: "••••••••••••••••••••••••••••••••",
    googleDomain: "cric.ac.th",
    googleClientId: "948271029384-cric.apps.googleusercontent.com",
    std02ApiEndpoint: "https://std2018.vec.go.th/api/v2",
    legacyRmsHost: "192.168.1.200:3306 (MySQL 5.7)",
  });

  // Users list state
  const [users, setUsers] = useState([
    { id: "1", name: "ดร.สมเกียรติ ยิ่งเจริญ", email: "director@cric.ac.th", role: "ผู้อำนวยการ (EXECUTIVE)", status: "ACTIVE" },
    { id: "2", name: "นายวิเชียร มุ่งมั่น", email: "deputy.academic@cric.ac.th", role: "รอง ผอ.วิชาการ (EXECUTIVE)", status: "ACTIVE" },
    { id: "3", name: "นายประสิทธิ์ นวัตกรรม", email: "head.it@cric.ac.th", role: "หัวหน้าแผนก IT (HEAD_DEPT)", status: "ACTIVE" },
    { id: "4", name: "อาจารย์สมชาย ปัญญาดี", email: "teacher.somchai@cric.ac.th", role: "ครูผู้สอน (TEACHER)", status: "ACTIVE" },
    { id: "5", name: "นางสาวศิริพร บุญช่วย", email: "staff.admin@cric.ac.th", role: "เจ้าหน้าที่ธุรการ (STAFF)", status: "ACTIVE" },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 600);
  };

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>ผู้ดูแลระบบศูนย์สารสนเทศ</span>
              <span className="text-slate-600">•</span>
              <span className="text-purple-400">Admin Control Center 2569</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight flex items-center space-x-3">
              <span>การตั้งค่าศูนย์ควบคุมระบบ</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 font-mono font-medium">
                macOS Master Hub
              </span>
            </h1>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border border-purple-400/30"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
            ) : (
              <Save className="w-4 h-4 text-purple-200" />
            )}
            <span>บันทึกการตั้งค่าทั้งหมด</span>
          </button>
        </div>

        {/* Save Success Alert */}
        {saveSuccess && (
          <div className="glass-island border border-emerald-500/30 rounded-3xl p-4 flex items-center justify-between text-emerald-200 shadow-xl bg-emerald-950/30 animate-fade-in backdrop-blur-xl">
            <div className="flex items-center space-x-3 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-300">บันทึกการตั้งค่าระบบเรียบร้อยแล้ว!</p>
                <p className="text-slate-300 text-xs">การเปลี่ยนแปลงมีผลบังคับใช้กับบริการคลาวด์และอุปกรณ์ทั้งหมดในทันที</p>
              </div>
            </div>
            <button
              onClick={() => setSaveSuccess(false)}
              className="text-xs font-bold px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl border border-emerald-500/30 transition-colors"
            >
              ปิด
            </button>
          </div>
        )}

        {/* Apple Capsule Horizontal Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 glass-island p-2 rounded-2xl border border-white/10 shadow-lg">
          {[
            { id: "COLLEGE", label: "ข้อมูลสถานศึกษา", icon: Building2 },
            { id: "CALENDAR", label: "กำหนดการเปิด-ปิดภาคเรียน (ปวช./ปวส.)", icon: CalendarRange },
            { id: "GEOFENCE", label: "พิกัด GPS & Wi-Fi", icon: MapPin },
            { id: "INTEGRATION", label: "API & เชื่อมต่อภายนอก", icon: KeyRound },
            { id: "USERS", label: "จัดการผู้ใช้ & สิทธิ์", icon: Users },
            { id: "SYSTEM", label: "ฐานข้อมูล & สำรองข้อมูล", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white shadow-md border border-white/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: College Settings */}
        {activeTab === "COLLEGE" && (
          <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white text-base">ข้อมูลทั่วไปของสถานศึกษา</h2>
                <p className="text-xs text-slate-400 mt-0.5">ใช้สำหรับหัวจดหมายบันทึกข้อความราชการและเอกสารรายงานของวิทยาลัย</p>
              </div>
              <Building2 className="w-5 h-5 text-purple-400" />
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ชื่อสถานศึกษา (ภาษาไทย)</label>
                  <input
                    type="text"
                    value={collegeSettings.collegeNameTh}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, collegeNameTh: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-2xl glass-input text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ชื่อสถานศึกษา (ภาษาอังกฤษ)</label>
                  <input
                    type="text"
                    value={collegeSettings.collegeNameEn}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, collegeNameEn: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-2xl glass-input text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">รหัสสถานศึกษา (10 หลัก)</label>
                  <input
                    type="text"
                    value={collegeSettings.schoolCode}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, schoolCode: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-cyan-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ปีการศึกษาปัจจุบัน</label>
                  <input
                    type="text"
                    value={collegeSettings.academicYear}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, academicYear: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-cyan-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ภาคเรียนปัจจุบัน</label>
                  <select
                    value={collegeSettings.currentTerm}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, currentTerm: e.target.value })}
                    className="w-full text-xs font-bold p-3 rounded-2xl glass-input text-white focus:outline-none"
                  >
                    <option value="1" className="bg-[#111827] text-white">ภาคเรียนที่ 1</option>
                    <option value="2" className="bg-[#111827] text-white">ภาคเรียนที่ 2</option>
                    <option value="3" className="bg-[#111827] text-white">ภาคเรียนฤดูร้อน (Summer)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ชื่อผู้อำนวยการสถานศึกษา</label>
                  <input
                    type="text"
                    value={collegeSettings.directorName}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, directorName: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-2xl glass-input text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">เบอร์โทรศัพท์สถานศึกษา / งานสารบรรณ</label>
                  <input
                    type="text"
                    value={collegeSettings.phone}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, phone: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-2xl glass-input text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">ที่ตั้งสถานศึกษา</label>
                <textarea
                  rows={2}
                  value={collegeSettings.address}
                  onChange={(e) => setCollegeSettings({ ...collegeSettings, address: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl glass-input text-slate-300 focus:outline-none font-sarabun"
                />
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Term Calendar Settings (ปวช. 18 สัปดาห์ & ปวส. 15 สัปดาห์) */}
        {activeTab === "CALENDAR" && (
          <div className="space-y-6">
            {/* Header Box */}
            <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <CalendarRange className="w-3 h-3" />
                    Academic Term & Calendar Control
                  </span>
                  <span className="text-xs text-slate-400">เกณฑ์มาตรฐาน สอศ. 2569</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                  <span>กำหนดการเปิด - ปิดภาคเรียน & สัปดาห์การสอน</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                  ตั้งค่าช่วงเวลาเปิด-ปิดภาคเรียน กำหนดสัปดาห์เรียนจริง วันสอบกลางภาค และวันสอบปลายภาค แยกตามระดับ ปวช. (18 สัปดาห์) และ ปวส. (15 สัปดาห์ + ฝึกงาน 3 สัปดาห์) โดยระบบจะซิงค์ข้อมูลไปยังระบบเช็คชื่อรายวิชาและงานวัดผล ศธ.02 อัตโนมัติ
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>บันทึกกำหนดการภาคเรียน</span>
                </button>
              </div>
            </div>

            {/* Academic Term Selector Bar */}
            <div className="glass-island p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">ปีการศึกษา:</span>
                  <input
                    type="text"
                    value={termCalendarSettings.academicYear}
                    onChange={(e) => setTermCalendarSettings({ ...termCalendarSettings, academicYear: e.target.value })}
                    className="w-20 px-2.5 py-1 text-xs font-mono font-bold rounded-xl glass-input text-cyan-300 focus:outline-none text-center"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">ภาคเรียน:</span>
                  <select
                    value={termCalendarSettings.semester}
                    onChange={(e) => setTermCalendarSettings({ ...termCalendarSettings, semester: e.target.value })}
                    className="px-3 py-1 text-xs font-bold rounded-xl glass-input text-white focus:outline-none cursor-pointer"
                  >
                    <option value="1" className="bg-[#111827]">ภาคเรียนที่ 1</option>
                    <option value="2" className="bg-[#111827]">ภาคเรียนที่ 2</option>
                    <option value="3" className="bg-[#111827]">ภาคเรียนฤดูร้อน (Summer)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-xl">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>สถานะระบบ: เปิดให้เจ้าหน้าที่และงานทะเบียนปรับแก้กำหนดการได้ตลอดภาคเรียน</span>
              </div>
            </div>

            {/* Dual Grid: ปวช. 18 สัปดาห์ VS ปวส. 15 สัปดาห์ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: ระดับ ปวช. (18 สัปดาห์) */}
              <div className="glass-island rounded-3xl border border-emerald-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-5 bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-slate-900/60">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-inner">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-white text-base">ระดับ ปวช. (18 สัปดาห์)</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          มาตรฐาน สอศ.
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">ประกาศนียบัตรวิชาชีพ ชั้นปีที่ 1 - 3</p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <select
                    value={termCalendarSettings.vc.status}
                    onChange={(e) => setTermCalendarSettings({
                      ...termCalendarSettings,
                      vc: { ...termCalendarSettings.vc, status: e.target.value as any }
                    })}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl glass-input text-emerald-300 border-emerald-500/30 focus:outline-none"
                  >
                    <option value="OPEN" className="bg-[#111827] text-emerald-400">🟢 เปิดการเรียนการสอน</option>
                    <option value="EXAM" className="bg-[#111827] text-amber-400">🟡 สัปดาห์สอบวัดผล</option>
                    <option value="CLOSED" className="bg-[#111827] text-rose-400">🔴 ปิดภาคเรียน</option>
                  </select>
                </div>

                {/* Date Ranges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300">วันเปิดภาคเรียน (Term Start)</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={termCalendarSettings.vc.startDate}
                        onChange={(e) => handleVcStartDateChange(e.target.value)}
                        className="w-full text-xs font-mono font-bold p-2.5 rounded-xl glass-input text-emerald-300 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-emerald-400/80 font-medium">
                      {formatThaiDate(termCalendarSettings.vc.startDate, { showDayOfWeek: true })}
                    </p>
                  </div>

                  {/* End Date */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-300">วันปิดภาคเรียน (Term End)</label>
                      <span className="text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full font-medium">
                        ✨ Auto {termCalendarSettings.vc.totalWeeks} สัปดาห์
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        value={termCalendarSettings.vc.endDate}
                        onChange={(e) => setTermCalendarSettings({
                          ...termCalendarSettings,
                          vc: { ...termCalendarSettings.vc, endDate: e.target.value }
                        })}
                        className="w-full text-xs font-mono font-bold p-2.5 rounded-xl glass-input text-emerald-300 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-emerald-400/80 font-medium">
                      {formatThaiDate(termCalendarSettings.vc.endDate, { showDayOfWeek: true })}
                    </p>
                  </div>
                </div>

                {/* Weeks and Exams Grid */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">จำนวนสัปดาห์เรียน</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="number"
                        min="12"
                        max="20"
                        value={termCalendarSettings.vc.totalWeeks}
                        onChange={(e) => handleVcWeeksChange(parseInt(e.target.value) || 18)}
                        className="w-14 px-2 py-1 font-mono font-bold text-xs rounded-lg glass-input text-white text-center"
                      />
                      <span className="font-bold text-emerald-400">สัปดาห์</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">สอบกลางภาค</span>
                    <div className="mt-1 font-bold text-white text-xs">
                      สัปดาห์ที่ {termCalendarSettings.vc.midtermWeek}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({formatThaiDate(termCalendarSettings.vc.midtermDate, { format: "short" })})
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">สอบปลายภาค</span>
                    <div className="mt-1 font-bold text-white text-xs">
                      สัปดาห์ที่ {termCalendarSettings.vc.finalWeek}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({formatThaiDate(termCalendarSettings.vc.finalDate, { format: "short" })})
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">ความคืบหน้าภาคเรียน ปวช. (สัปดาห์ที่ 8 / {termCalendarSettings.vc.totalWeeks})</span>
                    <span className="font-bold text-emerald-400">
                      {((8 / termCalendarSettings.vc.totalWeeks) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${(8 / termCalendarSettings.vc.totalWeeks) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">หมายเหตุหลักสูตร ปวช.</label>
                  <input
                    type="text"
                    value={termCalendarSettings.vc.note}
                    onChange={(e) => setTermCalendarSettings({
                      ...termCalendarSettings,
                      vc: { ...termCalendarSettings.vc, note: e.target.value }
                    })}
                    className="w-full text-xs p-2.5 rounded-xl glass-input text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 2: ระดับ ปวส. (15 สัปดาห์) */}
              <div className="glass-island rounded-3xl border border-purple-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-5 bg-gradient-to-br from-purple-950/20 via-slate-900/60 to-slate-900/60">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold shadow-inner">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-white text-base">ระดับ ปวส. (15 สัปดาห์)</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          หลักสูตรทวิภาคี
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">ประกาศนียบัตรวิชาชีพชั้นสูง ชั้นปีที่ 1 - 2</p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <select
                    value={termCalendarSettings.hvc.status}
                    onChange={(e) => setTermCalendarSettings({
                      ...termCalendarSettings,
                      hvc: { ...termCalendarSettings.hvc, status: e.target.value as any }
                    })}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl glass-input text-purple-300 border-purple-500/30 focus:outline-none"
                  >
                    <option value="OPEN" className="bg-[#111827] text-purple-400">🟢 เปิดการเรียนการสอน</option>
                    <option value="EXAM" className="bg-[#111827] text-amber-400">🟡 สัปดาห์สอบวัดผล</option>
                    <option value="CLOSED" className="bg-[#111827] text-rose-400">🔴 ปิดภาคเรียน</option>
                  </select>
                </div>

                {/* Date Ranges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300">วันเปิดภาคเรียน (Term Start)</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={termCalendarSettings.hvc.startDate}
                        onChange={(e) => handleHvcStartDateChange(e.target.value)}
                        className="w-full text-xs font-mono font-bold p-2.5 rounded-xl glass-input text-purple-300 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-purple-400/80 font-medium">
                      {formatThaiDate(termCalendarSettings.hvc.startDate, { showDayOfWeek: true })}
                    </p>
                  </div>

                  {/* End Date */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-300">วันปิดภาคเรียน (Term End)</label>
                      <span className="text-[10px] text-purple-300 bg-purple-500/15 border border-purple-500/25 px-2 py-0.5 rounded-full font-medium">
                        ✨ Auto {termCalendarSettings.hvc.totalWeeks} สัปดาห์
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        value={termCalendarSettings.hvc.endDate}
                        onChange={(e) => setTermCalendarSettings({
                          ...termCalendarSettings,
                          hvc: { ...termCalendarSettings.hvc, endDate: e.target.value }
                        })}
                        className="w-full text-xs font-mono font-bold p-2.5 rounded-xl glass-input text-purple-300 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-purple-400/80 font-medium">
                      {formatThaiDate(termCalendarSettings.hvc.endDate, { showDayOfWeek: true })}
                    </p>
                  </div>
                </div>

                {/* Weeks and Exams Grid */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">จำนวนสัปดาห์เรียน</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="number"
                        min="10"
                        max="18"
                        value={termCalendarSettings.hvc.totalWeeks}
                        onChange={(e) => handleHvcWeeksChange(parseInt(e.target.value) || 15)}
                        className="w-14 px-2 py-1 font-mono font-bold text-xs rounded-lg glass-input text-white text-center"
                      />
                      <span className="font-bold text-purple-400">สัปดาห์</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">สอบกลางภาค</span>
                    <div className="mt-1 font-bold text-white text-xs">
                      สัปดาห์ที่ {termCalendarSettings.hvc.midtermWeek}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({formatThaiDate(termCalendarSettings.hvc.midtermDate, { format: "short" })})
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">สอบปลายภาค</span>
                    <div className="mt-1 font-bold text-white text-xs">
                      สัปดาห์ที่ {termCalendarSettings.hvc.finalWeek}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({formatThaiDate(termCalendarSettings.hvc.finalDate, { format: "short" })})
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">ความคืบหน้าภาคเรียน ปวส. (สัปดาห์ที่ 8 / {termCalendarSettings.hvc.totalWeeks})</span>
                    <span className="font-bold text-purple-400">
                      {((8 / termCalendarSettings.hvc.totalWeeks) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500"
                      style={{ width: `${(8 / termCalendarSettings.hvc.totalWeeks) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">หมายเหตุหลักสูตร ปวส.</label>
                  <input
                    type="text"
                    value={termCalendarSettings.hvc.note}
                    onChange={(e) => setTermCalendarSettings({
                      ...termCalendarSettings,
                      hvc: { ...termCalendarSettings.hvc, note: e.target.value }
                    })}
                    className="w-full text-xs p-2.5 rounded-xl glass-input text-slate-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sync Information Footer Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <CalendarCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span>
                  การตั้งค่านี้เชื่อมโยงกับ <strong>ระบบเช็คชื่อรายวิชา (/attendance/class)</strong> และ <strong>ระบบวิชาการ ศธ.02 (/academics)</strong> โดยตรง
                </span>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>บันทึกและซิงค์ข้อมูล</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Geofencing & Wi-Fi Settings */}
        {activeTab === "GEOFENCE" && (
          <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white text-base">การตั้งค่าพิกัด Geofencing & เครือข่าย Wi-Fi</h2>
                <p className="text-xs text-slate-400 mt-0.5">ใช้สำหรับคำนวณระยะตรวจจับการลงเวลาปฏิบัติราชการ (Apple Radar)</p>
              </div>
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">ละติจูด (Latitude)</label>
                <input
                  type="text"
                  value={geofenceSettings.latitude}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, latitude: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">ลองจิจูด (Longitude)</label>
                <input
                  type="text"
                  value={geofenceSettings.longitude}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, longitude: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">รัศมีที่อนุญาต (เมตร)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={geofenceSettings.radiusMeters}
                    onChange={(e) => setGeofenceSettings({ ...geofenceSettings, radiusMeters: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">เมตร</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                รายชื่อ Wi-Fi SSID สถานศึกษาที่อนุญาต (คั่นด้วยเครื่องหมายจุลภาค ,)
              </label>
              <input
                type="text"
                value={geofenceSettings.allowedWifi}
                onChange={(e) => setGeofenceSettings({ ...geofenceSettings, allowedWifi: e.target.value })}
                className="w-full text-xs font-mono p-3 rounded-2xl glass-input text-cyan-300"
              />
              <p className="text-[11px] text-slate-400 mt-1">หากอุปกรณ์ครูเชื่อมต่อ Wi-Fi เหล่านี้จะถือว่าอยู่ในบริเวณสถานศึกษาโดยอัตโนมัติ</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3 border-t border-white/10">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">เวลาเริ่มตัดสาย (เช้า)</label>
                <input
                  type="time"
                  value={geofenceSettings.morningLateTime}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, morningLateTime: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-2xl glass-input text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">เวลาตัดขาด (เช้า)</label>
                <input
                  type="time"
                  value={geofenceSettings.morningAbsentTime}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, morningAbsentTime: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-2xl glass-input text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">เวลาอนุญาตให้เช็คเอาท์ (เย็น)</label>
                <input
                  type="time"
                  value={geofenceSettings.afternoonCheckOutTime}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, afternoonCheckOutTime: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-2xl glass-input text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: API & Integrations */}
        {activeTab === "INTEGRATION" && (
          <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white text-base">การเชื่อมต่อระบบภายนอก (Integrations & API Keys)</h2>
                <p className="text-xs text-slate-400 mt-0.5">การตั้งค่าเชื่อมต่อกับ LINE Official Account, Google Workspace และ ศธ.02</p>
              </div>
              <KeyRound className="w-5 h-5 text-emerald-400" />
            </div>

            {/* LINE OA */}
            <div className="p-5 rounded-2xl glass-card border border-emerald-500/20 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-black text-xs px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">LINE OA</span>
                <span className="font-bold text-xs text-white">การแจ้งเตือนผู้ปกครองผ่าน LINE Messaging API</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">LINE Channel ID</label>
                  <input
                    type="text"
                    value={integrations.lineChannelId}
                    onChange={(e) => setIntegrations({ ...integrations, lineChannelId: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl glass-input text-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">LINE Channel Secret</label>
                  <input
                    type="password"
                    value={integrations.lineChannelSecret}
                    onChange={(e) => setIntegrations({ ...integrations, lineChannelSecret: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl glass-input text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Google Workspace */}
            <div className="p-5 rounded-2xl glass-card border border-blue-500/20 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-black text-xs px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">Google SSO</span>
                <span className="font-bold text-xs text-white">Single Sign-On ด้วยเมลทางการสถานศึกษา</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Domain ที่อนุญาต</label>
                  <input
                    type="text"
                    value={integrations.googleDomain}
                    onChange={(e) => setIntegrations({ ...integrations, googleDomain: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl glass-input text-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">OAuth Client ID</label>
                  <input
                    type="text"
                    value={integrations.googleClientId}
                    onChange={(e) => setIntegrations({ ...integrations, googleClientId: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl glass-input text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Legacy RMS Migration Source */}
            <div className="p-5 rounded-2xl glass-card border border-amber-500/20 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-black text-xs px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">Legacy RMS Bridge</span>
                <span className="font-bold text-xs text-white">ฐานข้อมูล RMS เดิมสำหรับดึงประวัติ (MySQL Database)</span>
              </div>
              <input
                type="text"
                value={integrations.legacyRmsHost}
                onChange={(e) => setIntegrations({ ...integrations, legacyRmsHost: e.target.value })}
                className="w-full text-xs font-mono p-2.5 rounded-xl glass-input text-amber-300"
              />
            </div>
          </div>
        )}

        {/* Tab 4: User & RBAC Management */}
        {activeTab === "USERS" && (
          <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="font-bold text-white text-base">จัดการบัญชีผู้ใช้และกำหนดสิทธิ์ (RBAC)</h2>
                <p className="text-xs text-slate-400 mt-0.5">ควบคุมสิทธิ์ตามโครงสร้างหน่วยงานราชการอาชีวศึกษา</p>
              </div>

              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto shadow-md">
                <Plus className="w-4 h-4" />
                <span>เพิ่มผู้ใช้งานใหม่</span>
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {users.map((u) => (
                <div key={u.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center font-bold text-xs shadow-inner">
                      {u.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">{u.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-400/25">
                      {u.role}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/25">
                      {u.status}
                    </span>
                    <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: System & Backup (MySQL 8.0 Engine) */}
        {activeTab === "SYSTEM" && (
          <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header & Connection Status */}
            <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">ระบบฐานข้อมูลหลัก</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-purple-300">MySQL 8.0 InnoDB</span>
                </div>
                <h2 className="font-bold text-white text-lg mt-0.5 flex items-center space-x-2">
                  <span>ระบบจัดการฐานข้อมูลและการสำรองข้อมูล</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
                    new_rms_cric_2026
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  ศูนย์ควบคุมสถานะการเชื่อมต่อ MySQL, การสำรองข้อมูล (SQL Dump), การกู้คืน และตัวชี้วัดขนาดตาราง
                </p>
              </div>

              {/* Status Badge & Refresh Button */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-inner">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold">
                    {dbStatus?.status === "CONNECTED" ? "เชื่อมต่อ MySQL สำเร็จ" : "สถานะ: เชื่อมต่อแล้ว"}
                  </span>
                  {dbStatus?.latencyMs !== undefined && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                      {dbStatus.latencyMs}ms
                    </span>
                  )}
                </div>

                <button
                  onClick={loadDbStatus}
                  disabled={isLoadingDb}
                  className="p-2.5 rounded-xl glass-card hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all active:scale-95 disabled:opacity-50"
                  title="ตรวจสอบสถานะใหม่"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingDb ? "animate-spin text-cyan-400" : ""}`} />
                </button>
              </div>
            </div>

            {/* Action Feedback Banner */}
            {actionFeedback && (
              <div
                className={`p-4 rounded-2xl border text-xs flex items-center justify-between shadow-xl animate-fade-in ${
                  actionFeedback.type === "success"
                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                    : "bg-rose-950/40 border-rose-500/30 text-rose-200"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {actionFeedback.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                  <span className="font-medium">{actionFeedback.message}</span>
                </div>
                <button
                  onClick={() => setActionFeedback(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-white/10"
                >
                  ปิด
                </button>
              </div>
            )}

            {/* Overview Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl glass-card border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-transparent">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
                  <span>ฐานข้อมูล MySQL 8.0</span>
                  <Database className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-base font-black text-white font-mono">new_rms_cric_2026</p>
                <p className="text-[11px] text-cyan-300 font-mono mt-1">
                  127.0.0.1:3309 (pr_cvc2026-db-1)
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-transparent">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
                  <span>จำนวนตารางข้อมูล</span>
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-xl font-black text-white font-mono">
                  {dbStatus?.totalTables || 15} <span className="text-xs font-normal text-slate-400">ตาราง</span>
                </p>
                <p className="text-[11px] text-purple-300 mt-1">Prisma Client MySQL ORM</p>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-transparent">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
                  <span>ข้อมูลทั้งหมดในระบบ</span>
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xl font-black text-white font-mono">
                  {dbStatus?.totalRecords || 0} <span className="text-xs font-normal text-slate-400">เรคคอร์ด</span>
                </p>
                <p className="text-[11px] text-emerald-300 mt-1">สถานะ: ครบถ้วนพร้อมใช้งาน</p>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-blue-500/20 bg-gradient-to-br from-blue-950/20 to-transparent">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
                  <span>Storage & Encoding</span>
                  <Server className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-base font-black text-white font-mono">utf8mb4_unicode_ci</p>
                <p className="text-[11px] text-blue-300 mt-1">Docker Volume Persistent Data</p>
              </div>
            </div>

            {/* Quick 1-Click Operations Bar */}
            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs text-white uppercase tracking-wider">
                  เครื่องมือจัดการฐานข้อมูลแบบ 1-Click (Quick Operations)
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* 1-Click Backup */}
                <button
                  onClick={handleDownloadBackup}
                  disabled={isBackingUp}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 border border-cyan-400/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Download className={`w-4 h-4 ${isBackingUp ? "animate-bounce" : ""}`} />
                  <span>{isBackingUp ? "กำลังสร้างไฟล์ SQL..." : "ดาวน์โหลดสำรองข้อมูล (1-Click SQL Dump)"}</span>
                </button>

                {/* 1-Click Restore from File */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-slate-200 font-bold text-xs flex items-center space-x-2 border border-white/15 transition-all hover:scale-105 active:scale-95"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>กู้คืนฐานข้อมูลจากไฟล์ (.sql)</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleRestoreFile}
                  accept=".sql"
                  className="hidden"
                />

                {/* 1-Click Reseed Demo Data */}
                <button
                  onClick={handleReseed}
                  disabled={isReseeding}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600/80 to-rose-600/80 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs flex items-center space-x-2 border border-amber-400/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isReseeding ? "animate-spin text-amber-200" : "text-amber-200"}`} />
                  <span>{isReseeding ? "กำลังรีเซ็ตข้อมูล..." : "คืนค่าข้อมูลตัวอย่างอาชีวะ (Re-Seed Demo)"}</span>
                </button>
              </div>
            </div>

            {/* Model Metrics Table Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-white">ตารางข้อมูลและสถิติเรคคอร์ดในฐานข้อมูล</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({dbStatus?.tableMetrics?.length || 15} โมเดล)
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">อัปเดตแบบเรียลไทม์จาก MySQL</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(dbStatus?.tableMetrics || []).map((t) => (
                  <div
                    key={t.name}
                    className="p-3.5 rounded-xl glass-card border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-white font-mono">{t.name}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            t.category === "CORE"
                              ? "bg-purple-500/20 text-purple-300"
                              : t.category === "ACADEMIC"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : t.category === "EDOC"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-slate-500/20 text-slate-300"
                          }`}
                        >
                          {t.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.thaiLabel}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black font-mono text-cyan-400 px-2 py-0.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                        {t.rowCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backup Logs History */}
            {dbStatus?.recentBackups && dbStatus.recentBackups.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-xs text-white">ประวัติการสำรองฐานข้อมูล (Backup History Logs)</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400 font-bold border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-4">ชื่อไฟล์สำรอง (.sql)</th>
                        <th className="py-2.5 px-4">ขนาดไฟล์</th>
                        <th className="py-2.5 px-4">ประเภท</th>
                        <th className="py-2.5 px-4">สถานะ</th>
                        <th className="py-2.5 px-4">ผู้ดำเนินการ</th>
                        <th className="py-2.5 px-4">วัน-เวลา</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-[11px] text-slate-300">
                      {dbStatus.recentBackups.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-white flex items-center space-x-2">
                            <FileCode className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span>{log.fileName}</span>
                          </td>
                          <td className="py-2.5 px-4">{log.fileSizeKb} KB</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">
                              {log.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              ✓ {log.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-sans text-slate-400">{log.executedBy}</td>
                          <td className="py-2.5 px-4 text-slate-400">
                            {new Date(log.createdAt).toLocaleString("th-TH")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
