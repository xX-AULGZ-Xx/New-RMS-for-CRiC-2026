# Architectural Blueprint & Development Roadmap: New RMS 2026
**Project:** New Resource Management System for Vocational Education (CRiC 2026)  
**Document Version:** 1.0

---

## 1. Requirement Summary Matrix (ผลสรุปความต้องการจากการวิเคราะห์)

| ลำดับ | หัวข้อระบบ | ความต้องการที่ตกลงร่วมกัน | แนวทางทางเทคนิค (Implementation Strategy) |
|---|---|---|---|
| 1 | **ขอบเขตระบบ (Scope)** | ระบบบริหารจัดการครบวงจร (All-in-One): สารบรรณ, บุคลากร, กิจการนักเรียน, วิชาการ, พัสดุ | พัฒนาแบบ Modular Monolith หรือ Monorepo เพื่อการแชร์ Type และง่ายต่อการดูแล |
| 2 | **Tech Stack** | Modern Full-Stack (Next.js + Node.js/NestJS + PostgreSQL) | ใช้ Next.js สำหรับ Frontend/PWA + NestJS สำหรับ REST/WebSocket API + Prisma/Drizzle ORM |
| 3 | **Authentication** | Google Workspace SSO (@สถานศึกษา) + รหัสผ่าน/เลขบัตร + LINE Login | NextAuth.js / Supabase Auth / Passport.js พร้อม JWT Token และระบบสิทธิ์ RBAC ตามตำแหน่งราชการ |
| 4 | **E-Document & Signature** | ลายเซ็นวาด/ภาพลายเซ็น + ยืนยัน PIN 6 หลัก + Timestamp + QR Code | HTML5 Canvas Signature + Cryptographic Hash (SHA-256) + PDF-Lib ประทับตรายางและ QR Code ลงบนไฟล์ PDF |
| 5 | **Student Attendance** | แบบไฮบริด: ครูเช็คผ่านมือถือ (1-Click) + รับข้อมูลจากเครื่องสแกนเดิม + LINE Alert | PWA Fast-Check UI + TCP/IP Socket Adapter เชื่อมต่อเครื่องสแกนลายนิ้วมือ/บัตร + LINE Messaging API |
| 6 | **HR Time Attendance** | สมาร์ทโฟนด้วย Geofencing (GPS รัศมีวิทยาลัย) + Wi-Fi SSID Check + เครื่องสแกนเดิม | Geolocation API ตรวจสอบระยะทาง (Haversine formula) + Network SSID Hash + รวมข้อมูลเวลาเข้างาน |
| 7 | **Academic & ศธ.02** | เก็บคะแนนสมรรถนะ + ระบบ Export/Import ส่งต่อ ศธ.02 ออนไลน์ | Template Generator แปลงผลการเรียนเป็นไฟล์ชีตตามโครงสร้างมาตรฐานของ ศธ.02 สอศ. |
| 8 | **Infrastructure** | Hybrid Containerized (Docker Compose) | Dockerfile & Docker Compose พร้อมคอนฟิก Nginx, PostgreSQL, Redis, MinIO S3 |
| 9 | **Data Migration** | เครื่องมือ Migration ดึงข้อมูลจาก MySQL ของ RMS เดิม | ETL Script (Node.js/Python) สกัดข้อมูลบุคลากร นักเรียน แผนกวิชา และทำ Data Cleansing อัตโนมัติ |

---

## 2. โครงสร้างฐานข้อมูลเบื้องต้น (Initial Prisma Schema Concept)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  SUPERADMIN
  EXECUTIVE        // ผู้อำนวยการ / รองผู้อำนวยการ
  HEAD_DEPARTMENT  // หัวหน้าแผนกวิชา / หัวหน้างาน
  TEACHER          // ครูผู้สอน / ครูที่ปรึกษา
  STAFF            // เจ้าหน้าที่ธุรการ / สารบรรณ / พัสดุ
  STUDENT          // นักเรียน นักศึกษา
  PARENT           // ผู้ปกครอง
}

enum DocumentStatus {
  DRAFT
  ROUTING          // กำลังเสนอตามลำดับขั้น
  ENDORSED         // เกษียณสั่งการแล้ว
  APPROVED         // อนุมัติเรียบร้อย
  REJECTED         // ตีกลับ / แก้ไข
  ARCHIVED         // จัดเก็บเข้าแฟ้ม
}

enum AttendanceStatus {
  PRESENT          // มา
  LATE             // สาย
  LEAVE            // ลา
  ABSENT           // ขาด
}

model User {
  id               String       @id @default(uuid())
  citizenId        String?      @unique
  email            String       @unique
  fullName         String
  role             UserRole     @default(TEACHER)
  pinHash          String?      // รหัส PIN 6 หลักสำหรับยืนยันการเซ็นเอกสาร
  signatureImageUrl String?    // URL ลายเซ็นดิจิทัลที่บันทึกไว้
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  personnelProfile PersonnelProfile?
  studentProfile   StudentProfile?
  documentsCreated Document[]
  signatures       DocumentSignature[]
}

