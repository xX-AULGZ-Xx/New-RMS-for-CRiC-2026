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
  Sparkles,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";

const DEMO_USERS = [
  { id: "1", name: "ดร.สมเกียรติ ยิ่งเจริญ", role: "ผู้อำนวยการวิทยาลัย", email: "director@cric.ac.th", badge: "ผอ", color: "from-blue-600 to-indigo-600" },
  { id: "2", name: "นายวิเชียร มุ่งมั่น", role: "รองผู้อำนวยการฝ่ายวิชาการ", email: "deputy.academic@cric.ac.th", badge: "รอง", color: "from-indigo-600 to-purple-600" },
  { id: "3", name: "นายประสิทธิ์ นวัตกรรม", role: "หัวหน้าแผนก IT", email: "head.it@cric.ac.th", badge: "หน", color: "from-emerald-600 to-teal-600" },
  { id: "4", name: "อาจารย์สมชาย ปัญญาดี", role: "ครูที่ปรึกษา ปวช. 1/1", email: "teacher.somchai@cric.ac.th", badge: "ครู", color: "from-amber-600 to-orange-600" },
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
    { name: "งานวิชาการ", href: "/academics", icon: GraduationCap },
    { name: "ตั้งค่าระบบ", href: "/admin", icon: Settings },
  ];

  return (
    <header className="sticky top-2 z-50 mx-3 sm:mx-6 my-2 glass-island rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
                  RC
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#090d16] rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-white tracking-tight text-base">New RMS</span>
                  <span className="text-[10px] font-extrabold uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 px-1.5 py-0.2 rounded-full">
                    CRiC 2569
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 -mt-0.5">สถานศึกษาอาชีวศึกษา</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm border border-white/15"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
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
            <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-300 font-medium px-2.5 py-1 bg-white/5 border border-white/10 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{currentTime || "พ.ศ. 2569"}</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setRoleDropdownOpen(false);
                }}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl relative transition-colors border border-white/5"
                title="การแจ้งเตือน"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#090d16]"></span>
              </button>

              {/* Notification Popover */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-island rounded-3xl shadow-2xl border border-white/15 p-4 z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h4 className="font-bold text-xs text-white">การแจ้งเตือนระบบ (3 รายการ)</h4>
                    <span className="text-[10px] text-cyan-400 font-semibold cursor-pointer hover:underline">อ่านทั้งหมด</span>
                  </div>
                  <div className="divide-y divide-white/5 text-xs">
                    <div className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span className="font-bold text-rose-400">หนังสือด่วนมาก</span>
                        <span>5 นาทีที่แล้ว</span>
                      </div>
                      <p className="font-semibold text-white text-[11px] line-clamp-1">
                        ขออนุมัติโครงการสัมมนาเชิงปฏิบัติการ AI 2569
                      </p>
                      <p className="text-slate-400 text-[10px]">ส่งต่อจาก รอง ผอ.วิชาการ ถึง ผอ.</p>
                    </div>

                    <div className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span className="font-bold text-emerald-400">กิจกรรมหน้าเสาธง</span>
                        <span>08:15 น.</span>
                      </div>
                      <p className="font-semibold text-white text-[11px]">
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
                className="flex items-center space-x-2 pl-2 pr-3 py-1 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-xs"
              >
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${currentUser.color} flex items-center justify-center text-white font-black text-[10px] shadow-sm`}>
                  {currentUser.badge}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="font-bold text-white text-[11px] leading-tight">{currentUser.name}</p>
                  <p className="text-[9px] text-cyan-300 font-medium">{currentUser.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Dropdown Menu */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 glass-island rounded-3xl shadow-2xl border border-white/15 p-2 z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-2xl">
                  <div className="px-3 py-2 border-b border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      สลับบทบาทจำลอง (Role Simulator)
                    </span>
                  </div>
                  <div className="py-1">
                    {DEMO_USERS.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                          currentUser.id === user.id ? "bg-white/10 text-white font-bold" : "text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 text-left">
                          <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${user.color} flex items-center justify-center text-white font-black text-[10px]`}>
                            {user.badge}
                          </div>
                          <div>
                            <p className="text-xs">{user.name}</p>
                            <p className="text-[10px] text-slate-400">{user.role}</p>
                          </div>
                        </div>
                        {currentUser.id === user.id && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-xl bg-white/5 border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
