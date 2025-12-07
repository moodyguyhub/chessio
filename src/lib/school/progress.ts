/**
 * Client-side progress tracking for v1
 * Uses localStorage for simplicity
 * Later: migrate to DB with UserLessonProgress
 */

const STORAGE_KEY_CARDS = 'chessio_unlocked_cards';
const STORAGE_KEY_LESSONS = 'chessio_completed_lessons';
const STORAGE_KEY_EXAMS = 'chessio_exam_passed_levels';

export function unlockSecretCard(cardId: string): void {
  if (typeof window === 'undefined') return;
  
  const unlocked = getUnlockedSecretCards();
  if (!unlocked.includes(cardId)) {
    unlocked.push(cardId);
    localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(unlocked));
  }
}

export function getUnlockedSecretCards(): string[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY_CARDS);
  return stored ? JSON.parse(stored) : [];
}

export function markLessonComplete(lessonId: string): void {
  if (typeof window === 'undefined') return;
  
  const completed = getCompletedLessons();
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(completed));
  }
}

export function getCompletedLessons(): string[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY_LESSONS);
  return stored ? JSON.parse(stored) : [];
}

export function isLessonComplete(lessonId: string): boolean {
  return getCompletedLessons().includes(lessonId);
}

/**
 * Get unlocked levels for a user.
 * For v1: returns [1] (hardcoded)
 * Later: calculate based on completed lessons
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getUnlockedLevels(_userId: string): Promise<number[]> {
  // TODO: implement with real DB logic
  return [1];
}

/**
 * Mark a level exam as passed
 */
export function markLevelExamPassed(level: number): void {
  if (typeof window === 'undefined') return;
  
  const passed = getPassedLevelExams();
  if (!passed.includes(level)) {
    passed.push(level);
    localStorage.setItem(STORAGE_KEY_EXAMS, JSON.stringify(passed));
  }
}

/**
 * Get list of levels with passed exams
 */
export function getPassedLevelExams(): number[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY_EXAMS);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Check if a specific level's exam has been passed
 * @param levelId - The level ID to check
 * @returns true if the exam for this level is passed
 */
export function hasLevelExamPassed(levelId: number): boolean {
  return getPassedLevelExams().includes(levelId);
}

/**
 * Check if a level is fully mastered (all lessons + exam complete)
 * @param levelId - The level ID (e.g., 1)
 * @param lessonIds - Array of lesson IDs for this level (e.g., ["level-1-lesson-1-check", ...])
 * @returns true if all lessons completed AND exam passed
 */
export function isLevelMastered(levelId: number, lessonIds: string[]): boolean {
  if (typeof window === 'undefined') return false;
  
  const completedLessons = getCompletedLessons();
  const passedExams = getPassedLevelExams();
  
  // Check if all lessons for this level are completed
  const allLessonsComplete = lessonIds.every(id => completedLessons.includes(id));
  
  // Check if exam is passed
  const examPassed = passedExams.includes(levelId);
  
  return allLessonsComplete && examPassed;
}
