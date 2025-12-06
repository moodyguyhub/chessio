/**
 * Unit Tests: XP System
 * Tests XP calculation and level progression
 */

import { calculateLessonXp, calculateLevel, getLevelProgress } from '@/lib/gamification/xp';

describe('XP System - Unit Tests', () => {
  describe('calculateLessonXp', () => {
    it('should return correct XP structure', () => {
      const result = calculateLessonXp(100);
      
      expect(result).toHaveProperty('baseXp');
      expect(result).toHaveProperty('bonusXp');
      expect(result).toHaveProperty('totalXp');
      expect(result).toHaveProperty('breakdown');
      expect(result.totalXp).toBe(100);
    });

    it('should calculate totalXp correctly', () => {
      const result = calculateLessonXp(50);
      expect(result.totalXp).toBe(50);
    });

    it('should have non-negative XP', () => {
      const result = calculateLessonXp(25);
      expect(result.totalXp).toBeGreaterThanOrEqual(0);
      expect(result.baseXp).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateLevel', () => {
    it('should calculate level 0 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(0);
    });

    it('should calculate level correctly for 100 XP', () => {
      expect(calculateLevel(100)).toBeGreaterThanOrEqual(1);
    });

    it('should increase level with more XP', () => {
      const level1 = calculateLevel(100);
      const level2 = calculateLevel(500);
      expect(level2).toBeGreaterThan(level1);
    });

    it('should handle large XP values', () => {
      const level = calculateLevel(10000);
      expect(level).toBeGreaterThan(0);
      expect(level).toBeLessThan(1000); // Reasonable cap
    });
  });

  describe('getLevelProgress', () => {
    it('should return correct progress structure', () => {
      const progress = getLevelProgress(0);
      
      expect(progress).toHaveProperty('level');
      expect(progress).toHaveProperty('currentLevelXp');
      expect(progress).toHaveProperty('xpForNextLevel');
      expect(progress).toHaveProperty('progress');
    });

    it('should calculate progress correctly', () => {
      const progress = getLevelProgress(50);
      
      expect(progress.level).toBeGreaterThanOrEqual(0);
      expect(progress.progress).toBeGreaterThanOrEqual(0);
      expect(progress.progress).toBeLessThanOrEqual(1);
    });

    it('should show progress increases with XP', () => {
      const progress1 = getLevelProgress(100);
      const progress2 = getLevelProgress(500);
      
      expect(progress2.level).toBeGreaterThanOrEqual(progress1.level);
    });
  });
});
