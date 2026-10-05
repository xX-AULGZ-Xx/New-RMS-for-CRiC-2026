"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import PDFViewerModal, { PDFViewerDocProps } from "@/components/PDFViewerModal";
import {
  Inbox,
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

export default function EdocInboundPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [stampPreviewDoc, setStampPreviewDoc] = useState<any | null>(null);
  const [pdfViewerDoc, setPdfViewerDoc] = useState<PDFViewerDocProps | null>(null);

  const [inboundDocs] = useState<any[]>([
    {
      id: "doc-inbound-1",
      category: "INBOUND",
      docNumber: "รับ 0482/2569",
      internalRef: "ศธ 0601/ว 1120",
      originOrg: "สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)",
      receiverOrg: "ผู้อำนวยการวิทยาลัยอาชีวศึกษา CRiC",
      dept: "งานสารบรรณกลาง",
      title: "แนวทางการประเมินผลการเรียนรู้มาตรฐานวิชาชีพอาชีวศึกษา ประจำภาคเรียนที่ 1/2569",
      priority: "VERY_URGENT",
      status: "APPROVED",
      creator: "นางสาวศิริพร บุญช่วย (เจ้าหน้าที่สารบรรณ)",
      createdAt: "5 ต.ค. 2569 09:30 น.",
      hasAttachment: true,
      fileName: "สอศ_แนวทางการประเมินผล_1_2569.pdf",
      abstractContent:
        "แจ้งแนวปฏิบัติการวัดและประเมินผลตามมาตรฐานคุณวุฒิอาชีวศึกษาแห่งชาติ พ.ศ. 2569 ให้สถานศึกษาในสังกัดดำเนินการจัดส่งผลการเรียนผ่านระบบ ศธ.02 คลาวด์ ภายในกำหนดเวลา",
    },
    {
      id: "doc-inbound-2",
      category: "INBOUND",
      docNumber: "รับ 0483/2569",
      internalRef: "ชร 0017/2391",
      originOrg: "ศาลากลางจังหวัดเชียงราย",
      receiverOrg: "วิทยาลัยอาชีวศึกษา CRiC",
      dept: "งานสารบรรณกลาง",
      title: "ขอเชิญร่วมกิจกรรมจิตอาสาพัฒนาสิ่งแวดล้อมเฉลิมพระเกียรติ ณ สวนสาธารณะหาดเชียงราย",
      priority: "NORMAL",
      status: "APPROVED",
      creator: "นางสาวศิริพร บุญช่วย (เจ้าหน้าที่สารบรรณ)",
      createdAt: "4 ต.ค. 2569 14:20 น.",
      hasAttachment: true,
      fileName: "กำหนดการ_จิตอาสาเชียงราย_2569.pdf",
      abstractContent:
        "ขอความอนุเคราะห์นำคณะครู บุคลากร และนักเรียนนักศึกษา เข้าร่วมกิจกรรมจิตอาสาในวันศุกร์ที่ 10 ตุลาคม 2569 เวลา 08.30 - 12.00 น.",
    },
    {
      id: "doc-inbound-3",
      category: "INBOUND",
      docNumber: "รับ 0484/2569",
      internalRef: "อว 0612/5812",
      originOrg: "กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม (อว.)",
      receiverOrg: "วิทยาลัยอาชีวศึกษา CRiC",
      dept: "งานวิจัยและพัฒนานวัตกรรม",
      title: "ประกาศรับสมัครข้อเสนอโครงการวิจัยนวัตกรรมสิ่งประดิษฐ์คนรุ่นใหม่ ประจำปีงบประมาณ 2570",
      priority: "URGENT",
      status: "APPROVED",
      creator: "นางสาวศิริพร บุญช่วย (เจ้าหน้าที่สารบรรณ)",
      createdAt: "3 ต.ค. 2569 10:15 น.",
      hasAttachment: true,
      fileName: "แบบฟอร์มข้อเสนอโครงการวิจัย_อว.pdf",
      abstractContent:
        "เชิญชวนครูและนักศึกษาสายอาชีวศึกษาส่งผลงานนวัตกรรมสิ่งประดิษฐ์เพื่อขอรับทุนสนับสนุนสูงสุด 100,000 บาทต่อโครงการ",
    },
  ]);

  const filteredDocs = inboundDocs.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.originOrg.toLowerCase().includes(searchQuery.toLowerCase());
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
          <span className="text-cyan-400">ทะเบียนรับหนังสือเข้า</span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
              <span>ทะเบียนรับหนังสือเข้า (Inbound Registry)</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 font-mono font-medium">
                ภายนอกสู่สถานศึกษา
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              บัญชีคุมหนังสือรับเข้าจาก สอศ., กระทรวงศึกษาธิการ และหน่วยงานภายนอก พร้อมตราประทับรับสารบรรณดิจิทัล
            </p>
          </div>

          <Link
            href="/edoc/create"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 border border-white/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>ลงทะเบียนรับหนังสือใหม่</span>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-island p-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาเลขทะเบียนรับ, เลขที่เดิม, ชื่อเรื่อง, ต้นทาง..."
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

        {/* Inbound Registry Table */}
        <div className="glass-island rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Inbox className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">รายการทะเบียนรับหนังสือเข้า ปี 2569</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              รวม {filteredDocs.length} รายการ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-prompt">
              <thead className="bg-white/[0.04] border-b border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">เลขทะเบียนรับ</th>
                  <th className="px-5 py-4">เลขที่หนังสือเดิม</th>
                  <th className="px-5 py-4">วันที่รับ</th>
                  <th className="px-5 py-4">จาก (ต้นทาง)</th>
                  <th className="px-5 py-4">เรื่อง</th>
                  <th className="px-3 py-4 text-center">ความเร่งด่วน</th>
                  <th className="px-4 py-4 text-center">ไฟล์ PDF & ตราประทับ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-cyan-300 whitespace-nowrap">
                      {doc.docNumber}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {doc.internalRef || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-300 whitespace-nowrap">
                      {doc.createdAt}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-white whitespace-nowrap">
                      {doc.originOrg || doc.dept}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-medium text-slate-200 min-w-[220px]">
                      <p className="line-clamp-1">{doc.title}</p>
                      {doc.hasAttachment && (
                        <button
                          onClick={() => setPdfViewerDoc(doc)}
                          className="inline-flex items-center space-x-1 text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline mt-0.5"
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>{doc.fileName || "ไฟล์แนบ.pdf"}</span>
                        </button>
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${
                          doc.priority === "MOST_URGENT" || doc.priority === "VERY_URGENT"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : doc.priority === "URGENT"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }`}
                      >
                        {doc.priority === "MOST_URGENT"
                          ? "ด่วนที่สุด"
                          : doc.priority === "VERY_URGENT"
                          ? "ด่วนมาก"
                          : doc.priority === "URGENT"
                          ? "ด่วน"
                          : "ปกติ"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setPdfViewerDoc(doc)}
                          className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition-all flex items-center space-x-1"
                          title="เปิดอ่านไฟล์ PDF ต้นฉบับ"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>ดู PDF</span>
                        </button>
                        <button
                          onClick={() => setStampPreviewDoc(doc)}
                          className="px-2.5 py-1.5 rounded-xl glass-card hover:bg-white/10 border border-white/15 text-slate-300 text-xs font-bold transition-all flex items-center space-x-1"
                          title="ดูตราประทับรับสารบรรณ"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
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
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">ตราประทับรับสารบรรณดิจิทัล</h3>
                </div>
                <button
                  onClick={() => setStampPreviewDoc(null)}
                  className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Graphic Official Seal Box */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-cyan-400/60 bg-cyan-950/20 text-center space-y-3 font-sarabun shadow-inner">
                <div className="font-bold text-sm text-cyan-200">
                  วิทยาลัยอาชีวศึกษา CRiC
                </div>
                <div className="py-1 px-3 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-base border border-cyan-400/30 inline-block">
                  เลขรับ: {stampPreviewDoc.docNumber}
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p>
                    <span className="font-bold">วันที่บันทึก: </span>
                    <span>{stampPreviewDoc.createdAt}</span>
                  </p>
                  <p>
                    <span className="font-bold">ผู้ลงรับ: </span>
                    <span>{stampPreviewDoc.creator}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-cyan-500/30 flex items-center justify-center space-x-2 text-[10px] text-cyan-400 font-mono">
                  <QrCode className="w-4 h-4" />
                  <span>SHA256-{stampPreviewDoc.id.slice(0, 10).toUpperCase()} • VERIFIED</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 text-center">
                <p className="font-semibold text-slate-200">{stampPreviewDoc.title}</p>
                <p className="mt-1">ต้นทาง: {stampPreviewDoc.originOrg || stampPreviewDoc.dept}</p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const doc = stampPreviewDoc;
                    setStampPreviewDoc(null);
                    setPdfViewerDoc(doc);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
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
