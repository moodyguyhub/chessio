"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function updateSeoPage(formData: FormData) {
  const slug = String(formData.get("slug"));
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const ogTitle = String(formData.get("ogTitle") ?? "");
  const ogDescription = String(formData.get("ogDescription") ?? "");

  await db.seoPage.update({
    where: { slug },
    data: {
      title,
      description,
      ogTitle: ogTitle || null,
      ogDescription: ogDescription || null,
    },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/"); // Revalidate public pages too
}

export async function createSeoKeyword(formData: FormData) {
  const phrase = String(formData.get("phrase") ?? "");
  const intent = String(formData.get("intent") ?? "");
  const archetype = String(formData.get("archetype") ?? "");
  const notes = String(formData.get("notes") ?? "");
  const priority = Number(formData.get("priority") ?? 2);

  if (!phrase.trim()) return;

  await db.seoKeyword.create({
    data: {
      phrase: phrase.trim(),
      intent: intent.trim() || null,
      archetype: archetype.trim() || null,
      notes: notes.trim() || null,
      priority,
    },
  });

  revalidatePath("/admin/seo");
}
