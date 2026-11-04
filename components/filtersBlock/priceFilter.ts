import type { Locator } from '@playwright/test';
import { FiltersBlock } from './filtersBlock';
import type { PriceRange } from './priceRanges';

export class PriceFilter {
  readonly fromInput: Locator;
  readonly toInput: Locator;
  private readonly presets: Locator;

  constructor(private readonly block: FiltersBlock) {
    const fields = block.content.locator('.PriceSelector__fields input');
    this.fromInput = fields.nth(0);
    this.toInput = fields.nth(1);
    this.presets = block.content.locator('button.PriceSelector__priceButton');
  }

  async clickPriceRange(range: PriceRange): Promise<void> {
    await this.block.open();
    await this.presets.filter({ hasText: range }).click();
  }

  async setFrom(value: string): Promise<void> {
    await this.block.open();
    await this.fromInput.fill(value);
    await this.fromInput.press('Tab');
  }

  async setTo(value: string): Promise<void> {
    await this.block.open();
    await this.toInput.fill(value);
    await this.toInput.press('Tab');
  }

}
