import { z } from 'zod';

// ─── User Schemas ────────────────────────────────────────────────────────────

export const userSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  __v: z.number().optional(),
});

export const loginResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
});

export const addUserResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
});

// ─── Contact Schemas ─────────────────────────────────────────────────────────

export const contactSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  birthdate: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  street1: z.string().optional().nullable(),
  street2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  stateProvince: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  owner: z.string(),
  __v: z.number().optional(),
});

export const contactListSchema = z.array(contactSchema);

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type User = z.infer<typeof userSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type AddUserResponse = z.infer<typeof addUserResponseSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type ContactList = z.infer<typeof contactListSchema>;
