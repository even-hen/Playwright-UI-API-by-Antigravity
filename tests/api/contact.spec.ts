import { test, expect, APIRequestContext } from '@playwright/test';
import { UserApiClient } from '../../src/api/clients/user.client';
import { ContactApiClient } from '../../src/api/clients/contact.client';
import { generateUser, generateContact } from '../../src/utils/data.factory';
import { contactSchema, contactListSchema } from '../../src/api/schemas';

const BASE_URL = process.env.API_BASE_URL!;

test.describe('Contact API', () => {
  // We manually create and dispose an APIRequestContext so it can be
  // safely shared between beforeAll, afterAll, and individual tests.
  // Using the `request` fixture from beforeAll is not supported by Playwright.

  let apiContext: APIRequestContext;
  let token: string;
  let userClient: UserApiClient;
  let contactClient: ContactApiClient;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: BASE_URL,
    });
    userClient = new UserApiClient(apiContext, BASE_URL);

    const newUser = generateUser();
    const loginResponse = await userClient.addUser(newUser);
    token = loginResponse.token;
    contactClient = new ContactApiClient(apiContext, BASE_URL, token);
  });

  test.afterAll(async () => {
    await userClient.deleteMe(token);
    await apiContext.dispose();
  });

  test('POST /contacts — should create a contact and validate response schema', async () => {
    const payload = generateContact();
    const contact = await contactClient.createContact(payload);

    // Validate full Zod schema
    contactSchema.parse(contact);

    expect(contact.firstName).toBe(payload.firstName);
    expect(contact.lastName).toBe(payload.lastName);
    expect(contact.email).toBe(payload.email);

    // Cleanup
    await contactClient.deleteContact(contact._id);
  });

  test('GET /contacts — should return the contact list and validate schema', async () => {
    // Create a contact first
    const payload = generateContact();
    const created = await contactClient.createContact(payload);

    const contacts = await contactClient.getContacts();

    // Validate schema
    contactListSchema.parse(contacts);
    expect(contacts.length).toBeGreaterThan(0);
    expect(contacts.some((c) => c._id === created._id)).toBeTruthy();

    // Cleanup
    await contactClient.deleteContact(created._id);
  });

  test('GET /contacts/:id — should return a single contact by ID', async () => {
    const payload = generateContact();
    const created = await contactClient.createContact(payload);

    const fetched = await contactClient.getContact(created._id);

    contactSchema.parse(fetched);
    expect(fetched._id).toBe(created._id);
    expect(fetched.firstName).toBe(payload.firstName);

    await contactClient.deleteContact(created._id);
  });

  test('PUT /contacts/:id — should fully update a contact', async () => {
    const original = generateContact();
    const created = await contactClient.createContact(original);

    const updated = generateContact();
    const result = await contactClient.updateContact(created._id, updated);

    contactSchema.parse(result);
    expect(result.firstName).toBe(updated.firstName);
    expect(result.lastName).toBe(updated.lastName);
    expect(result.email).toBe(updated.email);

    await contactClient.deleteContact(created._id);
  });

  test('PATCH /contacts/:id — should partially update a contact', async () => {
    const original = generateContact();
    const created = await contactClient.createContact(original);

    const patchPayload = { firstName: 'PatchedFirstName' };
    const result = await contactClient.patchContact(created._id, patchPayload);

    contactSchema.parse(result);
    expect(result.firstName).toBe('PatchedFirstName');
    // Other fields remain unchanged
    expect(result.lastName).toBe(original.lastName);

    await contactClient.deleteContact(created._id);
  });

  test('DELETE /contacts/:id — should delete a contact and verify it is gone', async () => {
    const payload = generateContact();
    const created = await contactClient.createContact(payload);

    await contactClient.deleteContact(created._id);

    // Verify 404 after deletion
    const verifyResponse = await apiContext.get(`/contacts/${created._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(verifyResponse.status()).toBe(404);
  });
});
