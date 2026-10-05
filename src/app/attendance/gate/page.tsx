"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  ScanLine,
  QrCode,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Volume2,
  Sparkles,
  Smartphone,
  Check,
  Search,
  UserCheck,
  RefreshCw,
  BellRing,
  Building,
  KeyRound,
  ExternalLink,
  Calendar
} from "lucide-react";
import { formatThaiDate } from "@/lib/thai-date";

type GateLog = {
  id: string;
  time: string;
  code: string;
  name: string;
  department: string;
  level: string;
  gate: string;
  status: "ON_TIME" | "LATE" | "DENIED";
  lineNotified: boolean;
};

const SAMPLE_DATABASE: Record<string, { name: string; dept: string; level: string; status: "ON_TIME" | "LATE" | "DENIED" }> = {
  "6920901001": { name: "นายกิตติคุณ มั่นคง", dept: "แผนกวิชาเทคโนโลยีสารสนเทศ", level: "ปวส.1/1", status: "ON_TIME" },
  "6920901002": { name: "นางสาวณิชา ภักดี", dept: "แผนกวิชาเทคโนโลยีสารสนเทศ", level: "ปวส.1/1", status: "ON_TIME" },
  "6920901003": { name: "นายธนดล เจริญพร", dept: "แผนกวิชาช่างยนต์", level: "ปวช.2/3", status: "LATE" },
  "6920901004": { name: "นางสาวบุษกร รุ่งเรือง", dept: "แผนกวิชาการบัญชี", level: "ปวช.3/2", status: "LATE" },
  "6920901005": { name: "นายวรพจน์ สุขสวัสดิ์", dept: "แผนกวิชาช่างไฟฟ้ากำลัง", level: "ปวส.2/1", status: "ON_TIME" },
  "9999999999": { name: "บุคคลภายนอก (ไม่พบข้อมูลในระบบ)", dept: "ไม่ได้ลงทะเบียนบัตร", level: "-", status: "DENIED" }
};

