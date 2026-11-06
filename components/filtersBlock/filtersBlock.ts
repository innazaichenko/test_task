import { expect, type Locator, type Page } from '@playwright/test';

export class FiltersBlock {
  readonly root: Locator;
  readonly content: Locator;
  readonly appliedTags: Locator;
  private readonly mobileOpenButton: Locator;
  readonly mobileApplyButton: Locator;
  private readonly mobileClearButton: Locator;
  private readonly desktopClearButton: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('.Filters__filters');
    this.content = this.root.locator('.Filters__filtersContent');
    this.appliedTags = page.locator('.Tags__tags .Tag__tag');
    this.mobileOpenButton = page.locator('button.FilterSortingControls__button').filter({ hasText: 'Фільтр' });
    this.mobileApplyButton = this.root.locator('.Filters__buttons button').filter({ hasText: 'Застосувати' });
    this.mobileClearButton = this.root.locator('.Filters__buttons button').filter({ hasText: 'Очистити' });
    this.desktopClearButton = page.locator('button.Tags__clear');
  }

  async waitUntilInteractive(): Promise<void> {
    await this.page.waitForFunction(() => {
      const block = document.querySelector('.Filters__filters');
      return block && Object.keys(block).some((key) => key.startsWith('__reactFiber$'));
    });
  }

  async open(): Promise<void> {
    await this.waitUntilInteractive();
    if (await this.mobileOpenButton.isVisible() &&
        !(await this.root.getAttribute('class'))?.includes('Filters__isFilterShow')) {
      await this.mobileOpenButton.click();
      await expect(this.root).toHaveClass(/Filters__isFilterShow/);
    }
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
