/**
 * Chessio Task vs Board QA Validator (Vega)
 * 
 * Systematic QA pass to check whether each task in lessons matches the board and copy.
 * Runs 6 validation checks:
 * 1. Side to move consistency
 * 2. Objective vs reality (mate-in-1, win material, defend king)
 * 3. Single vs multi-solution validation
 * 4. Legal & thematic match
 * 5. Feedback message quality
 * 6. XP vs difficulty calibration
 */

import fs from 'fs/promises';
import path from 'path';
import { Chess } from 'chess.js';
import type { Lesson, LessonTask } from '../src/lib/school/types';

// ============================================
// DATA DISCOVERY
// ============================================

/**
 * Data Model Discovery Notes:
 * 
 * Lessons stored in: data/chessio/levels/level-N/lesson-*.json
 * 
 * Task structure:
 * - id: string (unique task ID)
 * - fen: string (board position)
 * - prompt: string (user-facing instruction)
 * - type: 'move' (only type for now)
 * - correctMoves: string[] (UCI format like "e1f1")
 * - successMessage?: string
 * - failPatternIds?: string[]
 * - failureHints?: MoveHint[]
 * 
 * Lesson structure:
 * - id: string
 * - level: number (0-10)
 * - order: number
 * - slug: string
 * - title: string
 * - XP: number
 * - coachIntro: string
 * - summary: string
 * - tasks: LessonTask[]
 * - secretCardId?: string
 * 
 * Board rendering:
 * - Chessboard component uses FEN directly
 * - No explicit sideToMove field in tasks (extracted from FEN)
 * - Board orientation is fixed to white (bottom = white)
 * - User always plays white in current implementation
 */

// ============================================
// TYPES
// ============================================

type ValidationSeverity = 'error' | 'warn' | 'needsHumanReview';

interface ValidationIssue {
  taskId: string;
  lessonId: string;
  level: number;
  type: string;
  severity: ValidationSeverity;
  details: string;
}

interface XpStats {
  objectiveType: string;
  level: number;
  avgXp: number;
  minXp: number;
  maxXp: number;
  count: number;
}

type ObjectiveType = 
  | 'mateIn1' 
  | 'winMaterial' 
  | 'defendKing' 
  | 'fork'
  | 'pin'
  | 'skewer'
  | 'development'
  | 'endgame'
  | 'other';

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if FEN is a simplified teaching position (missing kings)
 */
function isSimplifiedFen(fen: string): boolean {
  const position = fen.split(' ')[0];
  
  // Count kings (case-sensitive)
  const whiteKings = (position.match(/K/g) || []).length;
  const blackKings = (position.match(/k/g) || []).length;
  
  return whiteKings !== 1 || blackKings !== 1;
}

/**
 * Try to make a FEN valid for chess.js by adding missing kings
 * Places them in safe squares if missing
 */
function normalizeFen(fen: string): string {
  const parts = fen.split(' ');
  let position = parts[0];
  
  const whiteKings = (position.match(/K/g) || []).length;
  const blackKings = (position.match(/k/g) || []).length;
  
  // If both kings present, return as-is
  if (whiteKings === 1 && blackKings === 1) {
    return fen;
  }
  
  // For simplified FENs, just add dummy kings to make chess.js happy
  // This is hacky but good enough for validation purposes
  
  if (whiteKings === 0) {
    // Add white king to h1
    position = position + '/7K';
  }
  
  if (blackKings === 0) {
    // Prepend black king to a8
    const ranks = position.split('/');
    ranks[0] = 'k' + ranks[0];
    position = ranks.join('/');
  }
  
  return [position, ...parts.slice(1)].join(' ');
}

/**
 * Extract side to move from FEN
 */
function getSideToMove(fen: string): 'w' | 'b' {
  const parts = fen.split(' ');
  return (parts[1] === 'b' ? 'b' : 'w') as 'w' | 'b';
}

/**
 * Infer objective type from prompt and lesson context
 */
