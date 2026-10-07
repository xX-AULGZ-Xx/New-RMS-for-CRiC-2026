"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Copy,
  Check,
  Edit3,
  Trash2,
  Eye,
  ArrowRight,
  Download,
  Sparkles,
  Layers,
  Building2,
  Clock,
  ArrowLeft,
  X,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  LayoutTemplate,
  Sliders,
  Send,
  Info,
  Tag,
  ChevronRight,
  Printer
} from "lucide-react";
import {
  getDocumentTemplatesAction,
  saveDocumentTemplateAction,
  deleteDocumentTemplateAction,
  incrementTemplateUsageAction,
  DocumentTemplateItem,
} from "@/lib/edoc-actions";

export default function EdocTemplatesPage() {
  const router = useRouter();

  // State
  const [templates, setTemplates] = useState<DocumentTemplateItem[]>([]);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string; code: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [deptFilter, setDeptFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("GRID");

  // Feedback Banner
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Copy success feedback tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Template Add/Edit Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [editorForm, setEditorForm] = useState({
    code: "",
    title: "",
    category: "MEMO",
    departmentId: "",
    description: "",
    defaultOrigin: "",
    defaultReceiver: "",
    subjectPrefix: "",
    bodyContent: "",
    variablesJson: "",
    priority: "NORMAL" as "NORMAL" | "URGENT" | "VERY_URGENT" | "MOST_URGENT",
    tags: "",
    isActive: true,
  });

  // Preview Modal
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplateItem | null>(null);

  // Use Template (Fill Variables) Modal
  const [useModalTemplate, setUseModalTemplate] = useState<DocumentTemplateItem | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // Load data
  const loadTemplates = async () => {
    setIsLoading(true);
    const res = await getDocumentTemplatesAction();
    if (res.success && res.templates) {
      setTemplates(res.templates);
      if (res.departments) {
        setDepartments(res.departments);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // Filtered Templates
  const filteredTemplates = templates.filter((t) => {
    const matchesCat = categoryFilter === "ALL" || t.category === categoryFilter;
    const matchesDept =
      deptFilter === "ALL" ||
      (deptFilter === "CENTRAL" ? !t.departmentId : t.departmentId === deptFilter);
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.code.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.tags && t.tags.toLowerCase().includes(q));
    return matchesCat && matchesDept && matchesSearch;
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setEditorError(null);
    const nextCode = `TPL-MEMO-${String(templates.length + 1).padStart(3, "0")}`;
    setEditorForm({
      code: nextCode,
      title: "",
      category: "MEMO",
      departmentId: departments[0]?.id || "",
      description: "",
      defaultOrigin: "แผนกวิชาเทคโนโลยีสารสนเทศ",
      defaultReceiver: "ผู้อำนวยการวิทยาลัยอาชีวศึกษาเชียงราย",
      subjectPrefix: "ขออนุมัติ",
      bodyContent: "ด้วย แผนกวิชา{{department}} มีความประสงค์จะ...\n\nจึงเรียนมาเพื่อโปรดพิจารณา",
      variablesJson: JSON.stringify([
        { key: "department", label: "แผนกวิชา", default: "เทคโนโลยีสารสนเทศ" },
      ]),
      priority: "NORMAL",
      tags: "บันทึกข้อความ, ขออนุมัติ",
      isActive: true,
    });
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (t: DocumentTemplateItem) => {
    setEditingId(t.id);
    setEditorError(null);
    setEditorForm({
      code: t.code,
      title: t.title,
      category: t.category,
      departmentId: t.departmentId || "",
      description: t.description || "",
      defaultOrigin: t.defaultOrigin || "",
      defaultReceiver: t.defaultReceiver || "",
      subjectPrefix: t.subjectPrefix || "",
      bodyContent: t.bodyContent,
      variablesJson: t.variablesJson || "",
      priority: t.priority,
      tags: t.tags || "",
      isActive: t.isActive,
    });
    setIsEditorOpen(true);
  };

  // Save Template
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setEditorError(null);

    const res = await saveDocumentTemplateAction({
      id: editingId || undefined,
      ...editorForm,
    });

    setIsSaving(false);
    if (res.success) {
      setIsEditorOpen(false);
      loadTemplates();
      setFeedback({
        type: "success",
        message: editingId ? `แก้ไขแม่แบบ ${editorForm.code} เรียบร้อยแล้ว` : `สร้างแม่แบบใหม่ ${editorForm.code} สำเร็จ`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setEditorError(res.error || "เกิดข้อผิดพลาดในการบันทึกแม่แบบ");
    }
  };

  // Delete Template
  const handleDeleteTemplate = async (id: string, code: string, title: string) => {
    if (!confirm(`คุณต้องการลบแม่แบบ "${code} - ${title}" ใช่หรือไม่?`)) return;

    const res = await deleteDocumentTemplateAction(id);
    if (res.success) {
      loadTemplates();
      setFeedback({ type: "success", message: `ลบแม่แบบ ${code} เรียบร้อยแล้ว` });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: "error", message: res.error || "เกิดข้อผิดพลาดในการลบแม่แบบ" });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Copy Template Content
  const handleCopyContent = (t: DocumentTemplateItem) => {
    navigator.clipboard.writeText(t.bodyContent);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2500);
    setFeedback({ type: "success", message: `คัดลอกเนื้อหาแม่แบบ ${t.code} ไปยังคลิปบอร์ดแล้ว` });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Open "Use Template / Fill Variables" Modal
  const handleOpenUseTemplate = (t: DocumentTemplateItem) => {
    setUseModalTemplate(t);
    // Parse default variables if present
    const initVals: Record<string, string> = {};
    if (t.variablesJson) {
      try {
        const parsed = JSON.parse(t.variablesJson);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: any) => {
            if (item.key) initVals[item.key] = item.default || "";
          });
        }
      } catch (e) {}
    }
    setVariableValues(initVals);
  };

  // Proceed with filled variables -> Redirect to Create Doc
  const handleProceedToCreateDoc = async () => {
    if (!useModalTemplate) return;

    // Track usage increment in background
    incrementTemplateUsageAction(useModalTemplate.id);

    // Replace variables in bodyContent
    let filledBody = useModalTemplate.bodyContent;
    Object.entries(variableValues).forEach(([k, v]) => {
      const reg = new RegExp(`{{${k}}}`, "g");
      filledBody = filledBody.replace(reg, v || `[${k}]`);
    });

    // Store in session storage for /edoc/create to consume
    sessionStorage.setItem(
      "edoc_preset_from_template",
      JSON.stringify({
        category: useModalTemplate.category,
        title: useModalTemplate.title,
        originOrg: useModalTemplate.defaultOrigin || "",
        receiverOrg: useModalTemplate.defaultReceiver || "",
        abstractContent: filledBody,
        priority: useModalTemplate.priority,
        templateCode: useModalTemplate.code,
      })
    );

    router.push("/edoc/create?fromTemplate=" + useModalTemplate.code);
  };

  // Export CSV
  const exportTemplatesCSV = () => {
    const headers = "รหัสแบบฟอร์ม,ชื่อแบบฟอร์ม,หมวดหมู่,แผนกวิชา,หน่วยงานต้นทาง,ผู้รับ/เรียน,สถิติการใช้งาน,สถานะ\n";
    const rows = filteredTemplates
      .map((t) => {
        const dept = t.departmentName || "ส่วนกลาง";
        const status = t.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน";
        return `"${t.code}","${t.title}","${t.category}","${dept}","${t.defaultOrigin || ""}","${t.defaultReceiver || ""}",${t.usageCount},"${status}"`;
      })
      .join("\n");

    const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CRiC_Document_Templates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedback({
      type: "success",
      message: `ส่งออกรายการแม่แบบเอกสาร ${filteredTemplates.length} รายการ สำเร็จแล้ว`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Category Badge helper
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "MEMO":
        return { label: "บันทึกข้อความ", color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" };
      case "OUTBOUND":
        return { label: "หนังสือภายนอก", color: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30" };
      case "ORDER":
        return { label: "คำสั่งวิทยาลัย", color: "bg-purple-500/10 text-purple-300 border-purple-500/30" };
      case "CIRCULAR":
        return { label: "ประกาศ/หนังสือเวียน", color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" };
      case "FORM":
      default:
        return { label: "แบบฟอร์มทั่วไป", color: "bg-amber-500/10 text-amber-300 border-amber-500/30" };
    }
  };

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Link href="/edoc" className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>งานสารบรรณอิเล็กทรอนิกส์</span>
              </Link>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-bold">Template Builder & Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight flex items-center space-x-3">
              <span>ระบบจัดการแม่แบบเอกสารราชการ</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 font-mono font-medium">
                Standard VEC Forms
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={exportTemplatesCSV}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center space-x-2 border border-white/10 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>ส่งออก CSV</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 border border-amber-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>สร้างแม่แบบใหม่</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`glass-island border rounded-3xl p-4 flex items-center justify-between text-xs shadow-xl animate-fade-in backdrop-blur-xl ${
              feedback.type === "success"
                ? "border-emerald-500/30 text-emerald-200 bg-emerald-950/40"
                : "border-rose-500/30 text-rose-200 bg-rose-950/40"
            }`}
          >
            <div className="flex items-center space-x-3">
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <span className="font-bold text-sm">{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs font-bold px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              ปิด
            </button>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-island p-4 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
              <span>แม่แบบทั้งหมด</span>
              <LayoutTemplate className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{templates.length}</div>
            <div className="text-[11px] text-amber-300 mt-1">แบบฟอร์มพร้อมใช้งาน</div>
          </div>

          <div className="glass-island p-4 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
              <span>บันทึกข้อความ</span>
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {templates.filter((t) => t.category === "MEMO").length}
            </div>
            <div className="text-[11px] text-cyan-300 mt-1">แบบฟอร์มเสนอภายใน</div>
          </div>

          <div className="glass-island p-4 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
              <span>คำสั่ง & ประกาศ</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {templates.filter((t) => t.category === "ORDER" || t.category === "CIRCULAR").length}
            </div>
            <div className="text-[11px] text-purple-300 mt-1">เอกสารราชการทางการ</div>
          </div>

          <div className="glass-island p-4 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
              <span>ยอดการเรียกใช้รวม</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {templates.reduce((sum, t) => sum + t.usageCount, 0)}
            </div>
            <div className="text-[11px] text-emerald-300 mt-1">ครั้งในระบบ สารบรรณ</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-island p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center space-x-1.5 bg-black/40 border border-white/10 p-1.5 rounded-2xl overflow-x-auto w-fit max-w-full">
              {[
                { id: "ALL", label: "ทุกหมวดหมู่" },
                { id: "MEMO", label: "บันทึกข้อความ" },
                { id: "OUTBOUND", label: "หนังสือภายนอก" },
                { id: "ORDER", label: "คำสั่งวิทยาลัย" },
                { id: "CIRCULAR", label: "ประกาศ/หนังสือเวียน" },
                { id: "FORM", label: "แบบฟอร์มทั่วไป" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    categoryFilter === c.id
                      ? "bg-amber-500 text-slate-950 font-black shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Search Input & View Switcher */}
            <div className="flex items-center space-x-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อแบบฟอร์ม, รหัส, แท็ก..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex bg-black/40 border border-white/10 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setViewMode("GRID")}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    viewMode === "GRID" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                  }`}
                  title="มุมมองการ์ด (Grid)"
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("TABLE")}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    viewMode === "TABLE" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                  }`}
                  title="มุมมองตาราง (Table)"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Filter: Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-white/5 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">กรองตามแผนกวิชา / ฝ่าย</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
              >
                <option value="ALL" className="bg-[#111827]">ทุกแผนกวิชาและส่วนกลาง</option>
                <option value="CENTRAL" className="bg-[#111827]">ส่วนกลางวิทยาลัย / ทุกแผนก</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#111827]">
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-slate-400 text-xs flex items-center space-x-1.5 py-2.5">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>พบแบบฟอร์ม <strong>{filteredTemplates.length}</strong> จากทั้งหมด <strong>{templates.length}</strong> รายการ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content: GRID VIEW */}
        {viewMode === "GRID" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.length === 0 ? (
              <div className="col-span-full glass-island p-12 rounded-3xl border border-white/10 text-center text-slate-400">
                <LayoutTemplate className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <p className="font-bold text-base text-slate-300">ไม่พบแม่แบบเอกสารที่ตรงกับเงื่อนไข</p>
                <p className="text-xs text-slate-500 mt-1">ลองเปลี่ยนคำค้นหา หรือสร้างแม่แบบใหม่ด้วยปุ่มด้านบน</p>
                <button
                  onClick={handleOpenCreate}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  + สร้างแม่แบบใหม่
                </button>
              </div>
            ) : (
              filteredTemplates.map((t) => {
                const badge = getCategoryBadge(t.category);
                return (
                  <div
                    key={t.id}
                    className="glass-island p-5 rounded-3xl border border-white/10 shadow-lg hover:border-amber-400/30 transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Code & Category */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-xl bg-black/40 border border-white/10 text-amber-300">
                          {t.code}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-amber-200 transition-colors">
                        {t.title}
                      </h3>

                      {/* Description / snippet */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {t.description || t.bodyContent.slice(0, 100) + "..."}
                      </p>

                      {/* Metadata tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {t.departmentName ? (
                          <span className="text-[10px] text-slate-300 bg-white/5 px-2 py-0.5 rounded-lg flex items-center space-x-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span>{t.departmentName}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg">
                            ส่วนกลาง
                          </span>
                        )}
                        <span className="text-[10px] text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                          ใช้งาน {t.usageCount} ครั้ง
                        </span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1">
                        {/* Copy Content */}
                        <button
                          onClick={() => handleCopyContent(t)}
                          title="คัดลอกข้อความแม่แบบ"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all"
                        >
                          {copiedId === t.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {/* Preview */}
                        <button
                          onClick={() => setPreviewTemplate(t)}
                          title="ดูตัวอย่างเอกสารราชการ"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(t)}
                          title="แก้ไขแม่แบบ"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteTemplate(t.id, t.code, t.title)}
                          title="ลบแม่แบบ"
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Use Template Button */}
                      <button
                        onClick={() => handleOpenUseTemplate(t)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>ใช้แบบฟอร์มนี้</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Content: TABLE VIEW */}
        {viewMode === "TABLE" && (
          <div className="glass-island rounded-3xl border border-white/10 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-4">รหัสแบบฟอร์ม</th>
                    <th className="py-4 px-4">ชื่อแบบฟอร์ม</th>
                    <th className="py-4 px-3">หมวดหมู่</th>
                    <th className="py-4 px-3">แผนกวิชา</th>
                    <th className="py-4 px-3 text-center">สถิติการใช้</th>
                    <th className="py-4 px-3 text-center">สถานะ</th>
                    <th className="py-4 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        ไม่พบข้อมูลแม่แบบเอกสาร
                      </td>
                    </tr>
                  ) : (
                    filteredTemplates.map((t) => {
                      const badge = getCategoryBadge(t.category);
                      return (
                        <tr key={t.id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                            {t.code}
                          </td>
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="font-bold text-white group-hover:text-amber-200 transition-colors">
                              {t.title}
                            </div>
                            {t.description && (
                              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                                {t.description}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-300">
                            {t.departmentName || "ส่วนกลาง"}
                          </td>
                          <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-400">
                            {t.usageCount}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.isActive
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}
                            >
                              {t.isActive ? "เปิดใช้งาน" : "ปิด"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button
                                onClick={() => handleOpenUseTemplate(t)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400 transition-colors"
                              >
                                ใช้
                              </button>
                              <button
                                onClick={() => setPreviewTemplate(t)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white"
                                title="ดูตัวอย่าง"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(t)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white"
                                title="แก้ไข"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTemplate(t.id, t.code, t.title)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                                title="ลบ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 1: ADD / EDIT TEMPLATE                                   */}
        {/* ============================================================== */}
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-island max-w-2xl w-full rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 animate-scale-up max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <LayoutTemplate className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {editingId ? "แก้ไขแม่แบบเอกสารราชการ" : "สร้างแม่แบบเอกสารใหม่"}
                    </h3>
                    <p className="text-[11px] text-slate-400">กำหนดฟิลด์ตัวแปรและโครงร่างมาตรฐานสำหรับร่างหนังสือราชการ</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editorError && (
                <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{editorError}</span>
                </div>
              )}

              <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
                {/* Code & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      รหัสแบบฟอร์ม <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น TPL-MEMO-001"
                      value={editorForm.code}
                      onChange={(e) => setEditorForm({ ...editorForm, code: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">หมวดหมู่เอกสาร</label>
                    <select
                      value={editorForm.category}
                      onChange={(e) => setEditorForm({ ...editorForm, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                    >
                      <option value="MEMO" className="bg-[#111827]">บันทึกข้อความ (ภายใน)</option>
                      <option value="OUTBOUND" className="bg-[#111827]">หนังสือภายนอก (ส่งออก)</option>
                      <option value="ORDER" className="bg-[#111827]">คำสั่งวิทยาลัย</option>
                      <option value="CIRCULAR" className="bg-[#111827]">ประกาศ / หนังสือเวียน</option>
                      <option value="FORM" className="bg-[#111827]">แบบฟอร์มคำร้องทั่วไป</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    ชื่อแบบฟอร์ม / เรื่อง <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น บันทึกข้อความขออนุมัติจัดโครงการพัฒนาทักษะวิชาชีพ"
                    value={editorForm.title}
                    onChange={(e) => setEditorForm({ ...editorForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                  />
                </div>

                {/* Department & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">แผนกวิชา / ฝ่ายงานที่รับผิดชอบ</label>
                    <select
                      value={editorForm.departmentId}
                      onChange={(e) => setEditorForm({ ...editorForm, departmentId: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                    >
                      <option value="" className="bg-[#111827]">ส่วนกลางวิทยาลัย / ทุกแผนก</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id} className="bg-[#111827]">
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ชั้นความเร็วเริ่มต้น</label>
                    <select
                      value={editorForm.priority}
                      onChange={(e) => setEditorForm({ ...editorForm, priority: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                    >
                      <option value="NORMAL" className="bg-[#111827]">ปกติ</option>
                      <option value="URGENT" className="bg-[#111827]">ด่วน</option>
                      <option value="VERY_URGENT" className="bg-[#111827]">ด่วนมาก</option>
                      <option value="MOST_URGENT" className="bg-[#111827]">ด่วนที่สุด</option>
                    </select>
                  </div>
                </div>

                {/* Origin & Receiver */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ส่วนราชการต้นเรื่อง (Default Origin)</label>
                    <input
                      type="text"
                      placeholder="เช่น แผนกวิชาเทคโนโลยีสารสนเทศ"
                      value={editorForm.defaultOrigin}
                      onChange={(e) => setEditorForm({ ...editorForm, defaultOrigin: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ผู้รับ / เรียน (Default Receiver)</label>
                    <input
                      type="text"
                      placeholder="เช่น ผู้อำนวยการวิทยาลัยอาชีวศึกษาเชียงราย"
                      value={editorForm.defaultReceiver}
                      onChange={(e) => setEditorForm({ ...editorForm, defaultReceiver: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">คำอธิบายและแนวทางการใช้งาน</label>
                  <input
                    type="text"
                    placeholder="เช่น ใช้สำหรับขออนุมัติจัดอบรม สัมมนาเชิงปฏิบัติการ..."
                    value={editorForm.description}
                    onChange={(e) => setEditorForm({ ...editorForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                  />
                </div>

                {/* Body Content with Placeholders */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-300">
                      เนื้อหาแม่แบบ (รองรับ Placeholder) <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] text-amber-400">
                      ใช้ตัวแปรเช่น {"{{department}}"}, {"{{amount}}"}, {"{{startDate}}"}
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    required
                    placeholder="พิมพ์เนื้อหาแม่แบบเอกสารราชการที่นี่..."
                    value={editorForm.bodyContent}
                    onChange={(e) => setEditorForm({ ...editorForm, bodyContent: e.target.value })}
                    className="w-full p-3 rounded-2xl glass-input text-white focus:outline-none font-sans text-xs leading-relaxed"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">แท็กค้นหา (คั่นด้วยเครื่องหมายจุลภาค)</label>
                  <input
                    type="text"
                    placeholder="เช่น โครงการ, อบรม, งบประมาณ, ฝึกงาน"
                    value={editorForm.tags}
                    onChange={(e) => setEditorForm({ ...editorForm, tags: e.target.value })}
                    className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="templateIsActive"
                    checked={editorForm.isActive}
                    onChange={(e) => setEditorForm({ ...editorForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-transparent border-white/20"
                  />
                  <label htmlFor="templateIsActive" className="text-slate-300 font-bold cursor-pointer">
                    เปิดใช้งานแบบฟอร์มนี้ในระบบสร้างเอกสาร
                  </label>
                </div>

                {/* Form Footer */}
                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-xl glass-card hover:bg-white/10 text-slate-300 font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black flex items-center space-x-1.5 shadow-md disabled:opacity-50"
                  >
                    {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{editingId ? "บันทึกการแก้ไข" : "บันทึกแม่แบบใหม่"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: USE TEMPLATE (FILL VARIABLES)                         */}
        {/* ============================================================== */}
        {useModalTemplate && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-island max-w-2xl w-full rounded-3xl border border-white/20 p-6 shadow-2xl space-y-5 animate-scale-up max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      เติมข้อมูลลงในแบบฟอร์ม: {useModalTemplate.code}
                    </h3>
                    <p className="text-[11px] text-slate-400">{useModalTemplate.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setUseModalTemplate(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Variables Form */}
              {Object.keys(variableValues).length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>ระบุข้อมูลสำหรับตัวแปรในเอกสาร:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/30 p-4 rounded-2xl border border-white/5 text-xs">
                    {Object.keys(variableValues).map((key) => (
                      <div key={key}>
                        <label className="block text-slate-400 font-bold mb-1">
                          {"{{" + key + "}}"}
                        </label>
                        <input
                          type="text"
                          value={variableValues[key]}
                          onChange={(e) =>
                            setVariableValues({ ...variableValues, [key]: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl glass-input text-white focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-400">
                  แม่แบบนี้ไม่มีตัวแปรเติมคำ สามารถกดปุ่มนำไปสร้างเอกสารได้ทันที
                </div>
              )}

              {/* Real-time Preview Box */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ตัวอย่างเนื้อหาข้อความหลังแทนค่าตัวแปร:
                </label>
                <div className="bg-[#0f172a] p-4 rounded-2xl border border-white/10 text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-sans">
                  {(() => {
                    let preview = useModalTemplate.bodyContent;
                    Object.entries(variableValues).forEach(([k, v]) => {
                      preview = preview.replace(new RegExp(`{{${k}}}`, "g"), v || `[${k}]`);
                    });
                    return preview;
                  })()}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <span className="text-slate-400">
                  ปลายทาง: {useModalTemplate.defaultReceiver || "ผู้อำนวยการวิทยาลัย"}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setUseModalTemplate(null)}
                    className="px-4 py-2 rounded-xl glass-card text-slate-300 hover:text-white font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleProceedToCreateDoc}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>นำไปสร้างเอกสารราชการ (Proceed)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 3: OFFICIAL THAI GOV PREVIEW MODAL                       */}
        {/* ============================================================== */}
        {previewTemplate && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 max-w-2xl w-full rounded-2xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-prompt">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border font-bold text-xs text-slate-700">
                    ตราครุฑ
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-slate-900">
                      {previewTemplate.category === "MEMO" ? "บันทึกข้อความ" : previewTemplate.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                      รหัสแม่แบบ: {previewTemplate.code} • วิทยาลัยอาชีวศึกษาเชียงราย
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Thai Gov Header Fields */}
              <div className="text-xs space-y-2 border-b border-slate-200 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>ส่วนราชการ:</strong> {previewTemplate.defaultOrigin || "วิทยาลัยอาชีวศึกษาเชียงราย"}</div>
                  <div><strong>ที่:</strong> วอช ..../2569 &nbsp;&nbsp; <strong>วันที่:</strong> {new Date().toLocaleDateString("th-TH")}</div>
                </div>
                <div><strong>เรื่อง:</strong> {previewTemplate.title}</div>
                <div><strong>เรียน:</strong> {previewTemplate.defaultReceiver || "ผู้อำนวยการวิทยาลัยอาชีวศึกษาเชียงราย"}</div>
              </div>

              {/* Body */}
              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap py-2 indent-8">
                {previewTemplate.bodyContent}
              </div>

              {/* Signoff */}
              <div className="pt-6 text-xs text-right space-y-1">
                <div>(ลงชื่อ).....................................................................</div>
                <div className="font-bold">(.................................................................)</div>
                <div className="text-slate-500">ตำแหน่ง..........................................................</div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>สั่งพิมพ์ตัวอย่าง</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const t = previewTemplate;
                      setPreviewTemplate(null);
                      handleOpenUseTemplate(t);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400"
                  >
                    ใช้แบบฟอร์มนี้
                  </button>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
