import { test as base, expect } from '@playwright/test';
import { CategoryPage } from '../pages/categoryPage';

type CategoryFixtures = {
  visitCategory: (categoryId: string) => Promise<CategoryPage>;
};

export const test = base.extend<CategoryFixtures>({
  visitCategory: async ({ page }, use) => {
    await use(async (categoryId: string) => {
      const category = new CategoryPage(page);
      await category.goto(categoryId);
      return category;
    });
  },
});

export { expect };
