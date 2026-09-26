# PrivacyLedger Website Automation

## 1. Project Overview

This project automates functional testing of the PrivacyLedger website:
https://www.privacyledger.ai/

The automation framework is built using:
- Playwright
- TypeScript
- Google Chrome

## 2. Objective

The automation verifies the PrivacyLedger website including:
- Homepage
- Navigation bar
- Pricing
- Free Assessment
- Book Demo
- Products
- Product pages
- Request Demo form
- External links
- Company → About Us
- Homepage scrolling
- Footer

## 3. Technology Stack

- TypeScript
- Playwright
- Node.js
- Google Chrome

## 4. Project Structure

```text
privacyledger-playwright/
├── tests/
│   └── privacyledger.spec.ts   # Main test suite containing TC01 - TC05
├── playwright.config.ts        # Playwright configuration (browsers, timeouts, reporters)
├── package.json                # Project metadata and npm dependencies
├── tsconfig.json               # TypeScript configuration
├── README.md                   # How to set up and run the project
└── AUTOMATION_REPORT.md        # Test automation report and execution results
```

## 5. Installation

First, install all required npm dependencies:

```bash
npm install
```

Then, install the necessary Playwright browsers and dependencies (specifically Chromium):

```bash
npx playwright install chromium
```

## 6. Playwright Configuration

The project is specifically configured to enforce:
- Google Chrome only (Chromium engine)
- Headed execution (visually observable browser)
- One worker (disables parallel execution to preserve test flow and visibility)
- Sequential test execution

## 7. Test Cases

| Test Case | Description |
|---|---|
| TC01 | Complete homepage and navigation verification |
| TC02 | Products and product information verification |
| TC03A | Request Demo valid form |
| TC03B | Request Demo required-field validation |
| TC04 | External link verification |
| TC05 | Company → About Us and page scrolling |


## 8. Running All Tests

 Important step before doing the below run
 ```bash
cd privacyledger-playwright
```

To run the entire test suite sequentially with visual headed execution, run:

```bash
npx playwright test --project=chromium --headed --workers=1
```

The tests will run sequentially (TC01 → TC02 → TC03A → TC03B → TC04 → TC05).

## 9. Running Individual Tests

You can run an individual test by using the `-g` grep flag:

**TC01:**
```bash
npx playwright test -g "TC01" --project=chromium --headed --workers=1
```

**TC02:**
```bash
npx playwright test -g "TC02" --project=chromium --headed --workers=1
```

**TC03A:**
```bash
npx playwright test -g "TC03A" --project=chromium --headed --workers=1
```

**TC03B:**
```bash
npx playwright test -g "TC03B" --project=chromium --headed --workers=1
```

**TC04:**
```bash
npx playwright test -g "TC04" --project=chromium --headed --workers=1
```

**TC05:**
```bash
npx playwright test -g "TC05" --project=chromium --headed --workers=1
```

## 10. Test Reports

Playwright automatically generates an HTML report detailing the execution results. To view the latest report in your browser, run:

```bash
npx playwright show-report
```

## 11. Screenshots / Videos / Traces

Screenshots, videos, and trace viewers are retained according to the configurations inside `playwright.config.ts`, and are especially captured during failed tests to assist in debugging. Artifacts are automatically saved in the `test-results/` directory.

## 12. Expected Result

All tests should pass when the website behaves as expected.
