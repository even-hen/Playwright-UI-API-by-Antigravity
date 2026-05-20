# 📋 Contact List App — Use Cases & Test Coverage Tracker

This document serves as the single source of truth for the business-level use cases of the **Contact List App** web service. It maps the user checklist requirements directly to their corresponding automated UI and API test coverage to ensure full quality assurance.

---

## 📊 Summary of System Use Cases

Below is the high-level mapping of the use cases, including the specific actors, target files, and coverage status.

| Use Case ID | Use Case Name                               | Primary Actor      | API Coverage | UI Coverage | Coverage Status |
| :---------- | :------------------------------------------ | :----------------- | :----------- | :---------- | :-------------- |
| **UC-01**   | User Sign Up & Account Creation             | Guest User         | 🟢 Covered   | 🟢 Covered  | 🟢 Full         |
| **UC-02**   | User Authentication (Login & Logout)        | Guest / Registered | 🟢 Covered   | 🟢 Covered  | 🟢 Full         |
| **UC-03**   | Create New Contact (Required / Full Fields) | Registered User    | 🟢 Covered   | 🟢 Covered  | 🟢 Full         |
| **UC-04**   | Retrieve, View & Display Contacts           | Registered User    | 🟢 Covered   | 🟢 Covered  | 🟢 Full         |
| **UC-05**   | Update & Edit Contact Details               | Registered User    | 🟢 Covered   | 🟢 Covered  | 🟢 Full         |
| **UC-06**   | Delete Contact                              | Registered User    | 🟢 Covered   | 🟢 Covered  | 🟢 Full         |

---

## 💡 System Use Cases Detail

### 📝 UC-01: User Sign Up & Account Creation

**Description:**
Allows guest users to register an account with a unique email address to start managing contacts.

- **Primary Actor:** Guest User
- **Preconditions:**
  - The user is on the login landing page.
  - The registration email address is unique (not already registered).

#### 🟩 Main Flow (Happy Path)

1. User clicks the **"Sign up"** button.
2. System displays the **Add User** form.
3. User enters a **First Name**, **Last Name**, a **unique Email**, and a valid **Password** (min 7 characters), then clicks **"Submit"**. _(Covers: Register when registration form is fulfilled)_
4. System creates the account, generates an authentication token, sets up the session, and redirects to the **Contact List** home page.

#### 🟨 Alternative / Exception Flows (Sad Paths)

- **A1: Missing Required Fields** _(Covers: Sign up error when registration form is not fulfilled)_
  1. User leaves one or more required fields blank and clicks **"Submit"**.
  2. System displays a validation error message: `User validation failed: firstName: Path firstName is required.`
- **A2: Non-Unique Email Registration** _(Covers: Register only with unique email & Sign up error with non-unique email)_
  1. User attempts to register with an email address already registered.
  2. System displays the error: `Email address is already in use` and blocks registration.

#### 🧪 Test Coverage

- **API Coverage:**
  - 🟢 `tests/api/user.spec.ts` -> `"POST /users — should register a new user and return a valid token"`
- **UI Coverage:**
  - 🟢 `tests/ui/signUp.spec.ts` -> `"should sign up with credentials"`

---

### 📝 UC-02: User Authentication (Login & Logout)

**Description:**
Allows users to securely access and exit the application using valid credentials.

- **Primary Actor:** Guest / Registered User
- **Preconditions:**
  - For Login: The user has a registered, active account. _(Covers: Registered user should be able to login)_
  - For Logout: The user is currently logged in.

#### 🟩 Main Flow (Happy Path)

1. User enters a valid **Email** and **Password** on the login page and clicks **"Submit"**. _(Covers: Login with valid credentials)_
2. System authenticates the credentials and redirects the user to the **Contact List** home page.
3. To exit, the user clicks the **"Logout"** button on the Contact List page. _(Covers: User should be able to logout)_
4. System clears active session tokens and cookies, then redirects the user back to the **Login** page.

#### 🟨 Alternative / Exception Flows (Sad Paths)

- **A1: Invalid Credentials** _(Covers: Cannot login with invalid credentials & Error message display on invalid credentials)_
  1. User enters incorrect or non-existent credentials (e.g. incorrect email or password) and clicks **"Submit"**.
  2. System denies access and displays the error message: `Incorrect username or password`.

#### 🧪 Test Coverage

- **API Coverage:**
  - 🟢 `tests/api/user.spec.ts` -> `"POST /users/login — should log in and return a valid token"`
  - 🟢 `tests/api/user.spec.ts` -> `"POST /users/login — should fail with invalid credentials"`
- **UI Coverage:**
  - 🟢 `tests/ui/signUp.spec.ts` -> `"should log in successfully with valid credentials"`
  - 🟢 `tests/ui/unauthenticated.spec.ts` -> `"should show error on invalid credentials"`

---

### 📝 UC-03: Create New Contact

**Description:**
Allows logged-in users to add new contacts to their list by filling in required fields or comprehensive contact details.

- **Primary Actor:** Registered User
- **Preconditions:**
  - User is authenticated and on the **Contact List** home screen.

#### 🟩 Main Flow (Happy Path)

1. User clicks the **"Add a New Contact"** button.
2. System displays the **Add Contact** form.
3. User fills in the contact details:
   - **Option A (Full Details):** User fills in all fields (First Name, Last Name, Birthdate, Email, Phone, Street Address 1 & 2, City, State, Postal Code, Country) and clicks **"Submit"**. _(Covers: Add new contact with fully filled details)_
   - **Option B (Required Fields Only):** User fills in only the mandatory fields (**First Name** and **Last Name**) and clicks **"Submit"**. _(Covers: Add new contact with required fields only)_
