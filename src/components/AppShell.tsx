"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import {
  Menu,
  Bell,
  Home,
  FileCheck2,
  QrCode,
  ChevronDown,
  Check,
  Search,
  ExternalLink,
  User,
  ShieldCheck,
  Video
} from "lucide-react";
import Link from "next/link";

const DEMO_USERS = [
  { id: "1", name: "นายณัฐพงศ์ มะโนรัง", role: "ครูชำนาญการพิเศษ", email: "nattapong@cric.ac.th", badge: "ณัฐ", color: "bg-red-700" },
  { id: "2", name: "ดร.สมเกียรติ ยิ่งเจริญ", role: "ผู้อำนวยการวิทยาลัย", email: "director@cric.ac.th", badge: "ผอ", color: "bg-amber-600" },
  { id: "3", name: "นายวิเชียร มุ่งมั่น", role: "รองผู้อำนวยการฝ่ายวิชาการ", email: "deputy.academic@cric.ac.th", badge: "รอง", color: "bg-indigo-600" },
  { id: "4", name: "นายประสิทธิ์ นวัตกรรม", role: "หัวหน้าแผนก IT", email: "head.it@cric.ac.th", badge: "หน", color: "bg-emerald-600" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-prompt">
      {/* Authentic Top Red Header (เหมือนระบบ RMS ของวิทยาลัยการอาชีพเชียงราย) */}
      <header className="sticky top-0 z-40 h-14 bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#991b1b] text-white px-4 flex items-center justify-between shadow-md">
        {/* Left: Hamburger menu toggle + College Name */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
            title="เปิด/ปิดเมนูด้านข้าง"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/dashboard" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1 shadow-sm">
              <span className="text-[10px] font-black text-red-700 leading-none">วอช</span>
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight drop-shadow-xs">
                วิทยาลัยการอาชีพเชียงราย
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] bg-red-950/60 px-2 py-0.5 rounded-full border border-red-400/30 text-rose-200">
                CRiC New RMS 2569
              </span>
            </div>
          </Link>
        </div>

        {/* Right Action Icons (Home, Notification, Summary, User Name, QR Code) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Home Icon */}
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition-colors"
            title="หน้าหลัก"
          >
            <Home className="w-4 h-4" />
          </Link>

          {/* Notification with Badge */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setRoleDropdownOpen(false);
              }}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 hover:text-white relative transition-colors"
              title="การแจ้งเตือน"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full ring-2 ring-red-800 animate-pulse"></span>
            </button>

            {/* Notification Popover */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-xs text-slate-900">ศูนย์กลางการแจ้งเตือน (3)</h4>
                  <span className="text-[10px] text-red-600 font-bold cursor-pointer hover:underline">อ่านทั้งหมด</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 space-y-1">
                    <span className="text-[10px] font-bold text-rose-600">หนังสือราชการส่งถึงท่าน</span>
                    <p className="font-semibold text-slate-800 text-[11px] line-clamp-1">
                      ขออนุมัติโครงการสัมมนา AI 2569 แผนกวิชา IT
                    </p>
                    <p className="text-slate-400 text-[10px]">เมื่อสักครู่</p>
                  </div>
                  <div className="py-2.5 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600">สแกนลงเวลาสำเร็จ</span>
                    <p className="font-semibold text-slate-800 text-[11px]">
                      ลงเวลาเข้าปฏิบัติราชการเรียบร้อย (07:48 น.)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* บทสรุป (Summary) Button */}
          <Link
            href="/dashboard"
            className="hidden md:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-white text-xs font-semibold transition-colors border border-white/10"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>บทสรุป</span>
          </Link>

          {/* User Name & Role Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setNotificationOpen(false);
              }}
              className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-black/25 hover:bg-black/35 text-white text-xs font-bold transition-all border border-white/15"
            >
              <User className="w-3.5 h-3.5 text-rose-200" />
              <span className="hidden sm:inline-block max-w-[130px] truncate">{currentUser.name}</span>
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    สลับบัญชีผู้ใช้งาน (Demo Switcher)
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">เลือกบทบาทสำหรับทดสอบสิทธิ์ในระบบ</p>
                </div>

                <div className="py-1 space-y-1">
                  {DEMO_USERS.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                          isSelected ? "bg-red-50 text-red-900 font-bold" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className={`w-6 h-6 rounded-md ${user.color} text-white flex items-center justify-center text-[10px] font-bold`}>
                            {user.badge}
                          </span>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-[10px] text-slate-400">{user.role}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-red-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* QR Code Scan Icon */}
          <button
            onClick={() => alert("ระบบเปิดสแกน QR Code ตรวจสอบเอกสารหรือเช็คชื่อเข้าแถว")}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white/90 hover:text-white transition-colors border border-white/10"
            title="สแกน QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
