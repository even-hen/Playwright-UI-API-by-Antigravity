import { test } from '../../src/utils/fixtures';
import { generateUser } from '../../src/utils/data.factory';
import { UserApiClient } from '../../src/api/clients/user.client';

test.describe('Authenticated', () => {
  // serial mode to make sign up and login for the same user sequential
  test.describe.configure({ mode: 'serial' });
  let tokenValue: string;
  const user = generateUser();

  test.beforeAll(async ({ }) => { });

  test.afterEach(async ({ context }) => {
    let cookies = await context.cookies();
    let token = cookies.find((cookie) => cookie.name === 'token');
    if (token) tokenValue = token.value;
    await context.clearCookies();
  });

  test.afterAll(async ({ request }) => {
    let userClient = new UserApiClient(request, process.env.API_BASE_URL!);
    if (tokenValue && userClient) {
      await userClient.deleteMe(tokenValue).catch(() => { });
    }
  });

  test('should sign up with credentials', async ({
    page,
    loginPage,
    contactListPage,
    addUserPage,
  }) => {
    await page.goto('/login');
    await loginPage.clickSignUp();
    await addUserPage.fillAndSubmit(user);
    await contactListPage.assertOnContactListPage();
  });

  test('should log in successfully with valid credentials', async ({
    page,
    loginPage,
    contactListPage,
  }) => {
    await page.goto('/login');
    await loginPage.login(user.email, user.password);
    await contactListPage.assertOnContactListPage();
  });
});