4. System saves the contact, redirects back to the **Contact List** page, and displays the contact in the table.

#### 🟨 Alternative / Exception Flows (Sad Paths)

- **A1: Required Fields Missing**
  1. User leaves **First Name** and/or **Last Name** blank and clicks **"Submit"**.
  2. System displays a validation error and retains the user on the Add Contact page.
- **A2: Cancel Contact Creation**
  1. User clicks **"Cancel"** instead of submit.
  2. System discards all entries and redirects back to the **Contact List** page without saving.

#### 🧪 Test Coverage

- **API Coverage:**
  - 🟢 `tests/api/contact.spec.ts` -> `"POST /contacts — should create a contact and validate response schema"`
- **UI Coverage:**
  - 🟢 `tests/ui/add-contact.spec.ts` -> `"should create a new contact and display it in the list"`
  - 🟢 `tests/ui/add-contact.spec.ts` -> `"should show validation error when required fields are missing"`
  - 🟢 `tests/ui/add-contact.spec.ts` -> `"should cancel and return to contact list without creating contact"`

---

### 📝 UC-04: Retrieve, View & Display Contacts

**Description:**
Allows users to view all created contacts in the main table and inspect full details by selecting a specific contact.

- **Primary Actor:** Registered User
- **Preconditions:**
  - User is authenticated and has at least one active contact in their list.

#### 🟩 Main Flow (Happy Path)

1. User navigates to the **Contact List** home screen.
2. System displays the table of contacts with correct name, email, and other key summary details. _(Covers: Added contacts displayed in table and details are correct)_
3. User clicks on a specific contact row. _(Covers: View created contacts)_
4. System navigates to the **Contact Details** page and correctly displays the complete details (First Name, Last Name, Phone, Email, Address, etc.).

#### 🧪 Test Coverage

- **API Coverage:**
  - 🟢 `tests/api/contact.spec.ts` -> `"GET /contacts — should return the contact list and validate schema"`
  - 🟢 `tests/api/contact.spec.ts` -> `"GET /contacts/:id — should return a single contact by ID"`
- **UI Coverage:**
  - 🟢 `tests/ui/contact-list.spec.ts` -> `"should display the contact list page"`
  - 🟢 `tests/ui/contact-detail.spec.ts` -> `"should display correct contact details when clicking a contact"`
  - 🟢 `tests/ui/unauthenticated.spec.ts` -> `"should not allow access to contact details by direct link without login"`

---

### 📝 UC-05: Update & Edit Contact Details

**Description:**
Allows users to modify and update details of existing contacts.

- **Primary Actor:** Registered User
- **Preconditions:**
  - User is authenticated and has opened the detailed view of a specific contact.

#### 🟩 Main Flow (Happy Path)

1. User clicks the **"Edit Contact"** button on the Contact Details page. _(Covers: Edit created contacts)_
2. System displays the **Edit Contact** form populated with the current contact details.
3. User modifies the desired fields (e.g. First Name, Last Name, or Email) and clicks **"Submit"**.
4. System saves the changes, redirects to the **Contact Details** page, and displays the updated information.

#### 🟨 Alternative / Exception Flows (Sad Paths)

- **A1: Required Fields Missing on Edit**
  1. User clears the **First Name** and/or **Last Name** fields and clicks **"Submit"**.
  2. System displays a validation error message (e.g. `Validation failed: firstName: Path firstName is required.`) and blocks the update.

#### 🧪 Test Coverage

- **API Coverage:**
  - 🟢 `tests/api/contact.spec.ts` -> `"PUT /contacts/:id — should fully update a contact"`
  - 🟢 `tests/api/contact.spec.ts` -> `"PATCH /contacts/:id — should partially update a contact"`
- **UI Coverage:**
  - 🟢 `tests/ui/contact-detail.spec.ts` -> `"should edit a contact and reflect changes in the list"`
  - 🟢 `tests/ui/contact-detail.spec.ts` -> `"should show validation error when editing a contact and clearing first name"`
  - 🟢 `tests/ui/contact-detail.spec.ts` -> `"should show validation error when editing a contact and clearing last name"`
  - 🟢 `tests/ui/contact-detail.spec.ts` -> `"should show validation error when editing a contact and clearing both names"`

---

### 📝 UC-06: Delete Contact

**Description:**
Allows users to permanently delete a contact from their contact list.

- **Primary Actor:** Registered User
- **Preconditions:**
  - User is authenticated and has opened the detailed view of the contact they want to delete.

#### 🟩 Main Flow (Happy Path)

1. User clicks the **"Delete Contact"** button on the Contact Details page. _(Covers: Delete created contacts)_
2. System displays a confirmation dialog asking to confirm deletion.
3. User clicks **"OK"** to accept.
4. System permanently deletes the contact, redirects back to the **Contact List** home screen, and removes the contact row from the list.

#### 🧪 Test Coverage

- **API Coverage:**
  - 🟢 `tests/api/contact.spec.ts` -> `"DELETE /contacts/:id — should delete a contact and verify it is gone"`
- **UI Coverage:**
  - 🟢 `tests/ui/contact-detail.spec.ts` -> `"should delete a contact and remove it from the list"`

---

> [!NOTE]
> All business-level requirements listed in the checklist are fully covered by both **API** and **UI** level tests within our Playwright automation framework.
