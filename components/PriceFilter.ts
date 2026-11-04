import { expect, type Locator, type Page } from '@playwright/test';

export class PriceFilter {
  readonly fromInput: Locator;
  readonly toInput: Locator;
  private readonly presets: Locator;
  private readonly panel: Locator;
  private readonly mobileOpenButton: Locator;
  private readonly mobileApplyButton: Locator;
  private readonly mobileClearButton: Locator;
  private readonly desktopClearButton: Locator;

  constructor(private readonly page: Page) {
    const fields = page.locator('.PriceSelector__fields input');
    this.fromInput = fields.nth(0);
    this.toInput = fields.nth(1);
    this.presets = page.locator('button.PriceSelector__priceButton');
    this.panel = page.locator('.Filters__filters');
    this.mobileOpenButton = page.locator('button.FilterSortingControls__button').filter({ hasText: 'Фільтр' });
    this.mobileApplyButton = page.locator('.Filters__buttons button').filter({ hasText: 'Застосувати' });
    this.mobileClearButton = page.locator('.Filters__buttons button').filter({ hasText: 'Очистити' });
    this.desktopClearButton = page.locator('button.Tags__clear');
  }

  async open(): Promise<void> {
    if (await this.mobileOpenButton.isVisible() &&
        !(await this.panel.getAttribute('class'))?.includes('Filters__isFilterShow')) {
      await this.mobileOpenButton.click();
      await expect(this.panel).toHaveClass(/Filters__isFilterShow/);
    }
  }

  async selectPreset(from: number, to: number): Promise<void> {
    await this.open();
    await this.presets.filter({ hasText: new RegExp(`${from}\\s*₴\\s*-\\s*${to}\\s*₴`) }).click();
  }

  async selectBelow50(): Promise<void> {
    await this.open();
    await this.presets.first().click();
  }

  async selectAbove5000(): Promise<void> {
    await this.open();
    await this.presets.last().click();
  }

  async setFrom(value: string): Promise<void> {
    await this.open();
    await this.fromInput.fill(value);
    await this.fromInput.press('Tab');
  }

  async setTo(value: string): Promise<void> {
    await this.open();
    await this.toInput.fill(value);
    await this.toInput.press('Tab');
  }

  async applyOnMobile(): Promise<void> {
    if (await this.mobileApplyButton.isVisible()) {
      await this.mobileApplyButton.click();
    }
  }

  async clear(): Promise<void> {
    if (await this.mobileOpenButton.isVisible()) {
      await this.open();
      await this.mobileClearButton.click();
    } else {
      await this.desktopClearButton.click();
    }
  }
}