function inferObjectiveType(task: LessonTask, lesson: Lesson): ObjectiveType {
  const prompt = task.prompt.toLowerCase();
  const title = lesson.title.toLowerCase();
  
  // Checkmate patterns
  if (prompt.includes('checkmate') || prompt.includes('mate')) {
    return 'mateIn1';
  }
  
  // Defense patterns
  if (prompt.includes('in check') || prompt.includes('defend') || 
      prompt.includes('escape') || prompt.includes('protect your king')) {
    return 'defendKing';
  }
  
  // Tactical themes
  if (title.includes('fork') || prompt.includes('attack two') || prompt.includes('fork')) {
    return 'fork';
  }
  
  if (title.includes('pin') || prompt.includes('pin')) {
    return 'pin';
  }
  
  if (title.includes('skewer') || prompt.includes('skewer')) {
    return 'skewer';
  }
  
  // Material gain
  if (prompt.includes('win') || prompt.includes('capture') || 
      prompt.includes('take') || prompt.includes('grab')) {
    return 'winMaterial';
  }
  
  // Endgame
  if (lesson.level === 3 || title.includes('endgame') || title.includes('pawn')) {
    return 'endgame';
  }
  
  return 'other';
}

/**
 * Count material on board
 */
function getMaterialCount(chess: Chess, color: 'w' | 'b'): number {
  const board = chess.board();
  let material = 0;
  
  const pieceValues: Record<string, number> = {
    'p': 1,
    'n': 3,
    'b': 3,
    'r': 5,
    'q': 9,
    'k': 0
  };
  
  for (const row of board) {
    for (const square of row) {
      if (square && square.color === color) {
        material += pieceValues[square.type] || 0;
      }
    }
  }
  
  return material;
}

/**
 * Check if a move results in checkmate
 */
function isCheckmate(chess: Chess, move: string): boolean {
  const chessCopy = new Chess(chess.fen());
  try {
    chessCopy.move(move);
    return chessCopy.isCheckmate();
  } catch {
    return false;
  }
}

/**
 * Check if a move results in check
 */
function isCheck(chess: Chess, move: string): boolean {
  const chessCopy = new Chess(chess.fen());
  try {
    chessCopy.move(move);
    return chessCopy.isCheck();
  } catch {
    return false;
  }
}

/**
 * Get material difference after a move
 */
function getMaterialGain(chess: Chess, move: string): number {
  const originalMaterial = getMaterialCount(chess, chess.turn());
  const chessCopy = new Chess(chess.fen());
  
  try {
    chessCopy.move(move);
    const newMaterial = getMaterialCount(chessCopy, chess.turn());
    return newMaterial - originalMaterial;
  } catch {
    return 0;
  }
}

/**
 * Check if move creates a fork (attacks 2+ pieces)
 */
function isFork(chess: Chess, move: string): boolean {
  const chessCopy = new Chess(chess.fen());
  
  try {
    const moveObj = chessCopy.move(move);
    const toSquare = moveObj.to;
    const piece = chessCopy.get(toSquare);
    
    if (!piece) return false;
    
    // Get all squares attacked by the moved piece
    const moves = chessCopy.moves({ square: toSquare, verbose: true });
    const attackedPieces = moves.filter(m => m.captured).length;
    
    return attackedPieces >= 2;
  } catch {
    return false;
  }
}

// ============================================
// VALIDATION CHECK 1: SIDE TO MOVE
// ============================================

function validateSideToMove(
  task: LessonTask, 
  lesson: Lesson,
  chess: Chess
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  const fenSide = getSideToMove(task.fen);
  const actualTurn = chess.turn();
  
  // Check FEN consistency
  if (fenSide !== actualTurn) {
    issues.push({
      taskId: task.id,
      lessonId: lesson.id,
      level: lesson.level,
      type: 'SideToMoveMismatch',
      severity: 'error',
      details: `FEN says ${fenSide === 'w' ? 'white' : 'black'} to move, but chess.js parsed it as ${actualTurn === 'w' ? 'white' : 'black'}`
    });
  }
  
  // Check prompt consistency (heuristic)
  const prompt = task.prompt.toLowerCase();
  
  // Look for explicit color mentions
  if (prompt.includes('white to move') && fenSide !== 'w') {
    issues.push({
      taskId: task.id,
      lessonId: lesson.id,
      level: lesson.level,
      type: 'PromptSideMismatch',
      severity: 'warn',
      details: `Prompt says "white to move" but FEN shows black to move`
    });
  }
  
  if (prompt.includes('black to move') && fenSide !== 'b') {
    issues.push({
      taskId: task.id,
      lessonId: lesson.id,
      level: lesson.level,
      type: 'PromptSideMismatch',
      severity: 'warn',
      details: `Prompt says "black to move" but FEN shows white to move`
    });
  }
  
  // NOTE: Board orientation is always white-bottom in current implementation
  // All players play as white. If black-to-move tasks exist, flag for review.
  if (fenSide === 'b') {
    issues.push({
      taskId: task.id,
      lessonId: lesson.id,
      level: lesson.level,
      type: 'BlackToMoveTask',
      severity: 'needsHumanReview',
      details: `Task requires black to move. Verify board orientation handles this correctly (current implementation shows white at bottom)`
    });
  }
  
  return issues;
}