export default function SmartGatePage() {
  const [selectedGate, setSelectedGate] = useState("ประตู 1 (หน้าวิทยาลัย - ประตูหลัก)");
  const [inputCode, setInputCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<{
    code: string;
    name: string;
    dept: string;
    level: string;
    time: string;
    status: "ON_TIME" | "LATE" | "DENIED";
    turnstile: "OPENED" | "LOCKED";
  } | null>({
    code: "6920901001",
    name: "นายกิตติคุณ มั่นคง",
    dept: "แผนกวิชาเทคโนโลยีสารสนเทศ",
    level: "ปวส.1/1",
    time: "07:42:15",
    status: "ON_TIME",
    turnstile: "OPENED"
  });

  const [logs, setLogs] = useState<GateLog[]>([
    { id: "log-1", time: "07:42:15", code: "6920901001", name: "นายกิตติคุณ มั่นคง", department: "เทคโนโลยีสารสนเทศ", level: "ปวส.1/1", gate: "ประตู 1", status: "ON_TIME", lineNotified: true },
    { id: "log-2", time: "07:44:02", code: "6920901002", name: "นางสาวณิชา ภักดี", department: "เทคโนโลยีสารสนเทศ", level: "ปวส.1/1", gate: "ประตู 1", status: "ON_TIME", lineNotified: true },
    { id: "log-3", time: "08:05:30", code: "6920901003", name: "นายธนดล เจริญพร", department: "ช่างยนต์", level: "ปวช.2/3", gate: "ประตู 1", status: "LATE", lineNotified: true },
    { id: "log-4", time: "08:12:18", code: "6920901004", name: "นางสาวบุษกร รุ่งเรือง", department: "การบัญชี", level: "ปวช.3/2", gate: "ประตู 2", status: "LATE", lineNotified: true },
    { id: "log-5", time: "08:14:50", code: "6920901005", name: "นายวรพจน์ สุขสวัสดิ์", department: "ช่างไฟฟ้ากำลัง", level: "ปวส.2/1", gate: "ประตู 1", status: "ON_TIME", lineNotified: true },
  ]);

  const handleScanCode = (codeToScan: string) => {
    setIsScanning(true);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    // Simulate scanner latency
    setTimeout(() => {
      const student = SAMPLE_DATABASE[codeToScan] || {
        name: "บัตรนักเรียนชั่วคราว / บุคคลทั่วไป",
        dept: "รหัส: " + codeToScan,
        level: "-",
        status: "ON_TIME" as const
      };

      const isDenied = student.status === "DENIED";

      setLastScanned({
        code: codeToScan,
        name: student.name,
        dept: student.dept,
        level: student.level,
        time: timeStr,
        status: student.status,
        turnstile: isDenied ? "LOCKED" : "OPENED"
      });

      const newLog: GateLog = {
        id: "log-" + Date.now(),
        time: timeStr,
        code: codeToScan,
        name: student.name,
        department: student.dept.replace("แผนกวิชา", ""),
        level: student.level,
        gate: selectedGate.split(" ")[0] + " " + selectedGate.split(" ")[1],
        status: student.status,
        lineNotified: !isDenied
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
      setIsScanning(false);
      setInputCode("");
    }, 450);
  };

  const totalEntries = logs.length + 420;
  const onTimeCount = logs.filter(l => l.status === "ON_TIME").length + 380;
  const lateCount = logs.filter(l => l.status === "LATE").length + 38;
  const deniedCount = logs.filter(l => l.status === "DENIED").length + 2;

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Navigation Breadcrumb */}
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
            <span className="text-white/90 text-xs font-semibold">Smart Gate RFID & QR Scanner</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Smart Gate Online (WebSocket Sync)</span>
            </div>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-indigo-950/40 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Access Control Terminal
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-white/10 text-emerald-300 border border-white/15 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  {formatThaiDate(new Date(), { showDayOfWeek: true })}
                </span>
                <span className="text-xs text-white/50">ความหน่วงเฉลี่ย: 12ms</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <ScanLine className="w-7 h-7 text-emerald-400" />
                สแกนเนอร์ประตูวิทยาลัย Smart Gate
              </h1>
              <p className="text-sm text-white/60 mt-1 max-w-xl">
                ระบบจำลองการแตะบัตรประจำตัวนักศึกษา (RFID 13.56MHz) และสแกน QR Code หน้าประตูวิทยาลัย พร้อมสั่งการประตูปีกผีเสื้อ (Turnstile) และแจ้งเตือนผู้ปกครองผ่าน LINE OA อัตโนมัติ
              </p>
            </div>

            {/* Select Gate Control */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                <select
                  value={selectedGate}
                  onChange={(e) => setSelectedGate(e.target.value)}
                  className="bg-transparent text-sm text-white focus:outline-none cursor-pointer pr-4"
                >
                  <option value="ประตู 1 (หน้าวิทยาลัย - ประตูหลัก)" className="bg-slate-900 text-white">ประตู 1 (หน้าวิทยาลัย - ประตูหลัก)</option>
                  <option value="ประตู 2 (ฝั่งโรงอาหาร/ลานกีฬา)" className="bg-slate-900 text-white">ประตู 2 (ฝั่งโรงอาหาร/ลานกีฬา)</option>
                  <option value="ประตู 3 (ฝั่งหอพัก/หลังวิทยาลัย)" className="bg-slate-900 text-white">ประตู 3 (ฝั่งหอพัก/หลังวิทยาลัย)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 text-xs mb-1">
              <span>ผ่านประตูวันนี้</span>
              <UserCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{totalEntries} <span className="text-xs font-normal text-white/50">คน</span></div>
            <div className="text-[11px] text-blue-400/80 mt-1 flex items-center gap-1">
              <span>อัปเดตแบบเรียลไทม์</span>
            </div>
          </div>

          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 text-xs mb-1">
              <span>ตรงเวลา (&lt;08:00)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">{onTimeCount} <span className="text-xs font-normal text-white/50">คน</span></div>
            <div className="text-[11px] text-emerald-400/80 mt-1">
              {((onTimeCount / totalEntries) * 100).toFixed(1)}% ของนักศึกษาทั้งหมด
            </div>
          </div>

          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 text-xs mb-1">
              <span>มาสาย (&gt;08:00)</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">{lateCount} <span className="text-xs font-normal text-white/50">คน</span></div>
            <div className="text-[11px] text-amber-400/80 mt-1">
              แจ้งเตือนผู้ปกครองแล้ว {lateCount} ราย
            </div>
          </div>

          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 text-xs mb-1">
              <span>บุคคลภายนอก/ปฏิเสธ</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-400">{deniedCount} <span className="text-xs font-normal text-white/50">คน</span></div>
            <div className="text-[11px] text-rose-400/80 mt-1">
              Turnstile ล็อคอัตโนมัติ
            </div>
          </div>
        </div>

        {/* Main Content: Scanner Terminal + Live Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Laser Scanner Simulator */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ScanLine className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">เครื่องอ่านบัตร RFID / กล้องสแกน QR Code</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>รอการแตะบัตร...</span>
                </div>
              </div>

              {/* Laser Scanner Viewport */}
              <div className="relative w-full aspect-video rounded-xl bg-black/80 border-2 border-dashed border-emerald-500/30 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner">
                {/* Visual Laser Line Effect */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-[pulse_2s_ease-in-out_infinite]"
                  style={{
                    top: isScanning ? "50%" : "30%",
                    transition: "all 0.3s ease"
                  }}
                />

                {/* Target Bounding Box */}
                <div className={`relative w-48 h-48 border-2 rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                  isScanning ? "border-emerald-400 scale-105 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]" : "border-white/20 bg-white/5"
                }`}>
                  {/* Corner notches */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                  {isScanning ? (
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                      <span className="text-xs font-semibold text-emerald-300">กำลังประมวลผลบัตร...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <QrCode className="w-12 h-12 text-white/40 group-hover:text-emerald-400" />
                      <span className="text-xs text-white/50">วางบัตร RFID หรือสแกน QR หน้ากล้อง</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xs text-white/40">
                  {selectedGate} • กล้องความละเอียดสูง IR + Dual Sensor
                </div>
              </div>

              {/* Turnstile Barrier Status Indicator */}
              <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full ${
                    lastScanned?.turnstile === "OPENED"
                      ? "bg-emerald-500 shadow-[0_0_12px_#10b981]"
                      : "bg-rose-500 shadow-[0_0_12px_#f43f5e]"
                  }`} />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      สถานะประตูกั้น (Turnstile Barrier): {lastScanned?.turnstile === "OPENED" ? "🟢 ปลดล็อค (PASS)" : "🔴 ปิดกั้น (LOCKED)"}
                    </div>
                    <div className="text-[11px] text-white/50">
                      สัญญาณหน่วงเวลาผ่านประตู 3 วินาทีก่อนปิด
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <Volume2 className="w-4 h-4" />
                  <span>เสียงบี๊บพร้อม</span>
                </div>
              </div>

              {/* Quick Simulator Test Triggers */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-xs font-semibold text-white/80 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>ปุ่มทดสอบจำลองเหตุการณ์ (Simulator Quick Triggers):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => handleScanCode("6920901001")}
                    disabled={isScanning}
                    className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition text-left flex flex-col gap-0.5"
                  >
                    <span className="font-bold">6920901001</span>
                    <span className="text-[10px] text-white/60">กิตติคุณ (ตรงเวลา)</span>
                  </button>

                  <button
                    onClick={() => handleScanCode("6920901003")}
                    disabled={isScanning}
                    className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition text-left flex flex-col gap-0.5"
                  >
                    <span className="font-bold">6920901003</span>
                    <span className="text-[10px] text-white/60">ธนดล (มาสาย 08:05)</span>
                  </button>

                  <button
                    onClick={() => handleScanCode("6920901004")}
                    disabled={isScanning}
                    className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition text-left flex flex-col gap-0.5"
                  >
                    <span className="font-bold">6920901004</span>
                    <span className="text-[10px] text-white/60">บุษกร (มาสาย 08:12)</span>
                  </button>

                  <button
                    onClick={() => handleScanCode("6920901002")}
                    disabled={isScanning}
                    className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition text-left flex flex-col gap-0.5"
                  >
                    <span className="font-bold">6920901002</span>
                    <span className="text-[10px] text-white/60">ณิชา (ตรงเวลา)</span>
                  </button>

                  <button
                    onClick={() => handleScanCode("6920901005")}
                    disabled={isScanning}
                    className="p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition text-left flex flex-col gap-0.5"
                  >
                    <span className="font-bold">6920901005</span>
                    <span className="text-[10px] text-white/60">วรพจน์ (ตรงเวลา)</span>
                  </button>

                  <button
                    onClick={() => handleScanCode("9999999999")}
                    disabled={isScanning}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition text-left flex flex-col gap-0.5"
                  >
                    <span className="font-bold">บุคคลภายนอก</span>
                    <span className="text-[10px] text-rose-300/80">บัตรไม่ได้รับอนุญาต</span>
                  </button>
                </div>

                {/* Manual Code Input Barcode Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inputCode.trim()) {
                      handleScanCode(inputCode.trim());
                    }
                  }}
                  className="mt-4 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="กรอกรหัสนักศึกษา หรือสแกน Barcode ด้วย Handheld Gun..."
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={isScanning || !inputCode.trim()}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>จำลองสแกน</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Pop-up Student Profile Card & Live Logs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Real-time Pop-up Card */}
            {lastScanned && (
              <div className={`rounded-2xl p-5 border backdrop-blur-xl transition-all duration-300 ${
                lastScanned.status === "ON_TIME"
                  ? "bg-emerald-950/30 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                  : lastScanned.status === "LATE"
                  ? "bg-amber-950/30 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                  : "bg-rose-950/30 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)]"
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-semibold text-white/80">ตรวจพบนักศึกษา (Last Scanned Profile)</span>
                  </div>
                  <span className="text-xs text-white/50">{lastScanned.time} น.</span>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Avatar Badge */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                      {lastScanned.name.slice(0, 2)}
                    </div>
                    <div className={`absolute -bottom-1.5 -right-1.5 p-1 rounded-full border border-black ${
                      lastScanned.status === "ON_TIME" ? "bg-emerald-500" : lastScanned.status === "LATE" ? "bg-amber-500" : "bg-rose-500"
                    }`}>
                      {lastScanned.status === "ON_TIME" ? (
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                      ) : lastScanned.status === "LATE" ? (
                        <Clock className="w-3.5 h-3.5 text-black stroke-[3]" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-black stroke-[3]" />
                      )}
                    </div>
                  </div>

                  {/* Info Details */}
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-lg font-bold text-white">{lastScanned.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lastScanned.status === "ON_TIME"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : lastScanned.status === "LATE"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}>
                        {lastScanned.status === "ON_TIME" ? "ตรงเวลา" : lastScanned.status === "LATE" ? "มาสาย" : "บัตรไม่ถูกต้อง"}
                      </span>
                    </div>

                    <div className="text-xs text-white/70">
                      รหัสนักศึกษา: <span className="font-mono text-white font-semibold">{lastScanned.code}</span>
                    </div>

                    <div className="text-xs text-white/50">
                      {lastScanned.dept} • {lastScanned.level}
                    </div>

                    {/* LINE OA Notification Status */}
                    {lastScanned.status !== "DENIED" && (
                      <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-xs text-emerald-400">
                        <BellRing className="w-3.5 h-3.5" />
                        <span>ส่งข้อความแจ้งเตือนผู้ปกครองผ่าน LINE OA เรียบร้อยแล้ว</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Live Logs Feed */}
            <div className="rounded-2xl p-5 bg-slate-900/60 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">บันทึกประวัติการผ่านประตู ({formatThaiDate(new Date(), { format: "short" })})</h3>
                </div>
                <span className="text-xs text-white/40">{logs.length} รายการล่าสุด</span>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-white/50 text-[11px] w-14 shrink-0">
                        {log.time}
                      </div>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{log.name}</span>
                          <span className="text-[10px] text-white/40 font-mono">({log.code})</span>
                        </div>
                        <div className="text-[11px] text-white/50">
                          {log.department} • {log.level}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-white/40 px-2 py-0.5 rounded bg-black/30 border border-white/5">
                        {log.gate}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.status === "ON_TIME"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : log.status === "LATE"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}>
                        {log.status === "ON_TIME" ? "ตรงเวลา" : log.status === "LATE" ? "มาสาย" : "ปฏิเสธ"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
