"use server";

"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateArticleStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));

  await db.articleIdea.update({
    where: { id },
    data: { 
      status: status as "DRAFT" | "OUTLINED" | "WRITING" | "LIVE",
      updatedAt: new Date()
    },
  });

  revalidatePath("/admin/content");
}
