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
  LogOut
} from "lucide-react";
import Link from "next/link";

const DEMO_USERS = [
  { id: "1", name: "ดร.สมเกียรติ ยิ่งเจริญ", role: "ผู้อำนวยการวิทยาลัย", email: "director@cric.ac.th", badge: "ผอ", color: "bg-blue-600" },
  { id: "2", name: "นายวิเชียร มุ่งมั่น", role: "รองผู้อำนวยการฝ่ายวิชาการ", email: "deputy.academic@cric.ac.th", badge: "รอง", color: "bg-indigo-600" },
  { id: "3", name: "นายประสิทธิ์ นวัตกรรม", role: "หัวหน้าแผนก IT", email: "head.it@cric.ac.th", badge: "หน", color: "bg-emerald-600" },
  { id: "4", name: "อาจารย์สมชาย ปัญญาดี", role: "ครูที่ปรึกษา ปวช. 1/1", email: "teacher.somchai@cric.ac.th", badge: "ครู", color: "bg-amber-600" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]);

  return (
    <div className="min-h-screen flex bg-slate-50/70 font-prompt">
      {/* Sidebar Component */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
          {/* Left: Mobile hamburger & search shortcut */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/60">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>ค้นหาเอกสารสารบรรณ หรือ รหัสนักศึกษา...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white rounded border border-slate-300 font-mono text-slate-500">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Academic Term Badge */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200/60">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>ภาคเรียนที่ 1 / 2569</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setRoleDropdownOpen(false);
                }}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors border border-transparent hover:border-slate-200"
                title="การแจ้งเตือน"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900">การแจ้งเตือนระบบ (3 รายการ)</h4>
                    <span className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">อ่านทั้งหมด</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[10px]">
                        <span className="font-bold text-rose-600">หนังสือด่วนมาก</span>
                        <span>5 นาทีที่แล้ว</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-[11px] line-clamp-1">
                        ขออนุมัติโครงการสัมมนาเชิงปฏิบัติการ AI 2569
                      </p>
                      <p className="text-slate-400 text-[10px]">ส่งต่อจาก รอง ผอ.วิชาการ ถึง ผอ.</p>
                    </div>

                    <div className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[10px]">
                        <span className="font-bold text-emerald-600">กิจกรรมหน้าเสาธง</span>
                        <span>08:15 น.</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-[11px]">
                        เช็คชื่อ ปวช. 1/1 เรียบร้อย (มา 4 ขาด 1)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setNotificationOpen(false);
                }}
                className="flex items-center space-x-2.5 p-1.5 pr-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-all text-left group"
              >
                <div className={`w-8 h-8 rounded-lg ${currentUser.color} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {currentUser.badge}
                </div>
                <div className="hidden sm:block">
                  <p className="font-bold text-slate-800 text-xs leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{currentUser.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      สลับบทบาทผู้ใช้งาน (Role Simulator)
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">เลือกบทบาทเพื่อทดสอบสิทธิ์ในระบบ</p>
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
                            isSelected ? "bg-blue-50 text-blue-900 font-bold" : "hover:bg-slate-50 text-slate-700"
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
                          {isSelected && <Check className="w-4 h-4 text-blue-600" />}
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
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
