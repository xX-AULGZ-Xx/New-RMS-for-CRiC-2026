"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  Award,
  Fingerprint,
  Megaphone,
  BookOpen,
  DollarSign,
  Package,
  CalendarDays,
  Car,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  FolderGit2,
  CalendarCheck
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "ระบบบุคลากร", href: "/hr", icon: Users, color: "text-amber-400" },
    { name: "ระบบนักเรียน", href: "/attendance", icon: GraduationCap, color: "text-orange-400" },
    { name: "ระบบสารบรรณ", href: "/edoc", icon: FileText, color: "text-blue-400", badge: "3" },
    { name: "ระบบวัดผล และหลักสูตร", href: "/academics", icon: BarChart3, color: "text-cyan-400" },
    { name: "ระบบประเมิน (PA)", href: "/evaluation", icon: Award, color: "text-yellow-400" },
    { name: "ระบบสแกน & ลงเวลา", href: "/hr?tab=checkin", icon: Fingerprint, color: "text-emerald-400" },
    { name: "ระบบประชาสัมพันธ์", href: "/pr", icon: Megaphone, color: "text-pink-400" },
    { name: "ระบบถอดถอนรายวิชา", href: "/drop-courses", icon: BookOpen, color: "text-sky-400", badge: "7" },
    { name: "ระบบโครงการ งานวิจัยฯ", href: "/research", icon: FolderGit2, color: "text-indigo-400" },
    { name: "ระบบการเงินสถานศึกษา", href: "/finance", icon: DollarSign, color: "text-emerald-400" },
    { name: "ระบบพัสดุ / ครุภัณฑ์", href: "/inventory", icon: Package, color: "text-teal-400" },
    { name: "ระบบงานกิจกรรม", href: "/activities", icon: CalendarCheck, color: "text-amber-400" },
    { name: "ระบบจองห้องประชุม/รถ", href: "/booking", icon: Car, color: "text-blue-400" },
    { name: "ระบบผู้ดูแลระบบ", href: "/admin", icon: Settings, color: "text-purple-400" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container (Dark Navy Slate matching CRiC RMS) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#1e293b] text-slate-200 border-r border-slate-700/60 flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:static ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Top Header of Sidebar */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-700/80 bg-[#0f172a]">
          <Link href="/dashboard" className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-700 to-red-600 flex items-center justify-center text-white font-black shadow-md shadow-red-500/30 flex-shrink-0">
              CR
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-white tracking-tight text-sm">New RMS</span>
                  <span className="text-[9px] font-black uppercase bg-red-900/80 text-rose-300 border border-red-700/60 px-1.5 py-0.5 rounded-full">
                    2569
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 truncate">วอช.เชียงราย (CRiC)</p>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white items-center justify-center transition-colors"
            title={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.name : undefined}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
                  isActive
                    ? "bg-red-700 text-white shadow-md shadow-red-900/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : item.color}`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span className="px-2 py-0.2 text-[10px] font-black bg-rose-600 text-white rounded-full shadow-xs">
                    {item.badge}
                  </span>
                )}

                {/* Dot badge on collapsed */}
                {collapsed && item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#1e293b]"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Log Out */}
        <div className="p-3 border-t border-slate-700/80 bg-[#0f172a]">
          {!collapsed ? (
            <Link
              href="/"
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 text-xs font-bold transition-all border border-slate-700/40"
            >
              <div className="flex items-center space-x-2">
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>ออกจากระบบ</span>
              </div>
              <span className="text-[10px] text-slate-500">CRiC RMS</span>
            </Link>
          ) : (
            <div className="flex justify-center">
              <Link href="/" title="ออกจากระบบ" className="p-2 text-rose-400 hover:text-rose-300">
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
