"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
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
  FileCheck,
  Compass,
  Radio,
  History
} from "lucide-react";

export default function HrPage() {
  const [activeTab, setActiveTab] = useState<"CHECKIN" | "LEAVE">("CHECKIN");

  // Geofencing state (CRiC College: 19.9072 N, 99.8325 E)
  const [currentCoords, setCurrentCoords] = useState({ lat: 19.9073, lng: 99.8326 });
  const [wifiSsid, setWifiSsid] = useState("CRIC-STAFF");
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null);
  const [timeLogs, setTimeLogs] = useState([
    { id: 1, type: "เข้าปฏิบัติราชการ", time: "07:48 น.", date: "5 ต.ค. 2569", status: "VERIFIED", loc: "รัศมี 22 เมตร (CRIC-STAFF)" },
    { id: 2, type: "ออกปฏิบัติราชการ", time: "16:32 น.", date: "4 ต.ค. 2569", status: "VERIFIED", loc: "รัศมี 28 เมตร (CRIC-STAFF)" },
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

  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>กลุ่มงานบริหารงานบุคคล</span>
              <span>•</span>
              <span className="text-amber-600">Smart HR & Geofencing 2569</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              ระบบลงเวลาปฏิบัติราชการ & บริหารวันลาออนไลน์
            </h1>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab("CHECKIN")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === "CHECKIN"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>ลงเวลา GPS Geofencing</span>
            </button>

            <button
              onClick={() => setActiveTab("LEAVE")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === "LEAVE"
                  ? "bg-white text-slate-900 shadow-xs"
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
            {/* Interactive Radar & GPS Verification Card (Left 6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-7 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5 text-amber-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">การตรวจสอบสถานที่สถานศึกษา</h3>
                    <p className="text-xs text-slate-400">วิทยาลัยอาชีวศึกษา CRiC</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
                  พิกัดตรงตามเกณฑ์
                </span>
              </div>

              {/* Simulated Visual Radar Screen */}
              <div className="relative h-44 rounded-2xl bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center overflow-hidden border border-slate-800">
                {/* Radar Grid Circles */}
                <div className="absolute w-64 h-64 border border-blue-500/20 rounded-full animate-radar-ring"></div>
                <div className="absolute w-44 h-44 border border-blue-500/30 rounded-full"></div>
                <div className="absolute w-24 h-24 border border-blue-500/40 rounded-full"></div>

                {/* College Center Point */}
                <div className="absolute flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 flex items-center justify-center ring-4 ring-blue-500/30">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-bold mt-1 bg-slate-900/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    CRiC Campus Center
                  </span>
                </div>

                {/* Staff User Beacon */}
                <div className="absolute top-12 right-24 flex items-center space-x-1.5 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 text-[10px] text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>คุณอยู่ที่นี่ (~22ม.)</span>
                </div>
              </div>

              {/* Status parameters */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>พิกัด GPS อุปกรณ์:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">19.9073 N, 99.8326 E</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Wi-Fi สถานศึกษา:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">{wifiSsid} (ยืนยันแล้ว)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-purple-600" />
                    <span>ระยะห่างจากศูนย์กลาง:</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-600">~22 เมตร (อนุญาต &le; 200 ม.)</span>
                </div>
              </div>

              {checkInStatus && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold">{checkInStatus}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleCheckIn("CHECK_IN")}
                  className="py-4 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-500/20 flex flex-col items-center justify-center space-y-1 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Clock className="w-5 h-5 mb-1" />
                  <span>ลงเวลาเข้าปฏิบัติราชการ</span>
                  <span className="text-[10px] text-emerald-200 font-normal">เช็คอินช่วงเช้า</span>
                </button>

                <button
                  onClick={() => handleCheckIn("CHECK_OUT")}
                  className="py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/20 flex flex-col items-center justify-center space-y-1 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Clock className="w-5 h-5 mb-1" />
                  <span>ลงเวลาออกปฏิบัติราชการ</span>
                  <span className="text-[10px] text-blue-200 font-normal">เช็คเอาท์ช่วงเย็น</span>
                </button>
              </div>
            </div>

            {/* Attendance History (Right 6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-7 space-y-5">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <History className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-900 text-sm">ประวัติการลงเวลาของฉัน</h3>
              </div>

              <div className="divide-y divide-slate-100">
                {timeLogs.map((log) => (
                  <div key={log.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">{log.type}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          ✓ ยืนยันพิกัด
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-sarabun">{log.date} • {log.loc}</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Leave Request Form */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="font-black text-slate-900 text-lg">ยื่นคำขอลาออนไลน์ (Online Leave Request)</h3>
              <p className="text-xs text-slate-400 mt-0.5">ระบบจะส่งต่อไปยังหัวหน้าแผนกและรองผู้อำนวยการเพื่อพิจารณาอนุมัติ</p>
            </div>

            {leaveSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold">ส่งคำขอลาเรียบร้อยแล้ว!</p>
                  <p className="text-emerald-700">ระบบได้แจ้งเตือนหัวหน้างานเพื่อพิจารณาอนุมัติตามลำดับขั้น</p>
                </div>
              </div>
            )}

            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ประเภทการลา</label>
                <select
                  value={leaveType}
                  onChange={(e: any) => setLeaveType(e.target.value)}
                  className="w-full text-xs font-bold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="SICK">ลาป่วย (Sick Leave)</option>
                  <option value="BUSINESS">ลากิจส่วนตัว (Personal Business Leave)</option>
                  <option value="VACATION">ลาพักผ่อน (Vacation Leave)</option>
                  <option value="OFFICIAL_DUTY">ไปราชการ / ประชุมอบรม (Official Duty)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ตั้งแต่วันที่</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ถึงวันที่</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">เหตุผลประกอบการลา</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="ระบุเหตุผล เช่น ติดภารกิจราชการ / มีอาการไข้หวัดพบแพทย์..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-sarabun"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                ส่งคำขอลาออนไลน์
              </button>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
