"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export interface TableMetric {
  name: string;
  thaiLabel: string;
  rowCount: number;
  category: "CORE" | "ACADEMIC" | "EDOC" | "LOG";
}

export interface DbStatusResponse {
  success: boolean;
  engine: string;
  database: string;
  host: string;
  status: "CONNECTED" | "ERROR";
  latencyMs: number;
  totalTables: number;
  totalRecords: number;
  tableMetrics: TableMetric[];
  recentBackups: Array<{
    id: string;
    fileName: string;
    fileSizeKb: number;
    type: string;
    status: string;
    executedBy: string;
    createdAt: string;
  }>;
  error?: string;
}

// 1. Get Live Database Connection Status and Table Metrics
export async function getDatabaseStatusAction(): Promise<DbStatusResponse> {
  const startTime = Date.now();
  try {
    // 1. Ping test
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;

    // 2. Count rows across models
    const [
      userCount,
      deptCount,
      classCount,
      termCount,
      personnelCount,
      studentCount,
      docCount,
      routingCount,
      sigCount,
      attendanceCount,
      periodAttendanceCount,
      timeLogCount,
      leaveCount,
      gateLogCount,
      backupLogCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.department.count(),
      prisma.classroom.count(),
      prisma.academicTerm.count(),
      prisma.personnelProfile.count(),
      prisma.studentProfile.count(),
      prisma.document.count(),
      prisma.documentRouting.count(),
      prisma.documentSignature.count(),
      prisma.studentAttendance.count(),
      prisma.classPeriodAttendance.count(),
      prisma.staffTimeLog.count(),
      prisma.leaveRequest.count(),
      prisma.smartGateLog.count(),
      prisma.systemBackupLog.count(),
    ]);

    const tableMetrics: TableMetric[] = [
      { name: "User", thaiLabel: "ผู้ใช้งานระบบทั้งหมด (Users)", rowCount: userCount, category: "CORE" },
      { name: "AcademicTerm", thaiLabel: "ภาคเรียนการศึกษา (ปวช./ปวส.)", rowCount: termCount, category: "ACADEMIC" },
      { name: "Department", thaiLabel: "แผนกวิชา / ฝ่ายงาน", rowCount: deptCount, category: "CORE" },
      { name: "Classroom", thaiLabel: "ห้องเรียน / กลุ่มเรียน", rowCount: classCount, category: "ACADEMIC" },
      { name: "StudentProfile", thaiLabel: "ทะเบียนนักเรียน-นักศึกษา", rowCount: studentCount, category: "ACADEMIC" },
      { name: "PersonnelProfile", thaiLabel: "ทะเบียนครูและบุคลากร", rowCount: personnelCount, category: "CORE" },
      { name: "StudentAttendance", thaiLabel: "บันทึกการมาเรียน (หน้าเสาธง/โฮมรูม)", rowCount: attendanceCount, category: "ACADEMIC" },
      { name: "ClassPeriodAttendance", thaiLabel: "เช็คชื่อรายคาบเรียน (Period)", rowCount: periodAttendanceCount, category: "ACADEMIC" },
      { name: "Document", thaiLabel: "สารบรรณอิเล็กทรอนิกส์ (E-Docs)", rowCount: docCount, category: "EDOC" },
      { name: "DocumentRouting", thaiLabel: "เส้นทางเกษียณหนังสือ (Routings)", rowCount: routingCount, category: "EDOC" },
      { name: "DocumentSignature", thaiLabel: "ลายเซ็นดิจิทัล SHA-256", rowCount: sigCount, category: "EDOC" },
      { name: "StaffTimeLog", thaiLabel: "บันทึกเวลาปฏิบัติราชการ (HR GPS)", rowCount: timeLogCount, category: "LOG" },
      { name: "LeaveRequest", thaiLabel: "การลาราชการของบุคลากร", rowCount: leaveCount, category: "LOG" },
      { name: "SmartGateLog", thaiLabel: "บันทึกประตูอัจฉริยะ (RFID/Face)", rowCount: gateLogCount, category: "LOG" },
      { name: "SystemBackupLog", thaiLabel: "ประวัติการสำรองฐานข้อมูล", rowCount: backupLogCount, category: "LOG" },
    ];

    const totalRecords = tableMetrics.reduce((sum, t) => sum + t.rowCount, 0);

    // 3. Fetch recent backups
    const recentLogs = await prisma.systemBackupLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const recentBackups = recentLogs.map((log) => ({
      id: log.id,
      fileName: log.fileName,
      fileSizeKb: log.fileSizeKb,
      type: log.type,
      status: log.status,
      executedBy: log.executedBy,
      createdAt: log.createdAt.toISOString(),
    }));

    return {
      success: true,
      engine: "MySQL 8.0 (InnoDB)",
      database: "new_rms_cric_2026",
      host: "127.0.0.1:3309 (Docker: pr_cvc2026-db-1)",
      status: "CONNECTED",
      latencyMs,
      totalTables: tableMetrics.length,
      totalRecords,
      tableMetrics,
      recentBackups,
    };
  } catch (error: any) {
    return {
      success: false,
      engine: "MySQL 8.0",
      database: "new_rms_cric_2026",
      host: "127.0.0.1:3309",
      status: "ERROR",
      latencyMs: Date.now() - startTime,
      totalTables: 0,
      totalRecords: 0,
      tableMetrics: [],
      recentBackups: [],
      error: error.message || "Failed to connect to MySQL database",
    };
  }
}

