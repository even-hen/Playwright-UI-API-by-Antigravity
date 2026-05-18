import { Page, Locator, expect } from '@playwright/test';
import { AddUserPayload } from '../../api/clients/user.client';

/**
 * Page Object Model for the Add User page.
 * URL: /addUser
 */
export class AddUserPage {
  readonly page: Page;

  // Locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('#submit');
    this.cancelButton = page.locator('#cancel');
    this.errorMessage = page.locator('#error');
  }

  /** Navigate directly to the add user page. */
  async goto(): Promise<void> {
    await this.page.goto('/addUser');
  }

  /** Fill the form with a user payload and submit it. */
  async fillAndSubmit(user: Partial<AddUserPayload>): Promise<void> {
    if (user.firstName) await this.firstNameInput.fill(user.firstName);
    if (user.lastName) await this.lastNameInput.fill(user.lastName);
    if (user.email) await this.emailInput.fill(user.email);
    if (user.password) await this.passwordInput.fill(user.password);
    await this.submitButton.click();
  }

  /** Assert that we are on the add user page. */
  async assertOnAddContactPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/addUser/);
    await expect(this.submitButton).toBeVisible();
  }

  /** Assert that the error message is visible with optional text match. */
  async assertError(text?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (text) {
      await expect(this.errorMessage).toContainText(text);
    }
  }

  /** Click the cancel button to navigate back. */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
