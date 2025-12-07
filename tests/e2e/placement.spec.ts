/**
 * E2E Test - Placement Test & School Gating (Golden Path)
 * Validates the Gatekeeper feature: users must pass placement test to unlock School track
 * 
 * Based on: PLACEMENT_TEST_QA.md, PLACEMENT_TEST_SPEC.md
 */

import { test, expect } from '@playwright/test';

test.describe('Placement Test & School Gating - Golden Path', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear placement test state from localStorage
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('chessio_placement_v1');
    });
    
    // Login as test user
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Golden Path: Pass placement test (5/5) and unlock School', async ({ page }) => {
    // Step 1: Verify initial state - School is locked
    const placementCTA = page.getByTestId('dashboard-placement-cta');
    await expect(placementCTA).toBeVisible();
    
    // School CTA should not be visible (locked state)
    const schoolCTA = page.getByTestId('dashboard-school-cta');
    await expect(schoolCTA).not.toBeVisible();
    
    // Step 2: Navigate to placement test
    await placementCTA.click();
    await expect(page).toHaveURL(/\/school\/placement/);
    
    // Step 3: Start the test
    const beginButton = page.getByTestId('placement-begin');
    await expect(beginButton).toBeVisible();
    await beginButton.click();
    
    // Should show running container
    const runningContainer = page.getByTestId('placement-running');
    await expect(runningContainer).toBeVisible();
    
    // Step 4: Complete all 5 puzzles correctly
    // Puzzle 1: Queen safety (d8 → e7)
    await solvePuzzle(page, 'd8', 'e7');
    await page.waitForTimeout(2000); // Wait for auto-advance
    
    // Puzzle 2: The Fork (c4 → f7)
    await solvePuzzle(page, 'c4', 'f7');
    await page.waitForTimeout(2000);
    
    // Puzzle 3: Greed vs Logic (h2 → h3)
    await solvePuzzle(page, 'h2', 'h3');
    await page.waitForTimeout(2000);
    
    // Puzzle 4: Checkmate (d1 → d8)
    await solvePuzzle(page, 'd1', 'd8');
    await page.waitForTimeout(2000);
    
    // Puzzle 5: Endgame race (a5 → a6)
    await solvePuzzle(page, 'a5', 'a6');
    await page.waitForTimeout(2000);
    
    // Step 5: Verify pass result
    const resultContainer = page.getByTestId('placement-result');
    await expect(resultContainer).toBeVisible({ timeout: 10000 });
    await expect(resultContainer).toContainText(/you passed|good/i);
    await expect(resultContainer).toContainText(/5.*of.*5|score.*5/i);
    
    // Step 6: Navigate back to dashboard
    await page.goto('/dashboard');
    
    // Step 7: Verify School is now unlocked
    await expect(schoolCTA).toBeVisible();
    await expect(schoolCTA).not.toBeDisabled();
    
    // Placement CTA should be hidden now
    await expect(placementCTA).not.toBeVisible();
  });

  test('Pass with 4/5 still unlocks School', async ({ page }) => {
    // Navigate to placement test
    await page.getByTestId('dashboard-placement-cta').click();
    await page.getByTestId('placement-begin').click();
    await expect(page.getByTestId('placement-running')).toBeVisible();
    
    // Get puzzle 1 wrong first (try e8 instead of e7)
    await page.locator('[data-square="d8"]').click();
    await page.locator('[data-square="e8"]').click();
    
    // Should show failure message
    await expect(page.getByText(/passive|block/i)).toBeVisible({ timeout: 3000 });
    
    // Then correct it
    await page.locator('[data-square="d8"]').click();
    await page.locator('[data-square="e7"]').click();
    await page.waitForTimeout(2000);
    
    // Complete remaining puzzles correctly (puzzles 2-5)
    await solvePuzzle(page, 'c4', 'f7');
    await page.waitForTimeout(2000);
    
    await solvePuzzle(page, 'h2', 'h3');
    await page.waitForTimeout(2000);
    
    await solvePuzzle(page, 'd1', 'd8');
    await page.waitForTimeout(2000);
    
    await solvePuzzle(page, 'a5', 'a6');
    await page.waitForTimeout(2000);
    
    // Verify pass (4/5 is passing)
    const resultContainer = page.getByTestId('placement-result');
    await expect(resultContainer).toBeVisible({ timeout: 10000 });
    await expect(resultContainer).toContainText(/you passed|good/i);
    
    // School should unlock
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-school-cta')).toBeVisible();
  });

  test('Fail with 3/5 keeps School locked', async ({ page }) => {
    // Navigate to placement test
    await page.getByTestId('dashboard-placement-cta').click();
    await page.getByTestId('placement-begin').click();
    await expect(page.getByTestId('placement-running')).toBeVisible();
    
    // Deliberately answer puzzles incorrectly (3 correct, 2 wrong)
    // Correct: Puzzle 1
    await solvePuzzle(page, 'd8', 'e7');
    await page.waitForTimeout(2000);
    
    // Wrong: Puzzle 2 (do wrong move)
    await page.locator('[data-square="e4"]').click();
    await page.locator('[data-square="c5"]').click();
    await page.waitForTimeout(2000);
    
    // Correct: Puzzle 3
    await solvePuzzle(page, 'h2', 'h3');
    await page.waitForTimeout(2000);
    
    // Correct: Puzzle 4
    await solvePuzzle(page, 'd1', 'd8');
    await page.waitForTimeout(2000);
    
    // Wrong: Puzzle 5 (do wrong move - try king move instead of pawn)
    await page.locator('[data-square="g1"]').click();
    await page.locator('[data-square="f2"]').click();
    await page.waitForTimeout(2000);
    
    // Verify fail result
    const resultContainer = page.getByTestId('placement-result');
    await expect(resultContainer).toBeVisible({ timeout: 10000 });
    await expect(resultContainer).toContainText(/not yet|stop/i);
    await expect(resultContainer).toContainText(/3.*of.*5/i);
    
    // School should remain locked
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-placement-cta')).toBeVisible();
    await expect(page.getByTestId('dashboard-school-cta')).not.toBeVisible();
  });
});

test.describe('Placement Test - Edge Cases', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('chessio_placement_v1');
    });
    
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Pre-School track remains accessible regardless of School lock', async ({ page }) => {
    // Pre-School CTA should always be visible
    const preSchoolCTA = page.getByTestId('dashboard-pre-school-cta');
    await expect(preSchoolCTA).toBeVisible();
    await expect(preSchoolCTA).not.toBeDisabled();
    
    // Clicking should navigate to Pre-School
    await preSchoolCTA.click();
    await expect(page).toHaveURL(/\/app/);
  });

  test('Direct navigation to /school/placement works when logged in', async ({ page }) => {
    // Direct URL access
    await page.goto('/school/placement');
    
    // Should show placement test page
    await expect(page.getByTestId('placement-begin')).toBeVisible();
  });
});

// Helper function to solve a puzzle
async function solvePuzzle(page: any, fromSquare: string, toSquare: string) {
  const chessboard = page.getByTestId('chessboard');
  await expect(chessboard).toBeVisible();
  
  // Click from square
  await page.locator(`[data-square="${fromSquare}"]`).click();
  
  // Small delay for selection to register
  await page.waitForTimeout(200);
  
  // Click to square
  await page.locator(`[data-square="${toSquare}"]`).click();
}
