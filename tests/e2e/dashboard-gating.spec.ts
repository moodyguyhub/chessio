/**
 * E2E Test - Dashboard Gating & Track Navigation
 * Tests unified dashboard flow and Pre-School → School unlock via completion
 * 
 * Based on: DASHBOARD_V1.md
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard Gating - Pre-School Completion Path', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear all state
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Login
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Initial state: Pre-School accessible, School locked', async ({ page }) => {
    // Pre-School should be visible and enabled
    const preSchoolCTA = page.getByTestId('dashboard-pre-school-cta');
    await expect(preSchoolCTA).toBeVisible();
    await expect(preSchoolCTA).not.toBeDisabled();
    
    // School should show placement CTA (locked state)
    const placementCTA = page.getByTestId('dashboard-placement-cta');
    await expect(placementCTA).toBeVisible();
    
    // School CTA should not be visible
    const schoolCTA = page.getByTestId('dashboard-school-cta');
    await expect(schoolCTA).not.toBeVisible();
    
    // Club should be "coming soon"
    const clubCTA = page.getByTestId('dashboard-club-cta');
    await expect(clubCTA).toBeVisible();
    await expect(clubCTA).toBeDisabled();
  });

  test('Can navigate to Pre-School from dashboard', async ({ page }) => {
    // Click Pre-School CTA
    await page.getByTestId('dashboard-pre-school-cta').click();
    
    // Should navigate to /app
    await expect(page).toHaveURL(/\/app/);
    
    // Should show Pre-School content
    // (check for level 0 lessons or welcome message)
    await expect(page.getByText(/pre-school|level 0|meet the rook/i)).toBeVisible();
  });

  test('Dashboard is accessible from Pre-School', async ({ page }) => {
    // Navigate to Pre-School
    await page.getByTestId('dashboard-pre-school-cta').click();
    await expect(page).toHaveURL(/\/app/);
    
    // Look for dashboard/home link
    const dashboardLink = page.getByRole('link', { name: /dashboard|home/i }).first();
    
    // Click it
    await dashboardLink.click();
    
    // Should return to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Login redirects to dashboard (not /app)', async ({ page, context }) => {
    // Logout first
    await page.goto('/');
    await context.clearCookies();
    
    // Login again
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    // Should redirect to dashboard, not /app
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page).not.toHaveURL(/\/app$/);
  });

  test('Register redirects to dashboard', async ({ page, context }) => {
    // Logout
    await context.clearCookies();
    
    // Generate unique email
    const testEmail = `test-${Date.now()}@chessio.test`;
    
    // Go to register
    await page.goto('/register');
    
    // Fill form
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).first().fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    
    // Submit
    await page.getByRole('button', { name: /create account|sign up/i }).click();
    
    // After successful registration, should redirect to dashboard
    // (may go through login first)
    await expect(page).toHaveURL(/\/dashboard|\/login/, { timeout: 10000 });
    
    // If on login, login and check redirect
    if (page.url().includes('/login')) {
      await page.getByLabel(/email/i).fill(testEmail);
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: /log in|sign in/i }).click();
      await expect(page).toHaveURL(/\/dashboard/);
    }
  });
});

test.describe('Dashboard - Track Status Display', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Pre-School card shows progress indication', async ({ page }) => {
    // Pre-School card should show some status
    const preSchoolCard = page.getByTestId('dashboard-pre-school-cta').locator('..');
    
    // Should show progress percentage or completion count
    // E.g., "0% Complete" or "0 of 5 lessons"
    await expect(preSchoolCard).toBeVisible();
    
    // Check for common progress indicators
    const hasProgress = await preSchoolCard.getByText(/\d+%|\d+.*of.*\d+|not started|in progress|complete/i).isVisible();
    expect(hasProgress).toBeTruthy();
  });

  test('School card shows lock/unlock state clearly', async ({ page }) => {
    // School should be locked (no placement passed)
    // Look for lock icon or "locked" text
    const schoolSection = page.locator('text=/school|chess school/i').first().locator('..');
    
    // Should show lock indicator
    await expect(schoolSection.getByText(/locked|unlock|placement/i)).toBeVisible();
  });

  test('XP display is visible in header', async ({ page }) => {
    // Dashboard should show user's XP
    // Look for XP badge/counter in header
    const xpDisplay = page.getByText(/\d+.*xp|level \d+/i).first();
    await expect(xpDisplay).toBeVisible();
  });

  test('User name displayed in greeting', async ({ page }) => {
    // Should show personalized greeting
    // "Welcome back, [Name]" or similar
    await expect(page.getByText(/welcome|hello|hi/i)).toBeVisible();
  });
});

test.describe('Dashboard - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('Dashboard renders correctly on mobile', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    
    // All three track cards should be visible
    await expect(page.getByTestId('dashboard-pre-school-cta')).toBeVisible();
    await expect(page.getByTestId('dashboard-placement-cta')).toBeVisible();
    await expect(page.getByTestId('dashboard-club-cta')).toBeVisible();
  });

  test('Track cards are stacked vertically on mobile', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Get positions of cards
    const preSchoolCTA = page.getByTestId('dashboard-pre-school-cta');
    const placementCTA = page.getByTestId('dashboard-placement-cta');
    
    const preSchoolBox = await preSchoolCTA.boundingBox();
    const placementBox = await placementCTA.boundingBox();
    
    // On mobile, cards should be stacked (placement card below pre-school)
    if (preSchoolBox && placementBox) {
      expect(placementBox.y).toBeGreaterThan(preSchoolBox.y);
    }
  });
});
