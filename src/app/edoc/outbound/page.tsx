"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import PDFViewerModal, { PDFViewerDocProps } from "@/components/PDFViewerModal";
import {
  SendHorizontal,
  Search,
  Filter,
  Paperclip,
  FileText,
  ShieldCheck,
  QrCode,
  ArrowLeft,
  ChevronRight,
  Plus,
  Eye
} from "lucide-react";

export default function EdocOutboundPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [stampPreviewDoc, setStampPreviewDoc] = useState<any | null>(null);
  const [pdfViewerDoc, setPdfViewerDoc] = useState<PDFViewerDocProps | null>(null);

  const [outboundDocs] = useState<any[]>([
    {
      id: "doc-outbound-1",
      category: "OUTBOUND",
      docNumber: "ศธ 0621/0145",
      originOrg: "วิทยาลัยอาชีวศึกษา CRiC",
      receiverOrg: "มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา",
      dept: "ฝ่ายวิชาการ",
      title: "ขอความอนุเคราะห์วิทยากรผู้เชี่ยวชาญการเขียนโค้ดและสถาปัตยกรรม Microservices",
      priority: "NORMAL",
      status: "APPROVED",
      creator: "นายวิเชียร มุ่งมั่น (รอง ผอ.วิชาการ)",
      createdAt: "3 ต.ค. 2569 11:00 น.",
      hasAttachment: true,
      fileName: "หนังสือขอความอนุเคราะห์วิทยากร_มทร.pdf",
      abstractContent:
        "วิทยาลัยฯ ขอความอนุเคราะห์ให้อาจารย์ผู้เชี่ยวชาญร่วมเป็นวิทยากรบรรยายโครงการพัฒนาศักยภาพผู้เรียนระดับ ปวส.",
    },
    {
      id: "doc-outbound-2",
      category: "OUTBOUND",
      docNumber: "ศธ 0621/0146",
      originOrg: "วิทยาลัยอาชีวศึกษา CRiC",
      receiverOrg: "สำนักงานพัฒนาฝีมือแรงงานเชียงราย",
      dept: "งานทวิภาคีและความร่วมมือ",
      title: "การจัดส่งบัญชีรายชื่อนักศึกษาฝึกงานและเข้ารับการทดสอบมาตรฐานฝีมือแรงงานแห่งชาติ",
      priority: "URGENT",
      status: "APPROVED",
      creator: "นายประสิทธิ์ นวัตกรรม (หัวหน้าแผนก IT)",
      createdAt: "2 ต.ค. 2569 15:30 น.",
      hasAttachment: true,
      fileName: "บัญชีรายชื่อนักศึกษา_ทดสอบมาตรฐาน.pdf",
      abstractContent:
        "จัดส่งรายชื่อนักศึกษา ปวช. 3 แผนกวิชาเทคโนโลยีสารสนเทศ จำนวน 45 คน เข้ารับการทดสอบมาตรฐานฝีมือแรงงาน สาขาช่างซ่อมไมโครคอมพิวเตอร์",
    },
  ]);

  const filteredDocs = outboundDocs.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.receiverOrg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority = filterPriority === "ALL" || d.priority === filterPriority;
    return matchSearch && matchPriority;
  });

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold">
          <Link href="/edoc" className="hover:text-cyan-300 transition-colors flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>หมวดหมู่สารบรรณ</span>
          </Link>
          <span>/</span>
          <span className="text-cyan-400">ทะเบียนส่งออกภายนอก</span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
              <span>ทะเบียนส่งออกภายนอก (Outbound Registry)</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 font-mono font-medium">
                สถานศึกษาสู่ภายนอก
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              บัญชีคุมหนังสือราชการส่งออกไปยังหน่วยงานภายนอก มหาวิทยาลัย สถานประกอบการ และส่วนราชการอื่น
            </p>
          </div>

          <Link
            href="/edoc/create"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 border border-white/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>ร่างหนังสือส่งออกใหม่</span>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-island p-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาเลขที่ส่ง, ชื่อเรื่อง, ปลายทาง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-2xl glass-input w-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-bold">ความเร่งด่วน:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs font-bold text-white focus:outline-none"
            >
              <option value="ALL" className="bg-[#111827]">ทั้งหมด</option>
              <option value="NORMAL" className="bg-[#111827]">ปกติ</option>
              <option value="URGENT" className="bg-[#111827]">ด่วน</option>
              <option value="VERY_URGENT" className="bg-[#111827]">ด่วนมาก</option>
              <option value="MOST_URGENT" className="bg-[#111827]">ด่วนที่สุด</option>
            </select>
          </div>
        </div>

        {/* Outbound Registry Table */}
        <div className="glass-island rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SendHorizontal className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">รายการทะเบียนหนังสือส่งออกภายนอก ปี 2569</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              รวม {filteredDocs.length} รายการ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-prompt">
              <thead className="bg-white/[0.04] border-b border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">เลขทะเบียนส่ง</th>
                  <th className="px-5 py-4">วันที่ส่ง</th>
                  <th className="px-5 py-4">ถึง (หน่วยงานปลายทาง)</th>
                  <th className="px-5 py-4">เรื่อง</th>
                  <th className="px-5 py-4">เจ้าของเรื่อง</th>
                  <th className="px-4 py-4 text-center">ไฟล์ PDF & ตราประทับ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-indigo-300 whitespace-nowrap">
                      {doc.docNumber}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-300 whitespace-nowrap">
                      {doc.createdAt}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-white whitespace-nowrap">
                      {doc.receiverOrg || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-medium text-slate-200 min-w-[220px]">
                      <p className="line-clamp-1">{doc.title}</p>
                      {doc.hasAttachment && (
                        <button
                          onClick={() => setPdfViewerDoc(doc)}
                          className="inline-flex items-center space-x-1 text-[10px] text-indigo-300 hover:text-indigo-200 hover:underline mt-0.5"
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>{doc.fileName || "ไฟล์แนบ.pdf"}</span>
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {doc.creator}
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setPdfViewerDoc(doc)}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 text-xs font-bold transition-all flex items-center space-x-1"
                          title="เปิดอ่านไฟล์ PDF ต้นฉบับ"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>ดู PDF</span>
                        </button>
                        <button
                          onClick={() => setStampPreviewDoc(doc)}
                          className="px-2.5 py-1.5 rounded-xl glass-card hover:bg-white/10 border border-white/15 text-slate-300 text-xs font-bold transition-all flex items-center space-x-1"
                          title="ดูตราประทับส่งสารบรรณ"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                          <span>ตราประทับ</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: DIGITAL STAMP SEAL PREVIEW */}
        {stampPreviewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
            <div className="glass-island w-full max-w-md rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl relative space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-sm">ตราประทับส่งสารบรรณดิจิทัล</h3>
                </div>
                <button
                  onClick={() => setStampPreviewDoc(null)}
                  className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Graphic Official Seal Box */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-indigo-400/60 bg-indigo-950/20 text-center space-y-3 font-sarabun shadow-inner">
                <div className="font-bold text-sm text-indigo-200">
                  วิทยาลัยอาชีวศึกษา CRiC
                </div>
                <div className="py-1 px-3 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-base border border-indigo-400/30 inline-block">
                  เลขส่ง: {stampPreviewDoc.docNumber}
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p>
                    <span className="font-bold">วันที่ส่ง: </span>
                    <span>{stampPreviewDoc.createdAt}</span>
                  </p>
                  <p>
                    <span className="font-bold">ผู้ส่งเรื่อง: </span>
                    <span>{stampPreviewDoc.creator}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-indigo-500/30 flex items-center justify-center space-x-2 text-[10px] text-indigo-400 font-mono">
                  <QrCode className="w-4 h-4" />
                  <span>SHA256-{stampPreviewDoc.id.slice(0, 10).toUpperCase()} • VERIFIED</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 text-center">
                <p className="font-semibold text-slate-200">{stampPreviewDoc.title}</p>
                <p className="mt-1">ถึง: {stampPreviewDoc.receiverOrg || "-"}</p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const doc = stampPreviewDoc;
                    setStampPreviewDoc(null);
                    setPdfViewerDoc(doc);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>เปิดอ่าน PDF เต็มหน้า</span>
                </button>
                <button
                  onClick={() => setStampPreviewDoc(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        )}

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