// ============================================
// VALIDATION CHECK 2: OBJECTIVE VS REALITY
// ============================================

function validateObjectiveVsReality(
  task: LessonTask,
  lesson: Lesson,
  chess: Chess,
  objectiveType: ObjectiveType
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  switch (objectiveType) {
    case 'mateIn1':
      issues.push(...validateMateInOne(task, lesson, chess));
      break;
      
    case 'winMaterial':
      issues.push(...validateWinMaterial(task, lesson, chess));
      break;
      
    case 'defendKing':
      issues.push(...validateDefendKing(task, lesson, chess));
      break;
      
    case 'fork':
      issues.push(...validateFork(task, lesson, chess));
      break;
      
    default:
      // Other objectives - mark as skipped
      break;
  }
  
  return issues;
}

function validateMateInOne(
  task: LessonTask,
  lesson: Lesson,
  chess: Chess
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const legalMoves = chess.moves({ verbose: true });
  
  // Find all moves that result in checkmate
  const matingMoves = legalMoves.filter(move => {
    const chessCopy = new Chess(chess.fen());
    chessCopy.move(move.san);
    return chessCopy.isCheckmate();
  });
  
  // If objective is mate-in-1, expect exactly 1 mating move
  if (matingMoves.length === 0) {
    issues.push({
      taskId: task.id,
      lessonId: lesson.id,
      level: lesson.level,
      type: 'NoMateInOneExists',
      severity: 'error',
      details: `Task claims mate-in-1 but no legal move delivers checkmate`
    });
  } else if (matingMoves.length > 1) {
    const matingMovesStr = matingMoves.map(m => m.san).join(', ');
    
    // Check if all mating moves are in correctMoves
    const acceptedMates = matingMoves.filter(m => 
      task.correctMoves.some(cm => cm === `${m.from}${m.to}` || cm.toLowerCase() === m.san.toLowerCase())
    );
    
    if (acceptedMates.length < matingMoves.length) {
      issues.push({
        taskId: task.id,
        lessonId: lesson.id,
        level: lesson.level,
        type: 'MultipleMateInOne',
        severity: 'warn',
        details: `Found ${matingMoves.length} mate-in-1 moves (${matingMovesStr}) but only ${acceptedMates.length} accepted. Punishes "too right".`
      });
    }
  }
  
  // Verify correctMoves actually lead to checkmate
  for (const correctMove of task.correctMoves) {
    if (!isCheckmate(chess, correctMove)) {
      issues.push({
        taskId: task.id,
        lessonId: lesson.id,
        level: lesson.level,
        type: 'IncorrectMateMove',
        severity: 'error',
        details: `correctMove "${correctMove}" does not result in checkmate`
      });
    }
  }
  
  return issues;
}

