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
  UserCircle2,
  Bell,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "แดชบอร์ด", href: "/dashboard", icon: LayoutDashboard },
    { name: "สารบรรณอิเล็กทรอนิกส์", href: "/edoc", icon: FileText, badge: "3" },
    { name: "เช็คชื่อนักเรียน", href: "/attendance", icon: CalendarCheck },
    { name: "ลงเวลาปฏิบัติงาน & ลา", href: "/hr", icon: MapPin },
    { name: "งานวิชาการ & ศธ.02", href: "/academics", icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                RC
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-lg">New RMS</span>
                  <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">2026</span>
                </div>
                <p className="text-xs text-slate-500">วิทยาลัยอาชีวศึกษา CRiC</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[11px] font-semibold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Active Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              title="การแจ้งเตือน"
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                ผอ
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-800">ดร.สมเกียรติ ยิ่งเจริญ</p>
                <p className="text-slate-500">ผู้อำนวยการวิทยาลัย</p>
              </div>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-slate-500" />
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
          <div className="pt-3 border-t border-slate-100 flex items-center space-x-3 px-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
              ผอ
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">ดร.สมเกียรติ ยิ่งเจริญ</p>
              <p className="text-xs text-slate-500">ผู้อำนวยการสถานศึกษา (CRiC)</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
