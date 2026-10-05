"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import {
  User,
  UserCheck,
  GraduationCap,
  Briefcase,
  Calendar,
  Award,
  Medal,
  TrendingUp,
  Trophy,
  Clock,
  ClipboardList,
  Flame,
  FileText,
  FileCheck,
  RefreshCw,
  Search,
  AlertTriangle,
  Video,
  CheckCircle2,
  X,
  MapPin,
  Wifi,
  Radio,
  Building
} from "lucide-react";
import { staffCheckInAction, submitLeaveAction } from "@/lib/actions";

export default function PersonnelPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Geofencing state (CRiC College: 19.9072 N, 99.8325 E)
  const [currentCoords, setCurrentCoords] = useState({ lat: 19.9073, lng: 99.8326 });
  const [wifiSsid, setWifiSsid] = useState("CRIC-STAFF");
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null);
  const [timeLogs, setTimeLogs] = useState([
    { id: 1, type: "เข้าปฏิบัติราชการ", time: "07:48 น.", date: "5 ต.ค. 2569", status: "VERIFIED", loc: "รัศมี 22 เมตร (CRIC-STAFF)" },
    { id: 2, type: "ออกปฏิบัติราชการ", time: "16:32 น.", date: "4 ต.ค. 2569", status: "VERIFIED", loc: "รัศมี 28 เมตร (CRIC-STAFF)" },
  ]);

  // Leave Form state
  const [leaveType, setLeaveType] = useState<"SICK" | "BUSINESS" | "VACATION" | "OFFICIAL_DUTY">("SICK");
  const [startDate, setStartDate] = useState("2026-10-10");
  const [endDate, setEndDate] = useState("2026-10-10");
  const [reason, setReason] = useState("");
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  const handleCheckIn = async (type: "CHECK_IN" | "CHECK_OUT") => {
    const res = await staffCheckInAction({
      userEmail: "teacher.somchai@cric.ac.th",
      type,
      latitude: currentCoords.lat,
      longitude: currentCoords.lng,
      wifiSsid,
    });

    if (res.success) {
      setCheckInStatus(type === "CHECK_IN" ? "บันทึกเวลาเข้าปฏิบัติราชการเรียบร้อย!" : "บันทึกเวลาออกปฏิบัติราชการเรียบร้อย!");
      setTimeLogs((prev) => [
        {
          id: Date.now(),
          type: type === "CHECK_IN" ? "เข้าปฏิบัติราชการ" : "ออกปฏิบัติราชการ",
          time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.",
          date: "5 ต.ค. 2569",
          status: "VERIFIED",
          loc: `รัศมี ${res.distanceMeters || 18} เมตร (${wifiSsid})`,
        },
        ...prev,
      ]);
    }
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await submitLeaveAction({
      userEmail: "teacher.somchai@cric.ac.th",
      leaveType,
      startDate,
      endDate,
      totalDays: 1,
      reason,
    });

    if (res.success) {
      setLeaveSuccess(true);
      setReason("");
    }
  };

  // 17 Authentic Modules from CRiC RMS
  const hrModules = [
    // Row 1
    {
      id: "profile",
      title: "รายละเอียดส่วนตัว",
      desc: "ข้อมูลทั่วไป ประวัติส่วนตัว และข้อมูลติดต่อ",
      icon: User,
      color: "bg-blue-50 text-blue-600",
      action: () => setActiveModal("profile"),
    },
    {
      id: "edit-profile",
      title: "แก้ไขรายละเอียดส่วนตัว",
      desc: "ปรับปรุงเบอร์โทร อีเมล ที่อยู่ และรูปภาพ",
      icon: UserCheck,
      color: "bg-cyan-50 text-cyan-600",
      action: () => setActiveModal("profile"),
    },
    {
      id: "education",
      title: "ข้อมูลด้านประวัติการศึกษา",
      desc: "ระดับปริญญา สาขาวิชา และสถาบันที่สำเร็จ",
      icon: GraduationCap,
      color: "bg-amber-50 text-amber-600",
      action: () => alert("แสดงข้อมูลประวัติการศึกษา: ปริญญาโท กศ.ม. เทคโนโลยีและสื่อสารการศึกษา"),
    },
    {
      id: "duty-role",
      title: "ตำแหน่งหน้าที่รับผิดชอบ",
      desc: "ภาระงานสอน งานพิเศษ และคำสั่งแต่งตั้ง",
      icon: Briefcase,
      color: "bg-purple-50 text-purple-600",
      action: () => alert("ตำแหน่ง: ครูชำนาญการพิเศษ • แผนกวิชาเทคโนโลยีสารสนเทศ"),
    },

    // Row 2
    {
      id: "leave-history",
      title: "ประวัติการลา & ยื่นใบลา",
      desc: "สถิติวันลาคงเหลือ และขอลาออนไลน์",
      icon: Calendar,
      color: "bg-rose-50 text-rose-600",
      badge: "ออนไลน์",
      action: () => setActiveModal("leave"),
    },
    {
      id: "training",
      title: "ประวัติการฝึกอบรม",
      desc: "หลักสูตรพัฒนาวิชาชีพ และชั่วโมงสะสม",
      icon: Award,
      color: "bg-orange-50 text-orange-600",
      action: () => alert("ประวัติการอบรมล่าสุด: สัมมนา AI for Education (สอศ. 12 ชม.)"),
    },
    {
      id: "decorations",
      title: "ประวัติเครื่องราชฯ",
      desc: "บันทึกชั้นตราเครื่องราชอิสริยาภรณ์",
      icon: Medal,
      color: "bg-yellow-50 text-yellow-600",
      action: () => alert("ชั้นตราเครื่องราชฯ: ต.ช. (ตริตาภรณ์ช้างเผือก)"),
    },
    {
      id: "salary",
      title: "ประวัติการเลื่อนขั้นเงินเดือน",
      desc: "คำสั่งเลื่อนขั้นเงินเดือนและฐานเงินเดือน",
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
      action: () => alert("คำสั่งเลื่อนขั้นเงินเดือนล่าสุด: 1 ตุลาคม 2568 (ร้อยละ 3.1)"),
    },

    // Row 3
    {
      id: "honors",
      title: "รางวัลเกียรติยศ / เชิดชูเกียรติ",
      desc: "รางวัลครูดีเด่น ผลงานสร้างชื่อเสียงให้ วอช.",
      icon: Trophy,
      color: "bg-amber-50 text-amber-600",
      action: () => alert("รางวัล: ครูผู้สอนดีเด่น ระดับอาชีวศึกษาจังหวัดเชียงราย"),
    },
    {
      id: "checkin-gps",
      title: "ลงชื่อ และตรวจสอบปฏิบัติงาน",
      desc: "GPS Geofencing รัศมีวิทยาลัย & สแกนนิ้ว",
      icon: Clock,
      color: "bg-emerald-50 text-emerald-600",
      badge: "GPS Smart",
      action: () => setActiveModal("checkin"),
    },
    {
      id: "daily-duty",
      title: "บันทึกการปฏิบัติหน้าที่ประจำวัน",
      desc: "บันทึกเวรยามกลางวัน/กลางคืน และกิจกรรม",
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
      action: () => alert("บันทึกการปฏิบัติหน้าที่ประจำวัน: ตรวจเวรยามประตูหน้าวิทยาลัย"),
    },
    {
      id: "scouts",
      title: "ข้อมูลคุณวุฒิ ผลงานด้านลูกเสือ",
      desc: "วุฒิบัตร Wood Badge และกิจกรรมลูกเสือ",
      icon: Flame,
      color: "bg-teal-50 text-teal-600",
      action: () => alert("คุณวุฒิลูกเสือ: L.T.C. ผู้บังคับบัญชาลูกเสือวิสามัญ"),
    },

    // Row 4
    {
      id: "create-memo",
      title: "พิมพ์เอกสารบันทึกข้อความ",
      desc: "สร้างร่างบันทึกข้อความเสนอ ผอ. ออนไลน์",
      icon: FileText,
      color: "bg-sky-50 text-sky-600",
      action: () => window.location.href = "/edoc",
    },
    {
      id: "check-memos",
      title: "ตรวจสอบบันทึกข้อความรออนุมัติ",
      desc: "หนังสือเกษียณที่บุคคลอื่นส่งมาถึงท่าน",
      icon: FileCheck,
      color: "bg-indigo-50 text-indigo-600",
      badge: "รอลงนาม 3",
      action: () => window.location.href = "/edoc",
    },
    {
      id: "transfer-data",
      title: "ถ่ายโอนข้อมูลจากสถานศึกษาเดิม",
      desc: "ดึงข้อมูลประวัติครูย้ายเข้าจากระบบอาชีวะ",
      icon: RefreshCw,
      color: "bg-slate-100 text-slate-700",
      action: () => alert("ระบบพร้อมถ่ายโอนข้อมูลประวัติจาก สอศ. หรือวิทยาลัยเดิม"),
    },
    {
      id: "contacts-schedule",
      title: "ค้นหาข้อมูลติดต่อ & ตารางสอน",
      desc: "เบอร์ภายในบุคลากร และตารางสอนครู",
      icon: Search,
      color: "bg-violet-50 text-violet-600",
      action: () => alert("ค้นหาเบอร์โทรภายในวิทยาลัยการอาชีพเชียงราย"),
    },

    // Row 5
    {
      id: "alerts-center",
      title: "ศูนย์กลางการแจ้งเตือน",
      desc: "แจ้งเตือนงานด่วนและประกาศสถานศึกษา",
      icon: AlertTriangle,
      color: "bg-rose-50 text-rose-600",
      action: () => alert("ศูนย์กลางการแจ้งเตือน: ไม่มีรายการค้างคาเกินกำหนด"),
    },
  ];

  return (
    <AppShell>
      {/* Background with watermark gear style similar to CRiC RMS */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Module Title Header Banner (เหมือน CRiC RMS เป๊ะ) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-700 to-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  ระบบบุคลากร
                </h1>
                <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                  CRiC RMS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                วิทยาลัยการอาชีพเชียงราย • การบริหารจัดการข้อมูลและภาระงานบุคลากร
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert("เปิดวิดีโอแนะนำการใช้งานระบบ New RMS วิทยาลัยการอาชีพเชียงราย")}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span>วิดีโอแนะนำการใช้งาน</span>
            </button>
          </div>
        </div>

        {/* 17 Authentic Grid Cards (4 columns layout like legacy RMS, but with modern 2026 aesthetics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {hrModules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={m.action}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-red-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${m.color} group-hover:scale-110 transition-transform shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {m.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white rounded-full shadow-xs">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-red-700 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-red-600 transition-colors">
                  <span>เข้าสู่เมนู</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL 1: GPS Check-in Modal */}
        {activeModal === "checkin" && (
          <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-slate-900 text-base">ลงชื่อและตรวจสอบข้อมูลปฏิบัติงาน</h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status parameters */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>พิกัด GPS อุปกรณ์:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">19.9073 N, 99.8326 E</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Wi-Fi วิทยาลัย:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">{wifiSsid} (ยืนยันแล้ว)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-purple-600" />
                    <span>ระยะห่าง:</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-600">~22 เมตร (รัศมีตรงเกณฑ์)</span>
                </div>
              </div>

              {checkInStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{checkInStatus}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleCheckIn("CHECK_IN")}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex flex-col items-center"
                >
                  <span>ลงเวลาเข้าปฏิบัติงาน</span>
                  <span className="text-[10px] text-emerald-200">เช้า (Check-In)</span>
                </button>
                <button
                  onClick={() => handleCheckIn("CHECK_OUT")}
                  className="py-3 px-4 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex flex-col items-center"
                >
                  <span>ลงเวลาออกปฏิบัติงาน</span>
                  <span className="text-[10px] text-rose-200">เย็น (Check-Out)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: Leave Request Modal */}
        {activeModal === "leave" && (
          <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-slate-900 text-base">ยื่นคำขอลาออนไลน์</h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {leaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ส่งคำขอลาไปยังผู้บริหารเรียบร้อยแล้ว</span>
                </div>
              )}

              <form onSubmit={handleLeaveSubmit} className="space-y-4 text-xs font-prompt">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ประเภทการลา</label>
                  <select
                    value={leaveType}
                    onChange={(e: any) => setLeaveType(e.target.value)}
                    className="w-full font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="SICK">ลาป่วย</option>
                    <option value="BUSINESS">ลากิจส่วนตัว</option>
                    <option value="VACATION">ลาพักผ่อน</option>
                    <option value="OFFICIAL_DUTY">ไปราชการ / ประชุมอบรม</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ตั้งแต่วันที่</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ถึงวันที่</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">เหตุผลประกอบการลา</label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="ระบุเหตุผล..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold transition-all"
                >
                  ยืนยันยื่นใบขอลา
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: Profile Details Modal */}
        {activeModal === "profile" && (
          <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-base">รายละเอียดข้อมูลส่วนตัว</h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">ชื่อ - สกุล:</span>
                  <span className="font-bold text-slate-800">นายณัฐพงศ์ มะโนรัง</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">ตำแหน่ง:</span>
                  <span className="font-bold text-slate-800">ครู คศ.3 (ชำนาญการพิเศษ)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">แผนกวิชา:</span>
                  <span className="font-bold text-slate-800">เทคโนโลยีสารสนเทศ</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">สังกัด:</span>
                  <span className="font-bold text-red-700">วิทยาลัยการอาชีพเชียงราย</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">อีเมลทางการ:</span>
                  <span className="font-mono text-slate-800">nattapong@cric.ac.th</span>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
