"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/AppShell";
import { signDocumentAction, createSarabanDocumentAction } from "@/lib/actions";
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
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Eye,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  Printer,
  Inbox,
  SendHorizontal,
  ScrollText,
  Plus,
  Search,
  Filter,
  Paperclip,
  Check,
  Calendar,
  Building,
  UserCheck,
  CheckCheck,
  ExternalLink,
  Tag,
  Upload
} from "lucide-react";

type SarabanTab = "REVIEW" | "INBOUND" | "OUTBOUND" | "ORDERS";

type SarabanDoc = {
  id: string;
  category: "INBOUND" | "OUTBOUND" | "MEMO" | "ORDER" | "CIRCULAR";
  docNumber: string;
  internalRef?: string;
  dept: string;
  originOrg?: string;
  receiverOrg?: string;
  phone?: string;
  title: string;
  priority: "NORMAL" | "URGENT" | "VERY_URGENT" | "MOST_URGENT";
  status: "DRAFT" | "ROUTING" | "ENDORSED" | "APPROVED" | "ARCHIVED";
  creator: string;
  createdAt: string;
  abstractContent: string;
  hasAttachment?: boolean;
  fileName?: string;
  pdfBlobUrl?: string;
  routings?: Array<{
    order: number;
    title: string;
    name: string;
    status: "APPROVED" | "PENDING" | "WAITING";
    note: string | null;
    signedAt: string | null;
  }>;
};

