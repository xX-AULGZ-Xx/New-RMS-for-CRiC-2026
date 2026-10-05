"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  QrCode,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  Layers,
  FileCheck
} from "lucide-react";

export type PDFViewerDocProps = {
  id: string;
  category: "INBOUND" | "OUTBOUND" | "MEMO" | "ORDER" | "CIRCULAR";
  docNumber: string;
  internalRef?: string;
  dept: string;
  originOrg?: string;
  receiverOrg?: string;
  title: string;
  priority: string;
  status: string;
  creator: string;
  createdAt: string;
  abstractContent: string;
  fileName?: string;
  pdfBlobUrl?: string;
  routings?: Array<{
    order: number;
    title: string;
    name: string;
    status: string;
    note: string | null;
    signedAt: string | null;
  }>;
};

export default function PDFViewerModal({
  doc,
  onClose,
}: {
  doc: PDFViewerDocProps;
  onClose: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeView, setActiveView] = useState<"VECTOR_A4" | "EMBEDDED">(
    doc.pdfBlobUrl ? "EMBEDDED" : "VECTOR_A4"
  );

  const totalPages = 3;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (doc.pdfBlobUrl) {
      const a = document.createElement("a");
      a.href = doc.pdfBlobUrl;
      a.download = doc.fileName || `${doc.docNumber}.pdf`;
      a.click();
      return;
    }

    // Generate mock PDF download as text/html printable
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${doc.docNumber} - ${doc.title}</title>
            <style>
              body { font-family: 'Sarabun', sans-serif; padding: 40px; color: #000; }
              .garuda { text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 20px; }
              .header { border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; font-size: 14px; }
              .content { font-size: 14px; line-height: 1.8; text-indent: 40px; }
              .stamp { border: 2px solid #0284c7; color: #0284c7; padding: 10px; width: 250px; margin-top: 30px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="garuda">ตราครุฑ</div>
            <h2 style="text-align:center;">บันทึกข้อความราชการ</h2>
            <div class="header">
              <p><strong>ส่วนราชการ:</strong> ${doc.dept}</p>
              <p><strong>ที่:</strong> ${doc.docNumber} &nbsp;&nbsp;&nbsp;&nbsp; <strong>วันที่:</strong> ${doc.createdAt}</p>
              <p><strong>เรื่อง:</strong> ${doc.title}</p>
              <p><strong>เรียน:</strong> ${doc.receiverOrg || "ผู้อำนวยการวิทยาลัยอาชีวศึกษา CRiC"}</p>
            </div>
            <div class="content">${doc.abstractContent}</div>
            <div class="stamp">
              <strong>วิทยาลัยอาชีวศึกษา CRiC</strong><br/>
              เลขที่: ${doc.docNumber}<br/>
              ลงวันที่: ${doc.createdAt}<br/>
              e-Saraban Certified
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="glass-island w-full max-w-5xl h-[92vh] rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden relative">
        {/* macOS Style Window Title Bar */}
        <div className="h-14 px-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          {/* Left: Window Dots & Title */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center text-[8px] text-rose-950 font-bold opacity-80 hover:opacity-100"
              >
                ✕
              </button>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500 opacity-80"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 opacity-80"></div>
            </div>

            <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

            <div className="flex items-center space-x-2 min-w-0">
              <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="font-bold text-xs text-white truncate max-w-[240px] sm:max-w-md">
                {doc.fileName || `${doc.docNumber}.pdf`}
              </span>
              <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 font-mono">
                PDF 1.7 (A4 สอศ.)
              </span>
            </div>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle (if custom PDF uploaded) */}
            {doc.pdfBlobUrl && (
              <div className="flex items-center bg-white/5 rounded-xl p-0.5 border border-white/10 text-[11px]">
                <button
                  onClick={() => setActiveView("EMBEDDED")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeView === "EMBEDDED"
                      ? "bg-cyan-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  PDF ดั้งเดิม
                </button>
                <button
                  onClick={() => setActiveView("VECTOR_A4")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeView === "VECTOR_A4"
                      ? "bg-cyan-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Vector A4
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="hidden md:flex items-center space-x-1 bg-white/5 px-2 py-1 rounded-xl border border-white/10 text-xs text-slate-300">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                className="p-1 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="ย่อขนาด"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-10 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="ขยายขนาด"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-white/5"
              title="สั่งพิมพ์เอกสาร"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ดาวน์โหลด PDF</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body: Sidebar Thumbnails + PDF Viewport */}
        <div className="flex-1 flex overflow-hidden bg-[#131722]">
          {/* Left Thumbnail Strip */}
          <div className="hidden lg:flex flex-col w-48 border-r border-white/10 bg-[#0d111a] p-3 space-y-3 overflow-y-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
              หน้าเอกสาร ({totalPages} หน้า)
            </span>

            {[
              { page: 1, title: "หนังสือราชการต้นฉบับ" },
              { page: 2, title: "เอกสารแนบท้าย ๑ (โครงการ)" },
              { page: 3, title: "เอกสารแนบท้าย ๒ (งบประมาณ)" },
            ].map((p) => (
              <button
                key={p.page}
                onClick={() => setCurrentPage(p.page)}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  currentPage === p.page
                    ? "bg-cyan-500/15 border-cyan-400/50 text-cyan-300 shadow-md ring-1 ring-cyan-400/30"
                    : "glass-card border-white/10 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="aspect-[1/1.414] bg-white rounded-lg shadow-sm mb-1.5 p-1 flex flex-col justify-between overflow-hidden relative">
                  <div className="w-3 h-3 mx-auto bg-slate-300 rounded-full mt-0.5"></div>
                  <div className="space-y-0.5 px-0.5">
                    <div className="h-1 bg-slate-200 rounded w-full"></div>
                    <div className="h-1 bg-slate-200 rounded w-4/5"></div>
                    <div className="h-1 bg-slate-200 rounded w-3/4"></div>
                  </div>
                  <div className="text-[8px] text-right font-mono text-slate-400 pr-0.5">P.{p.page}</div>
                </div>
                <div className="text-[11px] font-bold truncate">หน้า {p.page}</div>
                <div className="text-[9px] text-slate-500 truncate">{p.title}</div>
              </button>
            ))}
          </div>

          {/* Right Viewport */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
            {activeView === "EMBEDDED" && doc.pdfBlobUrl ? (
              <iframe
                src={doc.pdfBlobUrl}
                className="w-full h-full min-h-[700px] rounded-2xl border border-white/10 shadow-2xl bg-white"
                title={doc.title}
              />
            ) : (
              /* High-Fidelity Vector A4 Paper Page */
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                className="w-full max-w-[794px] min-h-[1123px] bg-white text-slate-900 rounded-2xl shadow-2xl p-10 sm:p-14 font-sarabun relative transition-transform duration-200 border border-slate-300"
              >
                {/* Official Receipt Stamp Seal (If Inbound) */}
                {doc.category === "INBOUND" && (
                  <div className="absolute top-10 right-10 p-3 rounded-xl border-2 border-dashed border-sky-600 bg-sky-50/70 text-sky-900 text-center font-sarabun text-xs shadow-sm">
                    <div className="font-bold text-[11px] text-sky-800">วิทยาลัยอาชีวศึกษา CRiC</div>
                    <div className="font-mono font-bold text-sm text-sky-700 my-0.5">เลขรับ: {doc.docNumber}</div>
                    <div className="text-[10px] text-slate-600">วันที่: {doc.createdAt}</div>
                    <div className="text-[9px] text-sky-600 font-mono mt-0.5">e-Saraban Inbound Certified</div>
                  </div>
                )}

                {/* Official Outbound Stamp (If Outbound) */}
                {doc.category === "OUTBOUND" && (
                  <div className="absolute top-10 right-10 p-3 rounded-xl border-2 border-dashed border-indigo-600 bg-indigo-50/70 text-indigo-900 text-center font-sarabun text-xs shadow-sm">
                    <div className="font-bold text-[11px] text-indigo-800">วิทยาลัยอาชีวศึกษา CRiC</div>
                    <div className="font-mono font-bold text-sm text-indigo-700 my-0.5">เลขส่ง: {doc.docNumber}</div>
                    <div className="text-[10px] text-slate-600">วันที่: {doc.createdAt}</div>
                    <div className="text-[9px] text-indigo-600 font-mono mt-0.5">e-Saraban Outbound Certified</div>
                  </div>
                )}

                {/* PAGE 1: OFFICIAL GOVERNMENT LETTERHEAD */}
                {currentPage === 1 && (
                  <div className="space-y-6">
                    {/* Garuda Crest */}
                    <div className="text-center pt-2">
                      <div className="w-20 h-20 mx-auto text-slate-800 flex items-center justify-center font-bold text-3xl select-none">
                        ครุฑ
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                        {doc.category === "ORDER"
                          ? "คำสั่งวิทยาลัยอาชีวศึกษา CRiC"
                          : doc.category === "INBOUND"
                          ? "หนังสือราชการ (ต้นฉบับภายนอก)"
                          : doc.category === "OUTBOUND"
                          ? "หนังสือราชการ (ส่งภายนอก)"
                          : "บันทึกข้อความ"}
                      </h2>
                    </div>

                    {/* Official Letterhead Metadata */}
                    <div className="border-b-2 border-slate-900 pb-4 text-xs sm:text-sm text-slate-900 space-y-2">
                      <div className="flex justify-between items-center">
                        <p>
                          <strong>ส่วนราชการ:</strong> {doc.originOrg || doc.dept}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p>
                          <strong>ที่:</strong> <span className="font-mono">{doc.docNumber}</span>
                        </p>
                        <p>
                          <strong>วันที่:</strong> {doc.createdAt}
                        </p>
                      </div>
                      <p>
                        <strong>เรื่อง:</strong> <span className="font-bold">{doc.title}</span>
                      </p>
                      <p>
                        <strong>เรียน:</strong> {doc.receiverOrg || "ผู้อำนวยการวิทยาลัยอาชีวศึกษา CRiC"}
                      </p>
                    </div>

                    {/* Body Content */}
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed indent-8 space-y-4 text-justify">
                      <p>{doc.abstractContent}</p>
                      <p className="indent-8">
                        ในการนี้ เพื่อให้การดำเนินงานเป็นไปด้วยความเรียบร้อยและบรรลุวัตถุประสงค์ตามนโยบายของสำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.) จึงขออนุมัติจัดกิจกรรมตามกำหนดการแนบท้าย
                      </p>
                      <p className="indent-8">
                        จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ
                      </p>
                    </div>

                    {/* Signature Block */}
                    <div className="pt-10 text-right text-xs sm:text-sm space-y-1">
                      <p>(ลงชื่อ)....................................................................</p>
                      <p className="font-bold text-slate-900 mt-1">({doc.creator})</p>
                      <p className="text-slate-600 text-xs">ตำแหน่ง {doc.dept}</p>
                    </div>

                    {/* Endorsements Box */}
                    <div className="mt-8 pt-6 border-t border-dashed border-slate-300">
                      <div className="text-xs font-bold text-slate-500 mb-2 font-prompt">
                        บันทึกการเกษียณสั่งการ (Electronic Endorsements):
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="font-bold text-blue-900">รองผู้อำนวยการฝ่ายวิชาการ</p>
                          <p className="italic text-slate-700 mt-0.5">"เห็นควรอนุมัติตามเสนอ"</p>
                          <p className="text-[10px] text-slate-500 mt-1 font-mono">ลงนามเมื่อ: {doc.createdAt}</p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                          <p className="font-bold text-emerald-900">ผู้อำนวยการวิทยาลัยอาชีวศึกษา</p>
                          <p className="italic text-slate-700 mt-0.5">"อนุมัติ ดำเนินการตามระเบียบพัสดุ"</p>
                          <p className="text-[10px] text-emerald-700 mt-1 font-mono">Digital Signature Certified ✓</p>
                        </div>
                      </div>
                    </div>

                    {/* Verified Digital Seal Bottom */}
                    <div className="pt-4 flex items-center justify-between border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-4 h-4 text-slate-700" />
                        <span>SHA256-{doc.id.slice(0, 16).toUpperCase()}</span>
                      </div>
                      <div>หน้า 1 จาก 3 • New RMS CRiC 2026</div>
                    </div>
                  </div>
                )}

                {/* PAGE 2: APPENDIX 1 (PROJECT SCHEDULE & OBJECTIVES) */}
                {currentPage === 2 && (
                  <div className="space-y-6">
                    <div className="text-center border-b pb-4">
                      <span className="text-xs font-bold text-slate-500 uppercase">เอกสารแนบท้าย ๑</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">กำหนดการและรายละเอียดโครงการ</h3>
                      <p className="text-xs text-slate-600">แนบท้ายหนังสือ {doc.docNumber}</p>
                    </div>

                    <table className="w-full text-left text-xs border border-slate-300">
                      <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                        <tr>
                          <th className="p-2.5 border-r border-slate-300 w-28">วัน/เวลา</th>
                          <th className="p-2.5 border-r border-slate-300">กิจกรรม/หัวข้อการบรรยาย</th>
                          <th className="p-2.5">วิทยากร/ผู้รับผิดชอบ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-2.5 border-r border-slate-300 font-mono">08.30 - 09.00 น.</td>
                          <td className="p-2.5 border-r border-slate-300">ลงทะเบียนและรับเอกสารประกอบการสัมมนา</td>
                          <td className="p-2.5">ฝ่ายลงทะเบียน</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 border-r border-slate-300 font-mono">09.00 - 10.30 น.</td>
                          <td className="p-2.5 border-r border-slate-300 font-bold">
                            พิธีเปิดและบรรยายพิเศษ "ทิศทาง AI & Cloud Computing สำหรับอาชีวศึกษา 2026"
                          </td>
                          <td className="p-2.5">ผู้อำนวยการวิทยาลัยฯ</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 border-r border-slate-300 font-mono">10.45 - 12.00 น.</td>
                          <td className="p-2.5 border-r border-slate-300">
                            การฝึกปฏิบัติการติดตั้ง Microservices และฐานข้อมูล PostgreSQL บน Docker
                          </td>
                          <td className="p-2.5">ทีมวิทยากรผู้เชี่ยวชาญ</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 border-r border-slate-300 font-mono">13.00 - 16.30 น.</td>
                          <td className="p-2.5 border-r border-slate-300">
                            Workshop พัฒนา Web Application และการเชื่อมต่อ API สอศ. ศธ.02
                          </td>
                          <td className="p-2.5">อาจารย์แผนกวิชา IT</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="pt-8 flex items-center justify-between border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                      <span>เอกสารอิเล็กทรอนิกส์มาตรฐานราชการ</span>
                      <span>หน้า 2 จาก 3</span>
                    </div>
                  </div>
                )}

                {/* PAGE 3: APPENDIX 2 (BUDGET ESTIMATE) */}
                {currentPage === 3 && (
                  <div className="space-y-6">
                    <div className="text-center border-b pb-4">
                      <span className="text-xs font-bold text-slate-500 uppercase">เอกสารแนบท้าย ๒</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">ตารางประมาณการค่าใช้จ่ายงบประมาณ</h3>
                      <p className="text-xs text-slate-600">หมวดงบพัฒนาศักยภาพผู้เรียน ประจำปีงบประมาณ 2569</p>
                    </div>

                    <table className="w-full text-left text-xs border border-slate-300">
                      <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                        <tr>
                          <th className="p-2.5 border-r border-slate-300 w-12 text-center">ลำดับ</th>
                          <th className="p-2.5 border-r border-slate-300">รายการค่าใช้จ่าย</th>
                          <th className="p-2.5 border-r border-slate-300 text-center w-24">จำนวนหน่วย</th>
                          <th className="p-2.5 text-right w-28">รวมเป็นเงิน (บาท)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-2.5 border-r border-slate-300 text-center font-mono">1</td>
                          <td className="p-2.5 border-r border-slate-300">ค่าตอบแทนวิทยากรผู้ทรงคุณวุฒิภายนอก (12 ชม.)</td>
                          <td className="p-2.5 border-r border-slate-300 text-center">2 ท่าน</td>
                          <td className="p-2.5 text-right font-mono font-bold">14,400.00</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 border-r border-slate-300 text-center font-mono">2</td>
                          <td className="p-2.5 border-r border-slate-300">ค่าอาหารกลางวันและอาหารว่างผู้เข้าร่วมสัมมนา</td>
                          <td className="p-2.5 border-r border-slate-300 text-center">120 คน x 2 วัน</td>
                          <td className="p-2.5 text-right font-mono font-bold">24,000.00</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 border-r border-slate-300 text-center font-mono">3</td>
                          <td className="p-2.5 border-r border-slate-300">ค่าวัสดุและเอกสารประกอบการฝึกปฏิบัติการ</td>
                          <td className="p-2.5 border-r border-slate-300 text-center">120 ชุด</td>
                          <td className="p-2.5 text-right font-mono font-bold">9,600.00</td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                          <td colSpan={3} className="p-2.5 text-right border-r border-slate-300">
                            รวมทั้งสิ้น (สี่หมื่นแปดพันบาทถ้วน)
                          </td>
                          <td className="p-2.5 text-right font-mono text-cyan-800 text-sm">48,000.00</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="pt-8 flex items-center justify-between border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                      <span>ตรวจสอบถูกต้องตามระเบียบการเงินและพัสดุ</span>
                      <span>หน้า 3 จาก 3</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="h-12 px-4 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-slate-300">{doc.docNumber}</span>
            <span>•</span>
            <span className="truncate max-w-[200px] sm:max-w-xs">{doc.title}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg glass-card hover:bg-white/10 text-white disabled:opacity-30 transition-colors flex items-center space-x-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>ก่อนหน้า</span>
            </button>
            <span className="font-mono px-2 font-bold text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-lg glass-card hover:bg-white/10 text-white disabled:opacity-30 transition-colors flex items-center space-x-1"
            >
              <span>ถัดไป</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
