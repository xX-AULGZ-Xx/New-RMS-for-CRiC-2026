"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

// 1. E-Document: Approve and Sign Document
export async function signDocumentAction(data: {
  documentId: string;
  signerEmail: string;
  pin: string;
  actionNote: string;
  signatureDataUrl: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.signerEmail },
    });

    if (!user) {
      return { success: false, error: "ไม่พบบัญชีผู้ลงนามในระบบ" };
    }

    // Verify PIN (default 123456)
    if (data.pin !== "123456") {
      return { success: false, error: "รหัส PIN 6 หลักไม่ถูกต้อง (ลอง 123456)" };
    }

    // Record digital signature
    const signature = await prisma.documentSignature.create({
      data: {
        documentId: data.documentId,
        signerId: user.id,
        signatureUrl: data.signatureDataUrl || "data:image/svg+xml;base64,sample_svg",
        signedHash: "SHA256-" + Date.now().toString(36) + Math.random().toString(36).substring(2),
        pinVerified: true,
      },
    });

    // Update current routing
    await prisma.documentRouting.updateMany({
      where: {
        documentId: data.documentId,
        targetUserId: user.id,
      },
      data: {
        actionNote: data.actionNote || "เกษียณสั่งการเรียบร้อย",
        isApproved: true,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Check if Director signed -> update docStatus to APPROVED
    if (user.role === "EXECUTIVE" && user.email.includes("director")) {
      await prisma.document.update({
        where: { id: data.documentId },
        data: { status: "APPROVED" },
      });
    } else {
      await prisma.document.update({
        where: { id: data.documentId },
        data: { status: "ENDORSED" },
      });
    }

    revalidatePath("/edoc");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 2. Student Attendance: Batch Save Attendance
export async function saveAttendanceBatchAction(data: {
  classroomId: string;
  records: Array<{
    studentId: string;
    status: "PRESENT" | "LATE" | "LEAVE" | "ABSENT";
    remarks?: string;
  }>;
}) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const rec of data.records) {
      await prisma.studentAttendance.create({
        data: {
          studentId: rec.studentId,
          type: "FLAG_CEREMONY",
          status: rec.status,
          remarks: rec.remarks || null,
          source: "TEACHER_APP",
        },
      });
    }

    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { success: true, count: data.records.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 3. HR: Time Attendance Check-In / Check-Out
export async function staffCheckInAction(data: {
  userEmail: string;
  type: "CHECK_IN" | "CHECK_OUT";
  latitude: number;
  longitude: number;
  wifiSsid: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.userEmail },
      include: { personnelProfile: true },
    });

    if (!user || !user.personnelProfile) {
      return { success: false, error: "ไม่พบข้อมูลบุคลากร" };
    }

    // Distance calculation from college coordinates: 19.9072, 99.8325
    const collegeLat = 19.9072;
    const collegeLng = 99.8325;
    const dLat = (data.latitude - collegeLat) * 111000;
    const dLng = (data.longitude - collegeLng) * 111000;
    const distanceMeters = Math.sqrt(dLat * dLat + dLng * dLng);

    const isWithinGeofence = distanceMeters <= 500; // Allow 500m radius

    const log = await prisma.staffTimeLog.create({
      data: {
        personnelId: user.personnelProfile.id,
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude,
        wifiSsid: data.wifiSsid,
        isVerified: isWithinGeofence,
        source: "SMARTPHONE_GPS",
      },
    });

    revalidatePath("/hr");
    revalidatePath("/dashboard");
    return {
      success: true,
      log,
      distanceMeters: Math.round(distanceMeters),
      isWithinGeofence,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 4. HR: Submit Leave Request
export async function submitLeaveAction(data: {
  userEmail: string;
  leaveType: "SICK" | "BUSINESS" | "VACATION" | "OFFICIAL_DUTY";
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.userEmail },
      include: { personnelProfile: true },
    });

    if (!user || !user.personnelProfile) {
      return { success: false, error: "ไม่พบข้อมูลบุคลากร" };
    }

    await prisma.leaveRequest.create({
      data: {
        personnelId: user.personnelProfile.id,
        leaveType: data.leaveType,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        totalDays: data.totalDays,
        reason: data.reason,
        status: "PENDING",
      },
    });

    revalidatePath("/hr");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
