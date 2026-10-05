"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CalendarCheck,
  MapPin,
  GraduationCap,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Award,
  BookOpen,
  FolderGit2,
  DollarSign,
  Package,
  Megaphone,
  Fingerprint
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

  const menuSections = [
    {
      title: "Core",
      items: [
        { name: "แดชบอร์ด", href: "/dashboard", icon: LayoutDashboard, glow: "group-hover:text-blue-400" },
        { name: "สารบรรณดิจิทัล", href: "/edoc", icon: FileText, badge: "3", badgeColor: "bg-rose-500", glow: "group-hover:text-rose-400" },
      ],
    },
    {
      title: "Campus & Staff",
      items: [
        { name: "เช็คชื่อหน้าเสาธง", href: "/attendance", icon: CalendarCheck, glow: "group-hover:text-emerald-400" },
        { name: "ลงเวลา & ลา (GPS)", href: "/hr", icon: MapPin, glow: "group-hover:text-amber-400" },
        { name: "วิชาการ (ศธ.02)", href: "/academics", icon: GraduationCap, glow: "group-hover:text-purple-400" },
      ],
    },
    {
      title: "System",
      items: [
        { name: "ตั้งค่าระบบ", href: "/admin", icon: Settings, glow: "group-hover:text-cyan-400" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      {/* Floating Island Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:my-3 lg:ml-3 lg:h-[calc(100vh-1.5rem)] glass-island rounded-3xl flex flex-col transition-all duration-300 ease-in-out lg:static ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${mobileOpen ? "translate-x-0 w-64 m-2" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand / Logo Capsule */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
          <Link href="/dashboard" className="flex items-center space-x-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/30 ring-1 ring-white/20 group-hover:scale-105 transition-transform flex-shrink-0">
              RC
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-white text-base tracking-tight">New RMS</span>
                  <span className="text-[9px] font-black uppercase bg-blue-500/20 text-cyan-300 border border-blue-400/30 px-1.5 py-0.5 rounded-full">
                    2569
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 truncate">CRiC Apple Glass Edition</p>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white items-center justify-center border border-white/5 transition-all"
            title={collapsed ? "ขยายแถบเมนู" : "ย่อแถบเมนู"}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Menu Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.name : undefined}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all relative ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/20"
                          : "text-slate-300 hover:text-white hover:bg-white/8"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400 " + item.glow}`} />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <span className={`px-2 py-0.5 text-[10px] font-black text-white rounded-full shadow-sm ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Collapsed dot badge */}
                      {collapsed && item.badge && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900"></span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Capsule Footer */}
        <div className="p-3 border-t border-white/10">
          {!collapsed ? (
            <div className="flex items-center justify-between p-2 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/20 flex-shrink-0">
                  ผอ
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">ดร.สมเกียรติ ยิ่งเจริญ</p>
                  <p className="text-[10px] text-slate-400 truncate">ผู้อำนวยการวิทยาลัย</p>
                </div>
              </div>
              <Link href="/" title="ออกจากระบบ" className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/20 shadow-md">
                ผอ
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
