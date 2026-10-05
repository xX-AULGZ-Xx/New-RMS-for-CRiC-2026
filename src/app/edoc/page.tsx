"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
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
  RotateCcw
} from "lucide-react";

export default function EdocPage() {
  const [selectedDoc, setSelectedDoc] = useState<any>({
    id: "demo-doc-1",
    docNumber: "ศธ 0621/ว045",
    title: "ขออนุมัติจัดโครงการสัมมนาเชิงปฏิบัติการเทคโนโลยีปัญญาประดิษฐ์และคลาวด์คอมพิวติง ประจำปี 2569",
    priority: "URGENT",
    status: "ROUTING",
    creator: "อาจารย์สมชาย ปัญญาดี (ครูแผนก IT)",
    createdAt: "5 ต.ค. 2569 09:30 น.",
    abstractContent:
      "เนื่องด้วยแผนกวิชาเทคโนโลยีสารสนเทศ มีความประสงค์จะจัดโครงการสัมมนาเชิงปฏิบัติการให้แก่นักเรียนนักศึกษา ระดับ ปวช. และ ปวส. จำนวน 120 คน เพื่อเพิ่มพูนสมรรถนะวิชาชีพด้าน AI, Cloud Computing และความมั่นคงปลอดภัยไซเบอร์ โดยขออนุมัติงบประมาณหมวดพัฒนาผู้เรียน และขอใช้ห้องประชุมราชพฤกษ์ ระหว่างวันที่ 15-16 พฤศจิกายน 2569",
    routings: [
      {
        order: 1,
        title: "หัวหน้าแผนกวิชา IT (นายประสิทธิ์ นวัตกรรม)",
        status: "APPROVED",
        note: "เห็นควรอนุมัติ โครงการมีความสอดคล้องกับแผนพัฒนาผู้เรียนและทักษะแห่งอนาคต",
        signedAt: "5 ต.ค. 2569 10:15 น.",
      },
      {
        order: 2,
        title: "รองผู้อำนวยการฝ่ายวิชาการ (นายวิเชียร มุ่งมั่น)",
        status: "APPROVED",
        note: "ตรวจสอบแล้วสอดคล้องกับหลักสูตรและงบประมาณประจำปี เห็นควรเสนอท่านผู้อำนวยการ",
        signedAt: "5 ต.ค. 2569 11:45 น.",
      },
      {
        order: 3,
        title: "ผู้อำนวยการวิทยาลัย (ดร.สมเกียรติ ยิ่งเจริญ)",
        status: "PENDING",
        note: null,
        signedAt: null,
      },
    ],
  });

  // Signature state
  const [pin, setPin] = useState("");
  const [actionNote, setActionNote] = useState("อนุมัติ ดำเนินการตามระเบียบ");
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
    ctx.strokeStyle = "#1e40af";
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase">
              <span>งานสารบรรณ</span>
              <span>•</span>
              <span className="text-blue-600">E-Document & Signature</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              ระบบสารบรรณและเกษียณหนังสืออิเล็กทรอนิกส์
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">สิทธิ์ปัจจุบัน:</span>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-100 text-blue-800">
              ผู้อำนวยการ (ดร.สมเกียรติ ยิ่งเจริญ)
            </span>
          </div>
        </div>

        {/* Success Banner */}
        {signSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-emerald-800 shadow-sm animate-fade-in">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">เกษียณสั่งการและลงลายมือชื่อดิจิทัลเรียบร้อยแล้ว!</p>
                <p className="text-xs text-emerald-600">
                  ระบบได้ประทับตราเวลา (Timestamp) และสร้าง QR Code ตรวจสอบความถูกต้องให้เอกสารเรียบร้อย
                </p>
              </div>
            </div>
            <button
              onClick={() => setSignSuccess(false)}
              className="text-xs font-bold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              รับทราบ
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Document Content View (Left 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Header info */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md">
                  {selectedDoc.docNumber}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    ด่วน
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      selectedDoc.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {selectedDoc.status === "APPROVED" ? "อนุมัติเรียบร้อย" : "รอการลงนาม"}
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mt-3 leading-snug">
                {selectedDoc.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>ผู้เสนอ: <strong className="text-slate-700">{selectedDoc.creator}</strong></span>
                <span>•</span>
                <span>วันที่เสนอ: {selectedDoc.createdAt}</span>
              </div>
            </div>

            {/* Document Body / Abstract preview */}
            <div className="p-6 flex-1 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  สาระสำคัญของบันทึกข้อความ (Abstract)
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-200/60">
                  {selectedDoc.abstractContent}
                </div>
              </div>

              {/* Routing History Log */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  ลำดับขั้นการเกษียณหนังสือ (Routing & Endorsement Log)
                </h4>
                <div className="space-y-3">
                  {selectedDoc.routings.map((r: any, idx: number) => {
                    const isDone = r.status === "APPROVED";
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isDone
                            ? "bg-emerald-50/50 border-emerald-200"
                            : "bg-slate-50 border-slate-200 opacity-90"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isDone
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-300 text-slate-700"
                              }`}
                            >
                              {r.order}
                            </span>
                            <span className="text-xs font-bold text-slate-800">{r.title}</span>
                          </div>

                          <span
                            className={`text-[11px] font-semibold ${
                              isDone ? "text-emerald-700" : "text-amber-600"
                            }`}
                          >
                            {isDone ? "ลงนามแล้ว" : "รอพิจารณา"}
                          </span>
                        </div>

                        {r.note && (
                          <div className="mt-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                            <span className="font-semibold text-slate-700">ข้อคิดเห็น:</span> {r.note}
                            {r.signedAt && (
                              <p className="text-[10px] text-slate-400 mt-1">เวลา: {r.signedAt}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* QR Code Verification badge */}
              <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-center space-x-3">
                <QrCode className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-blue-900">QR Code Verification Token</p>
                  <p className="text-blue-700 font-mono text-[11px]">cric-doc-2569-demo-001</p>
                  <p className="text-blue-600/80 text-[10px]">สแกนเพื่อตรวจสอบความสมบูรณ์และผู้ลงนามจริง</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action & Digital Signature Pad (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex items-center space-x-2">
                <PenTool className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">เกษียณสั่งการ & ลงนามดิจิทัล</h3>
              </div>

              {selectedDoc.status === "APPROVED" ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-900">เอกสารนี้ได้รับการอนุมัติเรียบร้อยแล้ว</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    ท่านผู้อำนวยการได้ลงนามและประทับตราเวลาลงสู่เอกสารสารบรรณเสร็จสมบูรณ์
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
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:underline pt-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>รีเซ็ตเพื่อทดสอบลงนามอีกครั้ง</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSign} className="space-y-4">
                  {/* Preset Quick Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      ข้อคิดเห็น / คำสั่งการเกษียณ
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
                          className="px-2 py-1 text-[11px] rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={3}
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="พิมพ์ข้อคิดเห็นหรือคำสั่งการ..."
                    />
                  </div>

                  {/* Signature Canvas */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                        <span>วาดลายมือชื่อ (Touch / Stylus / เมาส์)</span>
                      </label>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-[11px] text-rose-500 hover:underline flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>ล้างลายเซ็น</span>
                      </button>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 overflow-hidden relative">
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
                        className="w-full h-28 touch-none cursor-crosshair bg-white"
                      />
                      {!hasDrawn && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400">
                          ✍️ ลากเส้นวาดลายเซ็นที่นี่ (หรือใช้ลายเซ็นโปรไฟล์เดิม)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 6-Digit PIN Verification */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      รหัส PIN 6 หลักเพื่อยืนยันตัวตน
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        maxLength={6}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="กรอก 123456"
                        className="w-full pl-9 pr-3 py-2 text-sm font-mono tracking-widest rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      💡 ทดสอบด้วยรหัส PIN: <span className="font-mono font-bold text-slate-600">123456</span>
                    </p>
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>กำลังประทับตราและบันทึก...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>เกษียณสั่งการและลงนาม (1-Click Approve)</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
