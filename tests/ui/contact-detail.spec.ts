import { test, expect } from '../../src/utils/fixtures';
import { generateContact, generateUser } from '../../src/utils/data.factory';
import { UserApiClient } from '../../src/api/clients/user.client';

test.describe('Contact Detail', () => {
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

  test('should display correct contact details when clicking a contact', async ({
    contactListPage,
    addContactPage,
    contactDetailPage,
  }) => {
    const contact = generateContact();

    // Create via UI then wait for redirect back to list
    await contactListPage.goto();
    await contactListPage.clickAddContact();
    await addContactPage.fillAndSubmit(contact);
    await contactListPage.assertOnContactListPage();

    // Assert contact is visible in table then click it
    await contactListPage.assertContactVisible(contact.firstName, contact.lastName);
    await contactListPage.clickContact(contact.firstName, contact.lastName);

    await contactDetailPage.assertOnContactDetailPage();
    await contactDetailPage.assertContactDetails({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
    });
  });

  test('should edit a contact and reflect changes in the list', async ({
    contactListPage,
    addContactPage,
    contactDetailPage,
    editContactPage,
  }) => {
    const contact = generateContact();
    const updatedName = 'UpdatedFirstName';

    // Create via UI then wait for redirect back to list
    await contactListPage.goto();
    await contactListPage.clickAddContact();
    await addContactPage.fillAndSubmit(contact);
    await contactListPage.assertOnContactListPage();

    // Click contact row to open detail, then edit
    await contactListPage.assertContactVisible(contact.firstName, contact.lastName);
    await contactListPage.clickContact(contact.firstName, contact.lastName);
    await contactDetailPage.clickEdit();

    await editContactPage.assertOnEditContactPage();
    await editContactPage.fillAndSubmit({ firstName: updatedName });

    // Verify update reflected in detail page
    await contactDetailPage.assertOnContactDetailPage();
    await expect(contactDetailPage.firstNameField).toHaveText(updatedName);
  });

  test('should delete a contact and remove it from the list', async ({
    page,
    contactListPage,
    addContactPage,
    contactDetailPage,
  }) => {
    const contact = generateContact();

    // Create via UI then wait for redirect back to list
    await contactListPage.goto();
    await contactListPage.clickAddContact();
    await addContactPage.fillAndSubmit(contact);
    await contactListPage.assertOnContactListPage();

    // Click contact to open detail, then delete
    await contactListPage.assertContactVisible(contact.firstName, contact.lastName);
    await contactListPage.clickContact(contact.firstName, contact.lastName);
    await contactDetailPage.deleteContact();

    // Should be back on list with contact removed
    await contactListPage.assertOnContactListPage();
    await expect(
      page.locator('tr.contactTableBodyRow', {
        hasText: `${contact.firstName} ${contact.lastName}`,
      }),
    ).not.toBeVisible();
  });
});
