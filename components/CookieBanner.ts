import { expect, type Locator, type Page } from '@playwright/test';
import { defaultLocale, type Locale } from '../utils/locales';

export class CookieBanner {
  private readonly agreeButton: Locator;

  constructor(page: Page, locale: Locale = defaultLocale) {
    this.agreeButton = page.getByRole('button', { name: locale.cookieBanner.agreeButton });
  }

  async accept(): Promise<void> {
    await expect(this.agreeButton).toBeVisible();
    await this.agreeButton.click();
    await expect(this.agreeButton).toBeHidden();
  }
}