function validateWinMaterial(
  task: LessonTask,
  lesson: Lesson,
  chess: Chess
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check each correct move wins material
  for (const correctMove of task.correctMoves) {
    const gain = getMaterialGain(chess, correctMove);
    
    if (gain <= 0) {
      issues.push({
        taskId: task.id,
        lessonId: lesson.id,
        level: lesson.level,
        type: 'NoMaterialGain',
        severity: 'warn',
        details: `correctMove "${correctMove}" doesn't win material (gain: ${gain})`
      });
    }
  }
  
  // Check if there are better material-winning moves not in correctMoves
  const legalMoves = chess.moves({ verbose: true });
  const bestGain = Math.max(...legalMoves.map(m => getMaterialGain(chess, `${m.from}${m.to}`)));
  const correctMovesBestGain = Math.max(...task.correctMoves.map(m => getMaterialGain(chess, m)));
  
  if (bestGain > correctMovesBestGain) {
    issues.push({
      taskId: task.id,
      lessonId: lesson.id,
      level: lesson.level,
      type: 'BetterMaterialMoveExists',
      severity: 'needsHumanReview',
      details: `Other legal moves win more material (${bestGain}) than accepted moves (${correctMovesBestGain})`
    });
  }
  
  return issues;
}

function validateDefendKing(
  task: LessonTask,
  lesson: Lesson,
  chess: Chess
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check if king is actually in check
  if (!chess.isCheck()) {
    issues.push({
      taskId: task.id,
      lessonId: lesson.id,
      level: lesson.level,
      type: 'NotInCheck',
      severity: 'warn',
      details: `Task about defending king but position is not in check`
    });
    return issues;
  }
  
  // Verify each correct move escapes check
  for (const correctMove of task.correctMoves) {
    try {
      const chessCopy = new Chess(chess.fen());
      chessCopy.move(correctMove);
      
      if (chessCopy.isCheck()) {
        issues.push({
          taskId: task.id,
          lessonId: lesson.id,
          level: lesson.level,
          type: 'StillInCheck',
          severity: 'error',
          details: `correctMove "${correctMove}" leaves king in check`
        });
      }
    } catch (error) {
      issues.push({
        taskId: task.id,
        lessonId: lesson.id,
        level: lesson.level,
        type: 'IllegalDefenseMove',
        severity: 'error',
        details: `correctMove "${correctMove}" is illegal: ${error}`
      });
    }
  }
  
  return issues;
}

function validateFork(
  task: LessonTask,
  lesson: Lesson,
  chess: Chess
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check if correct moves actually create forks
  for (const correctMove of task.correctMoves) {
    if (!isFork(chess, correctMove)) {
      issues.push({
        taskId: task.id,
        lessonId: lesson.id,
        level: lesson.level,
        type: 'NotAFork',
        severity: 'warn',
        details: `correctMove "${correctMove}" doesn't attack 2+ pieces (may need better fork detection)`
      });
    }
  }
  
  return issues;
}

// ============================================
// VALIDATION CHECK 3: SINGLE VS MULTI-SOLUTION
// ============================================

function validateSingleVsMultipleSolutions(
  task: LessonTask,
  lesson: Lesson,
  chess: Chess,
  objectiveType: ObjectiveType
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  const isSingleSolution = task.correctMoves.length === 1;
  
  if (!isSingleSolution) {
    // Multi-solution task - just note it
    return issues;
  }
  
  // For single-solution tasks, check if other moves are equally good
  if (objectiveType === 'mateIn1') {
    const legalMoves = chess.moves({ verbose: true });
    const matingMoves = legalMoves.filter(move => {
      const chessCopy = new Chess(chess.fen());
      chessCopy.move(move.san);
      return chessCopy.isCheckmate();
    });
    
    if (matingMoves.length > 1) {
      const otherMates = matingMoves
        .filter(m => !task.correctMoves.includes(`${m.from}${m.to}`))
        .map(m => m.san)
        .join(', ');
        
      if (otherMates) {
        issues.push({
          taskId: task.id,
          lessonId: lesson.id,
          level: lesson.level,
          type: 'SingleSolutionButMultipleGood',
          severity: 'warn',
          details: `Task claims single solution but these moves also mate: ${otherMates}`
        });
      }
    }
  }
  
  return issues;
}

// ============================================
// VALIDATION CHECK 4: LEGAL & THEMATIC
// ============================================