export default function EdocPage() {
  const [activeTab, setActiveTab] = useState<SarabanTab>("REVIEW");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [stampPreviewDoc, setStampPreviewDoc] = useState<SarabanDoc | null>(null);
  const [pdfViewerDoc, setPdfViewerDoc] = useState<PDFViewerDocProps | null>(null);

  // Initial registry documents
  const [documents, setDocuments] = useState<SarabanDoc[]>([
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
  ]);

  // Selected document for Review & Endorse panel
  const [selectedDoc, setSelectedDoc] = useState<SarabanDoc>(documents[0]);

  // Signature states
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

  // New Document Composer Form State
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
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);

  // Auto-number generator
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

  // PDF File Upload & Drag-and-drop state
  const [fileSizeText, setFileSizeText] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileSizeText(`${sizeMb} MB`);

      // Auto pre-fill title if empty
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

  // Canvas drawing
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

  // Handle Endorsement Submit
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
      const updatedRoutings = (selectedDoc.routings || []).map((r) =>
        r.order === 3
          ? {
              ...r,
              status: "APPROVED" as const,
              note: actionNote,
              signedAt: "เมื่อสักครู่ (5 ต.ค. 2569)",
            }
          : r
      );

      const updated = {
        ...selectedDoc,
        status: "APPROVED" as const,
        routings: updatedRoutings,
      };

      setSelectedDoc(updated);
      setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } else {
      setErrorMsg(res.error || "ไม่สามารถลงนามได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  // Handle Create New Document
  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocData.title.trim()) {
      alert("กรุณาระบุชื่อเรื่องเอกสาร");
      return;
    }

    setIsCreatingDoc(true);

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

    setIsCreatingDoc(false);

    if (res.success) {
      const createdItem: SarabanDoc = {
        id: res.documentId || "doc-" + Date.now(),
        category: newDocData.category,
        docNumber: newDocData.docNumber,
        internalRef: newDocData.internalRef,
        originOrg: newDocData.originOrg,
        receiverOrg: newDocData.receiverOrg,
        dept: newDocData.originOrg,
        title: newDocData.title,
        priority: newDocData.priority,
        status: newDocData.routingMode === "CIRCULAR" ? "APPROVED" : "ROUTING",
        creator: "อาจารย์สมชาย ปัญญาดี (ครูแผนก IT)",
        createdAt: "วันนี้ 5 ต.ค. 2569",
        abstractContent: newDocData.abstractContent,
        hasAttachment: newDocData.hasAttachment,
        fileName: newDocData.fileName || (newDocData.hasAttachment ? "เอกสารแนบ_" + newDocData.docNumber + ".pdf" : undefined),
        pdfBlobUrl: newDocData.pdfBlobUrl,
        routings:
          newDocData.routingMode === "APPROVAL_CHAIN"
            ? [
                {
                  order: 1,
                  title: "หัวหน้าแผนกวิชา",
                  name: "นายประสิทธิ์ นวัตกรรม",
                  status: "PENDING",
                  note: null,
                  signedAt: null,
                },
                {
                  order: 2,
                  title: "รองผู้อำนวยการฝ่ายวิชาการ",
                  name: "นายวิเชียร มุ่งมั่น",
                  status: "WAITING",
                  note: null,
                  signedAt: null,
                },
                {
                  order: 3,
                  title: "ผู้อำนวยการวิทยาลัย",
                  name: "ดร.สมเกียรติ ยิ่งเจริญ",
                  status: "WAITING",
                  note: null,
                  signedAt: null,
                },
              ]
            : undefined,
      };

      setDocuments((prev) => [createdItem, ...prev]);
      setIsCreateModalOpen(false);

      if (createdItem.category === "MEMO") {
        setActiveTab("REVIEW");
        setSelectedDoc(createdItem);
      } else if (createdItem.category === "INBOUND") {
        setActiveTab("INBOUND");
      } else if (createdItem.category === "OUTBOUND") {
        setActiveTab("OUTBOUND");
      } else {
        setActiveTab("ORDERS");
      }
    } else {
      alert("เกิดข้อผิดพลาด: " + res.error);
    }
  };

  // Filtered documents for each registry tab
  const getTabDocuments = () => {
    let list = documents;
    if (activeTab === "INBOUND") {
      list = documents.filter((d) => d.category === "INBOUND");
    } else if (activeTab === "OUTBOUND") {
      list = documents.filter((d) => d.category === "OUTBOUND");
    } else if (activeTab === "ORDERS") {
      list = documents.filter((d) => d.category === "ORDER" || d.category === "CIRCULAR");
    } else {
      list = documents.filter((d) => d.category === "MEMO");
    }

    return list.filter((d) => {
      const matchSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.originOrg && d.originOrg.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchPriority = filterPriority === "ALL" || d.priority === filterPriority;
      return matchSearch && matchPriority;
    });
  };

  const filteredTabDocs = getTabDocuments();

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header & Fast Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>งานสารบรรณและธุรการดิจิทัล</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400">Electronic Saraban Hub 2569</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight flex items-center space-x-3">
              <span>ศูนย์ระบบสารบรรณอิเล็กทรอนิกส์</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-mono font-medium">
                Official Cloud 2026
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setNewDocData((prev) => ({
                  ...prev,
                  docNumber: getNextNumber(prev.category),
                  title: "",
                  abstractContent: "",
                  fileName: "",
                  pdfBlobUrl: "",
                }));
                setIsCreateModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 border border-white/20"
            >
              <Plus className="w-4 h-4" />
              <span>สร้างเอกสาร / บันทึกข้อความใหม่</span>
            </button>
          </div>
        </div>

        {/* Apple Segmented Capsule Switcher */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 glass-island p-2 rounded-2xl border border-white/10 shadow-lg">
          {[
            {
              id: "REVIEW",
              label: "แฟ้มเสนอเกษียณ & ลงนาม",
              icon: PenTool,
              badge: documents.filter((d) => d.category === "MEMO" && d.status === "ROUTING").length,
            },
            {
              id: "INBOUND",
              label: "ทะเบียนรับหนังสือเข้า",
              icon: Inbox,
              badge: documents.filter((d) => d.category === "INBOUND").length,
            },
            {
              id: "OUTBOUND",
              label: "ทะเบียนส่งออกภายนอก",
              icon: SendHorizontal,
              badge: documents.filter((d) => d.category === "OUTBOUND").length,
            },
            {
              id: "ORDERS",
              label: "ทะเบียนคำสั่ง & ประกาศ",
              icon: ScrollText,
              badge: documents.filter((d) => d.category === "ORDER" || d.category === "CIRCULAR").length,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SarabanTab)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white shadow-md border border-white/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? "bg-white text-blue-900" : "bg-cyan-500/20 text-cyan-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: REVIEW & ENDORSE (Floating Paper Reader + Signature) */}
        {activeTab === "REVIEW" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Floating Paper Document */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {/* Document Selection Strip & PDF View Trigger */}
              <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2">
                <div className="flex items-center space-x-2 overflow-x-auto">
                  {documents
                    .filter((d) => d.category === "MEMO")
                    .map((d) => (
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

                <button
                  onClick={() => setPdfViewerDoc(selectedDoc as any)}
                  className="px-3.5 py-2 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm flex-shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>เปิดอ่านไฟล์ PDF ต้นฉบับ</span>
                </button>
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
                    onClick={() => setPdfViewerDoc(selectedDoc as any)}
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
                      <span>
                        {selectedDoc.dept} โทร. {selectedDoc.phone || "053-711234"}
                      </span>
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

                {/* Historical Endorsements (เกษียณข้อความ) */}
                <div className="mt-10 pt-6 border-t-2 border-dashed border-slate-300 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-prompt">
                    คำสั่งการและบันทึกเกษียณหนังสือ (Audit Trail)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedDoc.routings?.map((r, idx) => (
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

                {/* Verified QR Seal Stamp */}
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
        )}

        {/* TAB 2: INBOUND REGISTRY (ทะเบียนรับหนังสือเข้า) */}
        {activeTab === "INBOUND" && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="glass-island p-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center space-x-3 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ค้นหาเลขที่รับ, ชื่อเรื่อง, หน่วยงานต้นทาง..."
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

            {/* Registry Table */}
            <div className="glass-island rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Inbox className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">บัญชีคุมทะเบียนรับหนังสือเข้า (Inbound Registry 2569)</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  รวม {filteredTabDocs.length} รายการ
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
                    {filteredTabDocs.map((doc) => (
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
                              onClick={() => setPdfViewerDoc(doc as any)}
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
                              onClick={() => setPdfViewerDoc(doc as any)}
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
          </div>
        )}

        {/* TAB 3: OUTBOUND REGISTRY (ทะเบียนส่งออกภายนอก) */}
        {activeTab === "OUTBOUND" && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="glass-island p-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center space-x-3 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ค้นหาเลขที่ส่ง, ชื่อเรื่อง, หน่วยงานปลายทาง..."
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

            {/* Outbound Table */}
            <div className="glass-island rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SendHorizontal className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-sm">บัญชีคุมทะเบียนหนังสือส่งออกภายนอก (Outbound Registry)</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  รวม {filteredTabDocs.length} รายการ
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
                    {filteredTabDocs.map((doc) => (
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
                              onClick={() => setPdfViewerDoc(doc as any)}
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
                              onClick={() => setPdfViewerDoc(doc as any)}
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
          </div>
        )}

        {/* TAB 4: ORDERS & ANNOUNCEMENTS (คำสั่ง & ประกาศ) */}
        {activeTab === "ORDERS" && (
          <div className="space-y-6">
            <div className="glass-island rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ScrollText className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-white text-sm">ทะเบียนคำสั่งและประกาศวิทยาลัย (Orders & Circulars)</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  รวม {filteredTabDocs.length} รายการ
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-prompt">
                  <thead className="bg-white/[0.04] border-b border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-4">เลขที่คำสั่ง/ประกาศ</th>
                      <th className="px-5 py-4">วันที่ออกคำสั่ง</th>
                      <th className="px-5 py-4">เรื่อง</th>
                      <th className="px-5 py-4">ฝ่าย/งานที่รับผิดชอบ</th>
                      <th className="px-4 py-4 text-center">ดู & ดาวน์โหลด PDF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTabDocs.map((doc) => (
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
                            onClick={() => setPdfViewerDoc(doc as any)}
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
          </div>
        )}

        {/* MODAL: CREATE NEW SARABAN DOCUMENT */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="glass-island w-full max-w-2xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center font-bold">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">สร้างเอกสารราชการ / ออกเลขทะเบียนใหม่</h3>
                    <p className="text-xs text-slate-400">ระบบ Hybrid Auto-Numbering ประจำปี 2569</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateDocument} className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ประเภทเอกสารสารบรรณ
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "MEMO", label: "บันทึกข้อความ" },
                      { id: "INBOUND", label: "รับหนังสือเข้า" },
                      { id: "OUTBOUND", label: "ส่งออกภายนอก" },
                      { id: "ORDER", label: "คำสั่งวิทยาลัย" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleCategoryChange(c.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                          newDocData.category === c.id
                            ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-sm"
                            : "glass-card border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-Number with Edit Option */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
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
                    placeholder="เช่น ขออนุมัติจัดซื้อวัสดุฝึกปฏิบัติการเทคโนโลยีสารสนเทศ..."
                    value={newDocData.title}
                    onChange={(e) => setNewDocData({ ...newDocData, title: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-2xl glass-input text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
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
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewDocData({ ...newDocData, routingMode: "APPROVAL_CHAIN" })}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                        newDocData.routingMode === "APPROVAL_CHAIN"
                          ? "bg-blue-500/20 border-blue-400 text-white shadow-sm"
                          : "glass-card border-white/10 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 text-blue-300 mb-1">
                        <UserCheck className="w-4 h-4" />
                        <span>เสนอตามลำดับขั้น</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal">
                        ครูผู้เสนอ &rarr; หัวหน้างาน &rarr; รอง ผอ. &rarr; ผู้อำนวยการ
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewDocData({ ...newDocData, routingMode: "CIRCULAR" })}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                        newDocData.routingMode === "CIRCULAR"
                          ? "bg-emerald-500/20 border-emerald-400 text-white shadow-sm"
                          : "glass-card border-white/10 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 text-emerald-300 mb-1">
                        <SendHorizontal className="w-4 h-4" />
                        <span>หนังสือเวียนเพื่อทราบ/ถือปฏิบัติ</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal">
                        กระจายแจ้งทุกแผนกวิชาโดยไม่ต้องเซ็นเกษียณ
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
                    rows={3}
                    placeholder="ระบุเหตุผล ความจำเป็น และข้อเสนอแนะในการปฏิบัติราชการ..."
                    value={newDocData.abstractContent}
                    onChange={(e) => setNewDocData({ ...newDocData, abstractContent: e.target.value })}
                    className="w-full text-xs p-3 rounded-2xl glass-input text-white focus:outline-none"
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
                      className={`relative p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
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
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-2 shadow-inner">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-white">
                        ลากและวางไฟล์ PDF ที่นี่ หรือ <span className="text-cyan-400 underline">คลิกเพื่อเลือกไฟล์</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        ระบบจะดึงชื่อเรื่องจากไฟล์อัตโนมัติ และแสดงตัวอย่างบน macOS PDF Viewer ได้ทันที
                      </p>
                    </div>
                  ) : (
                    /* Uploaded File Chip / Card */
                    <div className="p-4 rounded-2xl glass-card border border-cyan-400/30 bg-cyan-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center flex-shrink-0 font-bold">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-white truncate max-w-[200px] sm:max-w-xs">
                              {newDocData.fileName}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {fileSizeText || "PDF พร้อมใช้งาน"}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
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
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all flex items-center space-x-1"
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
                          className="px-2.5 py-1.5 rounded-xl glass-card hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 text-slate-400 text-xs font-bold transition-all"
                          title="ลบไฟล์ออก"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit & Cancel */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl glass-card hover:bg-white/10 text-slate-300 text-xs font-bold transition-all"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingDoc}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all"
                  >
                    {isCreatingDoc ? (
                      <Clock className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>บันทึกและส่งเข้าระบบสารบรรณ</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DIGITAL STAMP SEAL PREVIEW */}
        {stampPreviewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
            <div className="glass-island w-full max-w-md rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl relative space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">
                    {stampPreviewDoc.category === "INBOUND" ? "ตราประทับรับสารบรรณดิจิทัล" : "ตราประทับส่งสารบรรณดิจิทัล"}
                  </h3>
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
                  {stampPreviewDoc.category === "INBOUND" ? `เลขรับ: ${stampPreviewDoc.docNumber}` : `เลขส่ง: ${stampPreviewDoc.docNumber}`}
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p>
                    <span className="font-bold">วันที่บันทึก: </span>
                    <span>{stampPreviewDoc.createdAt}</span>
                  </p>
                  <p>
                    <span className="font-bold">ผู้ลงรับ/ส่ง: </span>
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
                <p className="mt-1">
                  ต้นทาง: {stampPreviewDoc.originOrg || stampPreviewDoc.dept}
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const doc = stampPreviewDoc;
                    setStampPreviewDoc(null);
                    setPdfViewerDoc(doc as any);
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

        {/* MODAL: FULL MACOS STYLE PDF DOCUMENT VIEWER */}
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
