"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export interface TermDetail {
  totalWeeks: number;
  startDate: string;
  endDate: string;
  midtermWeek: number;
  midtermDate: string;
  finalWeek: number;
  finalDate: string;
  gradeDeadline: string;
  status: "OPEN" | "EXAM" | "CLOSED";
  note: string;
}

export interface TermCalendarSettings {
  academicYear: string;
  semester: string;
  vc: TermDetail;
  hvc: TermDetail;
}

export interface CollegeSettings {
  collegeNameTh: string;
  collegeNameEn: string;
  schoolCode: string;
  currentTerm: string;
  academicYear: string;
  directorName: string;
  phone: string;
  email: string;
  address: string;
}

export interface GeofenceSettings {
  latitude: string;
  longitude: string;
  radiusMeters: string;
  allowedWifi: string;
  morningLateTime: string;
  morningAbsentTime: string;
  afternoonCheckOutTime: string;
}

export interface IntegrationSettings {
  lineChannelId: string;
  lineChannelSecret: string;
  googleDomain: string;
  googleClientId: string;
  std02ApiEndpoint: string;
  legacyRmsHost: string;
}

export interface AllSettingsPayload {
  termCalendarSettings: TermCalendarSettings;
  collegeSettings: CollegeSettings;
  geofenceSettings: GeofenceSettings;
  integrations: IntegrationSettings;
}

