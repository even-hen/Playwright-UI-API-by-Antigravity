import { Page, Locator, expect } from '@playwright/test';
import { CreateContactPayload } from '../../api/clients/contact.client';

/**
 * Page Object Model for the Add Contact page.
 * URL: /addContact
 */
export class AddContactPage {
  readonly page: Page;

  // Locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly birthdateInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly street1Input: Locator;
  readonly street2Input: Locator;
  readonly cityInput: Locator;
  readonly stateProvinceInput: Locator;
  readonly postalCodeInput: Locator;
  readonly countryInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.birthdateInput = page.locator('#birthdate');
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phone');
    this.street1Input = page.locator('#street1');
    this.street2Input = page.locator('#street2');
    this.cityInput = page.locator('#city');
    this.stateProvinceInput = page.locator('#stateProvince');
    this.postalCodeInput = page.locator('#postalCode');
    this.countryInput = page.locator('#country');
    this.submitButton = page.locator('#submit');
    this.cancelButton = page.locator('#cancel');
    this.errorMessage = page.locator('#error');
  }

  /** Navigate directly to the add contact page. */
  async goto(): Promise<void> {
    await this.page.goto('/addContact');
  }

  /** Fill the form with a contact payload and submit it. */
  async fillAndSubmit(contact: Partial<CreateContactPayload>): Promise<void> {
    if (contact.firstName) await this.firstNameInput.fill(contact.firstName);
    if (contact.lastName) await this.lastNameInput.fill(contact.lastName);
    if (contact.birthdate) await this.birthdateInput.fill(contact.birthdate);
    if (contact.email) await this.emailInput.fill(contact.email);
    if (contact.phone) await this.phoneInput.fill(contact.phone);
    if (contact.street1) await this.street1Input.fill(contact.street1);
    if (contact.street2) await this.street2Input.fill(contact.street2);
    if (contact.city) await this.cityInput.fill(contact.city);
    if (contact.stateProvince) await this.stateProvinceInput.fill(contact.stateProvince);
    if (contact.postalCode) await this.postalCodeInput.fill(contact.postalCode);
    if (contact.country) await this.countryInput.fill(contact.country);
    await this.submitButton.click();
  }

  /** Assert that we are on the add contact page. */
  async assertOnAddContactPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/addContact/);
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
