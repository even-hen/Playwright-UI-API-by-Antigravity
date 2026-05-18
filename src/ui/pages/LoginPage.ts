import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Login page.
 * URL: /login
 */
export class LoginPage {
  readonly page: Page;

  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('#submit');
    this.errorMessage = page.locator('#error');
  }

  /** Navigate directly to the login page. */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /** Fill in credentials and submit the login form. */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /** Assert that we are on the login page. */
  async assertOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.submitButton).toBeVisible();
  }

  /** Assert that the error message is visible with optional text match. */
  async assertError(text?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (text) {
      await expect(this.errorMessage).toContainText(text);
    }
  }
}
