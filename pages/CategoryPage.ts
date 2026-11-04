import type { Page } from '@playwright/test';
import { Filters } from '../components/filtersBlock/filters';
import { ProductGrid } from '../components/productGrid/productGrid';

export class CategoryPage {
  readonly filters: Filters;
  readonly productGrid: ProductGrid;
  readonly heading;

  constructor(readonly page: Page) {
    this.filters = new Filters(page);
    this.productGrid = new ProductGrid(page);
    this.heading = page.locator('main h1');
  }

  async goto(categoryId: string): Promise<void> {
    await this.page.goto(`/ua/categorys/${categoryId}/`);
    await this.heading.waitFor({ state: 'visible' });
    await this.filters.block.waitUntilInteractive();
  }
}
