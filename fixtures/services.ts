import { test as base } from '@playwright/test';
import type { PagesFixture } from './pages';
import { ProductService } from '../services/productService';

export type ServicesFixture = {
  productService: ProductService;
};

export const test = base.extend<PagesFixture & ServicesFixture>({
  productService: async ({ page, pages }, use) => {
    await use(new ProductService(page, pages.category.filters.block));
  },
});
