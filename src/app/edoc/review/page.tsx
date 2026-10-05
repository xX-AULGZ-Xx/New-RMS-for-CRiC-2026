"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { signDocumentAction } from "@/lib/actions";
import PDFViewerModal, { PDFViewerDocProps } from "@/components/PDFViewerModal";
import {
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Lock,
  PenTool,
  QrCode,
  AlertCircle,
  ShieldCheck,
  Eye,
  RotateCcw,
  Paperclip,
  ArrowLeft,
  ChevronRight,
  UserCheck
} from "lucide-react";

export default function EdocReviewPage() {
  const [documents, setDocuments] = useState<any[]>([
    {
      id: "doc-memo-1",
      category: "MEMO",
      docNumber: "วอช 045/2569",
      dept: "แผนกวิชาเทคโนโลยีสารสนเทศ",
      phone: "โทร. 053-711234 ต่อ 104",
      title: "ขออนุมัติจัดโครงการสัมมนาเชิงปฏิบัติการเทคโนโลยีปัญญาประดิษฐ์และคลาวด์คอมพิวติง ประจำปี 2569",
      priority: "URGENT",
      status: "ROUTING",
      creator: "อาจารย์สมชาย ปัญญาดี (ครูแผนก IT)",
      createdAt: "5 ต.ค. 2569",
      hasAttachment: true,
      fileName: "โครงการ_สัมมนา_AI_Cloud_2569.pdf",
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
    },
    {
      id: "doc-memo-2",
      category: "MEMO",
      docNumber: "วอช 046/2569",
      dept: "แผนกวิชาการบัญชี",
      phone: "โทร. 053-711234 ต่อ 102",
      title: "ขออนุมัตินำนักศึกษาเข้าร่วมการแข่งขันทักษะวิชาชีพระดับภาคเหนือ ประจำปีการศึกษา 2569",
      priority: "NORMAL",
      status: "APPROVED",
      creator: "นางสาวมณีวรรณ เจริญสุข (ครูแผนกบัญชี)",
      createdAt: "4 ต.ค. 2569",
      hasAttachment: true,
      fileName: "รายชื่อผู้เข้าแข่งขัน_ทักษะวิชาชีพ.pdf",
      abstractContent:
        "เพื่อพัฒนาทักษะวิชาชีพและส่งเสริมความเป็นเลิศทางวิชาการ แผนกวิชาการบัญชีขออนุมัติส่งตัวแทนนักเรียนนักศึกษาจำนวน 6 คน และครูผู้ควบคุม 2 คน เข้าร่วมการแข่งขันทักษะการใช้โปรแกรมบัญชีสำเร็จรูป ณ วิทยาลัยอาชีวศึกษาเชียงใหม่ ระหว่างวันที่ 20-22 พฤศจิกายน 2569",
      routings: [
        {
          order: 1,
          title: "หัวหน้าแผนกวิชาการบัญชี",
          name: "นางเพ็ญศรี สุขเกษม",
          status: "APPROVED",
          note: "เห็นควรอนุมัติ",
          signedAt: "4 ต.ค. 2569 14:00 น.",
        },
        {
          order: 2,
          title: "รองผู้อำนวยการฝ่ายวิชาการ",
          name: "นายวิเชียร มุ่งมั่น",
          status: "APPROVED",
          note: "อนุมัติส่งแข่งขันตามระเบียบ",
          signedAt: "4 ต.ค. 2569 15:30 น.",
        },
        {
          order: 3,
          title: "ผู้อำนวยการวิทยาลัย",
          name: "ดร.สมเกียรติ ยิ่งเจริญ",
          status: "APPROVED",
          note: "อนุมัติ ขอให้ตั้งใจทำหน้าที่สร้างชื่อเสียงให้แก่วิทยาลัย",
          signedAt: "4 ต.ค. 2569 16:15 น.",
        },
      ],
    },
  ]);

  const [selectedDoc, setSelectedDoc] = useState<any>(documents[0]);
  const [pin, setPin] = useState("");
  const [actionNote, setActionNote] = useState("อนุมัติ ดำเนินการตามระเบียบ");
  const [inkColor, setInkColor] = useState("#38bdf8");
  const [signerEmail, setSignerEmail] = useState("director@cric.ac.th");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [pdfViewerDoc, setPdfViewerDoc] = useState<PDFViewerDocProps | null>(null);

  // Canvas Handlers
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

  const handleSignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!hasDrawn) {
      setErrorMsg("กรุณาลงลายมือชื่อบนกระดาน Apple Pencil");
      return;
    }
    if (!pin || pin.length !== 6) {
      setErrorMsg("กรุณาระบุรหัส PIN ปลอดภัย 6 หลัก (รหัสจำลอง: 123456)");
      return;
    }

    setIsSubmitting(true);
    const canvas = canvasRef.current;
    const sigData = canvas ? canvas.toDataURL("image/png") : "";

    const res = await signDocumentAction({
      documentId: selectedDoc.id,
      signerEmail,
      pin,
      actionNote,
      signatureDataUrl: sigData,
    });

    setIsSubmitting(false);

    if (res.success) {
      setSignSuccess(true);
      const updatedRoutings = (selectedDoc.routings || []).map((r: any) =>
        r.order === 3
          ? {
              ...r,
              status: "APPROVED",
              note: actionNote,
              signedAt: "เมื่อสักครู่ (5 ต.ค. 2569)",
            }
          : r
      );

      const updated = {
        ...selectedDoc,
        status: "APPROVED",
        routings: updatedRoutings,
      };

      setSelectedDoc(updated);
      setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } else {
      setErrorMsg(res.error || "ไม่สามารถลงนามได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold">
          <Link href="/edoc" className="hover:text-cyan-300 transition-colors flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>หมวดหมู่สารบรรณ</span>
          </Link>
          <span>/</span>
          <span className="text-cyan-400">แฟ้มเสนอเกษียณ & ลงนามดิจิทัล</span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
              <span>แฟ้มเสนอเกษียณ & ลงนามอิเล็กทรอนิกส์</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-mono font-medium">
                Pencil & PIN
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              ตรวจพิจารณาบันทึกข้อความ ลงลายมือชื่อดิจิทัล และยืนยันด้วยรหัสความปลอดภัย 6 หลัก
            </p>
          </div>

          <button
            onClick={() => setPdfViewerDoc(selectedDoc)}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 text-xs font-bold transition-all flex items-center space-x-2 shadow-sm self-start sm:self-auto"
          >
            <Eye className="w-4 h-4" />
            <span>เปิดอ่านไฟล์ PDF ต้นฉบับ (3 หน้า)</span>
          </button>
        </div>

        {/* Main Content: Floating Paper Reader + Endorsement Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Floating Paper Document */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Document Selection Strip */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {documents.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDoc(d);
                    setSignSuccess(false);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all text-left flex items-center space-x-2 border flex-shrink-0 ${
                    selectedDoc.id === d.id
                      ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-md"
                      : "glass-card border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">{d.docNumber}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      d.status === "APPROVED" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                    }`}
                  ></span>
                </button>
              ))}
            </div>

            {/* Floating Paper Preview */}
            <div className="floating-paper p-6 sm:p-10 rounded-3xl shadow-2xl relative">
              {/* Garuda Crest */}
              <div className="text-center mb-6 relative">
                <div className="w-16 h-16 mx-auto mb-2 text-slate-800 flex items-center justify-center font-bold text-2xl drop-shadow-sm select-none">
                  ครุฑ
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sarabun">
                  บันทึกข้อความ
                </h2>
              </div>

              {/* PDF Attachment Banner */}
              {selectedDoc.hasAttachment && (
                <div
                  onClick={() => setPdfViewerDoc(selectedDoc)}
                  className="mb-4 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-300 flex items-center justify-between text-xs cursor-pointer transition-colors shadow-xs"
                >
                  <div className="flex items-center space-x-2 text-slate-800">
                    <Paperclip className="w-4 h-4 text-cyan-700 flex-shrink-0" />
                    <span className="font-bold">{selectedDoc.fileName || "เอกสารแนบท้าย.pdf"}</span>
                    <span className="text-[10px] text-slate-500 hidden sm:inline">(คลิกเพื่อเปิดอ่านไฟล์ PDF)</span>
                  </div>
                  <span className="text-xs font-bold text-cyan-700 flex items-center space-x-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    <Eye className="w-3.5 h-3.5" />
                    <span>เปิดดู PDF</span>
                  </span>
                </div>
              )}

              {/* Header Meta */}
              <div className="border-b-2 border-slate-900 pb-4 mb-5 text-slate-900 text-xs sm:text-sm font-sarabun space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold">ส่วนราชการ: </span>
                    <span>{selectedDoc.dept} โทร. {selectedDoc.phone || "053-711234"}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold">ที่: </span>
                    <span className="font-mono">{selectedDoc.docNumber}</span>
                  </div>
                  <div>
                    <span className="font-bold">วันที่: </span>
                    <span>{selectedDoc.createdAt}</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold">เรื่อง: </span>
                  <span className="font-bold">{selectedDoc.title}</span>
                </div>
                <div>
                  <span className="font-bold">เรียน: </span>
                  <span>ผู้อำนวยการวิทยาลัยอาชีวศึกษา CRiC</span>
                </div>
              </div>

              {/* Content */}
              <div className="text-slate-800 text-xs sm:text-sm font-sarabun leading-relaxed text-justify indent-8 space-y-4">
                <p>{selectedDoc.abstractContent}</p>
                <p className="indent-8">
                  จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ และมอบหมายเจ้าหน้าที่ที่เกี่ยวข้องดำเนินการต่อไป
                </p>
              </div>

              {/* Creator Sign-off */}
              <div className="mt-8 text-right font-sarabun text-slate-900 text-xs sm:text-sm">
                <p>(ลงชื่อ)...................................................</p>
                <p className="font-bold mt-1">({selectedDoc.creator})</p>
                <p className="text-[11px] text-slate-600">ผู้ขออนุมัติโครงการ</p>
              </div>

              {/* Historical Endorsements */}
              <div className="mt-10 pt-6 border-t-2 border-dashed border-slate-300 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-prompt">
                  คำสั่งการและบันทึกเกษียณหนังสือ (Audit Trail)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedDoc.routings?.map((r: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-xs font-sarabun ${
                        r.status === "APPROVED"
                          ? "bg-blue-50/80 border-blue-200 text-slate-800 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-400 border-dashed"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                        <span className="text-blue-900">{r.title}</span>
                        {r.status === "APPROVED" ? (
                          <span className="text-emerald-600 flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>เกษียณแล้ว</span>
                          </span>
                        ) : (
                          <span className="text-amber-500 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>รอพิจารณา</span>
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-slate-900">{r.name}</p>
                      {r.note && <p className="italic text-slate-700 mt-1">"{r.note}"</p>}
                      {r.signedAt && (
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">{r.signedAt}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified QR Seal */}
              {selectedDoc.status === "APPROVED" && (
                <div className="mt-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-emerald-900">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-white p-1 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-10 h-10 text-emerald-700" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="font-black text-xs font-prompt uppercase">
                          Digital Signed & Verified Seal
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800 font-sarabun mt-0.5">
                        เอกสารฉบับนี้ได้รับการลงนามอิเล็กทรอนิกส์สมบูรณ์ตาม พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-600 text-white">
                    APPROVED
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Dark Frosted Glass Endorsement Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="glass-island p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <PenTool className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">แผงเกษียณหนังสือ (Approval Canvas)</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
                  Apple Pencil Mode
                </span>
              </div>

              {signSuccess && (
                <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  <span>ลงนามและเกษียณข้อความเรียบร้อยแล้ว! เอกสารเปลี่ยนสถานะเป็นอนุมัติ</span>
                </div>
              )}

              {errorMsg && (
                <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSignSubmit} className="mt-4 space-y-4">
                {/* Action Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ข้อความเกษียณสั่งการ
                  </label>
                  <textarea
                    rows={2}
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="ระบุข้อความสั่งการ เช่น อนุมัติ มอบงานพัสดุดำเนินการ..."
                    className="w-full text-xs p-3 rounded-2xl glass-input text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                {/* Canvas Signature Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      วาดลายมือชื่อดิจิทัล (Digital Signature)
                    </label>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>ล้างกระดาน</span>
                    </button>
                  </div>

                  <div className="relative rounded-2xl border border-white/20 bg-white/5 overflow-hidden shadow-inner">
                    <canvas
                      ref={canvasRef}
                      width={380}
                      height={130}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-32 cursor-crosshair touch-none"
                    />
                    {!hasDrawn && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-500 text-xs">
                        <PenTool className="w-5 h-5 mb-1 opacity-50" />
                        <span>เซ็นชื่อบนจอสัมผัส หรือลากเมาส์ที่นี่</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ink Color Picker */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">สีหมึกปากกา:</span>
                  <div className="flex items-center space-x-2">
                    {[
                      { color: "#38bdf8", name: "Cyan Blue" },
                      { color: "#3b82f6", name: "Royal Blue" },
                      { color: "#10b981", name: "Emerald" },
                      { color: "#f43f5e", name: "Rose Red" },
                    ].map((c) => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => setInkColor(c.color)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          inkColor === c.color ? "scale-110 border-white ring-2 ring-cyan-400" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c.color }}
                      />
                    ))}
                  </div>
                </div>

                {/* 6-Digit PIN Security */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>รหัส PIN ยืนยันตัวตน (6 หลัก)</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">ตัวอย่าง: 123456</span>
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full text-center tracking-widest font-mono text-base py-2.5 rounded-2xl glass-input text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 border border-white/20"
                >
                  {isSubmitting ? (
                    <Clock className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                  <span>ยืนยันการเกษียณและลงนามเอกสาร</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* PDF Document Viewer Modal */}
        {pdfViewerDoc && (
          <PDFViewerModal
            doc={pdfViewerDoc}
            onClose={() => setPdfViewerDoc(null)}
          />
        )}
      </div>
    </AppShell>
  );
}