function validateLegalityAndTheme(
  task: LessonTask,
  lesson: Lesson,
  chess: Chess,
  objectiveType: ObjectiveType
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check legality of all correct moves
  for (const correctMove of task.correctMoves) {
    try {
      const chessCopy = new Chess(chess.fen());
      chessCopy.move(correctMove);
    } catch (error) {
      issues.push({
        taskId: task.id,
        lessonId: lesson.id,
        level: lesson.level,
        type: 'IllegalCorrectMove',
        severity: 'error',
        details: `correctMove "${correctMove}" is illegal: ${error}`
      });
    }
  }
  
  // Theme validation (basic heuristics)
  // More sophisticated theme detection would require deeper chess logic
  
  return issues;
}

// ============================================
// VALIDATION CHECK 5: FEEDBACK MESSAGES
// ============================================

function validateFeedback(
  task: LessonTask,
  lesson: Lesson
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check if success message exists
  if (!task.successMessage || task.successMessage.trim().length === 0) {
    issues.push({
      taskId: task.id,
      lessonId: lesson.id,
      level: lesson.level,
      type: 'MissingSuccessMessage',
      severity: 'warn',
      details: `Task has no success message`
    });
  }
  
  // Check for generic/unhelpful messages
  const genericPhrases = ['correct', 'good job', 'well done', 'great', 'nice'];
  if (task.successMessage) {
    const msg = task.successMessage.toLowerCase();
    const isGeneric = genericPhrases.some(phrase => msg === phrase || msg === `${phrase}.` || msg === `${phrase}!`);
    
    if (isGeneric) {
      issues.push({
        taskId: task.id,
        lessonId: lesson.id,
        level: lesson.level,
        type: 'GenericSuccessMessage',
        severity: 'needsHumanReview',
        details: `Success message is too generic: "${task.successMessage}"`
      });
    }
  }
  
  // Check if failure feedback exists (via failPatternIds or failureHints)
  if (!task.failPatternIds && !task.failureHints) {
    issues.push({
      taskId: task.id,
      lessonId: lesson.id,
      level: lesson.level,
      type: 'NoFailureFeedback',
      severity: 'needsHumanReview',
      details: `Task has no failure patterns or hints. Users only see generic "Try again."`
    });
  }
  
  return issues;
}

// ============================================
// VALIDATION CHECK 6: XP / DIFFICULTY
// ============================================

function computeXpStats(allLessons: Lesson[]): Map<string, XpStats[]> {
  const statsMap = new Map<string, XpStats[]>();
  
  for (const lesson of allLessons) {
    const level = lesson.level;
    const xp = lesson.XP;
    
    // Group by level
    const key = `level-${level}`;
    
    if (!statsMap.has(key)) {
      statsMap.set(key, []);
    }
    
    statsMap.get(key)!.push({
      objectiveType: 'lesson',
      level,
      avgXp: xp,
      minXp: xp,
      maxXp: xp,
      count: 1
    });
  }
  
  // Calculate averages per level
  const finalStats = new Map<string, XpStats[]>();
  
  for (const [key, values] of statsMap) {
    const total = values.reduce((sum, v) => sum + v.avgXp, 0);
    const min = Math.min(...values.map(v => v.minXp));
    const max = Math.max(...values.map(v => v.maxXp));
    const count = values.length;
    const level = values[0].level;
    
    finalStats.set(key, [{
      objectiveType: 'lesson',
      level,
      avgXp: total / count,
      minXp: min,
      maxXp: max,
      count
    }]);
  }
  
  return finalStats;
}

function validateXpVsDifficulty(
  lesson: Lesson,
  xpStats: Map<string, XpStats[]>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check if XP is 0 or missing
  if (!lesson.XP || lesson.XP === 0) {
    issues.push({
      taskId: 'N/A',
      lessonId: lesson.id,
      level: lesson.level,
      type: 'MissingXP',
      severity: 'error',
      details: `Lesson has no XP reward`
    });
    return issues;
  }
  
  // Get stats for this level
  const key = `level-${lesson.level}`;
  const stats = xpStats.get(key);
  
  if (!stats || stats.length === 0) return issues;
  
  const levelStats = stats[0];
  const avgXp = levelStats.avgXp;
  
  // Flag outliers (>2x or <0.5x average)
  if (lesson.XP > avgXp * 2) {
    issues.push({
      taskId: 'N/A',
      lessonId: lesson.id,
      level: lesson.level,
      type: 'XPTooHigh',
      severity: 'needsHumanReview',
      details: `Lesson XP (${lesson.XP}) is >2x level average (${avgXp.toFixed(1)})`
    });
  } else if (lesson.XP < avgXp * 0.5) {
    issues.push({
      taskId: 'N/A',
      lessonId: lesson.id,
      level: lesson.level,
      type: 'XPTooLow',
      severity: 'needsHumanReview',
      details: `Lesson XP (${lesson.XP}) is <0.5x level average (${avgXp.toFixed(1)})`
    });
  }
  
  return issues;
}

