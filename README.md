# Playwright Test Automation Framework

A modern, production-grade test automation framework for the [Contact List App](https://thinking-tester-contact-list.herokuapp.com), built by **Google Antigravity** with **TypeScript**, **Playwright**, and **Zod**.

---

## 🚀 Tech Stack

| Tool                                                  | Purpose                        |
| ----------------------------------------------------- | ------------------------------ |
| [Playwright](https://playwright.dev)                  | UI & API test runner           |
| [TypeScript](https://www.typescriptlang.org)          | Type-safe test code            |
| [Zod](https://zod.dev)                                | API response schema validation |
| [@faker-js/faker](https://fakerjs.dev)                | Random test data generation    |
| [Prettier](https://prettier.io)                       | Code formatting                |
| [Docker](https://www.docker.com)                      | Containerized test execution   |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline                 |

---

## 📁 Project Structure

```
├── .github/workflows/playwright.yml  # CI/CD pipeline
├── src/
│   ├── api/
│   │   ├── clients/                  # UserApiClient, ContactApiClient
│   │   ├── helpers/                  # request.helper.ts (HTTP wrappers)
│   │   └── schemas/                  # Zod schemas & inferred types
│   ├── ui/
│   │   └── pages/                    # Page Object Models (POM)
│   └── utils/
│       ├── data.factory.ts           # Faker-based data generators
│       └── fixtures.ts               # Custom Playwright page fixtures
├── tests/
│   ├── api/
│   │   ├── contact.spec.ts           # API Contact CRUD tests
│   │   └── user.spec.ts              # API User management tests
│   └── ui/
│       ├── add-contact.spec.ts       # UI Contact addition tests
│       ├── contact-detail.spec.ts    # UI Contact detail & edit tests
│       ├── contact-list.spec.ts      # UI Contact list & search tests
│       ├── signUp.spec.ts            # UI Sign-up & Login tests
│       └── unauthenticated.spec.ts   # UI Unauthenticated routing tests
├── playwright.config.ts              # Playwright configuration
├── Dockerfile                        # Docker image
└── docker-compose.yml                # Docker Compose services
```

---

## ⚙️ Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
npm install
npx playwright install --with-deps chromium firefox
```

### 2. Environment Configuration

The repository uses `dotenvx` to manage environment variables securely. The `.env` file is already committed to the repository in an encrypted or managed state. 

You can run the tests directly and `dotenvx` will inject the correct environment variables automatically:

```
BASE_URL=https://thinking-tester-contact-list.herokuapp.com
API_BASE_URL=https://thinking-tester-contact-list.herokuapp.com
```

## ▶️ Running Tests

```bash
# Run all tests (UI on chromium & firefox → API)
npm test

# Run only API tests
npm run test:api

# Run only UI tests
npm run test:ui

# Run tests with Playwright UI mode (interactive)
npm run test:ui-mode

# Open the HTML report after a run
npm run report

# Format code with Prettier
npm run format

# Check formatting without writing
npm run format:check
```

---

## 🐳 Running with Docker

```bash
# Run all tests in Docker
docker compose up playwright

# Run only API tests
docker compose up playwright-api

# Run only UI tests
docker compose up playwright-ui
```

Reports will be written to `./playwright-report` and `./test-results` on your host machine.

---

## 🏗️ Architecture

### Page Object Model (POM)

UI pages are encapsulated in typed classes under `src/ui/pages/`:

- `LoginPage` — Login form interactions & assertions
- `ContactListPage` — Contact table, navigation, logout
- `AddContactPage` — New contact form submission
- `AddUserPage` — New user registration (sign-up) form submission
- `EditContactPage` — Contact edit form
- `ContactDetailPage` — Contact detail view & delete

### Custom Playwright Fixtures

The framework registers Page Objects directly as **custom fixtures** in `src/utils/fixtures.ts`. This simplifies test writing by removing redundant class instantiation (`new PageObject(page)`) from each test.

Page objects are automatically injected when destructured as arguments in a test block:

```typescript
import { test } from '../../src/utils/fixtures';

test('should create a contact', async ({ contactListPage, addContactPage }) => {
  await contactListPage.goto();
  await contactListPage.clickAddContact();
  await addContactPage.fillAndSubmit(contact);
});
```

### API Clients

Typed clients wrapping Playwright's `request` context:

- `UserApiClient` — Register, login, logout, delete account
- `ContactApiClient` — Full CRUD for contacts

### Zod Schema Validation

Every API response is validated against a Zod schema before being used in assertions, ensuring runtime type safety:

```typescript
const contact = await contactClient.createContact(payload);
contactSchema.parse(contact); // throws if response doesn't match schema
```

### Authentication Strategy

UI tests use dynamically created, isolated users per test context. A temporary user is registered via the API before each test suite, and an authentication token is injected into the browser's `localStorage` and cookies to instantly authenticate the session. This enables fully parallel and isolated test execution without state pollution. The user is deleted via the API after the tests complete. Unauthenticated tests are run in a separate group.

