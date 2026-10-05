"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { createSarabanDocumentAction } from "@/lib/actions";
import PDFViewerModal, { PDFViewerDocProps } from "@/components/PDFViewerModal";
import {
  FileText,
  Plus,
  ArrowLeft,
  Paperclip,
  Upload,
  Check,
  Eye,
  Clock,
  UserCheck,
  SendHorizontal,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function EdocCreatePage() {
  const router = useRouter();

  const [newDocData, setNewDocData] = useState({
    category: "MEMO" as "INBOUND" | "OUTBOUND" | "MEMO" | "ORDER" | "CIRCULAR",
    docNumber: "วอช 046/2569",
    internalRef: "",
    originOrg: "แผนกวิชาเทคโนโลยีสารสนเทศ",
    receiverOrg: "ผู้อำนวยการวิทยาลัยอาชีวศึกษา CRiC",
    title: "",
    priority: "NORMAL" as "NORMAL" | "URGENT" | "VERY_URGENT" | "MOST_URGENT",
    routingMode: "APPROVAL_CHAIN" as "APPROVAL_CHAIN" | "CIRCULAR",
    abstractContent: "",
    hasAttachment: false,
    fileName: "",
    pdfBlobUrl: "",
  });

  const [fileSizeText, setFileSizeText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfViewerDoc, setPdfViewerDoc] = useState<PDFViewerDocProps | null>(null);

  const getNextNumber = (category: string) => {
    const randomCount = Math.floor(Math.random() * 40) + 480;
    const year = "2569";
    switch (category) {
      case "INBOUND":
        return `รับ 0${randomCount}/${year}`;
      case "OUTBOUND":
        return `ศธ 0621/0${randomCount - 320}`;
      case "ORDER":
        return `คำสั่งที่ ${randomCount - 350}/${year}`;
      case "CIRCULAR":
        return `ว 0${randomCount - 400}/${year}`;
      case "MEMO":
      default:
        return `วอช 0${randomCount - 430}/${year}`;
    }
  };

  const handleCategoryChange = (cat: any) => {
    setNewDocData((prev) => ({
      ...prev,
      category: cat,
      docNumber: getNextNumber(cat),
    }));
  };

  const processFile = (file: File) => {
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileSizeText(`${sizeMb} MB`);

      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

      setNewDocData((prev) => ({
        ...prev,
        hasAttachment: true,
        fileName: file.name,
        pdfBlobUrl: url,
        title: prev.title.trim() === "" ? cleanTitle : prev.title,
      }));
    } else {
      alert("กรุณาเลือกไฟล์เอกสารนามสกุล .pdf เท่านั้น");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocData.title.trim()) {
      alert("กรุณาระบุชื่อเรื่องเอกสาร");
      return;
    }

    setIsSubmitting(true);

    const targetEmails =
      newDocData.routingMode === "APPROVAL_CHAIN"
        ? ["head.it@cric.ac.th", "deputy.academic@cric.ac.th", "director@cric.ac.th"]
        : [];

    const res = await createSarabanDocumentAction({
      category: newDocData.category,
      docNumber: newDocData.docNumber,
      title: newDocData.title,
      originOrg: newDocData.originOrg,
      receiverOrg: newDocData.receiverOrg,
      priority: newDocData.priority,
      abstractContent: newDocData.abstractContent || newDocData.title,
      routingMode: newDocData.routingMode,
      creatorEmail: "teacher.somchai@cric.ac.th",
      targetUserEmails: targetEmails,
    });

    setIsSubmitting(false);

    if (res.success) {
      alert("บันทึกเอกสารและส่งเข้าระบบสารบรรณเรียบร้อยแล้ว!");
      if (newDocData.category === "MEMO") {
        router.push("/edoc/review");
      } else if (newDocData.category === "INBOUND") {
        router.push("/edoc/inbound");
      } else if (newDocData.category === "OUTBOUND") {
        router.push("/edoc/outbound");
      } else {
        router.push("/edoc/orders");
      }
    } else {
      alert("เกิดข้อผิดพลาด: " + res.error);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold">
          <Link href="/edoc" className="hover:text-cyan-300 transition-colors flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>หมวดหมู่สารบรรณ</span>
          </Link>
          <span>/</span>
          <span className="text-cyan-400">สร้างเอกสาร & ออกเลขทะเบียนใหม่</span>
        </div>

        {/* Top Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>สร้างเอกสารราชการ & ออกเลขทะเบียนใหม่</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 font-mono font-medium">
              Hybrid Auto-Numbering
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            กรอกข้อมูลสารบรรณ ออกเลขทะเบียนอัตโนมัติ และอัปโหลดไฟล์ PDF ต้นฉบับจากคอมพิวเตอร์
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-island rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                เลือกประเภทเอกสารสารบรรณ
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "MEMO", label: "บันทึกข้อความภายใน" },
                  { id: "INBOUND", label: "รับหนังสือเข้าภายนอก" },
                  { id: "OUTBOUND", label: "ส่งออกภายนอก" },
                  { id: "ORDER", label: "คำสั่ง / ประกาศ" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategoryChange(c.id)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                      newDocData.category === c.id
                        ? "bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white shadow-md border-white/30"
                        : "glass-card border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-Number with Edit Option & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">เลขที่หนังสือ / เลขทะเบียน</label>
                  <button
                    type="button"
                    onClick={() =>
                      setNewDocData((prev) => ({
                        ...prev,
                        docNumber: getNextNumber(prev.category),
                      }))
                    }
                    className="text-[10px] text-cyan-400 font-bold hover:underline"
                  >
                    สุ่มรันเลขอัตโนมัติ
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newDocData.docNumber}
                  onChange={(e) => setNewDocData({ ...newDocData, docNumber: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ระดับความเร่งด่วน
                </label>
                <select
                  value={newDocData.priority}
                  onChange={(e) => setNewDocData({ ...newDocData, priority: e.target.value as any })}
                  className="w-full text-xs font-bold p-3 rounded-2xl glass-input text-white focus:outline-none"
                >
                  <option value="NORMAL" className="bg-[#111827]">ปกติ</option>
                  <option value="URGENT" className="bg-[#111827]">ด่วน</option>
                  <option value="VERY_URGENT" className="bg-[#111827]">ด่วนมาก</option>
                  <option value="MOST_URGENT" className="bg-[#111827]">ด่วนที่สุด</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ชื่อเรื่อง (สาระสำคัญ)
              </label>
              <input
                type="text"
                required
                placeholder="เช่น ขออนุมัติจัดโครงการพัฒนาสมรรถนะดิจิทัลครูและบุคลากร..."
                value={newDocData.title}
                onChange={(e) => setNewDocData({ ...newDocData, title: e.target.value })}
                className="w-full text-xs font-semibold p-3.5 rounded-2xl glass-input text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {/* Origin & Receiver */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">หน่วยงานเจ้าของเรื่อง / ต้นทาง</label>
                <input
                  type="text"
                  value={newDocData.originOrg}
                  onChange={(e) => setNewDocData({ ...newDocData, originOrg: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl glass-input text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">ส่งถึง / หน่วยงานปลายทาง</label>
                <input
                  type="text"
                  value={newDocData.receiverOrg}
                  onChange={(e) => setNewDocData({ ...newDocData, receiverOrg: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl glass-input text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Workflow Routing Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                รูปแบบกระบวนการส่งต่อ (Workflow Mode)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewDocData({ ...newDocData, routingMode: "APPROVAL_CHAIN" })}
                  className={`p-3.5 rounded-2xl text-xs font-bold border transition-all text-left ${
                    newDocData.routingMode === "APPROVAL_CHAIN"
                      ? "bg-blue-500/20 border-blue-400 text-white shadow-sm ring-1 ring-blue-400/30"
                      : "glass-card border-white/10 text-slate-400"
                  }`}
                >
                  <div className="flex items-center space-x-1.5 text-blue-300 mb-1">
                    <UserCheck className="w-4 h-4" />
                    <span>เสนอตามลำดับขั้น (Approval Chain)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal">
                    ครูผู้เสนอ &rarr; หัวหน้างาน &rarr; รอง ผอ. &rarr; ผู้อำนวยการ
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setNewDocData({ ...newDocData, routingMode: "CIRCULAR" })}
                  className={`p-3.5 rounded-2xl text-xs font-bold border transition-all text-left ${
                    newDocData.routingMode === "CIRCULAR"
                      ? "bg-emerald-500/20 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/30"
                      : "glass-card border-white/10 text-slate-400"
                  }`}
                >
                  <div className="flex items-center space-x-1.5 text-emerald-300 mb-1">
                    <SendHorizontal className="w-4 h-4" />
                    <span>หนังสือเวียนเพื่อทราบ/ถือปฏิบัติ (Circular Dispatch)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal">
                    กระจายแจ้งทุกแผนกวิชาเพื่อทราบโดยไม่ต้องลงนามเกษียณ
                  </p>
                </button>
              </div>
            </div>

            {/* Abstract Content */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ข้อความเนื้อหาในเอกสาร
              </label>
              <textarea
                rows={4}
                placeholder="ระบุเหตุผล ความจำเป็น รายละเอียดโครงการ และข้อเสนอแนะในการปฏิบัติราชการ..."
                value={newDocData.abstractContent}
                onChange={(e) => setNewDocData({ ...newDocData, abstractContent: e.target.value })}
                className="w-full text-xs p-3.5 rounded-2xl glass-input text-white focus:outline-none"
              />
            </div>

            {/* Drag & Drop PDF Upload Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>อัปโหลดไฟล์ PDF เอกสารต้นฉบับ / ไฟล์แนบ</span>
                </label>
                <span className="text-[10px] text-slate-400">รองรับ PDF สูงสุด 50 MB</span>
              </div>

              {!newDocData.pdfBlobUrl ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`relative p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                    isDragging
                      ? "border-cyan-400 bg-cyan-500/20 scale-[1.01]"
                      : "border-white/20 hover:border-cyan-400/50 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    onChange={handleFileUpload}
                  />
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-2.5 shadow-inner">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    ลากและวางไฟล์ PDF ที่นี่ หรือ <span className="text-cyan-400 underline">คลิกเพื่อเลือกไฟล์จากคอมพิวเตอร์</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    ระบบจะดึงชื่อเรื่องจากไฟล์อัตโนมัติ และแสดงตัวอย่างบน macOS PDF Viewer ได้ทันที
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl glass-card border border-cyan-400/30 bg-cyan-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center flex-shrink-0 font-bold">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[200px] sm:max-w-md">
                          {newDocData.fileName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {fileSizeText || "PDF พร้อมใช้งาน"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        พร้อมบันทึกและเปิดอ่านผ่าน macOS PDF Document Viewer
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setPdfViewerDoc({
                          id: "temp-preview",
                          category: newDocData.category,
                          docNumber: newDocData.docNumber,
                          dept: newDocData.originOrg,
                          originOrg: newDocData.originOrg,
                          receiverOrg: newDocData.receiverOrg,
                          title: newDocData.title || newDocData.fileName,
                          priority: newDocData.priority,
                          status: "DRAFT",
                          creator: "ผู้จัดทำเอกสาร",
                          createdAt: "วันนี้",
                          abstractContent: newDocData.abstractContent || "ไฟล์ PDF ที่เลือกจากคอมพิวเตอร์",
                          fileName: newDocData.fileName,
                          pdfBlobUrl: newDocData.pdfBlobUrl,
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>ดูตัวอย่าง PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNewDocData((prev) => ({
                          ...prev,
                          hasAttachment: false,
                          fileName: "",
                          pdfBlobUrl: "",
                        }));
                        setFileSizeText("");
                      }}
                      className="px-3 py-2 rounded-xl glass-card hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 text-slate-400 text-xs font-bold transition-all"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
              <Link
                href="/edoc"
                className="px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-slate-300 text-xs font-bold transition-all"
              >
                ยกเลิก
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>บันทึกและส่งเข้าระบบสารบรรณ</span>
              </button>
            </div>
          </form>
        </div>

        {/* Full PDF Viewer Modal */}
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
