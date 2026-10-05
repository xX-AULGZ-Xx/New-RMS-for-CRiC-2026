const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting New RMS Seed for CRiC 2026...');

  // Common password hash for demo accounts: "rms123456"
  const defaultPasswordHash = await bcrypt.hash('rms123456', 10);
  const defaultPinHash = await bcrypt.hash('123456', 10);

  // 1. Departments
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

  // 2. Classrooms
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

  // 3. Director (ผู้อำนวยการวิทยาลัย)
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

  // 4. Deputy Director (รอง ผอ. ฝ่ายวิชาการ)
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

  // 5. Head of Department (หัวหน้าแผนก IT)
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

  // 6. Teacher / Advisor (ครูที่ปรึกษา)
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

  // 7. Sample Students for IT 1/1
  const studentData = [
    { code: '6920901001', name: 'นายกิตติคุณ มั่นคง', email: 'std6920901001@cric.ac.th', phone: '089-111-2221' },
    { code: '6920901002', name: 'นางสาวณิชา ภักดี', email: 'std6920901002@cric.ac.th', phone: '089-111-2222' },
    { code: '6920901003', name: 'นายธนดล เจริญพร', email: 'std6920901003@cric.ac.th', phone: '089-111-2223' },
    { code: '6920901004', name: 'นางสาวบุษกร รุ่งเรือง', email: 'std6920901004@cric.ac.th', phone: '089-111-2224' },
    { code: '6920901005', name: 'นายวรพจน์ สุขสวัสดิ์', email: 'std6920901005@cric.ac.th', phone: '089-111-2225' },
  ];

  for (const s of studentData) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        citizenId: '1509900' + s.code.slice(4),
        passwordHash: defaultPasswordHash,
        fullName: s.name,
        role: 'STUDENT',
        studentProfile: {
          create: {
            studentCode: s.code,
            classroomId: classIT1.id,
            parentPhone: s.phone,
          },
        },
      },
    });
  }

  // 8. Sample E-Document in Routing
  const doc1 = await prisma.document.upsert({
    where: { qrToken: 'cric-doc-2569-demo-001' },
    update: {},
    create: {
      docNumber: 'ศธ 0621/ว045',
      title: 'ขออนุมัติจัดโครงการสัมมนาเชิงปฏิบัติการเทคโนโลยีปัญญาประดิษฐ์และคลาวด์คอมพิวติง ประจำปี 2569',
      abstractContent: 'เนื่องด้วยแผนกวิชาเทคโนโลยีสารสนเทศ มีความประสงค์จะจัดโครงการสัมมนาให้แก่นักเรียนนักศึกษา ปวช. และ ปวส. เพื่อส่งเสริมทักษะความรู้ด้าน AI...',
      priority: 'URGENT',
      status: 'ROUTING',
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
            completedAt: new Date(),
          },
          {
            stepOrder: 2,
            targetUserId: deputyUser.id,
            actionNote: 'ตรวจสอบงบประมาณและสอดคล้องกับแผนงานวิชาการ เห็นควรเสนอท่าน ผอ.',
            isApproved: true,
            isCompleted: true,
            completedAt: new Date(),
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
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('🔑 Default credentials:');
  console.log('   - ผู้อำนวยการ: director@cric.ac.th (รหัส: rms123456, PIN: 123456)');
  console.log('   - รอง ผอ.วิชาการ: deputy.academic@cric.ac.th (รหัส: rms123456, PIN: 123456)');
  console.log('   - หัวหน้าแผนก IT: head.it@cric.ac.th (รหัส: rms123456, PIN: 123456)');
  console.log('   - ครูที่ปรึกษา: teacher.somchai@cric.ac.th (รหัส: rms123456, PIN: 123456)');
  console.log('   - นักเรียน IT: std6920901001@cric.ac.th (รหัส: rms123456)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
