import type { Locator, Page } from '@playwright/test';

export class ProductGrid {
  readonly cards: Locator;

  constructor(page: Page) {
    this.cards = page.locator('.Products__cards > .ProductCard__cardContainer > .ProductCard__card');
  }

  async currentPrices(): Promise<number[]> {
    const labels = await this.cards.locator('.Price__priceCurrent').allTextContents();
    return labels.map((label) => Number(label.replace(/[^\d]/g, '')));
  }
}
