// scripts/export-lessons-to-md.ts
import fs from "fs";
import path from "path";

// Import lesson data from lessons.ts
import { lessons, type Lesson, type LessonTask } from "../src/lib/lessons";

function taskToMarkdown(task: LessonTask, index: number): string {
  const hint = task.messages?.hint ? `\n   - _Hint:_ ${task.messages.hint}` : "";
  
  // Add task type context for clarity
  let typeInfo = "";
  if (task.kind === "select-square") {
    typeInfo = ` _(Select ${task.targetSquare})_`;
  } else if (task.kind === "move-piece") {
    typeInfo = ` _(Move ${task.expectedMove.from} → ${task.expectedMove.to})_`;
  }
  
  return `${index + 1}. **Task ${index + 1}:** ${task.prompt}${typeInfo}${hint}`;
}

function lessonToMarkdown(lesson: Lesson): string {
  const header = `## Level ${lesson.level} – ${lesson.title}\n`;
  const description = lesson.description ? `${lesson.description}\n\n` : "";
  const xp = `> XP Reward: ${lesson.xpReward}\n`;
  const slug = `> Slug: \`${lesson.slug}\`\n\n`;

  const tasks = lesson.tasks
    .map((task, index) => taskToMarkdown(task, index))
    .join("\n");

  return `${header}${description}${xp}${slug}${tasks}\n`;
}

function main() {
  const intro = `# Chessio – Lesson Outline\n\n_Exported for review_\n\n**Total Lessons:** ${lessons.length}\n\n`;
  
  // Group by level
  const byLevel = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.level]) acc[lesson.level] = [];
    acc[lesson.level].push(lesson);
    return acc;
  }, {} as Record<number, Lesson[]>);

  let body = "";
  Object.keys(byLevel)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((level) => {
      body += `# Level ${level}\n\n`;
      body += byLevel[Number(level)]
        .map(lessonToMarkdown)
        .join("\n---\n\n");
      body += "\n\n";
    });

  const md = intro + body;

  const outPath = path.join(process.cwd(), "chessio-lessons-export.md");
  fs.writeFileSync(outPath, md, "utf8");

  console.log(`✅ Exported ${lessons.length} lessons to ${outPath}`);
}

main();
