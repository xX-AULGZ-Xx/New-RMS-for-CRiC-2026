const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Synchronizing initial system settings to MySQL...');

  const collegeSettings = {
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

  const geofenceSettings = {
    latitude: "19.907200",
    longitude: "99.832500",
    radiusMeters: "200",
    allowedWifi: "CRIC-STAFF, CRIC-WiFi, CRIC-Teacher",
    morningLateTime: "08:00",
    morningAbsentTime: "08:30",
    afternoonCheckOutTime: "16:30",
  };

  const integrations = {
    lineChannelId: "2001928472",
    lineChannelSecret: "••••••••••••••••••••••••••••••••",
    googleDomain: "cric.ac.th",
    googleClientId: "948271029384-cric.apps.googleusercontent.com",
    std02ApiEndpoint: "https://std2018.vec.go.th/api/v2",
    legacyRmsHost: "192.168.1.200:3306 (MySQL 5.7)",
  };

  const termCalendarSettings = {
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

  await prisma.systemSetting.upsert({
    where: { key: "COLLEGE_SETTINGS" },
    update: { value: JSON.stringify(collegeSettings), category: "COLLEGE" },
    create: { key: "COLLEGE_SETTINGS", value: JSON.stringify(collegeSettings), category: "COLLEGE" },
  });

  await prisma.systemSetting.upsert({
    where: { key: "GEOFENCE_SETTINGS" },
    update: { value: JSON.stringify(geofenceSettings), category: "GEOFENCE" },
    create: { key: "GEOFENCE_SETTINGS", value: JSON.stringify(geofenceSettings), category: "GEOFENCE" },
  });

  await prisma.systemSetting.upsert({
    where: { key: "INTEGRATION_SETTINGS" },
    update: { value: JSON.stringify(integrations), category: "INTEGRATION" },
    create: { key: "INTEGRATION_SETTINGS", value: JSON.stringify(integrations), category: "INTEGRATION" },
  });

  await prisma.systemSetting.upsert({
    where: { key: "CALENDAR_SETTINGS" },
    update: { value: JSON.stringify(termCalendarSettings), category: "CALENDAR" },
    create: { key: "CALENDAR_SETTINGS", value: JSON.stringify(termCalendarSettings), category: "CALENDAR" },
  });

  // Update AcademicTerm in MySQL for VC
  await prisma.academicTerm.upsert({
    where: {
      level_term_academicYear: {
        level: "ปวช.",
        term: "1",
        academicYear: "2569",
      },
    },
    update: {
      totalWeeks: 18,
      startDate: new Date("2026-08-17T00:00:00.000Z"),
      endDate: new Date("2026-12-18T23:59:59.000Z"),
      midtermWeek: 9,
      midtermDate: new Date("2026-10-12T00:00:00.000Z"),
      finalWeek: 18,
      finalDate: new Date("2026-12-14T00:00:00.000Z"),
      gradeDeadline: new Date("2026-12-25T23:59:59.000Z"),
      status: "OPEN",
      note: "จัดการเรียนการสอนในสถานศึกษาเต็มเวลา 18 สัปดาห์ ตามระเบียบ สอศ. 2569",
      isActive: true,
    },
    create: {
      level: "ปวช.",
      term: "1",
      academicYear: "2569",
      totalWeeks: 18,
      startDate: new Date("2026-08-17T00:00:00.000Z"),
      endDate: new Date("2026-12-18T23:59:59.000Z"),
      midtermWeek: 9,
      midtermDate: new Date("2026-10-12T00:00:00.000Z"),
      finalWeek: 18,
      finalDate: new Date("2026-12-14T00:00:00.000Z"),
      gradeDeadline: new Date("2026-12-25T23:59:59.000Z"),
      status: "OPEN",
      note: "จัดการเรียนการสอนในสถานศึกษาเต็มเวลา 18 สัปดาห์ ตามระเบียบ สอศ. 2569",
      isActive: true,
    },
  });

  // Update AcademicTerm in MySQL for HVC
  await prisma.academicTerm.upsert({
    where: {
      level_term_academicYear: {
        level: "ปวส.",
        term: "1",
        academicYear: "2569",
      },
    },
    update: {
      totalWeeks: 15,
      startDate: new Date("2026-08-17T00:00:00.000Z"),
      endDate: new Date("2026-11-27T23:59:59.000Z"),
      midtermWeek: 8,
      midtermDate: new Date("2026-10-05T00:00:00.000Z"),
      finalWeek: 15,
      finalDate: new Date("2026-11-23T00:00:00.000Z"),
      gradeDeadline: new Date("2026-12-04T23:59:59.000Z"),
      status: "OPEN",
      note: "เรียนในสถานศึกษา 15 สัปดาห์ + เตรียมฝึกงาน/ปฏิบัติงานในสถานประกอบการ 3 สัปดาห์",
      isActive: true,
    },
    create: {
      level: "ปวส.",
      term: "1",
      academicYear: "2569",
      totalWeeks: 15,
      startDate: new Date("2026-08-17T00:00:00.000Z"),
      endDate: new Date("2026-11-27T23:59:59.000Z"),
      midtermWeek: 8,
      midtermDate: new Date("2026-10-05T00:00:00.000Z"),
      finalWeek: 15,
      finalDate: new Date("2026-11-23T00:00:00.000Z"),
      gradeDeadline: new Date("2026-12-04T23:59:59.000Z"),
      status: "OPEN",
      note: "เรียนในสถานศึกษา 15 สัปดาห์ + เตรียมฝึกงาน/ปฏิบัติงานในสถานประกอบการ 3 สัปดาห์",
      isActive: true,
    },
  });

  console.log('✅ Initial settings and AcademicTerms saved into MySQL successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
