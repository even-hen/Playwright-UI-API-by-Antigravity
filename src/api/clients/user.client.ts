import { APIRequestContext } from '@playwright/test';
import {
  loginResponseSchema,
  addUserResponseSchema,
  LoginResponse,
  AddUserResponse,
} from '../schemas';
import { postJson, validateResponse } from '../helpers/request.helper';

export interface AddUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * API Client for User-related endpoints.
 * Handles user registration and authentication.
 */
export class UserApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
  ) {}

  /**
   * POST /users — Register a new user.
   */
  async addUser(payload: AddUserPayload): Promise<AddUserResponse> {
    const response = await postJson(this.request, `${this.baseUrl}/users`, payload);
    return validateResponse(response, addUserResponseSchema);
  }

  /**
   * POST /users/login — Log in an existing user and return token.
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await postJson(this.request, `${this.baseUrl}/users/login`, payload);
    return validateResponse(response, loginResponseSchema);
  }

  /**
   * POST /users/logout — Log out the current user.
   */
  async logout(token: string): Promise<void> {
    await this.request.post(`${this.baseUrl}/users/logout`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * DELETE /users/me — Delete the currently authenticated user.
   */
  async deleteMe(token: string): Promise<void> {
    await this.request.delete(`${this.baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
