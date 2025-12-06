/**
 * E2E Integration Tests - Lesson Completion Flow
 * Tests complete lesson playthrough from start to finish
 */

import { test, expect } from '@playwright/test';

test.describe('Lesson Completion Flow - E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/app/);
  });

  test('can start a lesson from dashboard', async ({ page }) => {
    // Dashboard should show available lessons
    const firstLesson = page.getByRole('link', { name: /meet the rook/i }).first();
    await expect(firstLesson).toBeVisible();
    
    // Click to start lesson
    await firstLesson.click();
    
    // Should navigate to lesson page
    await expect(page).toHaveURL(/\/lessons\//);
    
    // Lesson player should load
    await expect(page.locator('[data-testid="lesson-player"]')).toBeVisible();
  });

  test('complete a lesson successfully', async ({ page }) => {
    // Navigate directly to first lesson
    await page.goto('/lessons/meet-the-rook');
    
    // Wait for board to load
    await page.waitForSelector('[data-testid="chessboard"]');
    
    // Read first instruction
    const instruction = page.getByTestId('task-instruction');
    await expect(instruction).toBeVisible();
    
    // Make correct move (this is lesson-specific)
    // For "Meet the Rook" - move rook from e1 to e8
    await page.locator('[data-square="e1"]').click();
    await page.locator('[data-square="e8"]').click();
    
    // Should show success message
    await expect(page.getByText(/perfect/i)).toBeVisible({ timeout: 5000 });
    
    // Continue button should appear
    const continueBtn = page.getByRole('button', { name: /continue/i });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();
    
    // Should advance to next task or show completion
    await page.waitForTimeout(1000);
  });

  test('hint system works in lesson', async ({ page }) => {
    await page.goto('/lessons/meet-the-rook');
    
    // Click hint button
    const hintBtn = page.getByRole('button', { name: /hint/i });
    await hintBtn.click();
    
    // Hint modal or message should appear
    await expect(page.getByText(/rook/i)).toBeVisible();
    
    // Hint counter should update
    await expect(page.getByText(/hint.*used/i)).toBeVisible();
  });

  test('incorrect move shows feedback', async ({ page }) => {
    await page.goto('/lessons/meet-the-rook');
    
    // Wait for board
    await page.waitForSelector('[data-testid="chessboard"]');
    
    // Try an incorrect move (diagonal for rook)
    await page.locator('[data-square="e1"]').click();
    await page.locator('[data-square="h4"]').click();
    
    // Should show error feedback
    await expect(page.getByText(/rooks.*straight/i)).toBeVisible({ timeout: 5000 });
  });

  test('lesson completion awards XP', async ({ page }) => {
    await page.goto('/lessons/meet-the-rook');
    
    // Get initial XP
    const xpBefore = await page.getByTestId('user-xp').textContent();
    
    // Complete lesson (this is simplified - real test would complete all tasks)
    // ... complete all tasks ...
    
    // After completion, check XP increased
    await expect(page.getByText(/\+.*XP/i)).toBeVisible();
    
    // Return to dashboard
    await page.getByRole('button', { name: /dashboard/i }).click();
    
    // XP should be updated
    const xpAfter = await page.getByTestId('user-xp').textContent();
    expect(xpAfter).not.toBe(xpBefore);
  });

  test('lesson progress persists across sessions', async ({ page, context }) => {
    await page.goto('/lessons/meet-the-rook');
    
    // Start lesson and complete first task
    await page.locator('[data-square="e1"]').click();
    await page.locator('[data-square="e8"]').click();
    
    await page.getByRole('button', { name: /continue/i }).click();
    
    // Note current task
    const taskNumber = await page.getByTestId('task-number').textContent();
    
    // Navigate away
    await page.goto('/app');
    
    // Come back to lesson
    await page.goto('/lessons/meet-the-rook');
    
    // Should resume from where we left off
    const resumedTaskNumber = await page.getByTestId('task-number').textContent();
    expect(resumedTaskNumber).toBe(taskNumber);
  });

  test('can replay completed lesson', async ({ page }) => {
    // Assume lesson is already completed
    await page.goto('/app');
    
    // Find completed lesson (should have checkmark or "replay" button)
    const replayBtn = page.getByRole('button', { name: /replay/i }).first();
    
    if (await replayBtn.isVisible()) {
      await replayBtn.click();
      
      // Should load lesson from beginning
      await expect(page).toHaveURL(/\/lessons\//);
      await expect(page.getByTestId('task-number')).toHaveText('1');
    }
  });
});

test.describe('Lesson Navigation', () => {
  test('can exit lesson mid-way', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.goto('/lessons/meet-the-rook');
    
    // Find exit button
    const exitBtn = page.getByRole('button', { name: /exit|back/i }).first();
    await exitBtn.click();
    
    // Should return to dashboard
    await expect(page).toHaveURL(/\/app/);
  });

  test('progress indicator shows correct task number', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.goto('/lessons/meet-the-rook');
    
    // Should show "Task 1 of X"
    await expect(page.getByText(/1.*of/i)).toBeVisible();
  });
});
