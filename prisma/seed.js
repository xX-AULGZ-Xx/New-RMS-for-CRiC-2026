const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting New RMS Seed for CRiC 2026 (MySQL Edition)...');

  // Common password hash for demo accounts: "rms123456"
  const defaultPasswordHash = await bcrypt.hash('rms123456', 10);
  const defaultPinHash = await bcrypt.hash('123456', 10);

  // 1. Academic Terms (ปวช. 18 สัปดาห์ และ ปวส. 15 สัปดาห์)
  console.log('📅 Seeding Academic Terms...');
  await prisma.academicTerm.deleteMany();
  const termVC = await prisma.academicTerm.create({
    data: {
      level: 'ปวช.',
      term: '1',
      academicYear: '2569',
      totalWeeks: 18,
      startDate: new Date('2026-05-18T00:00:00.000Z'),
      endDate: new Date('2026-09-20T23:59:59.000Z'),
      isActive: true,
    },
  });

  const termHVC = await prisma.academicTerm.create({
    data: {
      level: 'ปวส.',
      term: '1',
      academicYear: '2569',
      totalWeeks: 15,
      startDate: new Date('2026-06-01T00:00:00.000Z'),
      endDate: new Date('2026-09-13T23:59:59.000Z'),
      isActive: true,
    },
  });

  // 2. Departments
  console.log('🏢 Seeding Departments...');
  const deptIT = await prisma.department.upsert({
    where: { code: 'DEPT-IT' },
    update: {},
    create: {
      code: 'DEPT-IT',
      name: 'แผนกวิชาเทคโนโลยีสารสนเทศ',
      headName: 'นายประสิทธิ์ นวัตกรรม',
    },
  });

  const deptAcc = await prisma.department.upsert({
    where: { code: 'DEPT-ACC' },
    update: {},
    create: {
      code: 'DEPT-ACC',
      name: 'แผนกวิชาการบัญชี',
      headName: 'นางสาวพิมพ์ใจ การเงิน',
    },
  });

  const deptMech = await prisma.department.upsert({
    where: { code: 'DEPT-MECH' },
    update: {},
    create: {
      code: 'DEPT-MECH',
      name: 'แผนกวิชาช่างยนต์',
      headName: 'นายอนุชา พลังกล',
    },
  });

  // 3. Classrooms (ปวช. และ ปวส.)
  console.log('🏫 Seeding Classrooms...');
  const classIT1 = await prisma.classroom.upsert({
    where: { code: 'IT101' },
    update: {},
    create: {
      code: 'IT101',
      name: 'ปวช. 1/1 (เทคโนโลยีสารสนเทศ)',
      level: 'ปวช.1',
      academicYear: '2569',
      departmentId: deptIT.id,
    },
  });

  const classIT2 = await prisma.classroom.upsert({
    where: { code: 'IT201' },
    update: {},
    create: {
      code: 'IT201',
      name: 'ปวช. 2/1 (เทคโนโลยีสารสนเทศ)',
      level: 'ปวช.2',
      academicYear: '2569',
      departmentId: deptIT.id,
    },
  });

  const classHVC_IT1 = await prisma.classroom.upsert({
    where: { code: 'HVC-IT101' },
    update: {},
    create: {
      code: 'HVC-IT101',
      name: 'ปวส. 1/1 (เทคโนโลยีสารสนเทศ/ซอฟต์แวร์)',
      level: 'ปวส.1',
      academicYear: '2569',
      departmentId: deptIT.id,
    },
  });

  // 4. Admin Account (Superadmin)
  console.log('👑 Seeding Superadmin & Executives...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cric.ac.th' },
    update: {},
    create: {
      email: 'admin@cric.ac.th',
      citizenId: '1509900000001',
      passwordHash: defaultPasswordHash,
      fullName: 'ผู้ดูแลระบบสูงสุด (Super Administrator)',
      phone: '080-000-0000',
      role: 'SUPERADMIN',
      pinHash: defaultPinHash,
      signatureImg: 'data:image/png;base64,sample_admin_sig',
    },
  });

  // 5. Director (ผู้อำนวยการวิทยาลัย)
  const directorUser = await prisma.user.upsert({
    where: { email: 'director@cric.ac.th' },
    update: {},
    create: {
      email: 'director@cric.ac.th',
      citizenId: '1509900123451',
      passwordHash: defaultPasswordHash,
      fullName: 'ดร.สมเกียรติ ยิ่งเจริญ',
      phone: '081-999-0001',
      role: 'EXECUTIVE',
      pinHash: defaultPinHash,
      signatureImg: 'data:image/png;base64,sample_signature_director',
      personnelProfile: {
        create: {
          employeeCode: 'EMP001',
          position: 'ผู้อำนวยการวิทยาลัยอาชีวศึกษา',
          departmentId: deptIT.id,
        },
      },
    },
  });

  // 6. Deputy Director (รอง ผอ. ฝ่ายวิชาการ)
  const deputyUser = await prisma.user.upsert({
    where: { email: 'deputy.academic@cric.ac.th' },
    update: {},
    create: {
      email: 'deputy.academic@cric.ac.th',
      citizenId: '1509900123452',
      passwordHash: defaultPasswordHash,
      fullName: 'นายวิเชียร มุ่งมั่น',
      phone: '081-999-0002',
      role: 'EXECUTIVE',
      pinHash: defaultPinHash,
      signatureImg: 'data:image/png;base64,sample_signature_deputy',
      personnelProfile: {
        create: {
          employeeCode: 'EMP002',
          position: 'รองผู้อำนวยการฝ่ายวิชาการ',
          departmentId: deptIT.id,
        },
      },
    },
  });

  // 7. Head of Department (หัวหน้าแผนก IT)
  const headITUser = await prisma.user.upsert({
    where: { email: 'head.it@cric.ac.th' },
    update: {},
    create: {
      email: 'head.it@cric.ac.th',
      citizenId: '1509900123453',
      passwordHash: defaultPasswordHash,
      fullName: 'นายประสิทธิ์ นวัตกรรม',
      phone: '081-999-0003',
      role: 'HEAD_DEPARTMENT',
      pinHash: defaultPinHash,
      signatureImg: 'data:image/png;base64,sample_signature_head_it',
      personnelProfile: {
        create: {
          employeeCode: 'EMP003',
          position: 'หัวหน้าแผนกวิชาเทคโนโลยีสารสนเทศ',
          departmentId: deptIT.id,
        },
      },
    },
  });

  // 8. Teachers
  console.log('👨‍🏫 Seeding Teachers...');
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher.somchai@cric.ac.th' },
    update: {},
    create: {
      email: 'teacher.somchai@cric.ac.th',
      citizenId: '1509900123454',
      passwordHash: defaultPasswordHash,
      fullName: 'อาจารย์สมชาย ปัญญาดี',
      phone: '081-999-0004',
      role: 'TEACHER',
      pinHash: defaultPinHash,
      signatureImg: 'data:image/png;base64,sample_signature_teacher',
      personnelProfile: {
        create: {
          employeeCode: 'EMP004',
          position: 'ครูผู้สอน / ครูที่ปรึกษา ปวช. 1/1',
          departmentId: deptIT.id,
        },
      },
    },
  });

  const teacherPornthip = await prisma.user.upsert({
    where: { email: 'teacher.pornthip@cric.ac.th' },
    update: {},
    create: {
      email: 'teacher.pornthip@cric.ac.th',
      citizenId: '1509900123455',
      passwordHash: defaultPasswordHash,
      fullName: 'อาจารย์พรทิพย์ สุนทรภู่',
      phone: '081-999-0005',
      role: 'TEACHER',
      pinHash: defaultPinHash,
      signatureImg: 'data:image/png;base64,sample_signature_teacher2',
      personnelProfile: {
        create: {
          employeeCode: 'EMP005',
          position: 'ครูผู้สอน / ครูที่ปรึกษา ปวส. 1/1',
          departmentId: deptIT.id,
        },
      },
    },
  });

  // 9. Students for ปวช. 1/1 and ปวส. 1/1
  console.log('🎒 Seeding Students...');
  const studentData = [
    { code: '6920901001', name: 'นายกิตติคุณ มั่นคง', email: 'std6920901001@cric.ac.th', phone: '089-111-2221', classroomId: classIT1.id },
    { code: '6920901002', name: 'นางสาวณิชา ภักดี', email: 'std6920901002@cric.ac.th', phone: '089-111-2222', classroomId: classIT1.id },
    { code: '6920901003', name: 'นายธนดล เจริญพร', email: 'std6920901003@cric.ac.th', phone: '089-111-2223', classroomId: classIT1.id },
    { code: '6920901004', name: 'นางสาวบุษกร รุ่งเรือง', email: 'std6920901004@cric.ac.th', phone: '089-111-2224', classroomId: classIT1.id },
    { code: '6920901005', name: 'นายวรพจน์ สุขสวัสดิ์', email: 'std6920901005@cric.ac.th', phone: '089-111-2225', classroomId: classIT1.id },
    // ปวส. Students
    { code: '6930901001', name: 'นายอัครเดช ยอดเยี่ยม', email: 'std6930901001@cric.ac.th', phone: '089-222-3331', classroomId: classHVC_IT1.id },
    { code: '6930901002', name: 'นางสาวเกศรา เพ็ญแข', email: 'std6930901002@cric.ac.th', phone: '089-222-3332', classroomId: classHVC_IT1.id },
    { code: '6930901003', name: 'นายชลทิศ นาคี', email: 'std6930901003@cric.ac.th', phone: '089-222-3333', classroomId: classHVC_IT1.id },
  ];

  const studentProfiles = [];
  for (const s of studentData) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        citizenId: '15099' + s.code.slice(-8),
        passwordHash: defaultPasswordHash,
        fullName: s.name,
        role: 'STUDENT',
        studentProfile: {
          create: {
            studentCode: s.code,
            classroomId: s.classroomId,
            parentPhone: s.phone,
          },
        },
      },
      include: { studentProfile: true },
    });
    if (user.studentProfile) {
      studentProfiles.push(user.studentProfile);
    }
  }

  // 10. Sample Attendance Data (Flag ceremony & Class Period)
  console.log('📋 Seeding Attendance Records...');
  await prisma.studentAttendance.deleteMany();
  await prisma.classPeriodAttendance.deleteMany();
  await prisma.smartGateLog.deleteMany();
  await prisma.systemBackupLog.deleteMany();

  const today = new Date();
  for (const sp of studentProfiles) {
    // Flag ceremony attendance
    await prisma.studentAttendance.create({
      data: {
        studentId: sp.id,
        date: today,
        type: 'FLAG_CEREMONY',
        status: Math.random() > 0.1 ? 'PRESENT' : (Math.random() > 0.5 ? 'LATE' : 'LEAVE'),
        source: 'TEACHER_APP',
        recordedBy: 'อาจารย์สมชาย ปัญญาดี',
      },
    });

    // Class period attendance for Week 1 (คาบ 1-2)
    await prisma.classPeriodAttendance.create({
      data: {
        studentId: sp.id,
        courseCode: '20204-2001',
        courseName: 'การเขียนโปรแกรมคอมพิวเตอร์เบื้องต้น',
        period: 1,
        weekNumber: 1,
        date: today,
        status: 'PRESENT',
        teacherId: teacherUser.id,
        remarks: 'เข้าเรียนตรงเวลา',
      },
    });
  }

  // 11. Smart Gate Turnstile Logs
  console.log('🚧 Seeding Smart Gate Logs...');
  await prisma.smartGateLog.createMany({
    data: [
      {
        userCode: '6920901001',
        userName: 'นายกิตติคุณ มั่นคง',
        role: 'STUDENT',
        gateName: 'ประตูหน้าอาคาร 1 (RFID Turnstile)',
        direction: 'IN',
        timestamp: new Date(Date.now() - 3600000 * 3),
        rfidCard: 'E280110520007834',
        temp: 36.4,
      },
      {
        userCode: 'EMP004',
        userName: 'อาจารย์สมชาย ปัญญาดี',
        role: 'TEACHER',
        gateName: 'ประตูหน้าอาคารอำนวยการ (Face Scan)',
        direction: 'IN',
        timestamp: new Date(Date.now() - 3600000 * 3.5),
        temp: 36.5,
      },
      {
        userCode: '6920901002',
        userName: 'นางสาวณิชา ภักดี',
        role: 'STUDENT',
        gateName: 'ประตูหน้าอาคาร 1 (RFID Turnstile)',
        direction: 'IN',
        timestamp: new Date(Date.now() - 3600000 * 2.8),
        rfidCard: 'E280110520007835',
        temp: 36.6,
      },
    ],
  });

  // 12. E-Documents & Digital Signatures Workflow
  console.log('📑 Seeding E-Documents & Routings...');
  await prisma.document.upsert({
    where: { qrToken: 'cric-doc-2569-demo-001' },
    update: {},
    create: {
      docNumber: 'ศธ 0621/ว045',
      title: 'ขออนุมัติจัดโครงการสัมมนาเชิงปฏิบัติการเทคโนโลยีปัญญาประดิษฐ์และคลาวด์คอมพิวติง ประจำปี 2569',
      abstractContent: 'เนื่องด้วยแผนกวิชาเทคโนโลยีสารสนเทศ มีความประสงค์จะจัดโครงการสัมมนาให้แก่นักเรียนนักศึกษา ปวช. และ ปวส. เพื่อส่งเสริมทักษะความรู้ด้าน AI และคลาวด์...',
      priority: 'URGENT',
      status: 'ROUTING',
      category: 'MEMO',
      creatorId: teacherUser.id,
      qrToken: 'cric-doc-2569-demo-001',
      routings: {
        create: [
          {
            stepOrder: 1,
            targetUserId: headITUser.id,
            actionNote: 'เห็นควรอนุมัติโครงการเพื่อพัฒนาสมรรถนะนักศึกษา',
            isApproved: true,
            isCompleted: true,
            completedAt: new Date(Date.now() - 86400000),
          },
          {
            stepOrder: 2,
            targetUserId: deputyUser.id,
            actionNote: 'ตรวจสอบงบประมาณและสอดคล้องกับแผนงานวิชาการ เห็นควรเสนอท่าน ผอ.',
            isApproved: true,
            isCompleted: true,
            completedAt: new Date(Date.now() - 43200000),
          },
          {
            stepOrder: 3,
            targetUserId: directorUser.id,
            actionNote: null,
            isApproved: false,
            isCompleted: false,
          },
        ],
      },
      signatures: {
        create: [
          {
            signerId: headITUser.id,
            signatureUrl: 'data:image/png;base64,sample_head_sig',
            signedHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            pinVerified: true,
            ipAddress: '192.168.1.101',
            signedAt: new Date(Date.now() - 86400000),
          },
          {
            signerId: deputyUser.id,
            signatureUrl: 'data:image/png;base64,sample_deputy_sig',
            signedHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
            pinVerified: true,
            ipAddress: '192.168.1.105',
            signedAt: new Date(Date.now() - 43200000),
          },
        ],
      },
    },
  });

  // 13. System Backup Log
  console.log('💾 Seeding System Backup Log...');
  await prisma.systemBackupLog.create({
    data: {
      fileName: 'new_rms_cric_2026_init_backup.sql',
      fileSizeKb: 142.5,
      type: 'PRE_UPGRADE',
      status: 'SUCCESS',
      executedBy: 'admin@cric.ac.th',
    },
  });

  console.log('✨ Seed completed successfully into MySQL: new_rms_cric_2026!');
  console.log('------------------------------------------------------------');
  console.log('🔑 Demo User Accounts:');
  console.log('   - ผู้ดูแลระบบ (Superadmin): admin@cric.ac.th (รหัส: rms123456, PIN: 123456)');
  console.log('   - ผู้อำนวยการ: director@cric.ac.th (รหัส: rms123456, PIN: 123456)');
  console.log('   - รอง ผอ.วิชาการ: deputy.academic@cric.ac.th (รหัส: rms123456, PIN: 123456)');
  console.log('   - หัวหน้าแผนก IT: head.it@cric.ac.th (รหัส: rms123456, PIN: 123456)');
  console.log('   - ครูที่ปรึกษา: teacher.somchai@cric.ac.th (รหัส: rms123456, PIN: 123456)');
  console.log('   - นักเรียน IT: std6920901001@cric.ac.th (รหัส: rms123456)');
  console.log('------------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
