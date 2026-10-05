"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import PDFViewerModal, { PDFViewerDocProps } from "@/components/PDFViewerModal";
import {
  FileText,
  PenTool,
  Inbox,
  SendHorizontal,
  ScrollText,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Paperclip,
  Eye,
  Search,
  Sparkles,
  Layers,
  Calendar,
  Building,
  TrendingUp,
  FileCheck2,
  Lock
} from "lucide-react";

export default function EdocHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pdfViewerDoc, setPdfViewerDoc] = useState<PDFViewerDocProps | null>(null);

  // Categories list
  const categories = [
    {
      id: "review",
      title: "แฟ้มเสนอเกษียณ & ลงนาม",
      subtitle: "Review & Endorse",
      description: "ตรวจพิจารณาบันทึกข้อความ ลงลายมือชื่อดิจิทัล Apple Pencil คู่รหัส PIN 6 หลัก และออก QR Code Seal",
      href: "/edoc/review",
      badge: "ด่วน 1 รายการ",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      icon: PenTool,
      iconBg: "bg-cyan-500/20 text-cyan-400 border-cyan-400/30",
      glowColor: "from-cyan-500/10 to-blue-500/10",
      stats: "1 รอลงนาม • 2 เกษียณแล้ว",
      actionText: "เปิดแฟ้มเสนอเกษียณ",
    },
    {
      id: "inbound",
      title: "ทะเบียนรับหนังสือเข้า",
      subtitle: "Inbound Registry",
      description: "บัญชีคุมรับหนังสือเข้าจาก สอศ., กระทรวงศึกษาธิการ, ศาลากลาง พร้อมตราประทับรับสารบรรณดิจิทัล",
      href: "/edoc/inbound",
      badge: "ภายนอกเข้า",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      icon: Inbox,
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-400/30",
      glowColor: "from-emerald-500/10 to-teal-500/10",
      stats: "3 รายการ • ล่าสุด: รับ 0484/2569",
      actionText: "เปิดทะเบียนรับหนังสือเข้า",
    },
    {
      id: "outbound",
      title: "ทะเบียนส่งออกภายนอก",
      subtitle: "Outbound Registry",
      description: "บัญชีคุมหนังสือราชการส่งออกสู่มหาวิทยาลัย สถานประกอบการ และหน่วยงานภายนอก พร้อมตราประทับส่ง",
      href: "/edoc/outbound",
      badge: "ส่งภายนอก",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      icon: SendHorizontal,
      iconBg: "bg-indigo-500/20 text-indigo-400 border-indigo-400/30",
      glowColor: "from-indigo-500/10 to-purple-500/10",
      stats: "2 ส่งออกแล้ว • ล่าสุด: ศธ 0621/0146",
      actionText: "เปิดทะเบียนส่งออก",
    },
    {
      id: "orders",
      title: "ทะเบียนคำสั่ง & ประกาศวิทยาลัย",
      subtitle: "Orders & Circulars",
      description: "คลังสืบค้นคำสั่งแต่งตั้ง คณะกรรมการดำเนินงาน และหนังสือเวียนประกาศภายในสถานศึกษาประจำปี 2569",
      href: "/edoc/orders",
      badge: "ปี 2569",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      icon: ScrollText,
      iconBg: "bg-purple-500/20 text-purple-400 border-purple-400/30",
      glowColor: "from-purple-500/10 to-pink-500/10",
      stats: "3 คำสั่ง • ล่าสุด: คำสั่งที่ 125/2569",
      actionText: "เปิดทะเบียนคำสั่ง & ประกาศ",
    },
    {
      id: "create",
      title: "สร้างเอกสาร & ออกเลขทะเบียนใหม่",
      subtitle: "New Document Composer",
      description: "ร่างบันทึกข้อความ ออกเลขที่หนังสืออัตโนมัติ (Hybrid Auto-Numbering) และอัปโหลดไฟล์ PDF ต้นฉบับจากคอมพิวเตอร์",
      href: "/edoc/create",
      badge: "Upload PDF",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
      icon: Plus,
      iconBg: "bg-blue-600 text-white border-blue-400/30",
      glowColor: "from-blue-600/20 to-indigo-600/20",
      stats: "รองรับ Drag & Drop PDF",
      actionText: "สร้างเอกสารใหม่ทันที",
    },
  ];

  // Recent Documents Stream
  const recentDocs = [
    {
      id: "doc-memo-1",
      category: "MEMO" as const,
      categoryLabel: "บันทึกข้อความ",
      docNumber: "วอช 045/2569",
      dept: "แผนกวิชาเทคโนโลยีสารสนเทศ",
      title: "ขออนุมัติจัดโครงการสัมมนาเชิงปฏิบัติการเทคโนโลยีปัญญาประดิษฐ์และคลาวด์คอมพิวติง ประจำปี 2569",
      priority: "URGENT",
      status: "ROUTING",
      creator: "อาจารย์สมชาย ปัญญาดี (ครูแผนก IT)",
      createdAt: "5 ต.ค. 2569 10:15 น.",
      hasAttachment: true,
      fileName: "โครงการ_สัมมนา_AI_Cloud_2569.pdf",
      abstractContent: "ขออนุมัติจัดโครงการสัมมนาเชิงปฏิบัติการด้าน AI และ Cloud Computing ระหว่างวันที่ 15-16 พ.ย. 2569",
      href: "/edoc/review",
    },
    {
      id: "doc-inbound-1",
      category: "INBOUND" as const,
      categoryLabel: "รับหนังสือเข้า",
      docNumber: "รับ 0482/2569",
      dept: "สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)",
      title: "แนวทางการประเมินผลการเรียนรู้มาตรฐานวิชาชีพอาชีวศึกษา ประจำภาคเรียนที่ 1/2569",
      priority: "VERY_URGENT",
      status: "APPROVED",
      creator: "นางสาวศิริพร บุญช่วย",
      createdAt: "5 ต.ค. 2569 09:30 น.",
      hasAttachment: true,
      fileName: "สอศ_แนวทางการประเมินผล_1_2569.pdf",
      abstractContent: "แจ้งแนวปฏิบัติการวัดและประเมินผลตามมาตรฐานคุณวุฒิอาชีวศึกษาแห่งชาติ",
      href: "/edoc/inbound",
    },
    {
      id: "doc-outbound-1",
      category: "OUTBOUND" as const,
      categoryLabel: "ส่งออกภายนอก",
      docNumber: "ศธ 0621/0145",
      dept: "ฝ่ายวิชาการ",
      title: "ขอความอนุเคราะห์วิทยากรผู้เชี่ยวชาญการเขียนโค้ดและสถาปัตยกรรม Microservices",
      priority: "NORMAL",
      status: "APPROVED",
      creator: "นายวิเชียร มุ่งมั่น",
      createdAt: "3 ต.ค. 2569 11:00 น.",
      hasAttachment: true,
      fileName: "หนังสือขอความอนุเคราะห์วิทยากร_มทร.pdf",
      abstractContent: "ขอความอนุเคราะห์ให้อาจารย์ผู้เชี่ยวชาญร่วมเป็นวิทยากรบรรยาย",
      href: "/edoc/outbound",
    },
    {
      id: "doc-order-1",
      category: "ORDER" as const,
      categoryLabel: "คำสั่งวิทยาลัย",
      docNumber: "คำสั่งที่ 124/2569",
      dept: "งานบุคคลและนิติการ",
      title: "แต่งตั้งคณะกรรมการดำเนินงานจัดกิจกรรมวันไหว้ครูและพิธีมอบทุนการศึกษา ประจำปีการศึกษา 2569",
      priority: "NORMAL",
      status: "APPROVED",
      creator: "ดร.สมเกียรติ ยิ่งเจริญ",
      createdAt: "1 ต.ค. 2569 09:00 น.",
      hasAttachment: true,
      fileName: "คำสั่งแต่งตั้ง_ไหว้ครู2569.pdf",
      abstractContent: "มอบหมายภาระหน้าที่ให้คณะครูและบุคลากรทางการศึกษาปฏิบัติหน้าที่กำกับดูแลการจัดพิธี",
      href: "/edoc/orders",
    },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>งานสารบรรณและธุรการดิจิทัล</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400">Electronic Saraban Hub 2569</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight flex items-center space-x-3">
              <span>ศูนย์สารบรรณอิเล็กทรอนิกส์</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-mono font-medium">
                Category Directory
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/edoc/create"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 border border-white/20"
            >
              <Plus className="w-4 h-4" />
              <span>สร้างเอกสาร / ออกเลขทะเบียนใหม่</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Overview Capsule */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">รอเสนอเกษียณ</span>
            <div className="text-2xl font-black font-mono text-rose-400 mt-1">1 <span className="text-xs font-normal text-slate-400">เรื่อง</span></div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">ทะเบียนรับเข้า</span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">3 <span className="text-xs font-normal text-slate-400">เรื่อง</span></div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">ทะเบียนส่งออก</span>
            <div className="text-2xl font-black font-mono text-indigo-400 mt-1">2 <span className="text-xs font-normal text-slate-400">เรื่อง</span></div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">คำสั่ง & ประกาศ</span>
            <div className="text-2xl font-black font-mono text-purple-400 mt-1">3 <span className="text-xs font-normal text-slate-400">เรื่อง</span></div>
          </div>
        </div>

        {/* SECTION: CATEGORY BENTO CARDS GRID */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>เลือกหมวดหมู่งานสารบรรณที่ต้องการปฏิบัติงาน</span>
            </h2>
            <span className="text-xs text-slate-400">คลิกที่การ์ดเพื่อเข้าสู่หน้าการจัดการเฉพาะด้าน</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="glass-card p-6 rounded-3xl border border-white/10 hover:border-cyan-400/50 shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${cat.glowColor} rounded-full blur-2xl pointer-events-none -mr-10 -mt-10`}></div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${cat.iconBg} flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
                        {cat.badge}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {cat.subtitle}
                    </div>
                    <h3 className="font-bold text-white text-lg mt-0.5 group-hover:text-cyan-300 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400">{cat.stats}</span>
                    <span className="font-bold text-cyan-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>{cat.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SECTION: RECENT DOCUMENTS ACTIVITY STREAM */}
        <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4 backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-cyan-400" />
                <span>ความเคลื่อนไหวเอกสารราชการล่าสุด (Recent Documents Stream)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">รวมเอกสารทุกหมวดหมู่ที่ได้รับการออกเลขและบันทึกลงระบบ</p>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] -mx-4 px-4 rounded-2xl transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-300">
                        {doc.docNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-white/10 text-slate-300">
                        {doc.categoryLabel}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {doc.createdAt}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm mt-1">{doc.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ส่วนราชการ/ต้นทาง: <span className="text-slate-300 font-medium">{doc.dept}</span> • ผู้บันทึก: <span className="text-slate-300">{doc.creator}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 self-end md:self-auto flex-shrink-0">
                  <button
                    onClick={() => setPdfViewerDoc(doc as any)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>เปิดอ่าน PDF</span>
                  </button>

                  <Link
                    href={doc.href}
                    className="px-3 py-1.5 rounded-xl glass-card hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center space-x-1"
                  >
                    <span>ไปยังหน้ารายการ</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
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
