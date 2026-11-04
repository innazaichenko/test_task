import type { Page } from '@playwright/test';
import { CookieBanner } from '../components/CookieBanner';
import { PriceFilter } from '../components/PriceFilter';
import { ProductGrid } from '../components/ProductGrid';

export class CategoryPage {
  readonly cookies: CookieBanner;
  readonly priceFilter: PriceFilter;
  readonly productGrid: ProductGrid;
  readonly heading;

  constructor(readonly page: Page) {
    this.cookies = new CookieBanner(page);
    this.priceFilter = new PriceFilter(page);
    this.productGrid = new ProductGrid(page);
    this.heading = page.locator('main h1');
  }

  async goto(categoryId: string): Promise<void> {
    await this.page.goto(`/ua/categorys/${categoryId}/`);
    await this.heading.waitFor({ state: 'visible' });
    // The server renders filter buttons before React attaches their click handlers.
    await this.page.waitForFunction(() => {
      const preset = document.querySelector('button.PriceSelector__priceButton');
      return preset && Object.keys(preset).some((key) => key.startsWith('__reactProps$'));
    });
  }
}
