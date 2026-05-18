import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { UserApiClient } from '../../src/api/clients/user.client';
import { generateUser } from '../../src/utils/data.factory';
import { loginResponseSchema } from '../../src/api/schemas';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BASE_URL = process.env.API_BASE_URL!;

test.describe('User API', () => {
  test('POST /users — should register a new user and return a valid token', async ({ request }) => {
    const userClient = new UserApiClient(request, BASE_URL);
    const newUser = generateUser();

    const response = await userClient.addUser(newUser);

    expect(response.token).toBeTruthy();
    expect(response.user.email).toBe(newUser.email);
    expect(response.user.firstName).toBe(newUser.firstName);
    expect(response.user.lastName).toBe(newUser.lastName);

    // Cleanup: delete the created user
    await userClient.deleteMe(response.token);
  });

  test('POST /users/login — should log in and return a valid token', async ({ request }) => {
    const userClient = new UserApiClient(request, BASE_URL);

    // Register first
    const newUser = generateUser();
    const registered = await userClient.addUser(newUser);

    // Log in
    const loginResponse = await userClient.login({
      email: newUser.email,
      password: newUser.password,
    });

    // Validate schema
    loginResponseSchema.parse(loginResponse);
    expect(loginResponse.token).toBeTruthy();
    expect(loginResponse.user.email).toBe(newUser.email);

    // Cleanup
    await userClient.deleteMe(loginResponse.token);
    void registered;
  });

  test('POST /users/login — should fail with invalid credentials', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/users/login`, {
      data: { email: 'invalid@nowhere.com', password: 'WrongPassword!' },
    });

    expect(response.status()).toBe(401);
  });
});
