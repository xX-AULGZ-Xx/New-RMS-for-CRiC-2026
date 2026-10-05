"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  Check,
  Sparkles,
  Calendar,
  LogOut,
  Command
} from "lucide-react";
import Link from "next/link";

const DEMO_USERS = [
  { id: "1", name: "ดร.สมเกียรติ ยิ่งเจริญ", role: "ผู้อำนวยการวิทยาลัย", email: "director@cric.ac.th", badge: "ผอ", color: "from-blue-600 to-indigo-600" },
  { id: "2", name: "นายวิเชียร มุ่งมั่น", role: "รองผู้อำนวยการฝ่ายวิชาการ", email: "deputy.academic@cric.ac.th", badge: "รอง", color: "from-indigo-600 to-purple-600" },
  { id: "3", name: "นายประสิทธิ์ นวัตกรรม", role: "หัวหน้าแผนก IT", email: "head.it@cric.ac.th", badge: "หน", color: "from-emerald-600 to-teal-600" },
  { id: "4", name: "อาจารย์สมชาย ปัญญาดี", role: "ครูที่ปรึกษา ปวช. 1/1", email: "teacher.somchai@cric.ac.th", badge: "ครู", color: "from-amber-600 to-orange-600" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]);

  return (
    <div className="h-screen h-[100dvh] bg-[#090d16] text-slate-100 flex font-prompt relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Ambient background glows for macOS Glassmorphism */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/2 right-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Sidebar (Fit H) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Floating Capsule Top Header (Dynamic Island / Capsule) */}
        <header className="shrink-0 z-30 mx-3 sm:mx-6 my-2 h-14 glass-island rounded-2xl px-4 flex items-center justify-between shadow-lg">
          {/* Left: Mobile Toggle & Spotlight Search shortcut */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 transition-colors cursor-pointer">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>ค้นหาเอกสารสารบรรณ, รหัสนักศึกษา หรือคำสั่งการ...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 rounded-md border border-white/15 font-mono text-slate-300">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Action Capsule */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Academic Badge */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/25 text-cyan-300 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>ภาคเรียนที่ 1 / 2569</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setRoleDropdownOpen(false);
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl relative transition-colors"
                title="การแจ้งเตือน"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-island rounded-3xl p-4 z-50 animate-in fade-in slide-in-from-top-2 border border-white/15 shadow-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h4 className="font-bold text-xs text-white">การแจ้งเตือนระบบ (3 รายการ)</h4>
                    <span className="text-[10px] text-cyan-400 font-semibold cursor-pointer hover:underline">อ่านทั้งหมด</span>
                  </div>
                  <div className="divide-y divide-white/5 text-xs">
                    <div className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-rose-400">หนังสือด่วนมาก</span>
                        <span className="text-slate-400">5 นาทีที่แล้ว</span>
                      </div>
                      <p className="font-semibold text-slate-200 text-[11px] line-clamp-1">
                        ขออนุมัติโครงการสัมมนาเชิงปฏิบัติการ AI 2569
                      </p>
                      <p className="text-slate-400 text-[10px]">ส่งต่อจาก รอง ผอ.วิชาการ ถึง ผอ.</p>
                    </div>

                    <div className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-emerald-400">กิจกรรมหน้าเสาธง</span>
                        <span className="text-slate-400">08:15 น.</span>
                      </div>
                      <p className="font-semibold text-slate-200 text-[11px]">
                        เช็คชื่อ ปวช. 1/1 เรียบร้อย (มา 4 ขาด 1)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setNotificationOpen(false);
                }}
                className="flex items-center space-x-2.5 p-1 pr-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${currentUser.color} text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/20 shadow-sm`}>
                  {currentUser.badge}
                </div>
                <div className="hidden sm:block">
                  <p className="font-bold text-white text-xs leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{currentUser.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 glass-island rounded-3xl p-2 z-50 animate-in fade-in slide-in-from-top-2 border border-white/15 shadow-2xl">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                      สลับบทบาทผู้ใช้งาน (Role Simulator)
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">เลือกบทบาทเพื่อทดสอบสิทธิ์ในระบบ</p>
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
                          className={`w-full flex items-center justify-between p-2 rounded-2xl text-left text-xs transition-colors ${
                            isSelected ? "bg-blue-600/40 text-white font-bold border border-blue-500/30" : "hover:bg-white/5 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${user.color} text-white flex items-center justify-center text-[10px] font-bold ring-1 ring-white/20`}>
                              {user.badge}
                            </span>
                            <div>
                              <p className="font-semibold text-slate-200">{user.name}</p>
                              <p className="text-[10px] text-slate-400">{user.role}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-1 overflow-y-auto px-2 sm:px-4 py-2">
          {children}
        </main>
      </div>
    </div>
  );
}
