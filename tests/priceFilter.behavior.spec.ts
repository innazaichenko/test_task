import { test, expect } from '../fixtures/category';
import { PriceRanges } from '../components/filtersBlock/priceRanges';

const HAIR = '20272';
const MAKEUP = '2419';

async function expectPricesWithin(prices: () => Promise<number[]>, from?: number, to?: number): Promise<void> {
  await expect.poll(async () => {
    const values = await prices();
    return values.length > 0 && values.every((value) =>
      Number.isFinite(value) && (from === undefined || value >= from) && (to === undefined || value <= to));
  }).toBe(true);
}

test.describe('price filter on both layouts', { tag: ['@mobile', '@desktop'] }, () => {
test('preset band filters visible product prices inclusively', async ({ visitCategory, page }) => {
  const categoryPage = await visitCategory(HAIR);
  await categoryPage.filters.price.clickPriceRange(PriceRanges.FROM_750_TO_1000);

  await expect(categoryPage.filters.price.fromInput).toHaveValue('750');
  await expect(categoryPage.filters.price.toInput).toHaveValue('1000');
  await expect(page).toHaveURL(/#price_from=750&price_to=1000$/);
  await expectPricesWithin(() => categoryPage.productGrid.currentPrices(), 750, 1000);
});

test('open-ended preset sets only an upper bound', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.filters.price.clickPriceRange(PriceRanges.BELOW_50);

  await expect(category.filters.price.fromInput).toHaveValue('');
  await expect(category.filters.price.toInput).toHaveValue('50');
  await expect(page).toHaveURL(/#price_to=50$/);
  await expectPricesWithin(() => category.productGrid.currentPrices(), undefined, 50);
});

test('open-ended preset sets only a lower bound', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.filters.price.clickPriceRange(PriceRanges.ABOVE_5000);

  await expect(category.filters.price.fromInput).toHaveValue('5000');
  await expect(category.filters.price.toInput).toHaveValue('');
  await expect(page).toHaveURL(/#price_from=5000$/);
  await expectPricesWithin(() => category.productGrid.currentPrices(), 5000);
});

test('custom range commits on blur and removing one bound preserves the other', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.filters.price.setFrom('120');
  await category.filters.price.setTo('250');

  await expect(page).toHaveURL(/#price_from=120&price_to=250$/);
  await expectPricesWithin(() => category.productGrid.currentPrices(), 120, 250);

  await category.filters.price.setFrom('');
  await expect(category.filters.price.fromInput).toHaveValue('');
  await expect(category.filters.price.toInput).toHaveValue('250');
  await expect(page).toHaveURL(/#price_to=250$/);
});

test('price range survives reload', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.filters.price.clickPriceRange(PriceRanges.FROM_100_TO_250);
  await expect(page).toHaveURL(/#price_from=100&price_to=250$/);

  await page.reload();
  await expect(category.filters.price.fromInput).toHaveValue('100');
  await expect(category.filters.price.toInput).toHaveValue('250');
  await expectPricesWithin(() => category.productGrid.currentPrices(), 100, 250);
});

test('clearing price restores unfiltered state', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.filters.price.clickPriceRange(PriceRanges.FROM_100_TO_250);
  await expect(page).toHaveURL(/#price_from=100&price_to=250$/);

  await category.filters.block.clear();
  await expect(page).toHaveURL(/\/ua\/categorys\/20272\/$/);
  await expect(category.filters.price.fromInput).toHaveValue('');
  await expect(category.filters.price.toInput).toHaveValue('');
  await expect.poll(async () => {
    const prices = await category.productGrid.currentPrices();
    return prices.some((price) => price < 100 || price > 250);
  }).toBe(true);
});

test('a range with equal bounds includes products at that price', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.filters.price.setFrom('100');
  await category.filters.price.setTo('100');

  await expect(page).toHaveURL(/#price_from=100&price_to=100$/);
  await expectPricesWithin(() => category.productGrid.currentPrices(), 100, 100);
});

test('price filter works on a second category', async ({ visitCategory, page }) => {
  const category = await visitCategory(MAKEUP);
  await category.filters.price.clickPriceRange(PriceRanges.FROM_100_TO_250);

  await expect(page).toHaveURL(/\/ua\/categorys\/2419\/#price_from=100&price_to=250$/);
  await expect(category.filters.price.fromInput).toHaveValue('100');
  await expect(category.filters.price.toInput).toHaveValue('250');
});

test('an extreme lower bound shows an empty result', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.filters.price.setFrom('9999999');

  await expect(page).toHaveURL(/#price_from=9999999$/);
  await expect(page.locator('.CategoryPage__content')).toContainText('0 товарів');
  await expect(category.productGrid.cards).toHaveCount(0);
});
});

test('mobile Apply closes the filter panel without losing the selection', { tag: '@mobile' }, async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.filters.price.clickPriceRange(PriceRanges.FROM_100_TO_250);
  await category.filters.block.applyOnMobile();

  await expect(page.locator('.Filters__filters')).not.toHaveClass(/Filters__isFilterShow/);
  await expect(page).toHaveURL(/#price_from=100&price_to=250$/);
});
