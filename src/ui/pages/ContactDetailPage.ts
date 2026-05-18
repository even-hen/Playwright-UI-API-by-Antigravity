import { Page, Locator, expect } from '@playwright/test';
import { CreateContactPayload } from '../../api/clients/contact.client';

/**
 * Page Object Model for the Contact Detail page.
 * URL: /contactDetails
 */
export class ContactDetailPage {
  readonly page: Page;

  // Locators
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly returnButton: Locator;

  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly birthdateField: Locator;
  readonly emailField: Locator;
  readonly phoneField: Locator;
  readonly street1Field: Locator;
  readonly street2Field: Locator;
  readonly cityStatePostalField: Locator;
  readonly countryField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editButton = page.locator('#edit-contact');
    this.deleteButton = page.locator('#delete');
    this.returnButton = page.locator('#return');

    this.firstNameField = page.locator('#firstName');
    this.lastNameField = page.locator('#lastName');
    this.birthdateField = page.locator('#birthdate');
    this.emailField = page.locator('#email');
    this.phoneField = page.locator('#phone');
    this.street1Field = page.locator('#street1');
    this.street2Field = page.locator('#street2');
    this.cityStatePostalField = page.locator('#cityStatePostal');
    this.countryField = page.locator('#country');
  }

  /** Assert that we are on the contact details page. */
  async assertOnContactDetailPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/contactDetails/);
    await expect(this.editButton).toBeVisible();
  }

  /** Assert displayed contact details match expected values. */
  async assertContactDetails(contact: Partial<CreateContactPayload>): Promise<void> {
    if (contact.firstName) await expect(this.firstNameField).toHaveText(contact.firstName);
    if (contact.lastName) await expect(this.lastNameField).toHaveText(contact.lastName);
    if (contact.email) await expect(this.emailField).toHaveText(contact.email);
    if (contact.phone) await expect(this.phoneField).toHaveText(contact.phone);
    if (contact.country) await expect(this.countryField).toHaveText(contact.country);
  }

  /** Click the Edit Contact button. */
  async clickEdit(): Promise<void> {
    await this.editButton.click();
  }

  /** Click the Delete button and confirm the browser dialog. */
  async deleteContact(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.deleteButton.click();
  }

  /** Click Return to navigate back to the contact list. */
  async returnToList(): Promise<void> {
    await this.returnButton.click();
  }
}
