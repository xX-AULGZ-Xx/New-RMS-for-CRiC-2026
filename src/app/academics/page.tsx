"use client";

import { useState } from "react";
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
  ChevronRight
} from "lucide-react";

type ScoreItem = {
  id: string;
  code: string;
  name: string;
  unit1: number;
  unit2: number;
  midterm: number;
  final: number;
};

export default function AcademicsPage() {
  const [courseCode, setCourseCode] = useState("30204-2001");
  const [courseName, setCourseName] = useState("การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่ (Mobile App Dev)");
  const [isExported, setIsExported] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [scores, setScores] = useState<ScoreItem[]>([
    { id: "1", code: "6920901001", name: "นายกิตติคุณ มั่นคง", unit1: 28, unit2: 27, midterm: 18, final: 17 },
    { id: "2", code: "6920901002", name: "นางสาวณิชา ภักดี", unit1: 29, unit2: 28, midterm: 19, final: 18 },
    { id: "3", code: "6920901003", name: "นายธนดล เจริญพร", unit1: 24, unit2: 25, midterm: 15, final: 14 },
    { id: "4", code: "6920901004", name: "นางสาวบุษกร รุ่งเรือง", unit1: 22, unit2: 23, midterm: 14, final: 12 },
    { id: "5", code: "6920901005", name: "นายวรพจน์ สุขสวัสดิ์", unit1: 27, unit2: 26, midterm: 17, final: 16 },
  ]);

  // Compute Grade according to Thai Vocational standard (สอศ.)
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

  const handleScoreChange = (id: string, field: "unit1" | "unit2" | "midterm" | "final", val: string) => {
    const num = Math.max(0, Math.min(30, Number(val) || 0));
    setScores((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: num } : s))
    );
  };

  // Export to CSV matching ศธ.02 format
  const exportStd02 = () => {
    const headers = "รหัสนักเรียน,ชื่อ-สกุล,หน่วยที่1(30),หน่วยที่2(30),กลางภาค(20),ปลายภาค(20),รวม(100),ระดับผลการเรียน(เกรด)\n";
    const rows = scores
      .map((s) => {
        const total = s.unit1 + s.unit2 + s.midterm + s.final;
        const grade = calculateGrade(total);
        return `${s.code},${s.name},${s.unit1},${s.unit2},${s.midterm},${s.final},${total},${grade}`;
      })
      .join("\n");

    const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `STD02_${courseCode}_CRiC_2569.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExported(true);
  };

  const filteredScores = scores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.includes(searchQuery)
  );

  // Grade Counts
  const gradeCounts = scores.reduce((acc: any, s) => {
    const total = s.unit1 + s.unit2 + s.midterm + s.final;
    const g = calculateGrade(total);
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const averageScore = Math.round(
    scores.reduce((acc, s) => acc + (s.unit1 + s.unit2 + s.midterm + s.final), 0) / (scores.length || 1)
  );

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>ฝ่ายวิชาการและงานวัดผลประเมินผล</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400">สอศ. ศธ.02 คลาวด์</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight flex items-center space-x-3">
              <span>บันทึกคะแนนสมรรถนะรายวิชา</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-mono font-medium">
                VEC Standard
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={exportStd02}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 border border-emerald-400/30"
            >
              <Download className="w-4 h-4" />
              <span>ส่งออกไฟล์มาตรฐาน ศธ.02</span>
            </button>
          </div>
        </div>

        {/* Export Success Alert */}
        {isExported && (
          <div className="glass-island border border-emerald-500/30 rounded-3xl p-4 flex items-center justify-between text-emerald-200 shadow-xl bg-emerald-950/30 animate-fade-in backdrop-blur-xl">
            <div className="flex items-center space-x-3 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-300">สร้างไฟล์ชีตมาตรฐาน ศธ.02 สำเร็จ!</p>
                <p className="text-slate-300 text-xs">
                  ไฟล์ <strong className="font-mono text-cyan-300">STD02_{courseCode}_CRiC_2569.csv</strong> พร้อมอัปโหลดนำเข้าสู่ระบบ ศธ.02 ออนไลน์ของ สอศ.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExported(false)}
              className="text-xs font-bold px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl border border-emerald-500/30 transition-colors"
            >
              ปิด
            </button>
          </div>
        )}

        {/* Course Info Bento Card */}
        <div className="glass-island p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex items-start sm:items-center space-x-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-400 flex items-center justify-center font-bold shadow-inner flex-shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
                  {courseCode}
                </span>
                <span className="text-xs text-slate-400 font-medium">ภาคเรียนที่ 1/2569 • 3 หน่วยกิต (2-2-3)</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  เปิดสอนปกติ
                </span>
              </div>
              <h3 className="font-bold text-white text-lg mt-1">{courseName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                กลุ่มเรียน: <span className="text-slate-200 font-semibold">ปวช. 1/1</span> แผนกวิชาเทคโนโลยีสารสนเทศ • ครูผู้สอน: <span className="text-slate-200 font-semibold">อาจารย์สมชาย ปัญญาดี</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 z-10">
            <div className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">คะแนนเฉลี่ยห้อง</span>
              <div className="text-xl font-black font-mono text-cyan-400">{averageScore} / 100</div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหารหัส หรือชื่อนักศึกษา..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-2xl glass-input w-52 sm:w-64 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
          </div>
        </div>

        {/* Grade Distribution Overview Bento Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {["4.0", "3.5", "3.0", "2.5", "2.0", "1.5", "1.0", "0"].map((g) => {
            const count = gradeCounts[g] || 0;
            const isHigh = Number(g) >= 3.0;
            const isPass = Number(g) >= 1.0;
            return (
              <div
                key={g}
                className="glass-card p-3 rounded-2xl border border-white/10 text-center hover:border-white/20 transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-1">
                  <span>เกรด</span>
                  <span className={`font-mono ${isHigh ? "text-cyan-400" : isPass ? "text-blue-400" : "text-rose-400"}`}>
                    {g}
                  </span>
                </div>
                <p className="text-xl font-black text-white font-mono">
                  {count} <span className="text-xs font-normal text-slate-400">คน</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Dark Glass Grading Table */}
        <div className="glass-island rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">ตารางบันทึกคะแนนเก็บและตัดเกรดอิงเกณฑ์ สอศ.</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              แสดง {filteredScores.length} จากทั้งหมด {scores.length} รายการ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-prompt">
              <thead className="bg-white/[0.04] border-b border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4 text-center">ลำดับ</th>
                  <th className="px-5 py-4">รหัสนักศึกษา</th>
                  <th className="px-5 py-4">ชื่อ - นามสกุล</th>
                  <th className="px-3 py-4 text-center">หน่วยที่ 1 (30)</th>
                  <th className="px-3 py-4 text-center">หน่วยที่ 2 (30)</th>
                  <th className="px-3 py-4 text-center">กลางภาค (20)</th>
                  <th className="px-3 py-4 text-center">ปลายภาค (20)</th>
                  <th className="px-4 py-4 text-center">รวม (100)</th>
                  <th className="px-4 py-4 text-center">เกรด ศธ.02</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredScores.map((s, idx) => {
                  const total = s.unit1 + s.unit2 + s.midterm + s.final;
                  const grade = calculateGrade(total);
                  const isHigh = Number(grade) >= 3.5;
                  const isGood = Number(grade) >= 2.0;

                  return (
                    <tr key={s.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-500 text-center">{idx + 1}</td>
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-cyan-400">{s.code}</td>
                      <td className="px-5 py-3.5 font-bold text-white">{s.name}</td>
                      <td className="px-3 py-3.5 text-center">
                        <input
                          type="number"
                          value={s.unit1}
                          onChange={(e) => handleScoreChange(s.id, "unit1", e.target.value)}
                          className="w-16 text-center py-1.5 px-2 rounded-xl glass-input font-mono font-bold text-xs text-white focus:ring-2 focus:ring-cyan-500/40"
                        />
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <input
                          type="number"
                          value={s.unit2}
                          onChange={(e) => handleScoreChange(s.id, "unit2", e.target.value)}
                          className="w-16 text-center py-1.5 px-2 rounded-xl glass-input font-mono font-bold text-xs text-white focus:ring-2 focus:ring-cyan-500/40"
                        />
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <input
                          type="number"
                          value={s.midterm}
                          onChange={(e) => handleScoreChange(s.id, "midterm", e.target.value)}
                          className="w-16 text-center py-1.5 px-2 rounded-xl glass-input font-mono font-bold text-xs text-white focus:ring-2 focus:ring-cyan-500/40"
                        />
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <input
                          type="number"
                          value={s.final}
                          onChange={(e) => handleScoreChange(s.id, "final", e.target.value)}
                          className="w-16 text-center py-1.5 px-2 rounded-xl glass-input font-mono font-bold text-xs text-white focus:ring-2 focus:ring-cyan-500/40"
                        />
                      </td>
                      <td className="px-4 py-3.5 text-center font-black text-white font-mono text-base">
                        {total}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`font-black font-mono text-xs px-3 py-1 rounded-xl border ${
                            isHigh
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/20"
                              : isGood
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-sm shadow-blue-500/20"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-sm shadow-rose-500/20"
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
    </AppShell>
  );
}
