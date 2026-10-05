"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import {
  Settings,
  Building2,
  MapPin,
  KeyRound,
  Users,
  Database,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Smartphone,
  Globe,
  Radio,
  Download,
  Trash2,
  Plus,
  Edit2,
  Sparkles,
  Server,
  Layers
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"COLLEGE" | "GEOFENCE" | "INTEGRATION" | "USERS" | "SYSTEM">("COLLEGE");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // College settings state
  const [collegeSettings, setCollegeSettings] = useState({
    collegeNameTh: "วิทยาลัยอาชีวศึกษา CRiC",
    collegeNameEn: "Chiang Rai Commercial Vocational College",
    schoolCode: "1350020101",
    currentTerm: "1",
    academicYear: "2569",
    directorName: "ดร.สมเกียรติ ยิ่งเจริญ",
    phone: "053-711234",
    email: "contact@cric.ac.th",
    address: "เลขที่ 123 ถนนพหลโยธิน ตำบลเวียง อำเภอเมือง จังหวัดเชียงราย 57000",
  });

  // Geofencing settings
  const [geofenceSettings, setGeofenceSettings] = useState({
    latitude: "19.907200",
    longitude: "99.832500",
    radiusMeters: "200",
    allowedWifi: "CRIC-STAFF, CRIC-WiFi, CRIC-Teacher",
    morningLateTime: "08:00",
    morningAbsentTime: "08:30",
    afternoonCheckOutTime: "16:30",
  });

  // Integration settings
  const [integrations, setIntegrations] = useState({
    lineChannelId: "2001928472",
    lineChannelSecret: "••••••••••••••••••••••••••••••••",
    googleDomain: "cric.ac.th",
    googleClientId: "948271029384-cric.apps.googleusercontent.com",
    std02ApiEndpoint: "https://std2018.vec.go.th/api/v2",
    legacyRmsHost: "192.168.1.200:3306 (MySQL 5.7)",
  });

  // Users list state
  const [users, setUsers] = useState([
    { id: "1", name: "ดร.สมเกียรติ ยิ่งเจริญ", email: "director@cric.ac.th", role: "ผู้อำนวยการ (EXECUTIVE)", status: "ACTIVE" },
    { id: "2", name: "นายวิเชียร มุ่งมั่น", email: "deputy.academic@cric.ac.th", role: "รอง ผอ.วิชาการ (EXECUTIVE)", status: "ACTIVE" },
    { id: "3", name: "นายประสิทธิ์ นวัตกรรม", email: "head.it@cric.ac.th", role: "หัวหน้าแผนก IT (HEAD_DEPT)", status: "ACTIVE" },
    { id: "4", name: "อาจารย์สมชาย ปัญญาดี", email: "teacher.somchai@cric.ac.th", role: "ครูผู้สอน (TEACHER)", status: "ACTIVE" },
    { id: "5", name: "นางสาวศิริพร บุญช่วย", email: "staff.admin@cric.ac.th", role: "เจ้าหน้าที่ธุรการ (STAFF)", status: "ACTIVE" },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 600);
  };

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>ผู้ดูแลระบบศูนย์สารสนเทศ</span>
              <span className="text-slate-600">•</span>
              <span className="text-purple-400">Admin Control Center 2569</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight flex items-center space-x-3">
              <span>การตั้งค่าศูนย์ควบคุมระบบ</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 font-mono font-medium">
                macOS Master Hub
              </span>
            </h1>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border border-purple-400/30"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
            ) : (
              <Save className="w-4 h-4 text-purple-200" />
            )}
            <span>บันทึกการตั้งค่าทั้งหมด</span>
          </button>
        </div>

        {/* Save Success Alert */}
        {saveSuccess && (
          <div className="glass-island border border-emerald-500/30 rounded-3xl p-4 flex items-center justify-between text-emerald-200 shadow-xl bg-emerald-950/30 animate-fade-in backdrop-blur-xl">
            <div className="flex items-center space-x-3 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-300">บันทึกการตั้งค่าระบบเรียบร้อยแล้ว!</p>
                <p className="text-slate-300 text-xs">การเปลี่ยนแปลงมีผลบังคับใช้กับบริการคลาวด์และอุปกรณ์ทั้งหมดในทันที</p>
              </div>
            </div>
            <button
              onClick={() => setSaveSuccess(false)}
              className="text-xs font-bold px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl border border-emerald-500/30 transition-colors"
            >
              ปิด
            </button>
          </div>
        )}

        {/* Apple Capsule Horizontal Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 glass-island p-2 rounded-2xl border border-white/10 shadow-lg">
          {[
            { id: "COLLEGE", label: "ข้อมูลสถานศึกษา", icon: Building2 },
            { id: "GEOFENCE", label: "พิกัด GPS & Wi-Fi", icon: MapPin },
            { id: "INTEGRATION", label: "API & เชื่อมต่อภายนอก", icon: KeyRound },
            { id: "USERS", label: "จัดการผู้ใช้ & สิทธิ์", icon: Users },
            { id: "SYSTEM", label: "ฐานข้อมูล & สำรองข้อมูล", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white shadow-md border border-white/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: College Settings */}
        {activeTab === "COLLEGE" && (
          <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white text-base">ข้อมูลทั่วไปของสถานศึกษา</h2>
                <p className="text-xs text-slate-400 mt-0.5">ใช้สำหรับหัวจดหมายบันทึกข้อความราชการและเอกสารรายงานของวิทยาลัย</p>
              </div>
              <Building2 className="w-5 h-5 text-purple-400" />
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ชื่อสถานศึกษา (ภาษาไทย)</label>
                  <input
                    type="text"
                    value={collegeSettings.collegeNameTh}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, collegeNameTh: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-2xl glass-input text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ชื่อสถานศึกษา (ภาษาอังกฤษ)</label>
                  <input
                    type="text"
                    value={collegeSettings.collegeNameEn}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, collegeNameEn: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-2xl glass-input text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">รหัสสถานศึกษา (10 หลัก)</label>
                  <input
                    type="text"
                    value={collegeSettings.schoolCode}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, schoolCode: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-cyan-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ปีการศึกษาปัจจุบัน</label>
                  <input
                    type="text"
                    value={collegeSettings.academicYear}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, academicYear: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-cyan-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ภาคเรียนปัจจุบัน</label>
                  <select
                    value={collegeSettings.currentTerm}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, currentTerm: e.target.value })}
                    className="w-full text-xs font-bold p-3 rounded-2xl glass-input text-white focus:outline-none"
                  >
                    <option value="1" className="bg-[#111827] text-white">ภาคเรียนที่ 1</option>
                    <option value="2" className="bg-[#111827] text-white">ภาคเรียนที่ 2</option>
                    <option value="3" className="bg-[#111827] text-white">ภาคเรียนฤดูร้อน (Summer)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ชื่อผู้อำนวยการสถานศึกษา</label>
                  <input
                    type="text"
                    value={collegeSettings.directorName}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, directorName: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-2xl glass-input text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">เบอร์โทรศัพท์สถานศึกษา / งานสารบรรณ</label>
                  <input
                    type="text"
                    value={collegeSettings.phone}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, phone: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-2xl glass-input text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">ที่ตั้งสถานศึกษา</label>
                <textarea
                  rows={2}
                  value={collegeSettings.address}
                  onChange={(e) => setCollegeSettings({ ...collegeSettings, address: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl glass-input text-slate-300 focus:outline-none font-sarabun"
                />
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Geofencing & Wi-Fi Settings */}
        {activeTab === "GEOFENCE" && (
          <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white text-base">การตั้งค่าพิกัด Geofencing & เครือข่าย Wi-Fi</h2>
                <p className="text-xs text-slate-400 mt-0.5">ใช้สำหรับคำนวณระยะตรวจจับการลงเวลาปฏิบัติราชการ (Apple Radar)</p>
              </div>
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">ละติจูด (Latitude)</label>
                <input
                  type="text"
                  value={geofenceSettings.latitude}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, latitude: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">ลองจิจูด (Longitude)</label>
                <input
                  type="text"
                  value={geofenceSettings.longitude}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, longitude: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">รัศมีที่อนุญาต (เมตร)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={geofenceSettings.radiusMeters}
                    onChange={(e) => setGeofenceSettings({ ...geofenceSettings, radiusMeters: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-3 rounded-2xl glass-input text-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">เมตร</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                รายชื่อ Wi-Fi SSID สถานศึกษาที่อนุญาต (คั่นด้วยเครื่องหมายจุลภาค ,)
              </label>
              <input
                type="text"
                value={geofenceSettings.allowedWifi}
                onChange={(e) => setGeofenceSettings({ ...geofenceSettings, allowedWifi: e.target.value })}
                className="w-full text-xs font-mono p-3 rounded-2xl glass-input text-cyan-300"
              />
              <p className="text-[11px] text-slate-400 mt-1">หากอุปกรณ์ครูเชื่อมต่อ Wi-Fi เหล่านี้จะถือว่าอยู่ในบริเวณสถานศึกษาโดยอัตโนมัติ</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3 border-t border-white/10">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">เวลาเริ่มตัดสาย (เช้า)</label>
                <input
                  type="time"
                  value={geofenceSettings.morningLateTime}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, morningLateTime: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-2xl glass-input text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">เวลาตัดขาด (เช้า)</label>
                <input
                  type="time"
                  value={geofenceSettings.morningAbsentTime}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, morningAbsentTime: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-2xl glass-input text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">เวลาอนุญาตให้เช็คเอาท์ (เย็น)</label>
                <input
                  type="time"
                  value={geofenceSettings.afternoonCheckOutTime}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, afternoonCheckOutTime: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-2xl glass-input text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: API & Integrations */}
        {activeTab === "INTEGRATION" && (
          <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white text-base">การเชื่อมต่อระบบภายนอก (Integrations & API Keys)</h2>
                <p className="text-xs text-slate-400 mt-0.5">การตั้งค่าเชื่อมต่อกับ LINE Official Account, Google Workspace และ ศธ.02</p>
              </div>
              <KeyRound className="w-5 h-5 text-emerald-400" />
            </div>

            {/* LINE OA */}
            <div className="p-5 rounded-2xl glass-card border border-emerald-500/20 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-black text-xs px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">LINE OA</span>
                <span className="font-bold text-xs text-white">การแจ้งเตือนผู้ปกครองผ่าน LINE Messaging API</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">LINE Channel ID</label>
                  <input
                    type="text"
                    value={integrations.lineChannelId}
                    onChange={(e) => setIntegrations({ ...integrations, lineChannelId: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl glass-input text-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">LINE Channel Secret</label>
                  <input
                    type="password"
                    value={integrations.lineChannelSecret}
                    onChange={(e) => setIntegrations({ ...integrations, lineChannelSecret: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl glass-input text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Google Workspace */}
            <div className="p-5 rounded-2xl glass-card border border-blue-500/20 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-black text-xs px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">Google SSO</span>
                <span className="font-bold text-xs text-white">Single Sign-On ด้วยเมลทางการสถานศึกษา</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Domain ที่อนุญาต</label>
                  <input
                    type="text"
                    value={integrations.googleDomain}
                    onChange={(e) => setIntegrations({ ...integrations, googleDomain: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl glass-input text-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">OAuth Client ID</label>
                  <input
                    type="text"
                    value={integrations.googleClientId}
                    onChange={(e) => setIntegrations({ ...integrations, googleClientId: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl glass-input text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Legacy RMS Migration Source */}
            <div className="p-5 rounded-2xl glass-card border border-amber-500/20 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-black text-xs px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">Legacy RMS Bridge</span>
                <span className="font-bold text-xs text-white">ฐานข้อมูล RMS เดิมสำหรับดึงประวัติ (MySQL Database)</span>
              </div>
              <input
                type="text"
                value={integrations.legacyRmsHost}
                onChange={(e) => setIntegrations({ ...integrations, legacyRmsHost: e.target.value })}
                className="w-full text-xs font-mono p-2.5 rounded-xl glass-input text-amber-300"
              />
            </div>
          </div>
        )}

        {/* Tab 4: User & RBAC Management */}
        {activeTab === "USERS" && (
          <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="font-bold text-white text-base">จัดการบัญชีผู้ใช้และกำหนดสิทธิ์ (RBAC)</h2>
                <p className="text-xs text-slate-400 mt-0.5">ควบคุมสิทธิ์ตามโครงสร้างหน่วยงานราชการอาชีวศึกษา</p>
              </div>

              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto shadow-md">
                <Plus className="w-4 h-4" />
                <span>เพิ่มผู้ใช้งานใหม่</span>
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {users.map((u) => (
                <div key={u.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center font-bold text-xs shadow-inner">
                      {u.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">{u.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-400/25">
                      {u.role}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/25">
                      {u.status}
                    </span>
                    <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: System & Backup */}
        {activeTab === "SYSTEM" && (
          <div className="glass-island rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white text-base">ระบบฐานข้อมูลและการสำรองข้อมูล (Database & Backup)</h2>
                <p className="text-xs text-slate-400 mt-0.5">จัดการสำรองข้อมูล PostgreSQL และสถิติสถานะเซิร์ฟเวอร์</p>
              </div>
              <Server className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl glass-card border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ฐานข้อมูลหลัก</span>
                <p className="text-sm font-black text-white mt-1">PostgreSQL 16 Alpine</p>
                <p className="text-xs text-emerald-400 font-bold mt-1">✓ พอร์ต 5435 (Docker Container)</p>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue & Cache</span>
                <p className="text-sm font-black text-white mt-1">Redis 7 Alpine</p>
                <p className="text-xs text-emerald-400 font-bold mt-1">✓ พอร์ต 6385 (Docker Container)</p>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">พื้นที่จัดเก็บข้อมูล</span>
                <p className="text-sm font-black text-white mt-1">Docker Volume Data</p>
                <p className="text-xs text-cyan-400 font-bold mt-1">ความปลอดภัยสูง พร้อมเข้ารหัส</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4">
              <button
                onClick={() => alert("กำลังเตรียมไฟล์สำรองข้อมูล PostgreSQL (SQL Dump)...")}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 border border-cyan-400/20"
              >
                <Download className="w-4 h-4 text-white" />
                <span>ดาวน์โหลดไฟล์สำรองฐานข้อมูล (1-Click SQL Dump)</span>
              </button>

              <button
                onClick={() => alert("ล้างแคช Redis สำเร็จแล้ว")}
                className="px-5 py-3 rounded-2xl glass-card hover:bg-white/10 text-slate-200 font-bold text-xs flex items-center space-x-2 transition-all border border-white/10"
              >
                <RefreshCw className="w-4 h-4 text-slate-400" />
                <span>ล้างแคชระบบ (Flush Redis Cache)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
