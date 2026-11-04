import { test, expect } from '../fixtures/category';

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
  const category = await visitCategory(HAIR);
  await category.priceFilter.selectPreset(100, 250);

  await expect(category.priceFilter.fromInput).toHaveValue('100');
  await expect(category.priceFilter.toInput).toHaveValue('250');
  await expect(page).toHaveURL(/#price_from=100&price_to=250$/);
  await expectPricesWithin(() => category.productGrid.currentPrices(), 100, 250);
});

test('open-ended preset sets only an upper bound', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.priceFilter.selectBelow50();

  await expect(category.priceFilter.fromInput).toHaveValue('');
  await expect(category.priceFilter.toInput).toHaveValue('50');
  await expect(page).toHaveURL(/#price_to=50$/);
  await expectPricesWithin(() => category.productGrid.currentPrices(), undefined, 50);
});

test('open-ended preset sets only a lower bound', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.priceFilter.selectAbove5000();

  await expect(category.priceFilter.fromInput).toHaveValue('5000');
  await expect(category.priceFilter.toInput).toHaveValue('');
  await expect(page).toHaveURL(/#price_from=5000$/);
  await expectPricesWithin(() => category.productGrid.currentPrices(), 5000);
});

test('custom range commits on blur and removing one bound preserves the other', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.priceFilter.setFrom('120');
  await category.priceFilter.setTo('250');

  await expect(page).toHaveURL(/#price_from=120&price_to=250$/);
  await expectPricesWithin(() => category.productGrid.currentPrices(), 120, 250);

  await category.priceFilter.setFrom('');
  await expect(category.priceFilter.fromInput).toHaveValue('');
  await expect(category.priceFilter.toInput).toHaveValue('250');
  await expect(page).toHaveURL(/#price_to=250$/);
});

test('price range survives reload', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.priceFilter.selectPreset(100, 250);
  await expect(page).toHaveURL(/#price_from=100&price_to=250$/);

  await page.reload();
  await expect(category.priceFilter.fromInput).toHaveValue('100');
  await expect(category.priceFilter.toInput).toHaveValue('250');
  await expectPricesWithin(() => category.productGrid.currentPrices(), 100, 250);
});

test('clearing price restores unfiltered state', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.priceFilter.selectPreset(100, 250);
  await expect(page).toHaveURL(/#price_from=100&price_to=250$/);

  await category.priceFilter.clear();
  await expect(page).toHaveURL(/\/ua\/categorys\/20272\/$/);
  await expect(category.priceFilter.fromInput).toHaveValue('');
  await expect(category.priceFilter.toInput).toHaveValue('');
  await expect.poll(async () => {
    const prices = await category.productGrid.currentPrices();
    return prices.some((price) => price < 100 || price > 250);
  }).toBe(true);
});

test('a range with equal bounds includes products at that price', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.priceFilter.setFrom('100');
  await category.priceFilter.setTo('100');

  await expect(page).toHaveURL(/#price_from=100&price_to=100$/);
  await expectPricesWithin(() => category.productGrid.currentPrices(), 100, 100);
});

test('price filter works on a second category', async ({ visitCategory, page }) => {
  const category = await visitCategory(MAKEUP);
  await category.priceFilter.selectPreset(100, 250);

  await expect(page).toHaveURL(/\/ua\/categorys\/2419\/#price_from=100&price_to=250$/);
  await expect(category.priceFilter.fromInput).toHaveValue('100');
  await expect(category.priceFilter.toInput).toHaveValue('250');
});

test('an extreme lower bound shows an empty result', async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.priceFilter.setFrom('9999999');

  await expect(page).toHaveURL(/#price_from=9999999$/);
  await expect(page.locator('.CategoryPage__content')).toContainText('0 товарів');
  await expect(category.productGrid.cards).toHaveCount(0);
});
});

test('mobile Apply closes the filter panel without losing the selection', { tag: '@mobile' }, async ({ visitCategory, page }) => {
  const category = await visitCategory(HAIR);
  await category.priceFilter.selectPreset(100, 250);
  await category.priceFilter.applyOnMobile();

  await expect(page.locator('.Filters__filters')).not.toHaveClass(/Filters__isFilterShow/);
  await expect(page).toHaveURL(/#price_from=100&price_to=250$/);
});
