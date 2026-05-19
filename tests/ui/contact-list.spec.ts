import { test } from '../../src/utils/fixtures';
import { generateUser } from '../../src/utils/data.factory';
import { UserApiClient } from '../../src/api/clients/user.client';

test.describe('Contact List', () => {
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

  test('should display the contact list page after login', async ({ contactListPage }) => {
    await contactListPage.goto();
    await contactListPage.assertOnContactListPage();
  });

  test('should navigate to Add Contact page on button click', async ({
    contactListPage,
    addContactPage,
  }) => {
    await contactListPage.goto();
    await contactListPage.clickAddContact();

    await addContactPage.assertOnAddContactPage();
  });
});