// 2. 1-Click Backup Database Action (Generates SQL Dump string & logs)
export async function createDatabaseBackupAction(executedBy: string = "admin@cric.ac.th"): Promise<{
  success: boolean;
  fileName?: string;
  fileSizeKb?: number;
  sqlContent?: string;
  error?: string;
}> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `new_rms_cric_2026_backup_${timestamp}.sql`;

    // Fetch key tables for dump
    const [users, depts, classes, terms, docs] = await Promise.all([
      prisma.user.findMany(),
      prisma.department.findMany(),
      prisma.classroom.findMany(),
      prisma.academicTerm.findMany(),
      prisma.document.findMany(),
    ]);

    // Build structured SQL header & insert statements
    let sql = `-- ========================================================\n`;
    sql += `-- New RMS CRiC 2026 - MySQL Database Backup\n`;
    sql += `-- Database: new_rms_cric_2026\n`;
    sql += `-- Export Date: ${new Date().toISOString()}\n`;
    sql += `-- Generated By: ${executedBy}\n`;
    sql += `-- Engine: MySQL 8.0 / InnoDB / utf8mb4\n`;
    sql += `-- ========================================================\n\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    // Dump Academic Terms
    sql += `-- Table: AcademicTerm (${terms.length} rows)\n`;
    terms.forEach((t) => {
      sql += `REPLACE INTO AcademicTerm (id, level, term, academicYear, totalWeeks, startDate, endDate, isActive, createdAt, updatedAt) VALUES ('${t.id}', '${t.level}', '${t.term}', '${t.academicYear}', ${t.totalWeeks}, '${t.startDate.toISOString()}', '${t.endDate.toISOString()}', ${t.isActive ? 1 : 0}, NOW(), NOW());\n`;
    });
    sql += `\n`;

    // Dump Departments
    sql += `-- Table: Department (${depts.length} rows)\n`;
    depts.forEach((d) => {
      sql += `REPLACE INTO Department (id, code, name, headName, createdAt) VALUES ('${d.id}', '${d.code}', '${d.name}', '${d.headName || ""}', NOW());\n`;
    });
    sql += `\n`;

    // Dump Classrooms
    sql += `-- Table: Classroom (${classes.length} rows)\n`;
    classes.forEach((c) => {
      sql += `REPLACE INTO Classroom (id, code, name, level, academicYear, departmentId, createdAt) VALUES ('${c.id}', '${c.code}', '${c.name}', '${c.level}', '${c.academicYear}', '${c.departmentId}', NOW());\n`;
    });
    sql += `\n`;

    // Dump Users
    sql += `-- Table: User (${users.length} rows)\n`;
    users.forEach((u) => {
      sql += `REPLACE INTO User (id, email, citizenId, passwordHash, fullName, phone, role, isActive, createdAt, updatedAt) VALUES ('${u.id}', '${u.email}', '${u.citizenId || ""}', '${u.passwordHash}', '${u.fullName}', '${u.phone || ""}', '${u.role}', ${u.isActive ? 1 : 0}, NOW(), NOW());\n`;
    });
    sql += `\n`;

    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    sql += `-- Backup completed successfully --\n`;

    const fileSizeKb = Math.round((Buffer.byteLength(sql, "utf8") / 1024) * 10) / 10;

    // Log the backup in DB
    await prisma.systemBackupLog.create({
      data: {
        fileName,
        fileSizeKb,
        type: "MANUAL",
        status: "SUCCESS",
        executedBy,
      },
    });

    revalidatePath("/admin");
    return {
      success: true,
      fileName,
      fileSizeKb,
      sqlContent: sql,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 3. 1-Click Re-Seed Demo Data Action (Restores Vocational College Demo Data)
export async function reseedDatabaseAction(): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const bcrypt = await import("bcryptjs");
    const defaultPasswordHash = await bcrypt.hash("rms123456", 10);
    const defaultPinHash = await bcrypt.hash("123456", 10);

    // Clean tables that have demo logs
    await prisma.studentAttendance.deleteMany();
    await prisma.classPeriodAttendance.deleteMany();
    await prisma.smartGateLog.deleteMany();
    await prisma.academicTerm.deleteMany();

    // Re-create Academic Terms
    await prisma.academicTerm.createMany({
      data: [
        {
          level: "ปวช.",
          term: "1",
          academicYear: "2569",
          totalWeeks: 18,
          startDate: new Date("2026-05-18T00:00:00.000Z"),
          endDate: new Date("2026-09-20T23:59:59.000Z"),
          isActive: true,
        },
        {
          level: "ปวส.",
          term: "1",
          academicYear: "2569",
          totalWeeks: 15,
          startDate: new Date("2026-06-01T00:00:00.000Z"),
          endDate: new Date("2026-09-13T23:59:59.000Z"),
          isActive: true,
        },
      ],
    });

    // Re-create Smart Gate Logs
    await prisma.smartGateLog.createMany({
      data: [
        {
          userCode: "6920901001",
          userName: "นายกิตติคุณ มั่นคง",
          role: "STUDENT",
          gateName: "ประตูหน้าอาคาร 1 (RFID Turnstile)",
          direction: "IN",
          timestamp: new Date(Date.now() - 3600000 * 2),
          rfidCard: "E280110520007834",
          temp: 36.4,
        },
        {
          userCode: "EMP004",
          userName: "อาจารย์สมชาย ปัญญาดี",
          role: "TEACHER",
          gateName: "ประตูหน้าอาคารอำนวยการ (Face Scan)",
          direction: "IN",
          timestamp: new Date(Date.now() - 3600000 * 2.5),
          temp: 36.5,
        },
        {
          userCode: "6920901002",
          userName: "นางสาวณิชา ภักดี",
          role: "STUDENT",
          gateName: "ประตูหน้าอาคาร 1 (RFID Turnstile)",
          direction: "IN",
          timestamp: new Date(Date.now() - 3600000 * 1.8),
          rfidCard: "E280110520007835",
          temp: 36.6,
        },
      ],
    });

    // Re-seed attendance for all current students
    const students = await prisma.studentProfile.findMany({
      include: { user: true },
    });
    const teacher = await prisma.user.findFirst({
      where: { email: "teacher.somchai@cric.ac.th" },
    });

    const now = new Date();
    for (const s of students) {
      await prisma.studentAttendance.create({
        data: {
          studentId: s.id,
          date: now,
          type: "FLAG_CEREMONY",
          status: "PRESENT",
          source: "TEACHER_APP",
          recordedBy: "อาจารย์สมชาย ปัญญาดี",
        },
      });

      await prisma.classPeriodAttendance.create({
        data: {
          studentId: s.id,
          courseCode: "20204-2001",
          courseName: "การเขียนโปรแกรมคอมพิวเตอร์เบื้องต้น",
          period: 1,
          weekNumber: 1,
          date: now,
          status: "PRESENT",
          teacherId: teacher?.id || null,
          remarks: "เข้าเรียนตรงเวลา (Re-Seeded)",
        },
      });
    }

    // Log seed event
    await prisma.systemBackupLog.create({
      data: {
        fileName: "reseed_vocational_demo_2569.sql",
        fileSizeKb: 85.0,
        type: "MANUAL",
        status: "SUCCESS",
        executedBy: "admin@cric.ac.th",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/attendance");
    revalidatePath("/edoc");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `รีเซ็ตและเติมข้อมูลตัวอย่างสำเร็จ (นักเรียน ${students.length} คน, ภาคเรียน 2 รายการ, การเช็คชื่อ และ Smart Gate)`,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
