import { test as base, expect } from '@playwright/test';
import { CategoryPage } from '../pages/categoryPage';

export class Pages {
  readonly category: CategoryPage;

  constructor(page: ConstructorParameters<typeof CategoryPage>[0]) {
    this.category = new CategoryPage(page);
  }
}

export type PagesFixture = {
  pages: Pages;
};

export const test = base.extend<PagesFixture>({
  pages: async ({ page }, use) => {
    await use(new Pages(page));
  },
});

export { expect };
