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
  Edit2
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>ผู้ดูแลระบบ</span>
              <span>•</span>
              <span className="text-purple-600">Admin Control Center 2569</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              การตั้งค่าระบบ (System Configuration)
            </h1>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>บันทึกการตั้งค่าทั้งหมด</span>
          </button>
        </div>

        {/* Save Success Alert */}
        {saveSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-emerald-800 shadow-sm animate-fade-in">
            <div className="flex items-center space-x-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">บันทึกการตั้งค่าระบบเรียบร้อยแล้ว!</p>
                <p className="text-emerald-700">การเปลี่ยนแปลงมีผลบังคับใช้กับระบบในทันที</p>
              </div>
            </div>
            <button
              onClick={() => setSaveSuccess(false)}
              className="text-xs font-bold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              ปิด
            </button>
          </div>
        )}

        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
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
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-base">ข้อมูลทั่วไปของสถานศึกษา</h2>
              <p className="text-xs text-slate-400 mt-0.5">ใช้สำหรับหัวจดหมายบันทึกข้อความราชการและเอกสารรายงานของวิทยาลัย</p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ชื่อสถานศึกษา (ภาษาไทย)</label>
                  <input
                    type="text"
                    value={collegeSettings.collegeNameTh}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, collegeNameTh: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ชื่อสถานศึกษา (ภาษาอังกฤษ)</label>
                  <input
                    type="text"
                    value={collegeSettings.collegeNameEn}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, collegeNameEn: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">รหัสสถานศึกษา (10 หลัก)</label>
                  <input
                    type="text"
                    value={collegeSettings.schoolCode}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, schoolCode: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ปีการศึกษาปัจจุบัน</label>
                  <input
                    type="text"
                    value={collegeSettings.academicYear}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, academicYear: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ภาคเรียนปัจจุบัน</label>
                  <select
                    value={collegeSettings.currentTerm}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, currentTerm: e.target.value })}
                    className="w-full text-xs font-bold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="1">ภาคเรียนที่ 1</option>
                    <option value="2">ภาคเรียนที่ 2</option>
                    <option value="3">ภาคเรียนฤดูร้อน (Summer)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ชื่อผู้อำนวยการสถานศึกษา</label>
                  <input
                    type="text"
                    value={collegeSettings.directorName}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, directorName: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">เบอร์โทรศัพท์สถานศึกษา / งานสารบรรณ</label>
                  <input
                    type="text"
                    value={collegeSettings.phone}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, phone: e.target.value })}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ที่ตั้งสถานศึกษา</label>
                <textarea
                  rows={2}
                  value={collegeSettings.address}
                  onChange={(e) => setCollegeSettings({ ...collegeSettings, address: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-sarabun"
                />
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Geofencing & Wi-Fi Settings */}
        {activeTab === "GEOFENCE" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-base">การตั้งค่าพิกัด Geofencing & เครือข่าย Wi-Fi</h2>
              <p className="text-xs text-slate-400 mt-0.5">ใช้สำหรับตรวจสอบการลงเวลาปฏิบัติราชการของครูและบุคลากรผ่านสมาร์ทโฟน</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ละติจูด (Latitude)</label>
                <input
                  type="text"
                  value={geofenceSettings.latitude}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, latitude: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-3 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ลองจิจูด (Longitude)</label>
                <input
                  type="text"
                  value={geofenceSettings.longitude}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, longitude: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-3 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">รัศมีที่อนุญาต (เมตร)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={geofenceSettings.radiusMeters}
                    onChange={(e) => setGeofenceSettings({ ...geofenceSettings, radiusMeters: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">เมตร</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                รายชื่อ Wi-Fi SSID สถานศึกษาที่อนุญาต (คั่นด้วยเครื่องหมายจุลภาค ,)
              </label>
              <input
                type="text"
                value={geofenceSettings.allowedWifi}
                onChange={(e) => setGeofenceSettings({ ...geofenceSettings, allowedWifi: e.target.value })}
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-slate-50"
              />
              <p className="text-[11px] text-slate-400 mt-1">หากอุปกรณ์ครูเชื่อมต่อ Wi-Fi เหล่านี้จะถือว่าอยู่ในบริเวณสถานศึกษา</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">เวลาเริ่มตัดสาย (เช้า)</label>
                <input
                  type="time"
                  value={geofenceSettings.morningLateTime}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, morningLateTime: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">เวลาตัดขาด (เช้า)</label>
                <input
                  type="time"
                  value={geofenceSettings.morningAbsentTime}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, morningAbsentTime: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">เวลาอนุญาตให้เช็คเอาท์ (เย็น)</label>
                <input
                  type="time"
                  value={geofenceSettings.afternoonCheckOutTime}
                  onChange={(e) => setGeofenceSettings({ ...geofenceSettings, afternoonCheckOutTime: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: API & Integrations */}
        {activeTab === "INTEGRATION" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-base">การเชื่อมต่อระบบภายนอก (Integrations & API Keys)</h2>
              <p className="text-xs text-slate-400 mt-0.5">การตั้งค่าเชื่อมต่อกับ LINE Official Account, Google Workspace และ ศธ.02</p>
            </div>

            {/* LINE OA */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-black text-xs px-2 py-0.5 rounded bg-emerald-600 text-white">LINE OA</span>
                <span className="font-bold text-xs text-slate-800">การแจ้งเตือนผู้ปกครองผ่าน LINE Messaging API</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">LINE Channel ID</label>
                  <input
                    type="text"
                    value={integrations.lineChannelId}
                    onChange={(e) => setIntegrations({ ...integrations, lineChannelId: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">LINE Channel Secret</label>
                  <input
                    type="password"
                    value={integrations.lineChannelSecret}
                    onChange={(e) => setIntegrations({ ...integrations, lineChannelSecret: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Google Workspace */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-black text-xs px-2 py-0.5 rounded bg-blue-600 text-white">Google SSO</span>
                <span className="font-bold text-xs text-slate-800">Single Sign-On ด้วยเมลทางการสถานศึกษา</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Domain ที่อนุญาต</label>
                  <input
                    type="text"
                    value={integrations.googleDomain}
                    onChange={(e) => setIntegrations({ ...integrations, googleDomain: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">OAuth Client ID</label>
                  <input
                    type="text"
                    value={integrations.googleClientId}
                    onChange={(e) => setIntegrations({ ...integrations, googleClientId: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Legacy RMS Migration Source */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-black text-xs px-2 py-0.5 rounded bg-amber-600 text-white">Legacy RMS</span>
                <span className="font-bold text-xs text-slate-800">ฐานข้อมูล RMS เดิมสำหรับดึงประวัติ (MySQL Database)</span>
              </div>
              <input
                type="text"
                value={integrations.legacyRmsHost}
                onChange={(e) => setIntegrations({ ...integrations, legacyRmsHost: e.target.value })}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>
        )}

        {/* Tab 4: User & RBAC Management */}
        {activeTab === "USERS" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-black text-slate-900 text-base">จัดการบัญชีผู้ใช้และกำหนดสิทธิ์ (RBAC)</h2>
                <p className="text-xs text-slate-400 mt-0.5">ควบคุมสิทธิ์ตามโครงสร้างหน่วยงานราชการอาชีวศึกษา</p>
              </div>

              <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto shadow-xs">
                <Plus className="w-4 h-4" />
                <span>เพิ่มผู้ใช้งานใหม่</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {users.map((u) => (
                <div key={u.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {u.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{u.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {u.role}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {u.status}
                    </span>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
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
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-base">ระบบฐานข้อมูลและการสำรองข้อมูล (Database & Backup)</h2>
              <p className="text-xs text-slate-400 mt-0.5">จัดการสำรองข้อมูล PostgreSQL และสถิติสถานะเซิร์ฟเวอร์</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ฐานข้อมูลหลัก</span>
                <p className="text-sm font-black text-slate-900 mt-1">PostgreSQL 16 Alpine</p>
                <p className="text-xs text-emerald-600 font-bold mt-1">✓ พอร์ต 5435 (Docker)</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue & Cache</span>
                <p className="text-sm font-black text-slate-900 mt-1">Redis 7 Alpine</p>
                <p className="text-xs text-emerald-600 font-bold mt-1">✓ พอร์ต 6385 (Docker)</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">พื้นที่จัดเก็บข้อมูล</span>
                <p className="text-sm font-black text-slate-900 mt-1">Docker Volume Data</p>
                <p className="text-xs text-blue-600 font-bold mt-1">ความปลอดภัยสูง พร้อมสำรอง</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
              <button
                onClick={() => alert("กำลังเตรียมไฟล์สำรองข้อมูล PostgreSQL (SQL Dump)...")}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-2 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>ดาวน์โหลดไฟล์สำรองฐานข้อมูล (1-Click SQL Dump)</span>
              </button>

              <button
                onClick={() => alert("ล้างแคช Redis สำเร็จแล้ว")}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>ล้างแคชระบบ (Flush Redis Cache)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
