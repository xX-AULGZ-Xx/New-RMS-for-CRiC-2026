# New RMS for CRiC 2026 (ระบบบริหารจัดการสถานศึกษาอาชีวศึกษา ยุคใหม่)

ระบบสารสนเทศเพื่อการบริหารจัดการสถานศึกษาอาชีวศึกษา (Resource Management System: New RMS) ออกแบบตามสถาปัตยกรรมสมัยใหม่สำหรับวิทยาลัยอาชีวศึกษา เพื่อทดแทนระบบ RMS เดิมที่ล้าสมัย โดยมุ่งเน้นความสะดวกในการใช้งานบนสมาร์ทโฟน ความปลอดภัย และระบบสารบรรณอิเล็กทรอนิกส์ที่รวดเร็ว

---

## 🚀 จุดเด่นหลักของระบบ (Key Highlights)

1. **Mobile-First & PWA:** ใช้งานได้ไหลลื่นทั้งบนสมาร์ทโฟน แท็บเล็ต และคอมพิวเตอร์
2. **ระบบสารบรรณและเกษียณหนังสืออิเล็กทรอนิกส์ (E-Document):** 
   - รองรับลายเซ็นดิจิทัล + ยืนยันรหัส PIN 6 หลัก
   - ประทับตราเวลา (Timestamp) และฝัง QR Code ตรวจสอบเอกสารจริง
3. **ระบบเช็คชื่อนักเรียนและกิจกรรมแบบไฮบริด:**
   - Fast 1-Click บนมือถือสำหรับครูที่ปรึกษา
   - รองรับการเชื่อมต่อข้อมูลกับเครื่องสแกนลายนิ้วมือ/สแกนบัตรเดิมของวิทยาลัย
   - แจ้งเตือนผู้ปกครองผ่าน LINE Official Account
4. **ระบบลงเวลาปฏิบัติราชการครูและบุคลากร (HR Time Attendance):**
   - ตรวจสอบพิกัด GPS Geofencing ในรัศมีวิทยาลัย + ตรวจสอบ Wi-Fi วิทยาลัย
   - ระบบขอลาและอนุมัติวันลาออนไลน์
5. **งานวิชาการและการส่งต่อผลการเรียน (Academics):**
   - เก็บคะแนนตามสมรรถนะ
   - มีระบบ Export/Import ข้อมูลเกรดที่เข้ากันได้กับระบบ **ศธ.02 ออนไลน์ (สอศ.)**
6. **การยืนยันตัวตนและการรักษาความปลอดภัย:**
   - รองรับ Google Workspace SSO (เมลสถานศึกษา เช่น `@cric.ac.th`)
   - รองรับการเข้าสู่ระบบด้วย LINE และ Username/เลขบัตร ปชช.
   - สิทธิ์การใช้งานแบบ Role-Based Access Control (RBAC) ตามโครงสร้างราชการ

---

## 🛠️ สถาปัตยกรรมและเทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** Next.js 15 (React, TypeScript), Tailwind CSS, Shadcn UI, Lucide Icons, Canvas Signature Pad
- **Backend API:** Node.js (NestJS / Express) หรือ Python FastAPI
- **Database:** PostgreSQL 16 + Redis (Caching & Job Queues)
- **Object Storage:** MinIO / Cloud S3 สำหรับจัดเก็บไฟล์เอกสารและรูปภาพ
- **Deployment:** Docker & Docker Compose (รองรับทั้ง Local Server วิทยาลัย และ Cloud VPS)

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure Overview)

```
New RMS For CRiC 2026/
├── apps/
│   ├── web/               # Next.js Frontend Application
│   └── api/               # Backend API Application
├── packages/
│   ├── database/          # Prisma / Drizzle ORM Schema & Migrations
│   └── shared-types/      # TypeScript Shared Data Types & DTOs
├── tools/
│   ├── biometric-agent/   # Agent ดึงข้อมูลเครื่องสแกนนิ้วเดิม
│   └── migration/         # สคริปต์ย้ายข้อมูลจาก RMS MySQL เดิม
├── docs/
│   └── ARCHITECTURAL_BLUEPRINT.md # พิมพ์เขียวการออกแบบระบบโดยละเอียด
└── docker-compose.yml     # สำหรับรันระบบพร้อมฐานข้อมูล
```

---

## 📖 เอกสารการออกแบบโดยละเอียด
ดูรายละเอียดโครงสร้างฐานข้อมูล เวิร์กโฟลว์ และรายละเอียดสถาปัตยกรรมได้ที่:
- [docs/ARCHITECTURAL_BLUEPRINT.md](docs/ARCHITECTURAL_BLUEPRINT.md)
