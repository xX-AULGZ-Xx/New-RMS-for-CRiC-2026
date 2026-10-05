"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  GraduationCap,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  Save,
  Search,
  BookOpen
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase">
              <span>ฝ่ายวิชาการและงานวัดผล</span>
              <span>•</span>
              <span className="text-indigo-600">สอศ. 2026</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              ระบบบันทึกคะแนนสมรรถนะรายวิชา & เชื่อมโยง ศธ.02 ออนไลน์
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportStd02}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>ส่งออกไฟล์มาตรฐาน ศธ.02 (สอศ.)</span>
            </button>
          </div>
        </div>

        {isExported && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-emerald-800 shadow-sm">
            <div className="flex items-center space-x-3 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">สร้างไฟล์ชีตมาตรฐาน ศธ.02 สำเร็จ!</p>
                <p className="text-emerald-700">
                  ไฟล์ <span className="font-mono font-bold">STD02_{courseCode}_CRiC_2569.csv</span> ดาวน์โหลดแล้ว พร้อมนำเข้าผ่านระบบ ศธ.02 ออนไลน์ได้ทันที
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExported(false)}
              className="text-xs font-bold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              ปิด
            </button>
          </div>
        )}

        {/* Course Info Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  {courseCode}
                </span>
                <span className="text-xs text-slate-400">ภาคเรียนที่ 1/2569</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">{courseName}</h3>
              <p className="text-xs text-slate-500">
                กลุ่มเรียน: ปวช. 1/1 แผนกวิชาเทคโนโลยีสารสนเทศ (อาจารย์สมชาย ปัญญาดี)
              </p>
            </div>
          </div>
        </div>

        {/* Grading Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
                <tr>
                  <th className="px-5 py-3.5">ลำดับ</th>
                  <th className="px-5 py-3.5">รหัสนักเรียน</th>
                  <th className="px-5 py-3.5">ชื่อ - สกุล</th>
                  <th className="px-3 py-3.5 text-center">หน่วยที่ 1 (30)</th>
                  <th className="px-3 py-3.5 text-center">หน่วยที่ 2 (30)</th>
                  <th className="px-3 py-3.5 text-center">กลางภาค (20)</th>
                  <th className="px-3 py-3.5 text-center">ปลายภาค (20)</th>
                  <th className="px-4 py-3.5 text-center">รวม (100)</th>
                  <th className="px-4 py-3.5 text-center">เกรด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scores.map((s, idx) => {
                  const total = s.unit1 + s.unit2 + s.midterm + s.final;
                  const grade = calculateGrade(total);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 text-xs font-bold text-slate-400">{idx + 1}</td>
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-700">{s.code}</td>
                      <td className="px-5 py-3 font-semibold text-slate-900">{s.name}</td>
                      <td className="px-3 py-3 text-center">
                        <input
                          type="number"
                          value={s.unit1}
                          onChange={(e) => handleScoreChange(s.id, "unit1", e.target.value)}
                          className="w-14 text-center p-1 rounded-lg border border-slate-200 font-semibold text-xs focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <input
                          type="number"
                          value={s.unit2}
                          onChange={(e) => handleScoreChange(s.id, "unit2", e.target.value)}
                          className="w-14 text-center p-1 rounded-lg border border-slate-200 font-semibold text-xs focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <input
                          type="number"
                          value={s.midterm}
                          onChange={(e) => handleScoreChange(s.id, "midterm", e.target.value)}
                          className="w-14 text-center p-1 rounded-lg border border-slate-200 font-semibold text-xs focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <input
                          type="number"
                          value={s.final}
                          onChange={(e) => handleScoreChange(s.id, "final", e.target.value)}
                          className="w-14 text-center p-1 rounded-lg border border-slate-200 font-semibold text-xs focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-900 font-mono text-sm">
                        {total}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-black font-mono text-xs px-2.5 py-1 rounded-md ${
                            Number(grade) >= 3.5
                              ? "bg-emerald-100 text-emerald-800"
                              : Number(grade) >= 2.0
                              ? "bg-blue-100 text-blue-800"
                              : "bg-rose-100 text-rose-800"
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
      </main>
    </div>
  );
}
