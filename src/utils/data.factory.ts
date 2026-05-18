import { faker } from '@faker-js/faker';
import { CreateContactPayload } from '../api/clients/contact.client';
import { AddUserPayload } from '../api/clients/user.client';

/**
 * Generates a random valid user payload for registration.
 */
export function generateUser(): AddUserPayload {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email({ provider: 'test-automation.com' }).toLowerCase(),
    password: faker.internet.password({ length: 12, memorable: false }) + 'A1!',
  };
}

/**
 * Generates a random valid contact payload.
 */
export function generateContact(overrides?: Partial<CreateContactPayload>): CreateContactPayload {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    birthdate: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }).toISOString().split('T')[0],
    email: faker.internet.email({ provider: 'test-automation.com' }).toLowerCase(),
    phone: faker.phone.number({ style: 'national' }).replace(/\D/g, '').slice(0, 10),
    street1: faker.location.streetAddress(),
    street2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    stateProvince: faker.location.state({ abbreviated: true }),
    postalCode: faker.location.zipCode('#####'),
    country: faker.location.countryCode('alpha-2'),
    ...overrides,
  };
}
