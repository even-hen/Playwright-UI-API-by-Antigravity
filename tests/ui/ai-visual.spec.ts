import { test, expect } from '../../src/utils/fixtures';
import { assertVisualLayout } from '../../src/utils/ai-vision';

test.describe('AI Visual UX Auditing & Diagnostics', () => {
  // Use isolated, unauthenticated state
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should validate the login page visual layout and branding', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('/login');

    // 2. Perform a semantic visual audit using Gemini
    await assertVisualLayout(
      page,
      'The login page must display a clear title banner for the "Contact List App". ' +
        'It should feature two input boxes for Email and Password, and a "Submit" button. ' +
        'There should also be a prompt and button/link for signing up. ' +
        'Ensure everything is cleanly aligned, centered, and readable.',
    );
  });

  test('should validate the registration (add user) page visual layout', async ({
    page,
    loginPage,
  }) => {
    // 1. Go to login page, then navigate to Sign Up
    await page.goto('/login');
    await loginPage.clickSignUp();
    await page.waitForURL(/\/addUser/);

    // 2. Perform a semantic visual audit of the registration form
    await assertVisualLayout(
      page,
      'The Add User page must display a structured form containing input fields for ' +
        'First Name, Last Name, Email, and Password. ' +
        'There should be two main action buttons: "Submit" and "Cancel". ' +
        'The form should be well-proportioned, legible, and properly centered.',
    );
  });

  // This test only runs when explicitly requested to demonstrate the AI Failure Diagnostics Reporter
  if (process.env.RUN_FAILING_AI_TEST === 'true') {
    test('should demonstrate the AI Failure Diagnostics reporter on error', async ({ page }) => {
      await page.goto('/login');

      // Intentional mismatch assertion to trigger test failure and AI Reporter diagnostics
      console.log('ℹ️ Running intentional failure test to showcase Gemini AI diagnostics...');

      // Let's assert a non-existent heading to trigger a timeout failure
      const hiddenHeader = page.locator(
        'h1:has-text("Welcome to the Ultimate Antigravity Portal")',
      );
      await expect(hiddenHeader).toBeVisible({ timeout: 2000 });
    });
  }
});