// ============================================
// MAIN VALIDATION ORCHESTRATOR
// ============================================

async function loadAllLessons(): Promise<Lesson[]> {
  const dataDir = path.join(process.cwd(), 'data', 'chessio', 'levels');
  const lessons: Lesson[] = [];
  
  for (let level = 1; level <= 10; level++) {
    const levelDir = path.join(dataDir, `level-${level}`);
    
    try {
      const files = await fs.readdir(levelDir);
      const lessonFiles = files.filter(f => f.startsWith('lesson-') && f.endsWith('.json'));
      
      for (const file of lessonFiles) {
        const content = await fs.readFile(path.join(levelDir, file), 'utf-8');
        const lesson = JSON.parse(content) as Lesson;
        lessons.push(lesson);
      }
    } catch (error) {
      // Level doesn't exist or no lessons - skip
      continue;
    }
  }
  
  return lessons;
}

async function validateAllLessons(): Promise<ValidationIssue[]> {
  console.log('🔍 Loading lessons...\n');
  
  const lessons = await loadAllLessons();
  console.log(`📚 Found ${lessons.length} lessons across ${new Set(lessons.map(l => l.level)).size} levels\n`);
  
  const allIssues: ValidationIssue[] = [];
  let totalTasks = 0;
  
  // First pass: collect XP stats
  console.log('📊 Computing XP statistics...\n');
  const xpStats = computeXpStats(lessons);
  
  // Second pass: validate each task
  console.log('🧪 Running validation checks...\n');
  
  for (const lesson of lessons) {
    console.log(`  Validating ${lesson.id} (${lesson.tasks.length} tasks)`);
    
    for (const task of lesson.tasks) {
      totalTasks++;
      
      // Check if FEN is simplified (missing kings)
      const isSimplified = isSimplifiedFen(task.fen);
      
      if (isSimplified) {
        allIssues.push({
          taskId: task.id,
          lessonId: lesson.id,
          level: lesson.level,
          type: 'SimplifiedFEN',
          severity: 'needsHumanReview',
          details: `Task uses simplified FEN (missing one or both kings). This is OK for teaching positions but chess.js validation is limited.`
        });
      }
      
      // Try to normalize FEN for validation
      const normalizedFen = normalizeFen(task.fen);
      
      // Initialize chess.js with FEN
      let chess: Chess;
      try {
        chess = new Chess(normalizedFen);
      } catch (error) {
        allIssues.push({
          taskId: task.id,
          lessonId: lesson.id,
          level: lesson.level,
          type: 'InvalidFEN',
          severity: 'error',
          details: `Cannot parse FEN even after normalization: ${error}`
        });
        continue;
      }
      
      // Infer objective type
      const objectiveType = inferObjectiveType(task, lesson);
      
      // Run all validation checks
      // Skip some checks for simplified FENs since they can't be fully validated
      allIssues.push(...validateSideToMove(task, lesson, chess));
      
      if (!isSimplified) {
        allIssues.push(...validateObjectiveVsReality(task, lesson, chess, objectiveType));
        allIssues.push(...validateSingleVsMultipleSolutions(task, lesson, chess, objectiveType));
        allIssues.push(...validateLegalityAndTheme(task, lesson, chess, objectiveType));
      } else {
        // For simplified FENs, only do basic move legality check
        for (const correctMove of task.correctMoves) {
          try {
            const chessCopy = new Chess(normalizedFen);
            chessCopy.move(correctMove);
          } catch (error) {
            allIssues.push({
              taskId: task.id,
              lessonId: lesson.id,
              level: lesson.level,
              type: 'IllegalCorrectMove',
              severity: 'warn',
              details: `correctMove "${correctMove}" appears illegal in normalized position (may be OK in actual simplified FEN): ${error}`
            });
          }
        }
      }
      
      allIssues.push(...validateFeedback(task, lesson));
    }
    
    // Validate lesson-level XP
    allIssues.push(...validateXpVsDifficulty(lesson, xpStats));
  }
  
  console.log(`\n✅ Validation complete! Checked ${totalTasks} tasks.\n`);
  
  return allIssues;
}

