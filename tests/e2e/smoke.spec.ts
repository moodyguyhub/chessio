/**
 * E2E Smoke Tests
 * Critical path testing - ensures core user flows work end-to-end
 */

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Critical Paths', () => {
  test('landing page loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Chessio/);
    
    // Check hero text
    await expect(page.getByText(/Learn chess calmly/i)).toBeVisible();
    await expect(page.getByText(/One confident move at a time/i)).toBeVisible();
    
    // Check CTA button
    await expect(page.getByRole('button', { name: /Start your first lesson/i })).toBeVisible();
  });

  test('navigation to register page works', async ({ page }) => {
    await page.goto('/');
    
    // Click register link
    await page.getByRole('link', { name: /Sign up/i }).click();
    
    // Should be on register page
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('heading', { name: /Sign up/i })).toBeVisible();
  });

  test('navigation to login page works', async ({ page }) => {
    await page.goto('/');
    
    // Click login link
    await page.getByRole('link', { name: /Sign in/i }).click();
    
    // Should be on login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
  });

  test('chessboard renders on landing page', async ({ page }) => {
    await page.goto('/');
    
    // Check for chessboard element
    const chessboard = page.locator('[data-testid="chessboard"]');
    await expect(chessboard).toBeVisible();
    
    // Check for chess squares
    const squares = page.locator('[data-square]');
    await expect(squares.first()).toBeVisible();
  });

  test('logo is visible and clickable', async ({ page }) => {
    await page.goto('/login');
    
    // Check logo exists
    const logo = page.locator('svg').first();
    await expect(logo).toBeVisible();
    
    // Logo should link to home
    await page.getByRole('link', { name: /Chessio/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('responsive design works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('/');
    
    // Content should still be visible
    await expect(page.getByText(/Learn chess calmly/i)).toBeVisible();
    
    // CTA should be reachable
    const cta = page.getByRole('button', { name: /Start your first lesson/i });
    await expect(cta).toBeVisible();
  });

  test('all critical pages return 200', async ({ page }) => {
    const pages = ['/', '/login', '/register'];
    
    for (const path of pages) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    }
  });
});

test.describe('Smoke Tests - Performance', () => {
  test('landing page loads within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('chessboard renders without layout shift', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial render
    await page.waitForLoadState('networkidle');
    
    // Check board is stable (no CLS)
    const chessboard = page.locator('[data-testid="chessboard"]');
    const box1 = await chessboard.boundingBox();
    
    await page.waitForTimeout(500);
    
    const box2 = await chessboard.boundingBox();
    
    // Position should not change
    expect(box1?.y).toBe(box2?.y);
  });
});
