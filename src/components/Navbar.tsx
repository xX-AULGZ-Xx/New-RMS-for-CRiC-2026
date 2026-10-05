"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  CalendarCheck,
  MapPin,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Bell,
  Menu,
  X,
  Search,
  ChevronDown,
  UserCheck,
  Check,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";

const DEMO_USERS = [
  { id: "1", name: "ดร.สมเกียรติ ยิ่งเจริญ", role: "ผู้อำนวยการวิทยาลัย", email: "director@cric.ac.th", badge: "ผอ", color: "bg-blue-600" },
  { id: "2", name: "นายวิเชียร มุ่งมั่น", role: "รองผู้อำนวยการฝ่ายวิชาการ", email: "deputy.academic@cric.ac.th", badge: "รอง", color: "bg-indigo-600" },
  { id: "3", name: "นายประสิทธิ์ นวัตกรรม", role: "หัวหน้าแผนก IT", email: "head.it@cric.ac.th", badge: "หน", color: "bg-emerald-600" },
  { id: "4", name: "อาจารย์สมชาย ปัญญาดี", role: "ครูที่ปรึกษา ปวช. 1/1", email: "teacher.somchai@cric.ac.th", badge: "ครู", color: "bg-amber-600" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const thaiDate = now.toLocaleDateString("th-TH", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const thaiTime = now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentTime(`${thaiDate} • ${thaiTime} น.`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: "แดชบอร์ด", href: "/dashboard", icon: LayoutDashboard },
    { name: "สารบรรณอิเล็กทรอนิกส์", href: "/edoc", icon: FileText, badge: "3" },
    { name: "เช็คชื่อนักเรียน", href: "/attendance", icon: CalendarCheck },
    { name: "ลงเวลา & ลา", href: "/hr", icon: MapPin },
    { name: "งานวิชาการ (ศธ.02)", href: "/academics", icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
                  RC
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-lg">New RMS</span>
                  <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded-full">
                    CRiC 2569
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 -mt-0.5">สถานศึกษาอาชีวศึกษา</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] font-black bg-rose-500 text-white rounded-full shadow-xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Live Clock */}
            <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-500 font-medium px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{currentTime || "พ.ศ. 2569"}</span>
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

              {/* Notification Popover */}
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
                <div className="hidden xl:block">
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

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-lg ${currentUser.color} text-white flex items-center justify-center font-bold text-xs`}>
              {currentUser.badge}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500">{currentUser.role}</p>
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
