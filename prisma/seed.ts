import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Parse the Prisma Postgres URL to get the underlying PostgreSQL connection
function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  // For Prisma Postgres URLs (prisma+postgres://), extract the real database URL
  if (databaseUrl.startsWith("prisma+postgres://")) {
    try {
      const url = new URL(databaseUrl);
      const apiKey = url.searchParams.get("api_key");
      if (apiKey) {
        const decoded = JSON.parse(Buffer.from(apiKey, "base64").toString());
        const pool = new Pool({ connectionString: decoded.databaseUrl });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
      }
    } catch {
      // Fall through to accelerateUrl approach
    }
    
    // Use accelerateUrl for Prisma Postgres
    return new PrismaClient({
      accelerateUrl: databaseUrl,
    });
  }
  
  // For standard PostgreSQL URLs, use direct connection
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

// Level 0: Learn the Pieces
const lessons = [
  {
    id: "level-0-lesson-1-board",
    slug: "board-basics",
    title: "The Chessboard",
    order: 1,
    pieceType: "Board",
    introText: "Welcome to chess! The chessboard has 64 squares arranged in an 8×8 grid. Each square has a unique name using a letter (a-h) and number (1-8). Let's learn how to read the board!",
    xpReward: 10,
    tasks: [
      {
        index: 1,
        instruction: "Find and tap the square e4. This is one of the most important squares in chess!",
        startingFen: "8/8/8/8/8/8/8/8 w - - 0 1", // Empty board
        goalType: "select",
        targetSquare: "e4",
        startSquare: null,
        validMoves: JSON.stringify(["e4"]),
        successMessage: "Perfect! The e4 square is right in the center. Controlling the center is key in chess!",
        failureDefault: "That's not e4. Remember: letters go left-to-right (a-h), numbers go bottom-to-top (1-8).",
        failureSpecific: null,
        hintMessage: "Look at the 4th row from the bottom, and the 5th column from the left (the 'e' file).",
      },
      {
        index: 2,
        instruction: "Now find d5 — another central square.",
        startingFen: "8/8/8/8/8/8/8/8 w - - 0 1",
        goalType: "select",
        targetSquare: "d5",
        startSquare: null,
        validMoves: JSON.stringify(["d5"]),
        successMessage: "Excellent! You're getting the hang of reading chess coordinates.",
        failureDefault: "Not quite. The 'd' file is the 4th column, and the 5th rank is row 5.",
        failureSpecific: null,
        hintMessage: "Count 4 columns from the left (a, b, c, d) and 5 rows from the bottom.",
      },
      {
        index: 3,
        instruction: "One more! Find h1 — the corner square where white's rook starts.",
        startingFen: "8/8/8/8/8/8/8/8 w - - 0 1",
        goalType: "select",
        targetSquare: "h1",
        startSquare: null,
        validMoves: JSON.stringify(["h1"]),
        successMessage: "You've mastered the basics! h1 is always a light square, and that's where the white king-side rook starts.",
        failureDefault: "h1 is in the bottom-right corner of the board.",
        failureSpecific: null,
        hintMessage: "Go all the way to the right (column h) and all the way to the bottom (row 1).",
      },
    ],
  },
  {
    id: "level-0-lesson-2-rook",
    slug: "the-rook",
    title: "The Rook",
    order: 2,
    pieceType: "Rook",
    introText: "The Rook is a powerful piece! It moves in straight lines — up, down, left, or right — as far as it wants. It cannot jump over other pieces, and it cannot move diagonally.",
    xpReward: 15,
    tasks: [
      {
        index: 1,
        instruction: "Move the Rook from e1 to e8. Rooks love open files!",
        startingFen: "8/8/8/8/8/8/8/4R3 w - - 0 1", // White rook on e1
        goalType: "move",
        targetSquare: "e8",
        startSquare: "e1",
        validMoves: JSON.stringify(["e1-e8"]),
        successMessage: "Great move! The Rook traveled the entire file in one move.",
        failureDefault: "Remember, Rooks move in straight lines. Try moving vertically to e8.",
        failureSpecific: JSON.stringify({
          "e1-f2": "Rooks cannot move diagonally! They only move in straight lines: up, down, left, or right.",
          "e1-d2": "Rooks cannot move diagonally! They only move in straight lines: up, down, left, or right.",
          "e1-f1": "That's a horizontal move, but we want to go to e8. Try moving up instead.",
        }),
        hintMessage: "Click the Rook on e1, then click e8 at the top of the same column.",
      },
      {
        index: 2,
        instruction: "Now move the Rook from a4 to h4, sweeping across the rank!",
        startingFen: "8/8/8/8/R7/8/8/8 w - - 0 1", // White rook on a4
        goalType: "move",
        targetSquare: "h4",
        startSquare: "a4",
        validMoves: JSON.stringify(["a4-h4"]),
        successMessage: "Excellent! Rooks are powerful on open ranks too.",
        failureDefault: "Move horizontally along the 4th rank to h4.",
        failureSpecific: JSON.stringify({
          "a4-b5": "Rooks cannot move diagonally! Try moving straight to the right.",
          "a4-b3": "Rooks cannot move diagonally! Try moving straight to the right.",
        }),
        hintMessage: "Keep the Rook on the 4th rank and slide it all the way to the right.",
      },
      {
        index: 3,
        instruction: "Capture the enemy pawn! Move your Rook to take it.",
        startingFen: "8/8/8/3p4/8/8/8/3R4 w - - 0 1", // White rook d1, black pawn d5
        goalType: "capture",
        targetSquare: "d5",
        startSquare: "d1",
        validMoves: JSON.stringify(["d1-d5"]),
        successMessage: "Captured! Rooks capture by moving onto the square of an enemy piece.",
        failureDefault: "The pawn is on d5. Move your Rook straight up to capture it.",
        failureSpecific: null,
        hintMessage: "Your Rook is on d1. The pawn is directly above on d5. Capture it!",
      },
    ],
  },
  {
    id: "level-0-lesson-3-bishop",
    slug: "the-bishop",
    title: "The Bishop",
    order: 3,
    pieceType: "Bishop",
    introText: "The Bishop moves diagonally — any number of squares, but only on diagonals. Each Bishop stays on its starting color forever: light-squared or dark-squared. That's why you start with two Bishops!",
    xpReward: 15,
    tasks: [
      {
        index: 1,
        instruction: "Move the Bishop from c1 to h6, sliding along the diagonal.",
        startingFen: "8/8/8/8/8/8/8/2B5 w - - 0 1", // White bishop on c1
        goalType: "move",
        targetSquare: "h6",
        startSquare: "c1",
        validMoves: JSON.stringify(["c1-h6"]),
        successMessage: "Beautiful diagonal! The Bishop covered 5 squares in one move.",
        failureDefault: "Bishops only move diagonally. Find the diagonal path to h6.",
        failureSpecific: JSON.stringify({
          "c1-c2": "Bishops cannot move straight! They only move diagonally.",
          "c1-d1": "Bishops cannot move straight! They only move diagonally.",
          "c1-b2": "That's a diagonal, but the wrong direction. We want to reach h6.",
        }),
        hintMessage: "From c1, go diagonally up and to the right. Count: d2, e3, f4, g5, h6.",
      },
      {
        index: 2,
        instruction: "Move the Bishop from f8 to a3.",
        startingFen: "5B2/8/8/8/8/8/8/8 w - - 0 1", // White bishop on f8
        goalType: "move",
        targetSquare: "a3",
        startSquare: "f8",
        validMoves: JSON.stringify(["f8-a3"]),
        successMessage: "Perfect! You're mastering diagonal movement.",
        failureDefault: "Find the diagonal from f8 down to a3.",
        failureSpecific: JSON.stringify({
          "f8-f7": "Bishops cannot move straight! Only diagonals.",
          "f8-e8": "Bishops cannot move straight! Only diagonals.",
        }),
        hintMessage: "From f8, go diagonally down and to the left: e7, d6, c5, b4, a3.",
      },
      {
        index: 3,
        instruction: "Capture the enemy Knight with your Bishop!",
        startingFen: "8/8/8/4n3/8/8/8/7B w - - 0 1", // White bishop h1, black knight e5
        goalType: "capture",
        targetSquare: "e4",
        startSquare: "h1",
        validMoves: JSON.stringify(["h1-e4"]),
        successMessage: "Got it! Bishops can be deadly on long diagonals.",
        failureDefault: "The Knight is on e4. Move your Bishop diagonally to capture it.",
        failureSpecific: null,
        hintMessage: "Your Bishop on h1 can reach e4 diagonally. That's where the Knight is!",
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding Level 0 lessons...\n");

  for (const lessonData of lessons) {
    const { tasks, ...lesson } = lessonData;
    
    // Upsert lesson
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: lesson,
      create: lesson,
    });
    
    console.log(`✅ Lesson: ${lesson.title}`);

    // Delete existing tasks and recreate
    await prisma.task.deleteMany({
      where: { lessonId: lesson.id },
    });

    // Create tasks
    for (const task of tasks) {
      await prisma.task.create({
        data: {
          ...task,
          lessonId: lesson.id,
        },
      });
      console.log(`   📝 Task ${task.index}: ${task.instruction.slice(0, 40)}...`);
    }
  }

  console.log("\n✨ Seed complete! Level 0 lessons ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
