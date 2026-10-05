"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  CalendarCheck,
  MapPin,
  GraduationCap,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Bell,
  LogOut,
  Sparkles,
  Search,
  ExternalLink
} from "lucide-react";
import { useState } from "react";

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

  const menuGroups = [
    {
      group: "ภาพรวม",
      items: [
        { name: "แดชบอร์ดหลัก", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      group: "งานบริหาร & บุคลากร",
      items: [
        { name: "สารบรรณอิเล็กทรอนิกส์", href: "/edoc", icon: FileText, badge: "3", badgeColor: "bg-rose-500" },
        { name: "ลงเวลาปฏิบัติงาน & ลา", href: "/hr", icon: MapPin },
      ],
    },
    {
      group: "กิจการนักเรียน & วิชาการ",
      items: [
        { name: "เช็คชื่อเข้าแถวหน้าเสาธง", href: "/attendance", icon: CalendarCheck },
        { name: "งานวิชาการ & ศธ.02", href: "/academics", icon: GraduationCap },
      ],
    },
    {
      group: "ผู้ดูแลระบบ",
      items: [
        { name: "ตั้งค่าระบบ (Admin)", href: "/admin", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-200/90 flex flex-col transition-all duration-300 ease-in-out shadow-xs lg:static ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header / Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20 flex-shrink-0">
              RC
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base">New RMS</span>
                  <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                    2569
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 truncate">วิทยาลัยอาชีวศึกษา CRiC</p>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 items-center justify-center transition-colors"
            title={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {group.group}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.name : undefined}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                        isActive
                          ? "bg-blue-50 text-blue-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <span className={`px-2 py-0.5 text-[10px] font-black text-white rounded-full ${item.badgeColor || "bg-blue-600"}`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Small dot badge when collapsed */}
                      {collapsed && item.badge && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / User Profile summary */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          {!collapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  ผอ
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">ดร.สมเกียรติ ยิ่งเจริญ</p>
                  <p className="text-[10px] text-slate-400 truncate">ผู้อำนวยการวิทยาลัย</p>
                </div>
              </div>
              <Link href="/" title="ออกจากระบบ / กลับหน้าแรก" className="text-slate-400 hover:text-rose-600 p-1 transition-colors">
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs" title="ดร.สมเกียรติ ยิ่งเจริญ (ผอ.)">
                ผอ
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