// ============================================
// REPORT GENERATION
// ============================================

function generateReport(issues: ValidationIssue[]): void {
  console.log('=' .repeat(80));
  console.log('CHESSIO LESSON VALIDATION REPORT');
  console.log('=' .repeat(80));
  console.log();
  
  // Summary by severity
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warn');
  const reviews = issues.filter(i => i.severity === 'needsHumanReview');
  
  console.log('📊 SUMMARY');
  console.log('-'.repeat(80));
  console.log(`Total Issues: ${issues.length}`);
  console.log(`  ❌ Errors: ${errors.length}`);
  console.log(`  ⚠️  Warnings: ${warnings.length}`);
  console.log(`  🔍 Needs Human Review: ${reviews.length}`);
  console.log();
  
  // Summary by type
  const byType = new Map<string, ValidationIssue[]>();
  for (const issue of issues) {
    if (!byType.has(issue.type)) {
      byType.set(issue.type, []);
    }
    byType.get(issue.type)!.push(issue);
  }
  
  console.log('📋 ISSUES BY TYPE');
  console.log('-'.repeat(80));
  
  const sortedTypes = Array.from(byType.entries()).sort((a, b) => b[1].length - a[1].length);
  
  for (const [type, typeIssues] of sortedTypes) {
    const errorCount = typeIssues.filter(i => i.severity === 'error').length;
    const warnCount = typeIssues.filter(i => i.severity === 'warn').length;
    const reviewCount = typeIssues.filter(i => i.severity === 'needsHumanReview').length;
    
    console.log(`  ${type}: ${typeIssues.length} (❌${errorCount} ⚠️${warnCount} 🔍${reviewCount})`);
  }
  console.log();
  
  // Detailed issues
  if (errors.length > 0) {
    console.log('❌ ERRORS (Must Fix)');
    console.log('-'.repeat(80));
    for (const issue of errors) {
      console.log(`[${issue.type}] ${issue.lessonId} → ${issue.taskId}`);
      console.log(`  ${issue.details}`);
      console.log();
    }
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (Should Review)');
    console.log('-'.repeat(80));
    for (const issue of warnings) {
      console.log(`[${issue.type}] ${issue.lessonId} → ${issue.taskId}`);
      console.log(`  ${issue.details}`);
      console.log();
    }
  }
  
  if (reviews.length > 0) {
    console.log('🔍 NEEDS HUMAN REVIEW');
    console.log('-'.repeat(80));
    for (const issue of reviews) {
      console.log(`[${issue.type}] ${issue.lessonId} → ${issue.taskId}`);
      console.log(`  ${issue.details}`);
      console.log();
    }
  }
  
  console.log('=' .repeat(80));
  console.log('END OF REPORT');
  console.log('=' .repeat(80));
}

async function saveReportToFile(issues: ValidationIssue[]): Promise<void> {
  const reportDir = path.join(process.cwd(), 'scripts', 'reports');
  
  try {
    await fs.mkdir(reportDir, { recursive: true });
  } catch {
    // Directory exists
  }
  
  const reportPath = path.join(reportDir, 'lesson-validation.json');
  await fs.writeFile(reportPath, JSON.stringify(issues, null, 2), 'utf-8');
  
  console.log(`\n💾 Full report saved to: ${reportPath}\n`);
}

// ============================================
// MAIN ENTRY POINT
// ============================================

async function main() {
  try {
    const issues = await validateAllLessons();
    generateReport(issues);
    await saveReportToFile(issues);
    
    // Exit with error code if critical errors found
    const errors = issues.filter(i => i.severity === 'error');
    if (errors.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

main();
