"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export interface DocumentTemplateItem {
  id: string;
  code: string;
  title: string;
  category: string; // MEMO, OUTBOUND, ORDER, CIRCULAR, FORM
  departmentId?: string | null;
  departmentName?: string | null;
  description?: string | null;
  defaultOrigin?: string | null;
  defaultReceiver?: string | null;
  subjectPrefix?: string | null;
  bodyContent: string;
  variablesJson?: string | null;
  priority: "NORMAL" | "URGENT" | "VERY_URGENT" | "MOST_URGENT";
  sampleFileUrl?: string | null;
  tags?: string | null;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 1. Get all templates with filtering and search
export async function getDocumentTemplatesAction(filters?: {
  category?: string;
  departmentId?: string;
  search?: string;
}) {
  try {
    const where: any = {};

    if (filters?.category && filters.category !== "ALL") {
      where.category = filters.category;
    }

    if (filters?.departmentId && filters.departmentId !== "ALL") {
      if (filters.departmentId === "CENTRAL") {
        where.departmentId = null;
      } else {
        where.departmentId = filters.departmentId;
      }
    }

    if (filters?.search && filters.search.trim() !== "") {
      const q = filters.search.trim();
      where.OR = [
        { code: { contains: q } },
        { title: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
        { bodyContent: { contains: q } },
      ];
    }

    const items = await prisma.documentTemplate.findMany({
      where,
      include: {
        department: true,
      },
      orderBy: [{ usageCount: "desc" }, { createdAt: "desc" }],
    });

    const templates: DocumentTemplateItem[] = items.map((t) => ({
      id: t.id,
      code: t.code,
      title: t.title,
      category: t.category,
      departmentId: t.departmentId,
      departmentName: t.department?.name || null,
      description: t.description,
      defaultOrigin: t.defaultOrigin,
      defaultReceiver: t.defaultReceiver,
      subjectPrefix: t.subjectPrefix,
      bodyContent: t.bodyContent,
      variablesJson: t.variablesJson,
      priority: t.priority as any,
      sampleFileUrl: t.sampleFileUrl,
      tags: t.tags,
      usageCount: t.usageCount,
      isActive: t.isActive,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    const departments = await prisma.department.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    });

    return {
      success: true,
      templates,
      departments,
    };
  } catch (error: any) {
    console.error("getDocumentTemplatesAction error:", error);
    return {
      success: false,
      error: error.message,
      templates: [],
      departments: [],
    };
  }
}

// 2. Get single template by ID
export async function getTemplateByIdAction(id: string) {
  try {
    const template = await prisma.documentTemplate.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });

    if (!template) {
      return { success: false, error: "ไม่พบแม่แบบเอกสารที่ต้องการ" };
    }

    return {
      success: true,
      template: {
        id: template.id,
        code: template.code,
        title: template.title,
        category: template.category,
        departmentId: template.departmentId,
        departmentName: template.department?.name || null,
        description: template.description,
        defaultOrigin: template.defaultOrigin,
        defaultReceiver: template.defaultReceiver,
        subjectPrefix: template.subjectPrefix,
        bodyContent: template.bodyContent,
        variablesJson: template.variablesJson,
        priority: template.priority as any,
        sampleFileUrl: template.sampleFileUrl,
        tags: template.tags,
        usageCount: template.usageCount,
        isActive: template.isActive,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 3. Save (Create or Update) template
export async function saveDocumentTemplateAction(data: {
  id?: string;
  code: string;
  title: string;
  category: string;
  departmentId?: string | null;
  description?: string;
  defaultOrigin?: string;
  defaultReceiver?: string;
  subjectPrefix?: string;
  bodyContent: string;
  variablesJson?: string;
  priority?: "NORMAL" | "URGENT" | "VERY_URGENT" | "MOST_URGENT";
  sampleFileUrl?: string;
  tags?: string;
  isActive?: boolean;
}) {
  try {
    if (!data.code || !data.title || !data.bodyContent) {
      return {
        success: false,
        error: "กรุณากรอกรหัสแบบฟอร์ม ชื่อแบบฟอร์ม และเนื้อหาแม่แบบให้ครบถ้วน",
      };
    }

    const payload = {
      code: data.code.trim().toUpperCase(),
      title: data.title.trim(),
      category: data.category || "MEMO",
      departmentId:
        data.departmentId && data.departmentId !== "ALL" && data.departmentId !== "CENTRAL"
          ? data.departmentId
          : null,
      description: data.description?.trim() || null,
      defaultOrigin: data.defaultOrigin?.trim() || null,
      defaultReceiver: data.defaultReceiver?.trim() || null,
      subjectPrefix: data.subjectPrefix?.trim() || null,
      bodyContent: data.bodyContent.trim(),
      variablesJson: data.variablesJson?.trim() || null,
      priority: data.priority || "NORMAL",
      sampleFileUrl: data.sampleFileUrl?.trim() || null,
      tags: data.tags?.trim() || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };

    if (data.id) {
      await prisma.documentTemplate.update({
        where: { id: data.id },
        data: payload,
      });
    } else {
      // Check existing code
      const existing = await prisma.documentTemplate.findUnique({
        where: { code: payload.code },
      });
      if (existing) {
        return {
          success: false,
          error: `รหัสแม่แบบ ${payload.code} มีอยู่ในระบบแล้ว`,
        };
      }

      await prisma.documentTemplate.create({
        data: payload,
      });
    }

    revalidatePath("/edoc");
    revalidatePath("/edoc/templates");
    revalidatePath("/edoc/create");
    return { success: true };
  } catch (error: any) {
    console.error("saveDocumentTemplateAction error:", error);
    return { success: false, error: error.message };
  }
}

// 4. Delete template
export async function deleteDocumentTemplateAction(id: string) {
  try {
    await prisma.documentTemplate.delete({
      where: { id },
    });

    revalidatePath("/edoc");
    revalidatePath("/edoc/templates");
    revalidatePath("/edoc/create");
    return { success: true };
  } catch (error: any) {
    console.error("deleteDocumentTemplateAction error:", error);
    return { success: false, error: error.message };
  }
}

// 5. Increment usage count
export async function incrementTemplateUsageAction(id: string) {
  try {
    await prisma.documentTemplate.update({
      where: { id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
