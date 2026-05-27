# 🎭 Playwright Test Automation Framework

A modern, production-grade test automation framework for the [Contact List App](https://thinking-tester-contact-list.herokuapp.com), built with **TypeScript** and **Playwright**.

---

## 🛠️ Quick Start

```bash
git clone <your-repo-url> && cd <repo-dir>
npm install
npx playwright install --with-deps chromium firefox
```

### Environment Setup
Create a `.env` file (managed by `dotenvx`):
```ini
BASE_URL=https://thinking-tester-contact-list.herokuapp.com
API_BASE_URL=https://thinking-tester-contact-list.herokuapp.com
GEMINI_API_KEY=your_gemini_api_key_here # Optional: For AI visual layout/diagnostics
```

---

## 🚀 Running Tests

### Local Execution
```bash
npm test              # Run all tests (UI → API)
npm run test:api      # Run only API tests
npm run test:ui       # Run only UI tests
npm run test:ui-mode  # Open Playwright UI mode
npm run report        # Open HTML test report
```

### Docker Execution
```bash
docker compose up playwright     # Run all tests in Docker
docker compose up playwright-api # Run only API tests
docker compose up playwright-ui  # Run only UI tests
```

---

## 📁 Directory Structure

```
├── .github/workflows/playwright.yml # CI/CD pipeline
├── src/
│   ├── api/                         # API clients (Zod validation & helpers)
│   ├── ui/pages/                    # Page Object Models (POM)
│   └── utils/                       # Faker data factories & custom fixtures
└── tests/
    ├── api/                         # Contact & User CRUD specs
    └── ui/                          # UI flow & navigation specs
```

---

## 🏗️ Core Architecture

- **Page Object Model (POM)**: Enriched pages under `src/ui/pages/` mapped to custom fixtures in `src/utils/fixtures.ts`. Eliminates redundant instantiations (`new PageObject()`) through dynamic injection.
- **API Clients & Zod**: High-performance HTTP client wrappers `UserApiClient` and `ContactApiClient` enforcing runtime type-safety via Zod response validation.
- **Isolated Authentication**: Fast, parallel execution using dynamically generated users. Sessions are authenticated instantly by injecting tokens into `localStorage` prior to each test, followed by API-based teardown.

---

## 🤖 Google Gemini and AI Capabilities

Equipped with cutting-edge AI features powered by `@google/genai`. Soft-skips gracefully if `GEMINI_API_KEY` is not present.

### 1. Visual UX Auditor
Uses Gemini Vision to perform semantic, layout-based design assertions on screenshots rather than fragile pixel-matching.
```typescript
import { assertVisualLayout } from '../../src/utils/ai-vision';
await assertVisualLayout(page, 'The login card should be centered with visible, aligned input fields.');
```

### 2. Failure Diagnostics Reporter
Lifecycle hooks automatically capture failures, evaluate step histories, and print a structured **Root Cause Analysis** and **Suggested Fix** directly to standard output on test error.
*Run failure demo:* ` $env:RUN_FAILING_AI_TEST="true"; npx playwright test tests/ui/ai-visual.spec.ts`

### 3. Playwright Healer & Agents (v1.56+)
Fully integrated **Playwright Healer, Planner, and Generator Agents** (`.github/agents/`) that leverage the **Model Context Protocol (MCP)** to dynamically heal selector drift and generate clean tests.
*To activate:* Ask your IDE assistant (e.g. Claude Code, Copilot) using the local MCP server (`.vscode/mcp.json`):
> _"Run the playwright healer agent on my failing login spec and automatically repair the locators."_
