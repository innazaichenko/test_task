import { test as base, expect } from '@playwright/test';
import { CategoryPage } from '../pages/CategoryPage';

type GuestFixtures = {
  visitCategory: (categoryId: string) => Promise<CategoryPage>;
};

export const test = base.extend<GuestFixtures>({
  visitCategory: async ({ page }, use) => {
    await use(async (categoryId: string) => {
      const category = new CategoryPage(page);
      await category.goto(categoryId);
      await category.cookies.acceptIfPresent();
      return category;
    });
  },
});

export { expect };
