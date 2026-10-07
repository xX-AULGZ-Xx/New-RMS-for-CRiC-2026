const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding standard vocational courses...');

  // Get departments
  const departments = await prisma.department.findMany();
  const itDept = departments.find(d => d.code === 'IT' || d.name.includes('สารสนเทศ') || d.name.includes('คอมพิวเตอร์'));
  const accDept = departments.find(d => d.code === 'ACC' || d.name.includes('บัญชี'));
  const firstDept = departments[0];

  const itDeptId = itDept ? itDept.id : (firstDept ? firstDept.id : null);
  const accDeptId = accDept ? accDept.id : (firstDept ? firstDept.id : null);

  const courses = [
    {
      code: '20000-1201',
      nameTh: 'ภาษาอังกฤษเพื่อการสื่อสาร',
      nameEn: 'English for Communication',
      level: 'ปวช.',
      credits: 1,
      theoryHours: 0,
      practiceHours: 2,
      totalHours: 2,
      category: 'หมวดวิชาสมรรถนะแกนกลาง',
      departmentId: null,
      description: 'ศึกษาและปฏิบัติเกี่ยวกับการฟัง พูด อ่าน และเขียนภาษาอังกฤษในชีวิตประจำวัน การทักทาย การแนะนำตนเองและผู้อื่น',
      competency: 'สื่อสารภาษาอังกฤษเบื้องต้นในสถานการณ์ชีวิตประจำวันและการทำงาน',
      isActive: true
    },
    {
      code: '20204-2001',
      nameTh: 'การเขียนโปรแกรมคอมพิวเตอร์เบื้องต้น',
      nameEn: 'Basic Computer Programming',
      level: 'ปวช.',
      credits: 3,
      theoryHours: 2,
      practiceHours: 2,
      totalHours: 4,
      category: 'หมวดวิชาสมรรถนะวิชาชีพเฉพาะ',
      departmentId: itDeptId,
      description: 'ศึกษาและปฏิบัติเกี่ยวกับหลักการเขียนโปรแกรม โครงสร้างภาษา ลูป ตัวแปร ฟังก์ชัน และการพัฒนาโปรแกรมประยุกต์เบื้องต้น',
      competency: 'วิเคราะห์ ออกแบบ และเขียนโปรแกรมคอมพิวเตอร์ระดับพื้นฐานตามโจทย์ที่กำหนด',
      isActive: true
    },
    {
      code: '20204-2002',
      nameTh: 'ระบบจัดการฐานข้อมูล',
      nameEn: 'Database Management Systems',
      level: 'ปวช.',
      credits: 3,
      theoryHours: 2,
      practiceHours: 2,
      totalHours: 4,
      category: 'หมวดวิชาสมรรถนะวิชาชีพเฉพาะ',
      departmentId: itDeptId,
      description: 'ศึกษาและปฏิบัติเกี่ยวกับระบบฐานข้อมูล แบบจำลองข้อมูล ER-Diagram ภาษา SQL และการเชื่อมต่อฐานข้อมูล',
      competency: 'ออกแบบและจัดการฐานข้อมูลเชิงสัมพันธ์ด้วยคำสั่ง SQL มาตรฐาน',
      isActive: true
    },
    {
      code: '20201-1001',
      nameTh: 'การบัญชีเบื้องต้น',
      nameEn: 'Basic Accounting',
      level: 'ปวช.',
      credits: 3,
      theoryHours: 2,
      practiceHours: 2,
      totalHours: 4,
      category: 'หมวดวิชาสมรรถนะวิชาชีพพื้นฐาน',
      departmentId: accDeptId,
      description: 'ศึกษาความหมาย วัตถุประสงค์ของการบัญชี แม่บทการบัญชี สินทรัพย์ หนี้สิน ส่วนของเจ้าของ การบันทึกสมุดรายวันทั่วไป และงบทดลอง',
      competency: 'บันทึกรายการค้าตามหลักการบัญชีคู่และจัดทำงบทดลอง',
      isActive: true
    },
    {
      code: '30000-1101',
      nameTh: 'ทักษะภาษาไทยเชิงวิชาชีพ',
      nameEn: 'Professional Thai Communication',
      level: 'ปวส.',
      credits: 3,
      theoryHours: 3,
      practiceHours: 0,
      totalHours: 3,
      category: 'หมวดวิชาสมรรถนะแกนกลาง',
      departmentId: null,
      description: 'ศึกษาและปฏิบัติเกี่ยวกับการใช้ภาษาไทยในการสื่อสารเชิงวิชาชีพ การพูดในที่ประชุมชน การเขียนหนังสือราชการและรายงานเชิงวิชาการ',
      competency: 'สื่อสารและเขียนเอกสารทางวิชาชีพได้อย่างถูกต้องตามระเบียบและหลักภาษาไทย',
      isActive: true
    },
    {
      code: '30204-2001',
      nameTh: 'การพัฒนาเว็บแอปพลิเคชันขั้นสูง',
      nameEn: 'Advanced Web Application Development',
      level: 'ปวส.',
      credits: 3,
      theoryHours: 2,
      practiceHours: 2,
      totalHours: 4,
      category: 'หมวดวิชาสมรรถนะวิชาชีพเฉพาะ',
      departmentId: itDeptId,
      description: 'ศึกษาและปฏิบัติเกี่ยวกับสถาปัตยกรรม Full-stack Web, REST API, การเชื่อมต่อฐานข้อมูล, และ Next.js / React',
      competency: 'พัฒนาเว็บแอปพลิเคชันแบบเต็มรูปแบบที่เชื่อมต่อกับฐานข้อมูลและ API ภายนอกได้',
      isActive: true
    },
    {
      code: '30204-2003',
      nameTh: 'ความปลอดภัยระบบสารสนเทศ',
      nameEn: 'Information System Security',
      level: 'ปวส.',
      credits: 3,
      theoryHours: 2,
      practiceHours: 2,
      totalHours: 4,
      category: 'หมวดวิชาสมรรถนะวิชาชีพเลือก',
      departmentId: itDeptId,
      description: 'ศึกษาหลักการความมั่นคงปลอดภัยไซเบอร์ ภัยคุกคาม นโยบายความปลอดภัย การเข้ารหัส และ พ.ร.บ. ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์',
      competency: 'วิเคราะห์ช่องโหว่ความปลอดภัยและกำหนดมาตรการป้องกันระบบสารสนเทศในองค์กร',
      isActive: true
    }
  ];

  for (const c of courses) {
    await prisma.course.upsert({
      where: { code: c.code },
      update: c,
      create: c
    });
  }

  const count = await prisma.course.count();
  console.log(`Courses seeded successfully! Total courses: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
