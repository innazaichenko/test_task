# Repository naming rules

- Use lower camelCase for source file and folder names, such as `categoryPage.ts`, `priceRanges.ts`, and `filtersBlock/`. Class and type names may use PascalCase.
- Keep test files in `tests/` and name them `<area>.<scenario>.spec.ts`, with lower camelCase in each word, such as `priceFilter.behavior.spec.ts` and `cookies.setup.spec.ts`.
- Preserve filenames required by tools or conventions, including `playwright.config.ts`, `package.json`, `package-lock.json`, `.gitignore`, and `AGENTS.md`.
- Update imports and Playwright test matching whenever a file is renamed.
