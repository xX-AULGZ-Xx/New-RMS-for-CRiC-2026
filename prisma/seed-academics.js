const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Timetable, Score Weights, and Teaching Logs into MySQL...');

  // Find classrooms
  const classIT1 = await prisma.classroom.findFirst({ where: { code: 'IT101' } });
  const classHVC = await prisma.classroom.findFirst({ where: { code: 'HVC-IT101' } });

  if (!classIT1) {
    console.log('Classroom IT101 not found, skipping schedule seed');
    return;
  }

  // 1. Class Schedules
  await prisma.classSchedule.deleteMany();
  await prisma.classSchedule.createMany({
    data: [
      {
        courseCode: '20204-2001',
        courseName: 'การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่',
        classroomId: classIT1.id,
        teacherName: 'อาจารย์สมชาย ปัญญาดี',
        dayOfWeek: 1, // จันทร์
        periodStart: 1,
        periodEnd: 2,
        roomNumber: 'Lab IT 1 (Mobile Lab)',
        colorTheme: 'cyan',
        academicTerm: '1/2569',
      },
      {
        courseCode: '20000-1201',
        courseName: 'ภาษาอังกฤษเพื่อการสื่อสารในงานอาชีพ',
        classroomId: classIT1.id,
        teacherName: 'อาจารย์พรทิพย์ สุนทรภู่',
        dayOfWeek: 1, // จันทร์
        periodStart: 3,
        periodEnd: 4,
        roomNumber: 'ห้อง 421 (อาคารเฉลิมพระเกียรติ)',
        colorTheme: 'purple',
        academicTerm: '1/2569',
      },
      {
        courseCode: '20204-2002',
        courseName: 'การเขียนโปรแกรมคอมพิวเตอร์เบื้องต้น',
        classroomId: classIT1.id,
        teacherName: 'อาจารย์สมชาย ปัญญาดี',
        dayOfWeek: 2, // อังคาร
        periodStart: 1,
        periodEnd: 4,
        roomNumber: 'Lab IT 2 (Programming Lab)',
        colorTheme: 'emerald',
        academicTerm: '1/2569',
      },
      {
        courseCode: '20000-2001',
        courseName: 'กิจกรรมองค์การวิชาชีพและลูกเสือวิสามัญ',
        classroomId: classIT1.id,
        teacherName: 'นายประสิทธิ์ นวัตกรรม',
        dayOfWeek: 3, // พุธ
        periodStart: 5,
        periodEnd: 6,
        roomNumber: 'หอประชุมใหญ่ CRiC Hall',
        colorTheme: 'amber',
        academicTerm: '1/2569',
      },
      // ปวส. 1/1 schedules if available
      ...(classHVC
        ? [
            {
              courseCode: '30204-2001',
              courseName: 'การพัฒนาโปรแกรมประยุกต์บนคลาวด์',
              classroomId: classHVC.id,
              teacherName: 'อาจารย์สมชาย ปัญญาดี',
              dayOfWeek: 4, // พฤหัสบดี
              periodStart: 1,
              periodEnd: 4,
              roomNumber: 'Lab Cloud Computing (อาคาร 4)',
              colorTheme: 'blue',
              academicTerm: '1/2569',
            },
            {
              courseCode: '30204-2003',
              courseName: 'ความปลอดภัยระบบสารสนเทศและไซเบอร์',
              classroomId: classHVC.id,
              teacherName: 'นายประสิทธิ์ นวัตกรรม',
              dayOfWeek: 5, // ศุกร์
              periodStart: 1,
              periodEnd: 3,
              roomNumber: 'Lab Network & Security',
              colorTheme: 'rose',
              academicTerm: '1/2569',
            },
          ]
        : []),
    ],
  });

  // 2. Score Weights
  await prisma.courseScoreWeight.upsert({
    where: {
      courseCode_academicTerm: {
        courseCode: '20204-2001',
        academicTerm: '1/2569',
      },
    },
    update: {
      affectiveWeight: 20,
      taskWeight: 40,
      midtermWeight: 20,
      finalWeight: 20,
      totalWeight: 100,
    },
    create: {
      courseCode: '20204-2001',
      courseName: 'การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่',
      academicTerm: '1/2569',
      affectiveWeight: 20,
      taskWeight: 40,
      midtermWeight: 20,
      finalWeight: 20,
      totalWeight: 100,
    },
  });

  await prisma.courseScoreWeight.upsert({
    where: {
      courseCode_academicTerm: {
        courseCode: '30204-2001',
        academicTerm: '1/2569',
      },
    },
    update: {
      affectiveWeight: 20,
      taskWeight: 40,
      midtermWeight: 20,
      finalWeight: 20,
      totalWeight: 100,
    },
    create: {
      courseCode: '30204-2001',
      courseName: 'การพัฒนาโปรแกรมประยุกต์บนคลาวด์',
      academicTerm: '1/2569',
      affectiveWeight: 20,
      taskWeight: 40,
      midtermWeight: 20,
      finalWeight: 20,
      totalWeight: 100,
    },
  });

  // 3. Teaching Logs
  await prisma.teachingLog.deleteMany();
  await prisma.teachingLog.createMany({
    data: [
      {
        courseCode: '20204-2001',
        courseName: 'การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่',
        classroomId: classIT1.id,
        weekNumber: 1,
        date: new Date('2026-08-17T00:00:00.000Z'),
        topic: 'ปฐมนิเทศรายวิชา ข้อตกลง และการติดตั้ง Environment พัฒนา Mobile App',
        learningOutcome: 'นักศึกษาสามารถติดตั้ง Node.js, Android Studio และทดสอบ Emulator ได้ครบทุกคน 100%',
        totalStudents: 5,
        presentCount: 5,
        absentCount: 0,
        lateCount: 0,
        leaveCount: 0,
        problems: 'เครื่องคอมพิวเตอร์ในห้องปฏิบัติการบางเครื่อง RAM 8GB ทำให้ Emulator ทำงานช้าเล็กน้อย',
        solutions: 'ให้นักศึกษาเชื่อมต่อมือถือจริงผ่านสาย USB Debugging แทน Emulator',
        teacherName: 'อาจารย์สมชาย ปัญญาดี',
      },
      {
        courseCode: '20204-2001',
        courseName: 'การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่',
        classroomId: classIT1.id,
        weekNumber: 2,
        date: new Date('2026-08-24T00:00:00.000Z'),
        topic: 'โครงสร้างภาษา JSX และการสร้าง UI Component พื้นฐาน',
        learningOutcome: 'นักศึกษาสามารถสร้างหน้าจอแสดงผล Profile Card ได้ตามแบบที่กำหนด',
        totalStudents: 5,
        presentCount: 4,
        absentCount: 1,
        lateCount: 0,
        leaveCount: 0,
        problems: 'นักศึกษา 1 คน ขาดเรียนเนื่องจากติดธุระครอบครัว',
        solutions: 'มอบหมายให้เพื่อนร่วมกลุ่มส่งเอกสารสรุปและให้ดูคลิปย้อนหลังใน Google Classroom',
        teacherName: 'อาจารย์สมชาย ปัญญาดี',
      },
    ],
  });

  console.log('✅ Academic seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
