const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding official document templates for vocational college...');

  const departments = await prisma.department.findMany();
  const itDept = departments.find(d => d.code === 'IT' || d.name.includes('สารสนเทศ'));
  const itDeptId = itDept ? itDept.id : null;

  const templates = [
    {
      code: 'TPL-MEMO-001',
      title: 'บันทึกข้อความขออนุมัติจัดโครงการพัฒนาทักษะวิชาชีพผู้เรียน',
      category: 'MEMO',
      departmentId: itDeptId,
      description: 'ใช้สำหรับขออนุมัติจัดทำโครงการ อบรม สัมมนาเชิงปฏิบัติการ หรือกิจกรรมพัฒนาผู้เรียนในแผนกวิชา',
      defaultOrigin: 'แผนกวิชาเทคโนโลยีสารสนเทศ',
      defaultReceiver: 'ผู้อำนวยการวิทยาลัยอาชีวศึกษาเชียงราย',
      subjectPrefix: 'ขออนุมัติจัดโครงการ',
      bodyContent: `ด้วย แผนกวิชา{{department}} มีความประสงค์จะดำเนินโครงการ "{{projectName}}" ประจำภาคเรียนที่ {{term}}/{{year}} เพื่อส่งเสริมและพัฒนาศักยภาพผู้เรียนระดับ {{level}} ให้มีทักษะความเชี่ยวชาญด้านวิชาชีพสอดคล้องกับมาตรฐานสมรรถนะและความต้องการของสถานประกอบการ

ในการนี้ โครงการดังกล่าวจะจัดขึ้นระหว่างวันที่ {{startDate}} ถึงวันที่ {{endDate}} ณ {{location}} โดยมีกลุ่มเป้าหมายคือนักเรียน นักศึกษา จำนวน {{participantCount}} คน และใช้งบประมาณในการดำเนินงานจากเงิน{{budgetSource}} เป็นจำนวนเงินทั้งสิ้น {{amount}} บาท ({{amountText}}) รายละเอียดโครงการดังเอกสารแนบ

จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติให้จัดโครงการดังกล่าว`,
      variablesJson: JSON.stringify([
        { key: 'department', label: 'แผนกวิชา', default: 'เทคโนโลยีสารสนเทศ' },
        { key: 'projectName', label: 'ชื่อโครงการ', default: 'อบรมเชิงปฏิบัติการพัฒนาเว็บแอปพลิเคชันด้วยเทคโนโลยีสมัยใหม่' },
        { key: 'term', label: 'ภาคเรียนที่', default: '1' },
        { key: 'year', label: 'ปีการศึกษา', default: '2569' },
        { key: 'level', label: 'ระดับชั้น', default: 'ปวช. และ ปวส.' },
        { key: 'startDate', label: 'วันที่เริ่ม', default: '20 สิงหาคม 2569' },
        { key: 'endDate', label: 'วันที่สิ้นสุด', default: '21 สิงหาคม 2569' },
        { key: 'location', label: 'สถานที่จัด', default: 'ห้องปฏิบัติการคอมพิวเตอร์ Lab IT 1' },
        { key: 'participantCount', label: 'จำนวนผู้เข้าร่วม (คน)', default: '45' },
        { key: 'budgetSource', label: 'หมวดเงินงบประมาณ', default: 'อุดหนุนกิจกรรมพัฒนาคุณภาพผู้เรียน' },
        { key: 'amount', label: 'จำนวนเงิน (บาท)', default: '15,000' },
        { key: 'amountText', label: 'จำนวนเงิน (ตัวอักษร)', default: 'หนึ่งหมื่นห้าพันบาทถ้วน' }
      ]),
      priority: 'NORMAL',
      tags: 'โครงการ, อบรม, กิจกรรม, งบประมาณ, พัฒนาผู้เรียน',
      usageCount: 18,
      isActive: true,
    },
    {
      code: 'TPL-MEMO-002',
      title: 'บันทึกข้อความขออนุมัติเดินทางไปราชการและนิเทศนักศึกษาฝึกงาน',
      category: 'MEMO',
      departmentId: null,
      description: 'ใช้สำหรับขออนุมัติเดินทางไปราชการ ออกตรวจเยี่ยมและนิเทศนักศึกษาฝึกงานในสถานประกอบการ',
      defaultOrigin: 'งานทวิภาคีและงานฝึกประสบการณ์วิชาชีพ',
      defaultReceiver: 'ผู้อำนวยการวิทยาลัยอาชีวศึกษาเชียงราย',
      subjectPrefix: 'ขออนุมัติเดินทางไปราชการเพื่อตรวจนิเทศนักศึกษาฝึกประสบการณ์วิชาชีพ',
      bodyContent: `ตามที่ วิทยาลัยอาชีวศึกษาเชียงราย ได้ส่งนักศึกษาระดับ {{level}} แผนกวิชา{{department}} ออกฝึกประสบการณ์ทักษะวิชาชีพในสถานประกอบการ ประจำภาคเรียนที่ {{term}}/{{year}} นั้น

เพื่อให้การจัดการเรียนการสอนในระบบทวิภาคีและการฝึกประสบการณ์วิชาชีพเป็นไปด้วยความเรียบร้อย มีประสิทธิภาพ และสร้างความร่วมมืออันดีกับสถานประกอบการ ข้าพเจ้าพร้อมคณะครูผู้รับผิดชอบ ขออนุมัติเดินทางไปราชการเพื่อตรวจนิเทศนักศึกษา ณ {{workplaceName}} อำเภอ{{district}} จังหวัด{{province}} ในวันที่ {{travelDate}} โดยขออนุมัติใช้ยานพาหนะ{{vehicleType}}

จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ`,
      variablesJson: JSON.stringify([
        { key: 'level', label: 'ระดับชั้น', default: 'ปวส.2' },
        { key: 'department', label: 'แผนกวิชา', default: 'เทคโนโลยีสารสนเทศ' },
        { key: 'term', label: 'ภาคเรียน', default: '1' },
        { key: 'year', label: 'ปีการศึกษา', default: '2569' },
        { key: 'workplaceName', label: 'สถานประกอบการ', default: 'บริษัท เชียงรายเทคโนโลยีแอนด์อินโนเวชั่น จำกัด' },
        { key: 'district', label: 'อำเภอ', default: 'เมือง' },
        { key: 'province', label: 'จังหวัด', default: 'เชียงราย' },
        { key: 'travelDate', label: 'วันที่เดินทาง', default: '25 สิงหาคม 2569' },
        { key: 'vehicleType', label: 'ยานพาหนะ', default: 'รถยนต์ส่วนบุคคล หมายเลขทะเบียน กข-4321 เชียงราย' }
      ]),
      priority: 'NORMAL',
      tags: 'ไปราชการ, ฝึกงาน, ทวิภาคี, นิเทศ, สถานประกอบการ',
      usageCount: 24,
      isActive: true,
    },
    {
      code: 'TPL-MEMO-003',
      title: 'บันทึกข้อความขออนุมัติจัดซื้อ/เบิกจ่ายวัสดุฝึกปฏิบัติการ',
      category: 'MEMO',
      departmentId: itDeptId,
      description: 'ใช้สำหรับขออนุมัติจัดซื้อหรือเบิกจ่ายวัสดุ อุปกรณ์ฝึกวิชาชีพประจำห้องปฏิบัติการ',
      defaultOrigin: 'แผนกวิชาเทคโนโลยีสารสนเทศ',
      defaultReceiver: 'ผู้อำนวยการวิทยาลัยอาชีวศึกษาเชียงราย (ผ่านงานพัสดุ)',
      subjectPrefix: 'ขออนุมัติจัดซื้อวัสดุฝึกปฏิบัติการเพื่อใช้ในการเรียนการสอน',
      bodyContent: `ด้วย แผนกวิชา{{department}} มีความจำเป็นต้องใช้วัสดุและอุปกรณ์สำหรับการจัดการเรียนการสอนภาคปฏิบัติการ รายวิชา {{courseCode}} {{courseName}} ระดับ {{level}} ในภาคเรียนที่ {{term}}/{{year}} เพื่อให้นักศึกษาสามารถฝึกปฏิบัติได้อย่างมีประสิทธิภาพ

รายการวัสดุฝึกที่ขอจัดซื้อมีรายละเอียดดังนี้
1. {{item1}} จำนวน {{qty1}} {{unit1}}
2. {{item2}} จำนวน {{qty2}} {{unit2}}
3. {{item3}} จำนวน {{qty3}} {{unit3}}

รวมเป็นเงินทั้งสิ้นประมาณ {{estimatedCost}} บาท ({{estimatedCostText}}) ขออนุมัติเบิกจ่ายจากงบประมาณ{{budgetType}}

จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติให้งานพัสดุดำเนินการจัดซื้อต่อไป`,
      variablesJson: JSON.stringify([
        { key: 'department', label: 'แผนกวิชา', default: 'เทคโนโลยีสารสนเทศ' },
        { key: 'courseCode', label: 'รหัสวิชา', default: '20204-2002' },
        { key: 'courseName', label: 'ชื่อวิชา', default: 'ระบบเครือข่ายและสายสัญญาณ' },
        { key: 'level', label: 'ระดับชั้น', default: 'ปวช.2' },
        { key: 'term', label: 'ภาคเรียน', default: '1' },
        { key: 'year', label: 'ปีการศึกษา', default: '2569' },
        { key: 'item1', label: 'รายการที่ 1', default: 'สายเคเบิล UTP Cat6 (305 เมตร/กล่อง)' },
        { key: 'qty1', label: 'จำนวน 1', default: '2' },
        { key: 'unit1', label: 'หน่วยนับ 1', default: 'กล่อง' },
        { key: 'item2', label: 'รายการที่ 2', default: 'หัวต่อ RJ-45 Modular Plug (100 ชิ้น/แพ็ก)' },
        { key: 'qty2', label: 'จำนวน 2', default: '5' },
        { key: 'unit2', label: 'หน่วยนับ 2', default: 'แพ็ก' },
        { key: 'item3', label: 'รายการที่ 3', default: 'คีมย้ำหัว RJ-45 แบบมืออาชีพ' },
        { key: 'qty3', label: 'จำนวน 3', default: '10' },
        { key: 'unit3', label: 'หน่วยนับ 3', default: 'อัน' },
        { key: 'estimatedCost', label: 'วงเงินประมาณการ (บาท)', default: '8,500' },
        { key: 'estimatedCostText', label: 'วงเงิน (ตัวอักษร)', default: 'แปดพันห้าร้อยบาทถ้วน' },
        { key: 'budgetType', label: 'ประเภทงบประมาณ', default: 'เงินอุดหนุนรายหัวหมวดค่าจัดการเรียนการสอน' }
      ]),
      priority: 'NORMAL',
      tags: 'พัสดุ, วัสดุฝึก, เบิกจ่าย, จัดซื้อ, ห้องปฏิบัติการ',
      usageCount: 31,
      isActive: true,
    },
    {
      code: 'TPL-OUT-001',
      title: 'หนังสือภายนอกขอความอนุเคราะห์รับนักศึกษาฝึกประสบการณ์วิชาชีพ',
      category: 'OUTBOUND',
      departmentId: null,
      description: 'หนังสือส่งออกภายนอกเพื่อขอความร่วมมือจากสถานประกอบการในการรับนักศึกษาเข้าฝึกงาน',
      defaultOrigin: 'วิทยาลัยอาชีวศึกษาเชียงราย',
      defaultReceiver: 'กรรมการผู้จัดการ / ผู้จัดการฝ่ายทรัพยากรบุคคล {{companyName}}',
      subjectPrefix: 'ขอความอนุเคราะห์รับนักศึกษาเข้าฝึกประสบการณ์ทักษะวิชาชีพ',
      bodyContent: `ด้วย วิทยาลัยอาชีวศึกษาเชียงราย สังกัดสำนักงานคณะกรรมการการอาชีวศึกษา ได้จัดการเรียนการสอนหลักสูตรประกาศนียบัตรวิชาชีพ (ปวช.) และประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) ซึ่งกำหนดให้นักศึกษาต้องเข้ารับการฝึกประสบการณ์วิชาชีพในสถานประกอบการ เพื่อเพิ่มพูนทักษะ ความรู้ และประสบการณ์ตรงในการทำงาน

วิทยาลัยฯ พิจารณาเห็นว่า หน่วยงาน/สถานประกอบการของท่านเป็นองค์กรที่มีชื่อเสียงและมีความพร้อมในการเสริมสร้างทักษะวิชาชีพแก่นักศึกษา จึงใคร่ขอความอนุเคราะห์รับนักศึกษา สาขาวิชา{{major}} จำนวน {{studentCount}} คน เข้าฝึกประสบการณ์วิชาชีพ ระหว่างวันที่ {{startDate}} ถึงวันที่ {{endDate}} โดยมีรายชื่อดังเอกสารแนบ

วิทยาลัยอาชีวศึกษาเชียงราย หวังเป็นอย่างยิ่งว่าจะได้รับความอนุเคราะห์จากท่าน และขอขอบคุณมา ณ โอกาสนี้`,
      variablesJson: JSON.stringify([
        { key: 'companyName', label: 'ชื่อหน่วยงาน/บริษัท', default: 'บริษัท สามารถ ดิจิตอล จำกัด (มหาชน)' },
        { key: 'major', label: 'สาขาวิชา', default: 'เทคโนโลยีสารสนเทศ' },
        { key: 'studentCount', label: 'จำนวนนักศึกษา (คน)', default: '4' },
        { key: 'startDate', label: 'วันเริ่มต้นฝึก', default: '1 กันยายน 2569' },
        { key: 'endDate', label: 'วันสิ้นสุดการฝึก', default: '30 พฤศจิกายน 2569' }
      ]),
      priority: 'NORMAL',
      tags: 'หนังสือภายนอก, สถานประกอบการ, ทวิภาคี, ขอความอนุเคราะห์, ฝึกงาน',
      usageCount: 15,
      isActive: true,
    },
    {
      code: 'TPL-ORD-001',
      title: 'คำสั่งวิทยาลัยแต่งตั้งคณะกรรมการตรวจรับพัสดุและจัดซื้อจัดจ้าง',
      category: 'ORDER',
      departmentId: null,
      description: 'แบบฟอร์มคำสั่งแต่งตั้งคณะกรรมการตรวจรับพัสดุตามระเบียบกระทรวงการคลังฯ',
      defaultOrigin: 'งานพัสดุและสินทรัพย์ ฝ่ายบริหารทรัพยากร',
      defaultReceiver: 'บุคลากรผู้ได้รับการแต่งตั้งทุกคน',
      subjectPrefix: 'คำสั่งวิทยาลัยอาชีวศึกษาเชียงราย แต่งตั้งคณะกรรมการตรวจรับพัสดุ',
      bodyContent: `เพื่อให้การจัดซื้อ{{procurementTopic}} ของวิทยาลัยอาชีวศึกษาเชียงราย เป็นไปด้วยความถูกต้อง เรียบร้อย โปร่งใส และเป็นไปตามพระราชบัญญัติการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560 อาศัยอำนาจตามคำสั่งสำนักงานคณะกรรมการการอาชีวศึกษา จึงขอแต่งตั้งบุคคลต่อไปนี้เป็นคณะกรรมการตรวจรับพัสดุ

1. {{committeeHead}} ตำแหน่ง {{headPosition}} ประธานกรรมการ
2. {{committeeMember1}} ตำแหน่ง {{member1Position}} กรรมการ
3. {{committeeMember2}} ตำแหน่ง {{member2Position}} กรรมการและเลขานุการ

ให้คณะกรรมการที่ได้รับการแต่งตั้ง ปฏิบัติหน้าที่ตรวจรับพัสดุให้ถูกต้องตามรูปแบบ รายการ คุณลักษณะเฉพาะ และระยะเวลาที่กำหนดในสัญญาอย่างเคร่งครัด`,
      variablesJson: JSON.stringify([
        { key: 'procurementTopic', label: 'รายการจัดซื้อจัดจ้าง', default: 'อุปกรณ์คอมพิวเตอร์และระบบเครือข่าย ประจำปีงบประมาณ 2569' },
        { key: 'committeeHead', label: 'ชื่อประธานกรรมการ', default: 'นายประสิทธิ์ สุขสมบูรณ์' },
        { key: 'headPosition', label: 'ตำแหน่งประธาน', default: 'หัวหน้างานพัฒนาหลักสูตร' },
        { key: 'committeeMember1', label: 'ชื่อกรรมการคนที่ 1', default: 'นางสาวนภาพร เจริญยิ่ง' },
        { key: 'member1Position', label: 'ตำแหน่งกรรมการ 1', default: 'ครู แผนกวิชาการบัญชี' },
        { key: 'committeeMember2', label: 'ชื่อกรรมการและเลขานุการ', default: 'นายสมชาย ปัญญาดี' },
        { key: 'member2Position', label: 'ตำแหน่งเลขานุการ', default: 'ครู แผนกวิชาเทคโนโลยีสารสนเทศ' }
      ]),
      priority: 'NORMAL',
      tags: 'คำสั่ง, แต่งตั้ง, ตรวจรับพัสดุ, คณะกรรมการ, พัสดุ',
      usageCount: 42,
      isActive: true,
    },
    {
      code: 'TPL-CIR-001',
      title: 'ประกาศวิทยาลัยเรื่องกำหนดการลงทะเบียนและเปิด-ปิดภาคเรียน',
      category: 'CIRCULAR',
      departmentId: null,
      description: 'แบบฟอร์มประกาศกำหนดการลงทะเบียนเรียน และปฏิทินการศึกษาประจำภาคเรียน',
      defaultOrigin: 'งานทะเบียนและวัดผล ฝ่ายวิชาการ',
      defaultReceiver: 'นักเรียน นักศึกษา ครู และบุคลากรทางการศึกษา',
      subjectPrefix: 'ประกาศวิทยาลัยอาชีวศึกษาเชียงราย เรื่อง กำหนดการลงทะเบียนเรียนและเปิดภาคเรียน',
      bodyContent: `ตามที่ วิทยาลัยอาชีวศึกษาเชียงราย ได้กำหนดปฏิทินการศึกษา ประจำภาคเรียนที่ {{term}} ปีการศึกษา {{year}} นั้น เพื่อให้การลงทะเบียนเรียนและการจัดการเรียนการสอนเป็นไปด้วยความเรียบร้อย จึงขอประกาศกำหนดการสำคัญดังนี้

1. วันลงทะเบียนเรียนผ่านระบบออนไลน์: วันที่ {{regOnlineStart}} ถึง {{regOnlineEnd}}
2. วันเปิดภาคเรียนและเริ่มต้นการเรียนการสอน: วันที่ {{termStartDate}}
3. วันสุดท้ายของการเพิ่ม-ถอนรายวิชา: วันที่ {{addDropDeadline}}
4. วันสอบวัดผลปลายภาคเรียน: วันที่ {{examStartDate}} ถึง {{examEndDate}}

ทั้งนี้ ให้นักเรียน นักศึกษา ทุกระดับชั้นตรวจสอบผลการเรียนและตารางสอนผ่านระบบ New RMS ให้เรียบร้อย`,
      variablesJson: JSON.stringify([
        { key: 'term', label: 'ภาคเรียนที่', default: '1' },
        { key: 'year', label: 'ปีการศึกษา', default: '2569' },
        { key: 'regOnlineStart', label: 'เริ่มลงทะเบียน', default: '3 สิงหาคม 2569' },
        { key: 'regOnlineEnd', label: 'สิ้นสุดลงทะเบียน', default: '14 สิงหาคม 2569' },
        { key: 'termStartDate', label: 'วันเปิดภาคเรียน', default: '17 สิงหาคม 2569' },
        { key: 'addDropDeadline', label: 'กำหนดเพิ่ม-ถอน', default: '28 สิงหาคม 2569' },
        { key: 'examStartDate', label: 'เริ่มสอบปลายภาค', default: '14 ธันวาคม 2569' },
        { key: 'examEndDate', label: 'สิ้นสุดการสอบ', default: '18 ธันวาคม 2569' }
      ]),
      priority: 'NORMAL',
      tags: 'ประกาศ, หนังสือเวียน, ปฏิทินการศึกษา, ลงทะเบียน, เปิดภาคเรียน',
      usageCount: 29,
      isActive: true,
    }
  ];

  for (const t of templates) {
    await prisma.documentTemplate.upsert({
      where: { code: t.code },
      update: t,
      create: t,
    });
  }

  const count = await prisma.documentTemplate.count();
  console.log(`Document templates seeded successfully! Total templates: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
