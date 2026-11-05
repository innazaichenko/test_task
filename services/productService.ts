import type { Page } from '@playwright/test';

type ApiProduct = {
  type?: unknown;
  price?: { current?: unknown };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export class ProductService {
  constructor(private readonly page: Page) {}

  async waitForFilteredProductPrices(categoryId: string, from: string, to: string): Promise<number[]> {
    const response = await this.page.waitForResponse((candidate) => {
      const url = new URL(candidate.url());
      return candidate.request().method() === 'GET' &&
        candidate.status() === 200 &&
        url.pathname === `/shop/v1/categories/${categoryId}/products/` &&
        url.searchParams.get('priceFrom') === (from || null) &&
        url.searchParams.get('priceTo') === (to || null);
    });
    const body: unknown = await response.json();

    if (!isRecord(body) || !Array.isArray(body.products)) {
      throw new Error('Filtered products response did not contain a products array');
    }

    return body.products
      .filter((product): product is ApiProduct => isRecord(product) && product.type === 'product')
      .map((product) => Number(product.price?.current))
      .filter(Number.isFinite);
  }
}
