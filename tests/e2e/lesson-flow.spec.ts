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
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('can start a lesson from dashboard', async ({ page }) => {
    // Navigate to Pre-School first
    await page.getByTestId('dashboard-pre-school-cta').click();
    await expect(page).toHaveURL(/\/app/);
    
    // Pre-School page should show available lessons
    const firstLesson = page.getByRole('link', { name: /meet the rook/i }).first();
    await expect(firstLesson).toBeVisible();
    
    // Click to start lesson
    await firstLesson.click();
    
    // Should navigate to lesson page
    await expect(page).toHaveURL(/\/lessons\//);
    
    // Chessboard should load (lesson player test ID may not exist)
    await expect(page.getByTestId('chessboard')).toBeVisible();
  });

  test('complete a lesson successfully', async ({ page }) => {
    // Navigate directly to first lesson
    await page.goto('/lessons/meet-the-rook');
    
    // Wait for board to load
    await page.waitForSelector('[data-testid="chessboard"]');
    
    // Read first instruction (if instruction test ID exists)
    const instruction = page.getByText(/move|rook|piece/i).first();
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

  // TODO: Simplify or skip until XP display has test ID
  test.skip('lesson completion awards XP', async ({ page }) => {
    await page.goto('/lessons/meet-the-rook');
    
    // Get initial XP (requires user-xp test ID)
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

  // TODO: Simplify or skip until task-number test ID exists
  test.skip('lesson progress persists across sessions', async ({ page, context }) => {
    await page.goto('/lessons/meet-the-rook');
    
    // Start lesson and complete first task
    await page.locator('[data-square="e1"]').click();
    await page.locator('[data-square="e8"]').click();
    
    await page.getByRole('button', { name: /continue/i }).click();
    
    // Note current task (requires task-number test ID)
    const taskNumber = await page.getByTestId('task-number').textContent();
    
    // Navigate away
    await page.goto('/dashboard');
    
    // Come back to lesson
    await page.goto('/lessons/meet-the-rook');
    
    // Should resume from where we left off
    const resumedTaskNumber = await page.getByTestId('task-number').textContent();
    expect(resumedTaskNumber).toBe(taskNumber);
  });

  // TODO: Update when replay functionality test IDs are added
  test.skip('can replay completed lesson', async ({ page }) => {
    // Assume lesson is already completed
    await page.goto('/dashboard');
    await page.getByTestId('dashboard-pre-school-cta').click();
    
    // Find completed lesson (should have checkmark or "replay" button)
    const replayBtn = page.getByRole('button', { name: /replay/i }).first();
    
    if (await replayBtn.isVisible()) {
      await replayBtn.click();
      
      // Should load lesson from beginning
      await expect(page).toHaveURL(/\/lessons\//);
      // Task number check requires test ID
      // await expect(page.getByTestId('task-number')).toHaveText('1');
    }
  });
});

test.describe('Lesson Navigation', () => {
  test('can exit lesson mid-way', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    await page.goto('/lessons/meet-the-rook');
    
    // Find exit button
    const exitBtn = page.getByRole('button', { name: /exit|back|dashboard/i }).first();
    await exitBtn.click();
    
    // Should return to dashboard or pre-school
    await expect(page).toHaveURL(/\/dashboard|\/app/);
  });

  // TODO: Add task-number test ID to enable this test
  test.skip('progress indicator shows correct task number', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    await page.goto('/lessons/meet-the-rook');
    
    // Should show "Task 1 of X" (requires task-number test ID)
    await expect(page.getByText(/1.*of/i)).toBeVisible();
  });
});
