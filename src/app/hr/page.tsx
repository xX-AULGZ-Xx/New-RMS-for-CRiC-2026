"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { staffCheckInAction, submitLeaveAction } from "@/lib/actions";
import {
  MapPin,
  Wifi,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  Send,
  Building,
  ShieldCheck,
  FileCheck
} from "lucide-react";

export default function HrPage() {
  const [activeTab, setActiveTab] = useState<"CHECKIN" | "LEAVE">("CHECKIN");

  // Geofencing state (mocked or browser navigator.geolocation)
  const [currentCoords, setCurrentCoords] = useState({ lat: 19.9073, lng: 99.8326 });
  const [wifiSsid, setWifiSsid] = useState("CRIC-STAFF");
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null);
  const [timeLogs, setTimeLogs] = useState([
    { id: 1, type: "เข้าปฏิบัติราชการ", time: "07:48 น.", date: "5 ต.ค. 2569", status: "VERIFIED", loc: "รัศมี 25 เมตร (CRIC-STAFF)" },
    { id: 2, type: "ออกปฏิบัติราชการ", time: "16:32 น.", date: "4 ต.ค. 2569", status: "VERIFIED", loc: "รัศมี 30 เมตร (CRIC-STAFF)" },
  ]);

  // Leave form state
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
      setCheckInStatus(type === "CHECK_IN" ? "บันทึกเวลาเข้าปฏิบัติราชการสำเร็จ!" : "บันทึกเวลาออกปฏิบัติราชการสำเร็จ!");
      setTimeLogs((prev) => [
        {
          id: Date.now(),
          type: type === "CHECK_IN" ? "เข้าปฏิบัติราชการ" : "ออกปฏิบัติราชการ",
          time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.",
          date: "5 ต.ค. 2569",
          status: "VERIFIED",
          loc: `รัศมี ${res.distanceMeters || 15} เมตร (${wifiSsid})`,
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase">
              <span>กลุ่มงานบริหารงานบุคคล</span>
              <span>•</span>
              <span className="text-amber-600">Smart HR & Geofencing</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              ระบบลงเวลาปฏิบัติราชการ & บริหารวันลาออนไลน์
            </h1>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab("CHECKIN")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === "CHECKIN"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>ลงเวลา GPS Geofencing</span>
            </button>

            <button
              onClick={() => setActiveTab("LEAVE")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === "LEAVE"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>ยื่นใบขอลาออนไลน์</span>
            </button>
          </div>
        </div>

        {activeTab === "CHECKIN" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Check-In Action Card (Left 6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    GPS
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">การตรวจสอบสถานที่และเครือข่าย</h3>
                    <p className="text-xs text-slate-500">วิทยาลัยอาชีวศึกษา CRiC</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
                  อยู่ในรัศมีวิทยาลัย
                </span>
              </div>

              {/* Status parameters */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>พิกัด GPS ปัจจุบัน:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-700">19.9073 N, 99.8326 E</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <Wifi className="w-4 h-4 text-emerald-600" />
                    <span>Wi-Fi สถานศึกษา:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-700">{wifiSsid} (เชื่อมต่อแล้ว)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span>ระยะห่างจากศูนย์กลาง:</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-600">~22 เมตร (อนุญาต &le; 200 ม.)</span>
                </div>
              </div>

              {checkInStatus && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold">{checkInStatus}</span>
                </div>
              )}

              {/* 2 Big Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleCheckIn("CHECK_IN")}
                  className="py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 flex flex-col items-center justify-center space-y-1 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Clock className="w-5 h-5 mb-1" />
                  <span>ลงเวลาเข้าปฏิบัติงาน</span>
                  <span className="text-[10px] text-emerald-200 font-normal">เช็คอินเช้า</span>
                </button>

                <button
                  onClick={() => handleCheckIn("CHECK_OUT")}
                  className="py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 flex flex-col items-center justify-center space-y-1 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Clock className="w-5 h-5 mb-1" />
                  <span>ลงเวลาออกปฏิบัติงาน</span>
                  <span className="text-[10px] text-blue-200 font-normal">เช็คเอาท์เย็น</span>
                </button>
              </div>
            </div>

            {/* Attendance History (Right 6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">ประวัติการลงเวลาล่าสุด</h3>
              <div className="divide-y divide-slate-100">
                {timeLogs.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">{log.type}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                          ถูกต้อง
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{log.date} • {log.loc}</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-slate-700">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Leave Request Form */
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="font-bold text-slate-900 text-base">ยื่นคำขอลาออนไลน์ (Leave Request)</h3>

            {leaveSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ส่งคำขอลาไปยังหัวหน้าแผนกและผู้บริหารเรียบร้อยแล้ว</span>
              </div>
            )}

            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ประเภทการลา</label>
                <select
                  value={leaveType}
                  onChange={(e: any) => setLeaveType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="SICK">ลาป่วย</option>
                  <option value="BUSINESS">ลากิจส่วนตัว</option>
                  <option value="VACATION">ลาพักผ่อน</option>
                  <option value="OFFICIAL_DUTY">ไปราชการ / อบรมพัฒนาวิชาชีพ</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ตั้งแต่วันที่</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ถึงวันที่</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">เหตุผลประกอบการลา</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="ระบุเหตุผล เช่น มีอาการไข้หวัดพบแพทย์..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
              >
                ส่งใบขอลาออนไลน์
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
