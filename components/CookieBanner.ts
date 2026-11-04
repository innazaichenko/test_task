import { expect, type Locator, type Page } from '@playwright/test';

export class CookieBanner {
  private readonly agreeButton: Locator;

  constructor(page: Page) {
    this.agreeButton = page.getByRole('button', { name: 'Погоджуюсь' });
  }

  async accept(): Promise<void> {
    await expect(this.agreeButton).toBeVisible();
    await this.agreeButton.click();
    await expect(this.agreeButton).toBeHidden();
  }
}
