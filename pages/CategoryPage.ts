import type { Page } from '@playwright/test';
import { Filters } from '../components/filtersBlock/filters';
import { ProductGrid } from '../components/productGrid/productGrid';
import { BasePage } from './basePage';

export class CategoryPage extends BasePage {
  readonly filters: Filters;
  readonly productGrid: ProductGrid;
  readonly heading;

  constructor(page: Page) {
    super(page);
    this.filters = new Filters(page);
    this.productGrid = new ProductGrid(page);
    this.heading = page.locator('main h1');
  }

  async goto(categoryId: string): Promise<void> {
    await super.goto(`/ua/categorys/${categoryId}/`);
    await this.heading.waitFor({ state: 'visible' });
  }
}
