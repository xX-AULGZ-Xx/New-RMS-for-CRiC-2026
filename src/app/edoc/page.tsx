"use client";

import { useState, useRef, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { signDocumentAction } from "@/lib/actions";
import {
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Lock,
  PenTool,
  QrCode,
  AlertCircle,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Eye,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  Printer
} from "lucide-react";

export default function EdocPage() {
  const [viewMode, setViewMode] = useState<"PAPER" | "TIMELINE">("PAPER");
  const [selectedDoc, setSelectedDoc] = useState<any>({
    id: "demo-doc-1",
    docNumber: "ศธ 0621/ว045",
    dept: "แผนกวิชาเทคโนโลยีสารสนเทศ",
    phone: "โทร. 053-711234 ต่อ 104",
    title: "ขออนุมัติจัดโครงการสัมมนาเชิงปฏิบัติการเทคโนโลยีปัญญาประดิษฐ์และคลาวด์คอมพิวติง ประจำปี 2569",
    priority: "URGENT",
    status: "ROUTING",
    creator: "อาจารย์สมชาย ปัญญาดี (ครูแผนก IT)",
    createdAt: "5 ตุลาคม 2569",
    abstractContent:
      "ด้วยแผนกวิชาเทคโนโลยีสารสนเทศ มีความประสงค์จะจัดโครงการสัมมนาเชิงปฏิบัติการให้แก่นักเรียนนักศึกษา ระดับ ปวช. และ ปวส. จำนวน 120 คน เพื่อเพิ่มพูนสมรรถนะวิชาชีพด้าน AI, Cloud Computing และความมั่นคงปลอดภัยไซเบอร์ โดยขออนุมัติงบประมาณหมวดพัฒนาผู้เรียน และขอใช้ห้องประชุมราชพฤกษ์ ระหว่างวันที่ 15-16 พฤศจิกายน 2569",
    routings: [
      {
        order: 1,
        title: "หัวหน้าแผนกวิชา IT",
        name: "นายประสิทธิ์ นวัตกรรม",
        status: "APPROVED",
        note: "เห็นควรอนุมัติ โครงการมีความสอดคล้องกับแผนพัฒนาสมรรถนะผู้เรียน",
        signedAt: "5 ต.ค. 2569 10:15 น.",
      },
      {
        order: 2,
        title: "รองผู้อำนวยการฝ่ายวิชาการ",
        name: "นายวิเชียร มุ่งมั่น",
        status: "APPROVED",
        note: "ตรวจสอบแล้วสอดคล้องกับหลักสูตรและงบประมาณประจำปี เห็นควรเสนอท่านผู้อำนวยการ",
        signedAt: "5 ต.ค. 2569 11:45 น.",
      },
      {
        order: 3,
        title: "ผู้อำนวยการวิทยาลัยอาชีวศึกษา",
        name: "ดร.สมเกียรติ ยิ่งเจริญ",
        status: "PENDING",
        note: null,
        signedAt: null,
      },
    ],
  });

  // Signature state
  const [pin, setPin] = useState("");
  const [actionNote, setActionNote] = useState("อนุมัติ ดำเนินการตามระเบียบ");
  const [inkColor, setInkColor] = useState("#1e40af");
  const [signerEmail, setSignerEmail] = useState("director@cric.ac.th");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Canvas drawing handlers
  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = inkColor;
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!pin) {
      setErrorMsg("กรุณาระบุรหัส PIN 6 หลัก");
      return;
    }

    setIsSubmitting(true);
    let signatureUrl = "";
    if (canvasRef.current && hasDrawn) {
      signatureUrl = canvasRef.current.toDataURL();
    } else {
      signatureUrl = "data:image/svg+xml;base64,sample_director_signature";
    }

    try {
      const res = await signDocumentAction({
        documentId: selectedDoc.id,
        signerEmail,
        pin,
        actionNote,
        signatureDataUrl: signatureUrl,
      });

      if (res.success) {
        setSignSuccess(true);
        setSelectedDoc((prev: any) => ({
          ...prev,
          status: "APPROVED",
          routings: prev.routings.map((r: any) =>
            r.order === 3
              ? {
                  ...r,
                  status: "APPROVED",
                  note: actionNote,
                  signedAt: "เมื่อสักครู่",
                }
              : r
          ),
        }));
      } else {
        setErrorMsg(res.error || "เกิดข้อผิดพลาดในการลงนาม");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6 pb-12 pt-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>งานสารบรรณ</span>
              <span>•</span>
              <span className="text-cyan-400">E-Document Reader</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              เกษียณหนังสือและลงนามดิจิทัล
            </h1>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setViewMode("PAPER")}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                  viewMode === "PAPER"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>มุมมองบันทึกข้อความ</span>
              </button>

              <button
                onClick={() => setViewMode("TIMELINE")}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                  viewMode === "TIMELINE"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>เส้นทางการเสนอ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {signSuccess && (
          <div className="glass-island border border-emerald-500/40 rounded-3xl p-5 flex items-center justify-between text-emerald-300 shadow-xl animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">เกษียณสั่งการและลงนามดิจิทัลเรียบร้อยแล้ว!</p>
                <p className="text-xs text-emerald-400">
                  ระบบได้ประทับตราเวลาดิจิทัล (SHA-256) และสร้าง QR Code ตรวจสอบความถูกต้องให้เอกสารเรียบร้อย
                </p>
              </div>
            </div>
            <button
              onClick={() => setSignSuccess(false)}
              className="text-xs font-bold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors"
            >
              รับทราบ
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Document View (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {viewMode === "PAPER" ? (
              /* Floating Paper Document (Crisp white sheet floating inside dark mode) */
              <div className="floating-paper p-8 sm:p-10 relative">
                {/* Stamp Seal if Approved */}
                {selectedDoc.status === "APPROVED" && (
                  <div className="absolute top-8 right-8 border-4 border-rose-600 text-rose-600 rounded-2xl px-5 py-2.5 font-black text-center transform rotate-6 opacity-90 shadow-lg pointer-events-none">
                    <p className="text-xl tracking-wider">อนุมัติแล้ว</p>
                    <p className="text-[10px] font-sans font-bold">วอช. เชียงราย (CRiC)</p>
                    <p className="text-[9px] font-mono">5 ต.ค. 2569 • E-Signed</p>
                  </div>
                )}

                {/* Header */}
                <div className="text-center pb-6 border-b border-slate-200">
                  <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-serif font-black text-xl mb-2">
                    ครุฑ
                  </div>
                  <h2 className="text-2xl font-black font-sarabun tracking-wide text-slate-900">
                    บันทึกข้อความ
                  </h2>
                </div>

                {/* Metadata Table */}
                <div className="mt-5 space-y-3 font-sarabun text-sm">
                  <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <div className="flex items-baseline space-x-2">
                      <strong className="text-slate-900">ส่วนราชการ:</strong>
                      <span className="text-slate-700">{selectedDoc.dept} {selectedDoc.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-baseline space-x-2">
                      <strong className="text-slate-900">ที่:</strong>
                      <span className="font-mono text-slate-700">{selectedDoc.docNumber}</span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <strong className="text-slate-900">วันที่:</strong>
                      <span className="text-slate-700">{selectedDoc.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-baseline space-x-2 pt-1 border-t border-slate-100">
                    <strong className="text-slate-900 flex-shrink-0">เรื่อง:</strong>
                    <span className="font-bold text-slate-900">{selectedDoc.title}</span>
                  </div>

                  <div className="flex items-baseline space-x-2">
                    <strong className="text-slate-900 flex-shrink-0">เรียน:</strong>
                    <span className="text-slate-700">ผู้อำนวยการวิทยาลัยอาชีวศึกษา</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="mt-6 pt-4 border-t border-slate-100 font-sarabun text-sm text-slate-800 leading-relaxed text-justify space-y-4">
                  <p className="indent-8">
                    {selectedDoc.abstractContent}
                  </p>
                  <p className="indent-8">
                    จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติโครงการดังกล่าว
                  </p>
                </div>

                {/* Submitter Signature box */}
                <div className="mt-8 text-right font-sarabun text-sm">
                  <div className="inline-block text-center space-y-1">
                    <p className="italic text-slate-500 font-serif">(ลงชื่อ) สมชาย ปัญญาดี</p>
                    <p className="font-semibold text-slate-900">(อาจารย์สมชาย ปัญญาดี)</p>
                    <p className="text-xs text-slate-500">ครูแผนกวิชาเทคโนโลยีสารสนเทศ</p>
                  </div>
                </div>

                {/* Endorsement Notes section */}
                <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-prompt">
                    คำสั่งการและข้อคิดเห็นการเกษียณหนังสือ
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedDoc.routings.map((r: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border text-xs ${
                          r.status === "APPROVED"
                            ? "bg-blue-50/70 border-blue-200 text-blue-950"
                            : "bg-slate-50 border-slate-200 text-slate-500"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span>{r.title}</span>
                          {r.status === "APPROVED" && (
                            <span className="text-[10px] text-emerald-600 font-mono">✓ ลงนามแล้ว</span>
                          )}
                        </div>
                        <p className="text-slate-700 font-sarabun mt-1">
                          {r.note || "— รอการพิจารณา —"}
                        </p>
                        {r.signedAt && (
                          <p className="text-[10px] text-slate-400 mt-2 font-mono">{r.signedAt}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Code Verification Footer */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    <span>ตรวจสอบเอกสารจริง: <strong className="font-mono text-slate-700">cric-doc-2569-demo-001</strong></span>
                  </div>
                  <span className="font-mono text-[10px]">RMS E-DOC 2026</span>
                </div>
              </div>
            ) : (
              /* Timeline View */
              <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
                <h3 className="font-bold text-white text-sm">ขั้นตอนการพิจารณาตามลำดับขั้น</h3>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                  {selectedDoc.routings.map((r: any, idx: number) => {
                    const isDone = r.status === "APPROVED";
                    return (
                      <div key={idx} className="relative space-y-1 text-xs">
                        <span
                          className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isDone ? "bg-emerald-500 text-white" : "bg-white/20 text-slate-300"
                          }`}
                        >
                          {r.order}
                        </span>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-white">{r.title} ({r.name})</p>
                          <span className={`text-[10px] font-bold ${isDone ? "text-emerald-400" : "text-amber-400"}`}>
                            {isDone ? "ลงนามเรียบร้อย" : "รอการลงนาม"}
                          </span>
                        </div>
                        {r.note && (
                          <div className="glass-card p-3 rounded-2xl border border-white/10 text-slate-200 font-sarabun mt-1">
                            {r.note}
                          </div>
                        )}
                        {r.signedAt && <p className="text-[10px] text-slate-400">{r.signedAt}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Endorsement & Signature Pad (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-7 space-y-5 shadow-2xl">
              <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-cyan-400 flex items-center justify-center">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm">เกษียณสั่งการ & ลงนาม</h3>
                  <p className="text-[11px] text-slate-400">สำหรับ ดร.สมเกียรติ ยิ่งเจริญ (ผอ.)</p>
                </div>
              </div>

              {selectedDoc.status === "APPROVED" ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-white text-base">เอกสารนี้ได้รับการอนุมัติสมบูรณ์แล้ว</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    ท่านผู้อำนวยการได้ลงลายมือชื่อดิจิทัลและประทับตรายางอิเล็กทรอนิกส์เรียบร้อย
                  </p>
                  <button
                    onClick={() => {
                      setSelectedDoc((prev: any) => ({
                        ...prev,
                        status: "ROUTING",
                        routings: prev.routings.map((r: any) =>
                          r.order === 3
                            ? { ...r, status: "PENDING", note: null, signedAt: null }
                            : r
                        ),
                      }));
                      setSignSuccess(false);
                      setPin("");
                    }}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400 hover:underline pt-3"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>รีเซ็ตเพื่อทดสอบลงนามใหม่</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSign} className="space-y-4">
                  {/* Preset Quick Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      ข้อคิดเห็น / คำสั่งการเกษียณหนังสือ
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {[
                        "อนุมัติ ดำเนินการตามระเบียบ",
                        "ทราบ / เห็นชอบตามเสนอ",
                        "อนุมัติในหลักการ",
                        "มอบฝ่ายวิชาการประสานงานต่อ",
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setActionNote(preset)}
                          className="px-2.5 py-1 text-[11px] rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors font-medium"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={3}
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      className="w-full text-xs p-3 rounded-2xl glass-input font-sarabun"
                      placeholder="พิมพ์ข้อคิดเห็นหรือคำสั่งการ..."
                    />
                  </div>

                  {/* Signature Canvas */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs font-bold text-slate-300">
                          วาดลายมือชื่อสด
                        </label>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => setInkColor("#1e40af")}
                            className={`w-3.5 h-3.5 rounded-full bg-blue-600 ring-1 ring-offset-1 ring-offset-slate-900 ${inkColor === "#1e40af" ? "ring-blue-400" : "ring-transparent"}`}
                            title="หมึกน้ำเงินราชการ"
                          />
                          <button
                            type="button"
                            onClick={() => setInkColor("#000000")}
                            className={`w-3.5 h-3.5 rounded-full bg-black ring-1 ring-offset-1 ring-offset-slate-900 ${inkColor === "#000000" ? "ring-white" : "ring-transparent"}`}
                            title="หมึกดำ"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-[11px] text-rose-400 hover:underline flex items-center space-x-1 font-semibold"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>ล้าง</span>
                      </button>
                    </div>

                    <div className="border border-white/20 rounded-2xl bg-white overflow-hidden relative shadow-inner">
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-28 touch-none cursor-crosshair bg-slate-50"
                      />
                      {!hasDrawn && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400 font-medium">
                          ✍️ วาดลายมือชื่อด้วย Apple Pencil / เมาส์ / นิ้วมือ
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 6-Digit PIN Verification */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      ยืนยันรหัส PIN 6 หลัก
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        maxLength={6}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="กรอก 123456"
                        className="w-full pl-9 pr-3 py-2.5 text-sm font-mono tracking-widest rounded-2xl glass-input"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      💡 PIN ทดสอบ: <strong className="font-mono text-cyan-300">123456</strong>
                    </p>
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/30 border border-white/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>กำลังประทับตราดิจิทัล...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>เกษียณสั่งการและลงนามดิจิทัล</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
