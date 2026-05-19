import { test as base } from '@playwright/test';
import {
  LoginPage,
  ContactListPage,
  AddContactPage,
  AddUserPage,
  ContactDetailPage,
  EditContactPage,
} from '../ui/pages';

interface PageFixtures {
  loginPage: LoginPage;
  contactListPage: ContactListPage;
  addContactPage: AddContactPage;
  addUserPage: AddUserPage;
  contactDetailPage: ContactDetailPage;
  editContactPage: EditContactPage;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  contactListPage: async ({ page }, use) => {
    await use(new ContactListPage(page));
  },
  addContactPage: async ({ page }, use) => {
    await use(new AddContactPage(page));
  },
  addUserPage: async ({ page }, use) => {
    await use(new AddUserPage(page));
  },
  contactDetailPage: async ({ page }, use) => {
    await use(new ContactDetailPage(page));
  },
  editContactPage: async ({ page }, use) => {
    await use(new EditContactPage(page));
  },
});

export { expect } from '@playwright/test';
