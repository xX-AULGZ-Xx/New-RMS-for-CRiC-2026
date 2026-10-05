"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import PDFViewerModal, { PDFViewerDocProps } from "@/components/PDFViewerModal";
import {
  ScrollText,
  Search,
  FileText,
  Download,
  ArrowLeft,
  ChevronRight,
  Plus
} from "lucide-react";

export default function EdocOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pdfViewerDoc, setPdfViewerDoc] = useState<PDFViewerDocProps | null>(null);

  const [orderDocs] = useState<any[]>([
    {
      id: "doc-order-1",
      category: "ORDER",
      docNumber: "คำสั่งที่ 124/2569",
      dept: "งานบุคคลและนิติการ",
      originOrg: "วิทยาลัยอาชีวศึกษา CRiC",
      title: "แต่งตั้งคณะกรรมการดำเนินงานจัดกิจกรรมวันไหว้ครูและพิธีมอบทุนการศึกษา ประจำปีการศึกษา 2569",
      priority: "NORMAL",
      status: "APPROVED",
      creator: "ดร.สมเกียรติ ยิ่งเจริญ (ผู้อำนวยการ)",
      createdAt: "1 ต.ค. 2569 09:00 น.",
      hasAttachment: true,
      fileName: "คำสั่งแต่งตั้ง_ไหว้ครู2569.pdf",
      abstractContent:
        "เพื่อมอบหมายภาระหน้าที่ให้คณะครูและบุคลากรทางการศึกษาปฏิบัติหน้าที่กำกับดูแลการจัดพิธีให้เป็นไปด้วยความเรียบร้อยและสมเกียรติ",
    },
    {
      id: "doc-order-2",
      category: "ORDER",
      docNumber: "คำสั่งที่ 125/2569",
      dept: "ฝ่ายพัฒนากิจการนักเรียนนักศึกษา",
      originOrg: "วิทยาลัยอาชีวศึกษา CRiC",
      title: "แต่งตั้งคณะทำงานกำกับดูแลระเบียบวินัยและความปลอดภัยกิจกรรมหน้าเสาธงและรอบรั้ววิทยาลัย",
      priority: "NORMAL",
      status: "APPROVED",
      creator: "ดร.สมเกียรติ ยิ่งเจริญ (ผู้อำนวยการ)",
      createdAt: "28 ก.ย. 2569 11:30 น.",
      hasAttachment: true,
      fileName: "คำสั่งแต่งตั้ง_ครูเวร2569.pdf",
      abstractContent:
        "มอบหมายหน้าที่ครูเวรประจำวัน ปฏิบัติหน้าที่ตรวจคัดกรอง เช็คชื่อเข้าแถวหน้าเสาธง และดูแลความปลอดภัยของนักเรียนนักศึกษา",
    },
    {
      id: "doc-order-3",
      category: "CIRCULAR",
      docNumber: "ว 018/2569",
      dept: "ฝ่ายบริหารทรัพยากร",
      originOrg: "วิทยาลัยอาชีวศึกษา CRiC",
      title: "ประกาศแนวปฏิบัติการประหยัดพลังงานและการใช้ห้องปฏิบัติการคอมพิวเตอร์นอกเวลาราชการ",
      priority: "NORMAL",
      status: "APPROVED",
      creator: "นายประสิทธิ์ นวัตกรรม (หัวหน้าแผนก IT)",
      createdAt: "25 ก.ย. 2569 14:00 น.",
      hasAttachment: true,
      fileName: "ประกาศแนวปฏิบัติ_ประหยัดพลังงาน.pdf",
      abstractContent:
        "แจ้งทุกแผนกวิชาและงาน กำหนดเวลาปิด-เปิดเครื่องปรับอากาศและระบบไฟฟ้าในอาคารเรียนเพื่อสนับสนุนนโยบาย Green College",
    },
  ]);

  const filteredDocs = orderDocs.filter((d) => {
    return (
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.dept.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
          <span className="text-cyan-400">ทะเบียนคำสั่ง & ประกาศวิทยาลัย</span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
              <span>ทะเบียนคำสั่งและประกาศวิทยาลัย (Orders & Circulars)</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-400/25 text-purple-300 font-mono font-medium">
                ปีการศึกษา 2569
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              คลังสืบค้นคำสั่งแต่งตั้ง คณะกรรมการดำเนินงาน และหนังสือเวียนประกาศภายในสถานศึกษา
            </p>
          </div>

          <Link
            href="/edoc/create"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 border border-white/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>ออกคำสั่ง / ประกาศใหม่</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="glass-island p-4 rounded-3xl border border-white/10 flex items-center justify-between shadow-xl">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาเลขที่คำสั่ง, เรื่อง, ฝ่ายที่รับผิดชอบ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-2xl glass-input w-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            แสดง {filteredDocs.length} รายการ
          </span>
        </div>

        {/* Orders Table */}
        <div className="glass-island rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-prompt">
              <thead className="bg-white/[0.04] border-b border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">เลขที่คำสั่ง/ประกาศ</th>
                  <th className="px-5 py-4">วันที่ออกคำสั่ง</th>
                  <th className="px-5 py-4">เรื่อง</th>
                  <th className="px-5 py-4">ฝ่าย/งานที่รับผิดชอบ</th>
                  <th className="px-4 py-4 text-center">ดูไฟล์ PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-purple-300 whitespace-nowrap">
                      {doc.docNumber}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-300 whitespace-nowrap">
                      {doc.createdAt}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-medium text-white min-w-[240px]">
                      <p className="line-clamp-1">{doc.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{doc.abstractContent}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-300 whitespace-nowrap">
                      {doc.dept}
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => setPdfViewerDoc(doc)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs font-bold transition-all flex items-center space-x-1.5 mx-auto"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>เปิดอ่าน PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
