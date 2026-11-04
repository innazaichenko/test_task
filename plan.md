# Price filter test implementation plan

This plan implements the observed behavior and candidate cases in [specs.md](./specs.md). The tests exercise the site as a guest in desktop Chrome and emulated mobile Chrome.

## 1. Correct the Playwright projects

- Keep a desktop Chromium project with `channel: 'chrome'` and a desktop viewport.
- Replace the current `devices['iPhone 16 PRO Max']` entry with a Chromium Android profile such as `devices['Pixel 7']`, also using `channel: 'chrome'`. The current key does not exist in the installed Playwright device list, so its spread does not create a mobile context; the correctly spelled iPhone profile would target WebKit.
- Keep the base URL in configuration. Add a normal `test` script so the suite has one documented run command.
- Check the effective mobile context during the setup smoke run: mobile user agent, touch enabled, and expected viewport.

**Done when:** both projects can launch and the mobile project actually renders the site's narrow filter layout.

## 2. Add the guest cookie fixture

- Extend Playwright's `test` with a `visitCategory(categoryId)` fixture or equivalent helper. It navigates to `/ua/categorys/{categoryId}/`, handles the visible `Погоджуюсь` button when present, and returns the category page object.
- Keep cookie handling in a small `CookieBanner` component used by that fixture. Each Playwright test gets its own browser context, so the fixture must handle a fresh guest visit without relying on a previous test.
- Wait for the page and consent state using locators, not a fixed sleep. If the consent button appears, click it and assert the banner is hidden before handing control to the test.

**Done when:** a test can visit hair (`20272`) as a guest and interact with filters without a cookie banner covering the page.

## 3. Run a temporary setup smoke test

- Add one small test that uses the fixture, opens the hair category, checks the category heading, and checks that cookie consent is no longer visible.
- Run that test in both projects. Confirm that the mobile project shows the `Фільтр` entry point and the desktop project shows the filter alongside the listing.
- Remove the temporary smoke test after it passes in both projects; the real filter tests will cover the fixture and navigation. Keep any useful setup checks in project documentation or the real tests.

**Done when:** both projects pass the smoke test and the temporary test is removed.

## 4. Build small page and component objects

Use the Page Object Model with components as the main interaction layer:

- `CategoryPage`: category navigation and access to its filter and product grid.
- `PriceFilter`: preset selection, From/To entry and blur, active-state reading, mobile panel open/Apply, and layout-specific clear actions.
- `ProductGrid`: product-card selection and parsing of displayed current prices; exclude promotional action cards.
- `CookieBanner`: guest consent interaction, called by the fixture.

The components should expose meaningful user actions and stable scoped locators. Tests own the assertions. Keep the category ID configurable and avoid a large shared base page. Microservices architecture does not apply here: the site is an external service, while this repository is one browser test suite. API requests can help investigate or diagnose failures, but the acceptance tests should primarily assert browser behavior.

**Done when:** tests can use the same filter and grid methods in both projects, with only the layout-specific interaction handled inside `PriceFilter`.

## 5. Implement and run the price cases

Start with one preset band and visible current-price assertions in both projects. Then add custom bounds, open-ended preset, clear, reload persistence, inclusive boundary, and mobile Apply behavior. Add one cross-category smoke case for makeup (`2419`). An empty-result case is useful if time permits. Keep reversed and nonnumeric input out of the acceptance suite until the intended rules are known.

Wait for the URL bounds and rendered products after each change. Avoid fixed delays, fixed product IDs, and exact catalog counts. Run focused tests in each project, then the full suite. Record any site behavior that contradicts [specs.md](./specs.md) as an observation before deciding whether a test expectation should change.

**Done when:** the focused and full suites pass in both projects, or any site-dependent failures are documented with evidence.
