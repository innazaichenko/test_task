# Price filter Playwright tests

This repository contains a TypeScript/Playwright test suite for the price filter on product category pages of [makeup.com.ua](https://makeup.com.ua/). It tests the site as a guest in desktop Chrome and Chromium-based mobile Chrome emulation.

## Requirements

- Node.js with npm
- Google Chrome, because the Playwright projects use `channel: 'chrome'`
- Network access to the live site

Install dependencies from the repository root:

```text
npm ci
```

## Running the tests

Run both browser configurations:

```text
npm test
```

Run only desktop Chrome:

```text
npm run test:desktop
```

Run only emulated mobile Chrome:

```text
npm run test:mobile
```

The first run executes the setup project. It accepts the cookie banner and writes guest authentication state to `playwright/.auth/guest.json`. Test reports are written to `playwright-report/desktop` or `playwright-report/mobile`; both reports and authentication state are ignored by Git.

## Repository structure

```text
components/                 Reusable UI components used by page objects
  cookieBanner.ts            Guest cookie-consent interaction
  filtersBlock/              Shared filter block and price-filter objects
  productGrid/               Product-card locators and displayed-price parsing
utils/                      Shared utilities
  locales.ts                 Locale types and default Ukrainian translations
fixtures/                   Composed Playwright fixtures for pages and services
pages/                      Page objects, including the category page
services/                   API response helpers used for diagnostic comparison
support/                    Shared paths and test support utilities
tests/                      Playwright tests
  cookies.setup.spec.ts      Setup project that saves guest cookie state
  filtering/                 Price-filter behavior tests and test helpers
playwright.config.ts         Desktop Chrome configuration
playwright.mobile.config.ts Mobile Chrome emulation configuration
plan.md                     Implementation plan and completion criteria
specs.md                    Exploratory specification, observations, and assumptions
AGENTS.md                   Repository naming and test-file conventions
```

## Test design

The tests navigate to category IDs rather than hard-coding one category. They verify visible filter state, URL hash bounds, applied tags, and current prices on product cards. Promotional cards are excluded from price checks, and catalog-specific counts are avoided because the live inventory changes.

The main acceptance scenarios include preset ranges, open-ended ranges, custom bounds, equal bounds, clearing, API/UI price consistency, and the mobile filter Apply flow. Invalid or reversed ranges remain exploratory until their intended product behavior is defined; see [specs.md](./specs.md) for the full evidence and open questions.

## Localization

UI labels used by page objects and locators are defined in [`utils/locales.ts`](./utils/locales.ts). Ukrainian is the default locale. Pass a custom `Locale` to the `CategoryPage`, `Filters`, `FiltersBlock`, or `CookieBanner` constructor when running against another translation. For a one-off price-range lookup, use `priceRanges(locale)` from [`priceRanges.ts`](./components/filtersBlock/priceRanges.ts).

Constructor injection is used because locale is a stable dependency shared by a page object and its components; function parameters are reserved for one-off locale-sensitive lookups.

## Naming conventions

Source files and folders use lower camelCase. Tests live under `tests/` and use names such as `priceFilter.behavior.spec.ts`. Tool-required names such as `package.json`, `playwright.config.ts`, and `AGENTS.md` are preserved.