model PersonnelProfile {
  id             String      @id @default(uuid())
  userId         String      @unique
  user           User        @relation(fields: [userId], references: [id])
  employeeId     String?     @unique
  position       String
  departmentId   String
  department     Department  @relation(fields: [departmentId], references: [id])
  timeLogs       TimeLog[]
  leaveRequests  LeaveRequest[]
}

model StudentProfile {
  id             String          @id @default(uuid())
  userId         String          @unique
  user           User            @relation(fields: [userId], references: [id])
  studentCode    String          @unique
  classroomId    String
  classroom      Classroom       @relation(fields: [classroomId], references: [id])
  attendances    AttendanceLog[]
}

model Department {
  id             String             @id @default(uuid())
  name           String
  code           String             @unique
  personnel      PersonnelProfile[]
  classrooms     Classroom[]
}

model Classroom {
  id             String           @id @default(uuid())
  name           String           // เช่น ชฟ. 1/1, ชส. 2/2
  departmentId   String
  department     Department       @relation(fields: [departmentId], references: [id])
  students       StudentProfile[]
}

model Document {
  id                String              @id @default(uuid())
  docNumber         String?             // เลขที่หนังสือ (ระบบออกให้อัตโนมัติ)
  title             String
  description       String?
  originalPdfUrl    String
  stampedPdfUrl     String?
  status            DocumentStatus      @default(DRAFT)
  creatorId         String
  creator           User                @relation(fields: [creatorId], references: [id])
  qrToken           String              @unique @default(uuid())
  routings          DocumentRouting[]
  signatures        DocumentSignature[]
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
}

model DocumentRouting {
  id           String     @id @default(uuid())
  documentId   String
  document     Document   @relation(fields: [documentId], references: [id])
  stepOrder    Int
  targetUserId String
  actionNotes  String?    // ข้อคิดเห็น / ข้อความเกษียณ
  isCompleted  Boolean    @default(false)
}

model DocumentSignature {
  id           String    @id @default(uuid())
  documentId   String
  document     Document  @relation(fields: [documentId], references: [id])
  signerId     String
  signer       User      @relation(fields: [signerId], references: [id])
  signatureUrl String
  pinVerified  Boolean   @default(true)
  timestamp    DateTime  @default(now())
  ipAddress    String?
}

model AttendanceLog {
  id          String           @id @default(uuid())
  studentId   String
  student     StudentProfile   @relation(fields: [studentId], references: [id])
  date        DateTime         @default(now())
  status      AttendanceStatus @default(PRESENT)
  source      String           // TEACHER_APP / FINGERPRINT
  recordedBy  String?
}

model TimeLog {
  id          String           @id @default(uuid())
  personnelId String
  personnel   PersonnelProfile @relation(fields: [personnelId], references: [id])
  timestamp   DateTime         @default(now())
  type        String           // CHECK_IN / CHECK_OUT
  latitude    Float?
  longitude   Float?
  wifiSsid    String?
  isVerified  Boolean          @default(true)
}

model LeaveRequest {
  id          String           @id @default(uuid())
  personnelId String
  personnel   PersonnelProfile @relation(fields: [personnelId], references: [id])
  leaveType   String           // SICK / BUSINESS / VACATION
  startDate   DateTime
  endDate     DateTime
  reason      String?
  attachmentUrl String?
  status      String           @default("PENDING")
}
```

---

## 3. แผนการพัฒนาแบบเป็นระยะ (Roadmap & Milestones)

- **Sprint 1 (Core Foundation & Auth):**
  - Setup Monorepo (Next.js 15, PostgreSQL, Prisma, Docker Compose)
  - พัฒนาระบบยืนยันตัวตน Google Workspace SSO + Local Auth + สิทธิ์ RBAC
  - ฐานข้อมูลผู้ใช้ ครู บุคลากร และโครงสร้างแผนกวิชา

- **Sprint 2 (E-Document & Signature Workflow):**
  - หน้าจอสร้างเอกสารและส่งต่อตามลำดับชั้นการเกษียณหนังสือ
  - โมดูลวาดลายเซ็น / ลายเซ็นกราฟิก + ระบบยืนยัน PIN 6 หลัก
  - ตัวแปลงประทับตรายางสารบรรณและ QR Code ลงบนไฟล์ PDF แบบอัตโนมัติ

- **Sprint 3 (Attendance & Time Tracking):**
  - หน้าจอ Fast 1-Click เช็คชื่อนักเรียนหน้าเสาธง/โฮมรูมบนมือถือ
  - ระบบลงเวลาปฏิบัติราชการครูด้วย GPS Geofencing + Wi-Fi Check
  - ตัวเชื่อมต่อข้อมูลจากเครื่องสแกนลายนิ้วมือเดิม

- **Sprint 4 (Academics, Notification & Migration):**
  - โมดูลบันทึกคะแนนสมรรถนะและ Export เข้า ศธ.02
  - ระบบแจ้งเตือนผู้ปกครองผ่าน LINE Official Account
  - สคริปต์ Migration ข้อมูลจากระบบ RMS เดิม
