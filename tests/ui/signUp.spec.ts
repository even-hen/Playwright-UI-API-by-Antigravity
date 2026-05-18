import { test } from '@playwright/test';
import { LoginPage, ContactListPage, AddUserPage } from '../../src/ui/pages';
import { generateUser } from '../../src/utils/data.factory';
import { UserApiClient } from '../../src/api/clients/user.client';

test.describe('Authenticated', () => {
  test.describe.configure({ mode: 'serial' });
  let tokenValue: string;
  const user = generateUser();

  test.beforeAll(async ({}) => {});

  test.afterEach(async ({ context }) => {
    let cookies = await context.cookies();
    let token = cookies.find((cookie) => cookie.name === 'token');
    if (token) tokenValue = token.value;
    await context.clearCookies();
  });

  test.afterAll(async ({ request }) => {
    let userClient = new UserApiClient(request, process.env.API_BASE_URL!);
    if (tokenValue && userClient) {
      await userClient.deleteMe(tokenValue).catch(() => {});
    }
  });

  test('should sign up with credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const contactListPage = new ContactListPage(page);
    const addUserPage = new AddUserPage(page);

    await page.goto('/login');
    await loginPage.clickSignUp();
    await addUserPage.fillAndSubmit(user);
    await contactListPage.assertOnContactListPage();
  });

  test('should log in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const contactListPage = new ContactListPage(page);

    await page.goto('/login');
    await loginPage.login(user.email, user.password);
    await contactListPage.assertOnContactListPage();
  });
});
