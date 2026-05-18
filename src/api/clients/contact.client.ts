import { APIRequestContext } from '@playwright/test';
import { contactSchema, contactListSchema, Contact, ContactList } from '../schemas';
import {
  validateResponse,
  postJson,
  getJson,
  putJson,
  patchJson,
  deleteJson,
} from '../helpers/request.helper';

export interface CreateContactPayload {
  firstName: string;
  lastName: string;
  birthdate?: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

/**
 * API Client for Contact-related endpoints.
 * All methods require a valid Bearer token.
 */
export class ContactApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
    private readonly token: string,
  ) {}

  /**
   * POST /contacts — Create a new contact.
   */
  async createContact(payload: CreateContactPayload): Promise<Contact> {
    const response = await postJson(this.request, `${this.baseUrl}/contacts`, payload, this.token);
    return validateResponse(response, contactSchema);
  }

  /**
   * GET /contacts — Retrieve the full contact list for the authenticated user.
   */
  async getContacts(): Promise<ContactList> {
    const response = await getJson(this.request, `${this.baseUrl}/contacts`, this.token);
    return validateResponse(response, contactListSchema);
  }

  /**
   * GET /contacts/:id — Retrieve a single contact by ID.
   */
  async getContact(id: string): Promise<Contact> {
    const response = await getJson(this.request, `${this.baseUrl}/contacts/${id}`, this.token);
    return validateResponse(response, contactSchema);
  }

  /**
   * PUT /contacts/:id — Replace a contact with a full update.
   */
  async updateContact(id: string, payload: CreateContactPayload): Promise<Contact> {
    const response = await putJson(
      this.request,
      `${this.baseUrl}/contacts/${id}`,
      payload,
      this.token,
    );
    return validateResponse(response, contactSchema);
  }

  /**
   * PATCH /contacts/:id — Partially update a contact.
   */
  async patchContact(id: string, payload: Partial<CreateContactPayload>): Promise<Contact> {
    const response = await patchJson(
      this.request,
      `${this.baseUrl}/contacts/${id}`,
      payload,
      this.token,
    );
    return validateResponse(response, contactSchema);
  }

  /**
   * DELETE /contacts/:id — Delete a contact by ID.
   */
  async deleteContact(id: string): Promise<void> {
    await deleteJson(this.request, `${this.baseUrl}/contacts/${id}`, this.token);
  }
}
