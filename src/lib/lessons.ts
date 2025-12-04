// Data structure for Level 0 Lessons

export type Task = {
  id: number;
  instruction: string;
  startingFen: string; // Using standard FEN notation
  goal: {
    type: "move" | "capture" | "select";
    targetSquare: string; // e.g., "a5"
    startSquare?: string; // e.g., "a1"
  };
  validMoves?: string[]; // "a1-a5"
  messages: {
    success: string;
    failure: {
      default: string;
      specific?: Record<string, string>; // { "e1-h4": "No diagonals!" }
    };
    hint: string;
  };
};

export type Lesson = {
  slug: string;
  title: string;
  pieceType: string;
  introText: string;
  order: number;
  tasks: Task[];
};

export const level0Lessons: Lesson[] = [
  {
    slug: "level-0-lesson-1-board",
    title: "Welcome to the Board",
    pieceType: "Board",
    introText: "The chessboard is a grid of 64 squares, alternating between light and dark colors. The board has vertical columns (called files) and horizontal rows (called ranks). Every square has a unique name, like a1 or e4.",
    order: 1,
    tasks: [
      {
        id: 1,
        instruction: "Click on any square in the highlighted row (Rank 4).",
        startingFen: "8/8/8/8/8/8/8/8 w - - 0 1", // Empty board
        goal: { type: "select", targetSquare: "rank-4" }, // Special logic for generic rank selection
        messages: {
          success: "Perfect. That horizontal line is called a 'Rank'.",
          failure: { default: "That square isn't in the highlighted row. Try clicking inside the glow." },
          hint: "Look for the horizontal row labeled with the number '4' on the side."
        }
      },
      {
        id: 2,
        instruction: "Click on any square in the highlighted column (the 'e' file).",
        startingFen: "8/8/8/8/8/8/8/8 w - - 0 1",
        goal: { type: "select", targetSquare: "file-e" },
        messages: {
          success: "You got it. That vertical line is called a 'File'.",
          failure: { default: "That square isn't in the highlighted column. Look for the vertical strip." },
          hint: "Look for the letter 'e' at the bottom of the board and follow it up."
        }
      },
      {
        id: 3,
        instruction: "Find and click the square named e4.",
        startingFen: "8/8/8/8/8/8/8/8 w - - 0 1",
        goal: { type: "select", targetSquare: "e4" },
        messages: {
          success: "Nice work! That is one of the most important squares in chess.",
          failure: { default: "Not quite. Look for where column 'e' and row '4' meet." },
          hint: "Find the letter 'e' at the bottom and the number '4' on the side. The square is where they cross."
        }
      }
    ]
  },
  {
    slug: "level-0-lesson-2-rook",
    title: "How the Rook Moves",
    pieceType: "Rook",
    introText: "The Rook looks like a castle tower. It moves in straight lines: up, down, left, or right. It can move as far as it wants until it hits the edge of the board or another piece.",
    order: 2,
    tasks: [
      {
        id: 1,
        instruction: "Move the Rook forward to the star on a5.",
        startingFen: "8/8/8/8/8/8/8/R7 w - - 0 1", // White rook on a1
        goal: { type: "move", startSquare: "a1", targetSquare: "a5" },
        validMoves: ["a1-a5"],
        messages: {
          success: "Great start. Rooks are powerful on open lines.",
          failure: { default: "That move isn't allowed. Rooks must stay in a straight line." },
          hint: "Click the Rook, then click the square with the star (a5)."
        }
      },
      {
        id: 2,
        instruction: "Now, move the Rook sideways to h5.",
        startingFen: "8/8/8/3R4/8/8/8/8 w - - 0 1", // White rook on a5 (simulated start)
        goal: { type: "move", startSquare: "a5", targetSquare: "h5" },
        validMoves: ["a5-h5"],
        messages: {
          success: "Exactly right. Rooks can cross the whole board in one turn.",
          failure: { default: "That move isn't allowed. Try moving straight across the row." },
          hint: "The Rook is on row 5. Move it all the way to the right side of the board."
        }
      },
      {
        id: 3,
        instruction: "Move the Rook to capture the black pawn on e8.",
        startingFen: "4p3/8/8/8/8/8/8/4R3 w - - 0 1", // Rook e1, Pawn e8
        goal: { type: "capture", startSquare: "e1", targetSquare: "e8" },
        validMoves: ["e1-e8"],
        messages: {
          success: "Capture successful! You moved in a straight line.",
          failure: {
            default: "That move isn't allowed. Rooks cannot move diagonally.",
            specific: { "e1-h4": "That move isn't allowed. Rooks cannot move diagonally." }
          },
          hint: "The pawn is straight ahead. Move the Rook all the way up the 'e' column."
        }
      }
    ]
  },
  {
    slug: "level-0-lesson-3-bishop",
    title: "How the Bishop Moves",
    pieceType: "Bishop",
    introText: "The Bishop moves diagonally, like an 'X'. It can go as far as it wants, but it must stay on squares of the same color. A Bishop starting on a light square will never touch a dark square.",
    order: 3,
    tasks: [
      {
        id: 1,
        instruction: "Move the Bishop diagonally to e4.",
        startingFen: "8/8/8/8/8/8/2B5/8 w - - 0 1", // Bishop c2
        goal: { type: "move", startSquare: "c2", targetSquare: "e4" },
        validMoves: ["c2-e4"],
        messages: {
          success: "Nice move. Notice how the Bishop stayed on light squares.",
          failure: { default: "That move isn't allowed. Bishops must move diagonally." },
          hint: "The target is two squares up and two squares to the right."
        }
      },
      {
        id: 2,
        instruction: "Move the Bishop all the way across the board to h1.",
        startingFen: "B7/8/8/8/8/8/8/8 w - - 0 1", // Bishop a8
        goal: { type: "move", startSquare: "a8", targetSquare: "h1" },
        validMoves: ["a8-h1"],
        messages: {
          success: "Perfect. Bishops are great at controlling long diagonals.",
          failure: { default: "Not quite. Follow the diagonal line of light squares." },
          hint: "Imagine a diagonal line connecting the top-left corner to the bottom-right corner."
        }
      },
      {
        id: 3,
        instruction: "Move the Bishop to capture the pawn on a7.",
        startingFen: "8/p7/8/8/8/4B3/8/8 w - - 0 1", // Bishop e3, Pawn a7
        goal: { type: "capture", startSquare: "e3", targetSquare: "a7" },
        validMoves: ["e3-a7"],
        messages: {
          success: "Capture successful! You stayed on the diagonal.",
          failure: {
            default: "That move isn't allowed. Bishops cannot move up, down, left, or right.",
            specific: { "e3-e7": "That move isn't allowed. Bishops cannot move straight up." }
          },
          hint: "The pawn is on a diagonal path from your Bishop. Do not go straight up."
        }
      }
    ]
  }
];
