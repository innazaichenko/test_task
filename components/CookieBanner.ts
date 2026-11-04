import { expect, type Page } from '@playwright/test';

export class CookieBanner {
  private readonly agreeButton;

  constructor(page: Page) {
    this.agreeButton = page.getByRole('button', { name: 'Погоджуюсь' });
  }

  async acceptIfPresent(): Promise<void> {
    if (await this.agreeButton.isVisible()) {
      await this.agreeButton.click();
      await expect(this.agreeButton).toBeHidden();
    }
  }
}
