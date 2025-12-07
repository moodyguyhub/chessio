/**
 * School Data API
 * Functions to load lessons, exams, secret cards, and fail patterns from JSON files
 */

import path from 'path';
import fs from 'fs/promises';
import { Lesson, ExamPuzzle, SecretCard, FailPattern } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'chessio');

export async function getLessonsByLevel(level: number): Promise<Lesson[]> {
  const levelDir = path.join(DATA_DIR, 'levels', `level-${level}`);
  
  try {
    const files = await fs.readdir(levelDir);
    const lessonFiles = files.filter(f => f.startsWith('lesson-') && f.endsWith('.json'));
    
    const lessons = await Promise.all(
      lessonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(levelDir, file), 'utf-8');
        return JSON.parse(content) as Lesson;
      })
    );
    
    return lessons.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error(`Error loading lessons for level ${level}:`, error);
    return [];
  }
}

export async function getLessonBySlug(level: number, slug: string): Promise<Lesson | null> {
  const lessons = await getLessonsByLevel(level);
  return lessons.find(l => l.slug === slug) || null;
}

export async function getExamPuzzlesByLevel(level: number): Promise<ExamPuzzle[]> {
  const examPath = path.join(DATA_DIR, 'levels', `level-${level}`, 'exams.json');
  
  try {
    const content = await fs.readFile(examPath, 'utf-8');
    return JSON.parse(content) as ExamPuzzle[];
  } catch (error) {
    console.error(`Error loading exams for level ${level}:`, error);
    return [];
  }
}

export async function getSecretCards(): Promise<SecretCard[]> {
  const cardPath = path.join(DATA_DIR, 'secret-cards.json');
  
  try {
    const content = await fs.readFile(cardPath, 'utf-8');
    return JSON.parse(content) as SecretCard[];
  } catch (error) {
    console.error('Error loading secret cards:', error);
    return [];
  }
}

export async function getFailPatterns(): Promise<FailPattern[]> {
  const patternPath = path.join(DATA_DIR, 'fail-patterns.json');
  
  try {
    const content = await fs.readFile(patternPath, 'utf-8');
    return JSON.parse(content) as FailPattern[];
  } catch (error) {
    console.error('Error loading fail patterns:', error);
    return [];
  }
}

export async function getFailPatternMap(): Promise<Record<string, FailPattern>> {
  const patterns = await getFailPatterns();
  return patterns.reduce((acc, pattern) => {
    acc[pattern.id] = pattern;
    return acc;
  }, {} as Record<string, FailPattern>);
}
