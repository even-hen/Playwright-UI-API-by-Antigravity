import { Page, Locator, expect } from '@playwright/test';
import { CreateContactPayload } from '../../api/clients/contact.client';

/**
 * Page Object Model for the Edit Contact page.
 * URL: /editContact
 */
export class EditContactPage {
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

  /** Assert that we are on the edit contact page and the form is populated. */
  async assertOnEditContactPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/editContact/);
    await expect(this.submitButton).toBeVisible();
    // The app fetches contact details asynchronously and populates the form.
    // Wait until at least the lastName is populated before proceeding to edit.
    await expect(this.lastNameInput).not.toBeEmpty();
  }

  /** Fill specified fields and submit the form. */
  async fillAndSubmit(contact: Partial<CreateContactPayload>): Promise<void> {
    if (contact.firstName !== undefined) {
      await this.firstNameInput.clear();
      await this.firstNameInput.fill(contact.firstName);
    }
    if (contact.lastName !== undefined) {
      await this.lastNameInput.clear();
      await this.lastNameInput.fill(contact.lastName);
    }
    if (contact.birthdate !== undefined) {
      await this.birthdateInput.clear();
      await this.birthdateInput.fill(contact.birthdate);
    }
    if (contact.email !== undefined) {
      await this.emailInput.clear();
      await this.emailInput.fill(contact.email);
    }
    if (contact.phone !== undefined) {
      await this.phoneInput.clear();
      await this.phoneInput.fill(contact.phone);
    }
    if (contact.street1 !== undefined) {
      await this.street1Input.clear();
      await this.street1Input.fill(contact.street1);
    }
    if (contact.street2 !== undefined) {
      await this.street2Input.clear();
      await this.street2Input.fill(contact.street2);
    }
    if (contact.city !== undefined) {
      await this.cityInput.clear();
      await this.cityInput.fill(contact.city);
    }
    if (contact.stateProvince !== undefined) {
      await this.stateProvinceInput.clear();
      await this.stateProvinceInput.fill(contact.stateProvince);
    }
    if (contact.postalCode !== undefined) {
      await this.postalCodeInput.clear();
      await this.postalCodeInput.fill(contact.postalCode);
    }
    if (contact.country !== undefined) {
      await this.countryInput.clear();
      await this.countryInput.fill(contact.country);
    }
    await this.submitButton.click();
  }

  /** Assert that the error message is visible with optional text match. */
  async assertError(text?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (text) {
      await expect(this.errorMessage).toContainText(text);
    }
  }

  /** Click cancel to return without saving. */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