// 1. Load All Settings & Users directly from MySQL
export async function getAllSettingsAction() {
  try {
    // 1. Fetch system settings
    const settings = await prisma.systemSetting.findMany();
    const map = new Map<string, string>();
    settings.forEach((s) => map.set(s.key, s.value));

    // 2. Fetch academic terms from MySQL
    const terms = await prisma.academicTerm.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    const vcDb = terms.find((t) => t.level.includes("ปวช"));
    const hvcDb = terms.find((t) => t.level.includes("ปวส"));

    // 3. Fetch real users from DB
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        personnelProfile: true,
        studentProfile: {
          include: { classroom: true },
        },
      },
    });

    const formattedUsers = users.map((u) => {
      let roleLabel = u.role as string;
      if (u.role === "SUPERADMIN") roleLabel = "ผู้ดูแลระบบสูงสุด (SUPERADMIN)";
      else if (u.role === "EXECUTIVE") roleLabel = u.personnelProfile?.position || "ผู้บริหาร (EXECUTIVE)";
      else if (u.role === "HEAD_DEPARTMENT") roleLabel = u.personnelProfile?.position || "หัวหน้าแผนกวิชา (HEAD_DEPT)";
      else if (u.role === "TEACHER") roleLabel = u.personnelProfile?.position || "ครูผู้สอน (TEACHER)";
      else if (u.role === "STAFF") roleLabel = u.personnelProfile?.position || "เจ้าหน้าที่ (STAFF)";
      else if (u.role === "STUDENT") roleLabel = `นักเรียน/นักศึกษา (${u.studentProfile?.classroom?.name || ""})`;

      return {
        id: u.id,
        name: u.fullName,
        email: u.email,
        phone: u.phone || "-",
        role: roleLabel,
        rawRole: u.role,
        status: u.isActive ? "ACTIVE" : "INACTIVE",
        createdAt: u.createdAt.toISOString(),
      };
    });

    // Parse stored settings or return defaults
    let collegeSettings: CollegeSettings = {
      collegeNameTh: "วิทยาลัยอาชีวศึกษา CRiC",
      collegeNameEn: "Chiang Rai Commercial Vocational College",
      schoolCode: "1350020101",
      currentTerm: "1",
      academicYear: "2569",
      directorName: "ดร.สมเกียรติ ยิ่งเจริญ",
      phone: "053-711234",
      email: "contact@cric.ac.th",
      address: "เลขที่ 123 ถนนพหลโยธิน ตำบลเวียง อำเภอเมือง จังหวัดเชียงราย 57000",
    };

    if (map.has("COLLEGE_SETTINGS")) {
      try {
        collegeSettings = { ...collegeSettings, ...JSON.parse(map.get("COLLEGE_SETTINGS")!) };
      } catch (e) {}
    }

    let geofenceSettings: GeofenceSettings = {
      latitude: "19.907200",
      longitude: "99.832500",
      radiusMeters: "200",
      allowedWifi: "CRIC-STAFF, CRIC-WiFi, CRIC-Teacher",
      morningLateTime: "08:00",
      morningAbsentTime: "08:30",
      afternoonCheckOutTime: "16:30",
    };

    if (map.has("GEOFENCE_SETTINGS")) {
      try {
        geofenceSettings = { ...geofenceSettings, ...JSON.parse(map.get("GEOFENCE_SETTINGS")!) };
      } catch (e) {}
    }

    let integrations: IntegrationSettings = {
      lineChannelId: "2001928472",
      lineChannelSecret: "••••••••••••••••••••••••••••••••",
      googleDomain: "cric.ac.th",
      googleClientId: "948271029384-cric.apps.googleusercontent.com",
      std02ApiEndpoint: "https://std2018.vec.go.th/api/v2",
      legacyRmsHost: "192.168.1.200:3306 (MySQL 5.7)",
    };

    if (map.has("INTEGRATION_SETTINGS")) {
      try {
        integrations = { ...integrations, ...JSON.parse(map.get("INTEGRATION_SETTINGS")!) };
      } catch (e) {}
    }

    // Term Calendar settings
    let termCalendarSettings: TermCalendarSettings = {
      academicYear: "2569",
      semester: "1",
      vc: {
        totalWeeks: 18,
        startDate: "2026-08-17",
        endDate: "2026-12-18",
        midtermWeek: 9,
        midtermDate: "2026-10-12",
        finalWeek: 18,
        finalDate: "2026-12-14",
        gradeDeadline: "2026-12-25",
        status: "OPEN",
        note: "จัดการเรียนการสอนในสถานศึกษาเต็มเวลา 18 สัปดาห์ ตามระเบียบ สอศ. 2569",
      },
      hvc: {
        totalWeeks: 15,
        startDate: "2026-08-17",
        endDate: "2026-11-27",
        midtermWeek: 8,
        midtermDate: "2026-10-05",
        finalWeek: 15,
        finalDate: "2026-11-23",
        gradeDeadline: "2026-12-04",
        status: "OPEN",
        note: "เรียนในสถานศึกษา 15 สัปดาห์ + เตรียมฝึกงาน/ปฏิบัติงานในสถานประกอบการ 3 สัปดาห์",
      },
    };

    if (map.has("CALENDAR_SETTINGS")) {
      try {
        termCalendarSettings = { ...termCalendarSettings, ...JSON.parse(map.get("CALENDAR_SETTINGS")!) };
      } catch (e) {}
    }

    // Merge directly from AcademicTerm table if available
    if (vcDb) {
      termCalendarSettings.vc.startDate = vcDb.startDate.toISOString().split("T")[0];
      termCalendarSettings.vc.endDate = vcDb.endDate.toISOString().split("T")[0];
      termCalendarSettings.vc.totalWeeks = vcDb.totalWeeks;
      if (vcDb.midtermDate) termCalendarSettings.vc.midtermDate = vcDb.midtermDate.toISOString().split("T")[0];
      if (vcDb.finalDate) termCalendarSettings.vc.finalDate = vcDb.finalDate.toISOString().split("T")[0];
      if (vcDb.gradeDeadline) termCalendarSettings.vc.gradeDeadline = vcDb.gradeDeadline.toISOString().split("T")[0];
      if (vcDb.status) termCalendarSettings.vc.status = vcDb.status as any;
      if (vcDb.note) termCalendarSettings.vc.note = vcDb.note;
    }

    if (hvcDb) {
      termCalendarSettings.hvc.startDate = hvcDb.startDate.toISOString().split("T")[0];
      termCalendarSettings.hvc.endDate = hvcDb.endDate.toISOString().split("T")[0];
      termCalendarSettings.hvc.totalWeeks = hvcDb.totalWeeks;
      if (hvcDb.midtermDate) termCalendarSettings.hvc.midtermDate = hvcDb.midtermDate.toISOString().split("T")[0];
      if (hvcDb.finalDate) termCalendarSettings.hvc.finalDate = hvcDb.finalDate.toISOString().split("T")[0];
      if (hvcDb.gradeDeadline) termCalendarSettings.hvc.gradeDeadline = hvcDb.gradeDeadline.toISOString().split("T")[0];
      if (hvcDb.status) termCalendarSettings.hvc.status = hvcDb.status as any;
      if (hvcDb.note) termCalendarSettings.hvc.note = hvcDb.note;
    }

    return {
      success: true,
      collegeSettings,
      geofenceSettings,
      integrations,
      termCalendarSettings,
      users: formattedUsers,
    };
  } catch (error: any) {
    console.error("Error loading settings from DB:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// 2. Save All Settings to MySQL (SystemSetting + AcademicTerm)
export async function saveAllSettingsAction(payload: AllSettingsPayload) {
  try {
    const { collegeSettings, geofenceSettings, integrations, termCalendarSettings } = payload;

    // 1. Save SystemSetting table
    await prisma.$transaction([
      prisma.systemSetting.upsert({
        where: { key: "COLLEGE_SETTINGS" },
        update: { value: JSON.stringify(collegeSettings), category: "COLLEGE" },
        create: { key: "COLLEGE_SETTINGS", value: JSON.stringify(collegeSettings), category: "COLLEGE" },
      }),
      prisma.systemSetting.upsert({
        where: { key: "GEOFENCE_SETTINGS" },
        update: { value: JSON.stringify(geofenceSettings), category: "GEOFENCE" },
        create: { key: "GEOFENCE_SETTINGS", value: JSON.stringify(geofenceSettings), category: "GEOFENCE" },
      }),
      prisma.systemSetting.upsert({
        where: { key: "INTEGRATION_SETTINGS" },
        update: { value: JSON.stringify(integrations), category: "INTEGRATION" },
        create: { key: "INTEGRATION_SETTINGS", value: JSON.stringify(integrations), category: "INTEGRATION" },
      }),
      prisma.systemSetting.upsert({
        where: { key: "CALENDAR_SETTINGS" },
        update: { value: JSON.stringify(termCalendarSettings), category: "CALENDAR" },
        create: { key: "CALENDAR_SETTINGS", value: JSON.stringify(termCalendarSettings), category: "CALENDAR" },
      }),
    ]);

    // 2. Upsert AcademicTerm table in MySQL for ปวช. (18 Weeks)
    const vcStart = new Date(termCalendarSettings.vc.startDate + "T00:00:00.000Z");
    const vcEnd = new Date(termCalendarSettings.vc.endDate + "T23:59:59.000Z");
    const vcMidterm = termCalendarSettings.vc.midtermDate
      ? new Date(termCalendarSettings.vc.midtermDate + "T00:00:00.000Z")
      : null;
    const vcFinal = termCalendarSettings.vc.finalDate
      ? new Date(termCalendarSettings.vc.finalDate + "T00:00:00.000Z")
      : null;
    const vcDeadline = termCalendarSettings.vc.gradeDeadline
      ? new Date(termCalendarSettings.vc.gradeDeadline + "T23:59:59.000Z")
      : null;

    await prisma.academicTerm.upsert({
      where: {
        level_term_academicYear: {
          level: "ปวช.",
          term: termCalendarSettings.semester || "1",
          academicYear: termCalendarSettings.academicYear || "2569",
        },
      },
      update: {
        totalWeeks: termCalendarSettings.vc.totalWeeks || 18,
        startDate: vcStart,
        endDate: vcEnd,
        midtermWeek: termCalendarSettings.vc.midtermWeek,
        midtermDate: vcMidterm,
        finalWeek: termCalendarSettings.vc.finalWeek,
        finalDate: vcFinal,
        gradeDeadline: vcDeadline,
        status: termCalendarSettings.vc.status,
        note: termCalendarSettings.vc.note,
        isActive: true,
      },
      create: {
        level: "ปวช.",
        term: termCalendarSettings.semester || "1",
        academicYear: termCalendarSettings.academicYear || "2569",
        totalWeeks: termCalendarSettings.vc.totalWeeks || 18,
        startDate: vcStart,
        endDate: vcEnd,
        midtermWeek: termCalendarSettings.vc.midtermWeek,
        midtermDate: vcMidterm,
        finalWeek: termCalendarSettings.vc.finalWeek,
        finalDate: vcFinal,
        gradeDeadline: vcDeadline,
        status: termCalendarSettings.vc.status,
        note: termCalendarSettings.vc.note,
        isActive: true,
      },
    });

    // 3. Upsert AcademicTerm table in MySQL for ปวส. (15 Weeks)
    const hvcStart = new Date(termCalendarSettings.hvc.startDate + "T00:00:00.000Z");
    const hvcEnd = new Date(termCalendarSettings.hvc.endDate + "T23:59:59.000Z");
    const hvcMidterm = termCalendarSettings.hvc.midtermDate
      ? new Date(termCalendarSettings.hvc.midtermDate + "T00:00:00.000Z")
      : null;
    const hvcFinal = termCalendarSettings.hvc.finalDate
      ? new Date(termCalendarSettings.hvc.finalDate + "T00:00:00.000Z")
      : null;
    const hvcDeadline = termCalendarSettings.hvc.gradeDeadline
      ? new Date(termCalendarSettings.hvc.gradeDeadline + "T23:59:59.000Z")
      : null;

    await prisma.academicTerm.upsert({
      where: {
        level_term_academicYear: {
          level: "ปวส.",
          term: termCalendarSettings.semester || "1",
          academicYear: termCalendarSettings.academicYear || "2569",
        },
      },
      update: {
        totalWeeks: termCalendarSettings.hvc.totalWeeks || 15,
        startDate: hvcStart,
        endDate: hvcEnd,
        midtermWeek: termCalendarSettings.hvc.midtermWeek,
        midtermDate: hvcMidterm,
        finalWeek: termCalendarSettings.hvc.finalWeek,
        finalDate: hvcFinal,
        gradeDeadline: hvcDeadline,
        status: termCalendarSettings.hvc.status,
        note: termCalendarSettings.hvc.note,
        isActive: true,
      },
      create: {
        level: "ปวส.",
        term: termCalendarSettings.semester || "1",
        academicYear: termCalendarSettings.academicYear || "2569",
        totalWeeks: termCalendarSettings.hvc.totalWeeks || 15,
        startDate: hvcStart,
        endDate: hvcEnd,
        midtermWeek: termCalendarSettings.hvc.midtermWeek,
        midtermDate: hvcMidterm,
        finalWeek: termCalendarSettings.hvc.finalWeek,
        finalDate: hvcFinal,
        gradeDeadline: hvcDeadline,
        status: termCalendarSettings.hvc.status,
        note: termCalendarSettings.hvc.note,
        isActive: true,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/attendance");
    revalidatePath("/academics");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "บันทึกการตั้งค่าทั้งหมดลงฐานข้อมูล MySQL (new_rms_cric_2026) สำเร็จเรียบร้อยแล้ว!",
    };
  } catch (error: any) {
    console.error("Error saving settings to DB:", error);
    return {
      success: false,
      error: error.message || "เกิดข้อผิดพลาดในการบันทึกลงฐานข้อมูล",
    };
  }
}

// 3. Get Active Academic Terms directly from MySQL
export async function getAcademicCalendarAction() {
  try {
    const terms = await prisma.academicTerm.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    const vcDb = terms.find((t) => t.level.includes("ปวช"));
    const hvcDb = terms.find((t) => t.level.includes("ปวส"));

    const vc = {
      totalWeeks: vcDb?.totalWeeks || 18,
      startDate: vcDb?.startDate ? vcDb.startDate.toISOString().split("T")[0] : "2026-08-17",
      endDate: vcDb?.endDate ? vcDb.endDate.toISOString().split("T")[0] : "2026-12-18",
      midtermWeek: vcDb?.midtermWeek || 9,
      midtermDate: vcDb?.midtermDate ? vcDb.midtermDate.toISOString().split("T")[0] : "2026-10-12",
      finalWeek: vcDb?.finalWeek || 18,
      finalDate: vcDb?.finalDate ? vcDb.finalDate.toISOString().split("T")[0] : "2026-12-14",
      gradeDeadline: vcDb?.gradeDeadline ? vcDb.gradeDeadline.toISOString().split("T")[0] : "2026-12-25",
      status: (vcDb?.status as any) || "OPEN",
      note: vcDb?.note || "จัดการเรียนการสอนในสถานศึกษาเต็มเวลา 18 สัปดาห์ ตามระเบียบ สอศ. 2569",
    };

    const hvc = {
      totalWeeks: hvcDb?.totalWeeks || 15,
      startDate: hvcDb?.startDate ? hvcDb.startDate.toISOString().split("T")[0] : "2026-08-17",
      endDate: hvcDb?.endDate ? hvcDb.endDate.toISOString().split("T")[0] : "2026-11-27",
      midtermWeek: hvcDb?.midtermWeek || 8,
      midtermDate: hvcDb?.midtermDate ? hvcDb.midtermDate.toISOString().split("T")[0] : "2026-10-05",
      finalWeek: hvcDb?.finalWeek || 15,
      finalDate: hvcDb?.finalDate ? hvcDb.finalDate.toISOString().split("T")[0] : "2026-11-23",
      gradeDeadline: hvcDb?.gradeDeadline ? hvcDb.gradeDeadline.toISOString().split("T")[0] : "2026-12-04",
      status: (hvcDb?.status as any) || "OPEN",
      note: hvcDb?.note || "เรียนในสถานศึกษา 15 สัปดาห์ + เตรียมฝึกงาน/ปฏิบัติงานในสถานประกอบการ 3 สัปดาห์",
    };

    return {
      success: true,
      academicYear: vcDb?.academicYear || "2569",
      semester: vcDb?.term || "1",
      vc,
      hvc,
    };
  } catch (error: any) {
    console.error("Error in getAcademicCalendarAction:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// 4. Save Class Period Attendance batch into MySQL
export async function saveClassPeriodAttendanceBatchAction(payload: {
  courseCode: string;
  courseName: string;
  period: number;
  weekNumber: number;
  date: string;
  records: Array<{
    studentCode: string;
    studentName: string;
    status: "PRESENT" | "LATE" | "LEAVE" | "ABSENT";
  }>;
}) {
  try {
    const attendanceDate = new Date(payload.date + "T00:00:00.000Z");

    for (const rec of payload.records) {
      const student = await prisma.studentProfile.findFirst({
        where: { studentCode: rec.studentCode },
      });

      if (student) {
        await prisma.classPeriodAttendance.create({
          data: {
            studentId: student.id,
            courseCode: payload.courseCode,
            courseName: payload.courseName,
            period: payload.period,
            weekNumber: payload.weekNumber,
            date: attendanceDate,
            status: rec.status,
            remarks: `บันทึกเช็คชื่อสัปดาห์ที่ ${payload.weekNumber}`,
          },
        });
      }
    }

    revalidatePath("/attendance/class");
    revalidatePath("/attendance");
    revalidatePath("/attendance/reports");
    revalidatePath("/dashboard");

    return {
      success: true,
      count: payload.records.length,
      message: `บันทึกเวลาเรียนรายวิชา ${payload.courseCode} สัปดาห์ที่ ${payload.weekNumber} จำนวน ${payload.records.length} คน เรียบร้อยแล้ว`,
    };
  } catch (error: any) {
    console.error("Error saving class attendance:", error);
    return {
      success: false,
      error: error.message || "เกิดข้อผิดพลาดในการบันทึกเวลาเรียน",
    };
  }
}
