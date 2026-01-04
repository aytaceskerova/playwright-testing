# QA Course Playwright Project

This project contains end-to-end tests using Playwright and TypeScript for the QA Course application.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

- Run all tests:
```bash
npm test
```

- Run tests in headed mode:
```bash
npm run test:headed
```

- Run tests with UI mode:
```bash
npm run test:ui
```

- Debug tests:
```bash
npm run test:debug
```

- View test report:
```bash
npm run test:report
```

## Project Structure

```
.
├── tests/              # Test files
├── playwright.config.ts # Playwright configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## Configuration

The Playwright configuration is set to test against `https://qa-course-01.andersenlab.com` as the base URL.

Tests are configured to run on Chromium, Firefox, and WebKit browsers.
