/**
 * E2E Integration Tests - User Authentication Flow
 * Tests complete registration, login, and logout flows
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow - E2E', () => {
  const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@chessio.test`,
    password: 'SecurePassword123!',
  };

  test('complete registration flow', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    await page.getByLabel(/name/i).fill(testUser.name);
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).first().fill(testUser.password);
    await page.getByLabel(/confirm password/i).fill(testUser.password);
    
    // Submit form
    await page.getByRole('button', { name: /create account|sign up/i }).click();
    
    // Should redirect to login after successful registration
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    
    // Success message should appear
    await expect(page.getByText(/account created/i)).toBeVisible();
  });

  test('registration validation works', async ({ page }) => {
    await page.goto('/register');
    
    // Try to submit without filling fields
    await page.getByRole('button', { name: /create account|sign up/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/required/i).first()).toBeVisible();
  });

  test('password mismatch shows error', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByLabel(/email/i).fill('test@test.com');
    await page.getByLabel(/password/i).first().fill('password123');
    await page.getByLabel(/confirm password/i).fill('different123');
    
    await page.getByRole('button', { name: /create account|sign up/i }).click();
    
    await expect(page.getByText(/passwords.*match/i)).toBeVisible();
  });

  test('login with valid credentials', async ({ page }) => {
    // Note: This requires a seeded test user in the database
    await page.goto('/login');
    
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    // Should redirect to dashboard (unified home)
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/email/i).fill('wrong@test.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid.*credentials/i)).toBeVisible();
  });

  test('protected routes redirect to login', async ({ page }) => {
    // Try to access protected dashboard without auth
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Session Management', () => {
  test('logout works correctly', async ({ page, context }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@chessio.app');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Find and click logout button
    await page.getByRole('button', { name: /sign out/i }).click();
    
    // Should redirect to home
    await expect(page).toHaveURL('/');
    
    // Session should be cleared - trying to access protected route should redirect
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
