import { test } from '../../src/utils/fixtures';
import { generateContact, generateUser } from '../../src/utils/data.factory';
import { UserApiClient } from '../../src/api/clients/user.client';

test.describe('Add Contact', () => {
  let token: string;
  let userClient: UserApiClient;

  test.beforeEach(async ({ request, context }) => {
    await context.clearCookies();

    userClient = new UserApiClient(request, process.env.API_BASE_URL!);
    const newUser = generateUser();
    const response = await userClient.addUser(newUser);
    token = response.token;

    await context.addInitScript((tokenVal) => {
      window.localStorage.setItem('token', tokenVal);
    }, token);

    const url = new URL(
      process.env.BASE_URL || 'https://thinking-tester-contact-list.herokuapp.com',
    );
    await context.addCookies([
      {
        name: 'token',
        value: token,
        domain: url.hostname,
        path: '/',
      },
    ]);
  });

  test.afterEach(async () => {
    if (token && userClient) {
      await userClient.deleteMe(token).catch(() => {});
    }
  });

  test('should create a new contact and display it in the list', async ({
    contactListPage,
    addContactPage,
  }) => {
    const contact = generateContact();

    await contactListPage.goto();
    await contactListPage.clickAddContact();

    await addContactPage.assertOnAddContactPage();
    await addContactPage.fillAndSubmit(contact);

    // Should redirect back to contact list
    await contactListPage.assertOnContactListPage();
    await contactListPage.assertContactVisible(contact.firstName, contact.lastName);
  });

  test('should show validation error when required fields are missing', async ({
    contactListPage,
    addContactPage,
  }) => {
    await contactListPage.goto();
    await contactListPage.clickAddContact();

    // Submit empty form
    await addContactPage.submitButton.click();
    await addContactPage.assertError();
  });

  test('should cancel and return to contact list without creating contact', async ({
    contactListPage,
    addContactPage,
  }) => {
    await contactListPage.goto();
    await contactListPage.clickAddContact();
    await addContactPage.assertOnAddContactPage();

    await addContactPage.cancel();
    await contactListPage.assertOnContactListPage();
  });
});
