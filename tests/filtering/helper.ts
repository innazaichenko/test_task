import { expect } from '@playwright/test';
import type { CategoryPage } from '../../pages/categoryPage';
import type { Page } from '@playwright/test';
import { PriceRanges, type PriceRange } from '../../components/filtersBlock/priceRanges';

export type PriceFilterCase = {
  title: string;
  categoryId: string;
  range?: PriceRange;
  from: string;
  to: string;
  hash: string;
  tagText: string;
  expectedProductPrice?: number;
};

export const priceFilterCases: PriceFilterCase[] = [
  {
    title: 'Preset 250-500',
    categoryId: '2419',
    range: PriceRanges.FROM_250_TO_500,
    from: '250',
    to: '500',
    hash: '#price_from=250&price_to=500',
    tagText: 'від 250 до 500',
  },
  {
    title: 'Manual Upper Bound',
    categoryId: '20272',
    from: '',
    to: '250',
    hash: '#price_to=250',
    tagText: 'до 250',
  },
  {
    title: 'Manual Lower Bound',
    categoryId: '20272',
    from: '5000',
    to: '',
    hash: '#price_from=5000',
    tagText: 'від 5000',
  },
  {
    title: 'Equal Bounds',
    categoryId: '20272',
    from: '100',
    to: '100',
    hash: '#price_from=100&price_to=100',
    tagText: 'від 100 до 100',
  },
  {
    title: 'Reversed Range - Lower Bound',
    categoryId: '20272',
    from: '200',
    to: '100',
    hash: '#price_from=200&price_to=100',
    tagText: 'від 200 до 100',
    expectedProductPrice: 200,
  },
];

export async function expectDefaultState(category: CategoryPage, page: Page): Promise<void> {
  await expect(page, 'Verify the category URL has no price filter').toHaveURL(/\/ua\/categorys\/\d+\/$/);
  await expect(category.filters.price.fromInput, 'Verify the lower-bound input is empty').toHaveValue('');
  await expect(category.filters.price.toInput, 'Verify the upper-bound input is empty').toHaveValue('');
  await expect.poll(
    async () => (await category.productGrid.currentPrices()).length > 0,
    { message: 'Verify the default product grid contains products' },
  ).toBe(true);
}

export async function expectApiProductsDisplayed(category: CategoryPage, apiPrices: number[]): Promise<void> {
  await expect.poll(async () => {
    const actualPrices = await category.productGrid.currentPrices();
    return samePriceMultiset(actualPrices, apiPrices);
  }, { message: 'Verify displayed product prices match the filtered API response' }).toBe(true);
}

export async function expectProductPrices(category: CategoryPage, filterCase: PriceFilterCase): Promise<void> {
  const message = filterCase.expectedProductPrice !== undefined
    ? `Verify every displayed product price matches ${filterCase.expectedProductPrice}`
    : `Verify every displayed product price matches the ${filterCase.from || 'open'}–${filterCase.to || 'open'} bounds`;

  await expect.poll(async () => {
    const prices = await category.productGrid.currentPrices();
    return prices.length > 0 && prices.every((price) =>
      Number.isFinite(price) &&
      (filterCase.expectedProductPrice !== undefined
        ? price === filterCase.expectedProductPrice
        : (filterCase.from === '' || price >= Number(filterCase.from)) &&
          (filterCase.to === '' || price <= Number(filterCase.to))));
  }, { message }).toBe(true);
}

function samePriceMultiset(actual: number[], expected: number[]): boolean {
  return [...actual].sort((a, b) => a - b).join(',') === [...expected].sort((a, b) => a - b).join(',');
}
