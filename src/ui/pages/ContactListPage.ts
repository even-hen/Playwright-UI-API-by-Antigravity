import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Contact List page.
 * URL: /contactList
 */
export class ContactListPage {
  readonly page: Page;

  // Locators
  readonly addContactButton: Locator;
  readonly logoutButton: Locator;
  readonly contactTable: Locator;
  readonly contactRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addContactButton = page.locator('#add-contact');
    this.logoutButton = page.locator('#logout');
    this.contactTable = page.locator('#myTable');
    this.contactRows = page.locator('.contactTableBodyRow');
  }

  /** Navigate directly to the contact list page. */
  async goto(): Promise<void> {
    await this.page.goto('/contactList');
    await this.page.waitForURL(/\/contactList/, { timeout: 15_000 });
  }

  /** Click the "Add a New Contact" button. */
  async clickAddContact(): Promise<void> {
    await this.addContactButton.click();
  }

  /** Click the logout button and wait for the server-side redirect to /login. */
  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForURL(/\/login/, { timeout: 15_000 });
  }

  /** Assert that we are on the contact list page. */
  async assertOnContactListPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/contactList/);
    await expect(this.addContactButton).toBeVisible();
  }

  /** Assert the total number of rows in the contact table. */
  async assertContactCount(count: number): Promise<void> {
    await expect(this.contactRows).toHaveCount(count);
  }

  /** Assert that a contact with the given full name appears in the table. */
  async assertContactVisible(firstName: string, lastName: string): Promise<void> {
    const fullName = `${firstName} ${lastName}`;
    await expect(this.page.locator('tr.contactTableBodyRow', { hasText: fullName })).toBeVisible();
  }

  /** Click on a contact row by full name to open the detail view. */
  async clickContact(firstName: string, lastName: string): Promise<void> {
    const fullName = `${firstName} ${lastName}`;
    await this.page.locator('tr.contactTableBodyRow', { hasText: fullName }).click();
  }

  /** Get the text of all contact name cells. */
  async getContactNames(): Promise<string[]> {
    const nameCells = this.contactRows.locator('td:nth-child(2)');
    return nameCells.allTextContents();
  }
}
