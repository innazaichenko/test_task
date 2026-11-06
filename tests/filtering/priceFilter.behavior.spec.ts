import { test, expect } from '../../fixtures';
import { PriceRanges } from '../../components/filtersBlock/priceRanges';
import {
  applyPriceFilterAndCaptureProducts,
  expectApiProductsDisplayed,
  expectDefaultState,
  expectProductPrices,
  priceFilterCases,
} from './helper';

test.describe('price filter behavior', { tag: ['@mobile', '@desktop'] }, () => {
  for (const filterCase of priceFilterCases) {
    test(filterCase.title, async ({ pages, page, productService }) => {
      const category = pages.category;
      await test.step('Open category page', () => category.goto(filterCase.categoryId));
      await test.step('Verify default filter state', () => expectDefaultState(category, page));

      const apiPrices = await test.step('Apply price filter and capture products response', () =>
        applyPriceFilterAndCaptureProducts(category, productService, filterCase));

      await test.step('Verify displayed products against API and expected prices', async () => {
        await expectApiProductsDisplayed(category, apiPrices);
        await expectProductPrices(category, filterCase);
      });

      await test.step('Verify filter inputs, URL, and applied tag', async () => {
        await expect(category.filters.price.fromInput, `Verify the lower-bound input matches ${filterCase.from || 'empty'}`)
          .toHaveValue(filterCase.from);
        await expect(category.filters.price.toInput, `Verify the upper-bound input matches ${filterCase.to || 'empty'}`)
          .toHaveValue(filterCase.to);
        await expect(page, `Verify the URL matches ${filterCase.hash}`)
          .toHaveURL(new RegExp(`${filterCase.hash}$`));
        await expect(
          category.filters.block.appliedTags.filter({ hasText: filterCase.tagText }),
          `Verify the applied price tag matches ${filterCase.tagText}`,
        ).toBeVisible();
      });

      await test.step('Clear filter and verify default state', async () => {
        await category.filters.block.clear();
        await expectDefaultState(category, page);
      });
    });
  }
});

test('mobile Apply closes the filter panel without losing the selection', { tag: '@mobile' }, async ({ pages, page }) => {
  const category = pages.category;
  await test.step('Open category page', () => category.goto('20272'));

  await test.step('Select price range and verify mobile filter panel', async () => {
    await category.filters.price.clickPriceRange(PriceRanges.FROM_100_TO_250);
    await expect(category.filters.block.root, 'Verify the mobile filter panel is open')
      .toHaveClass(/Filters__isFilterShow/);
    await expect(category.filters.block.mobileApplyButton, 'Verify the mobile Apply button is visible')
      .toBeVisible();
  });

  await test.step('Apply and verify panel closes without losing selection', async () => {
    await category.filters.block.applyOnMobile();
    await expect(category.filters.block.root, 'Verify the mobile filter panel closes after Apply')
      .not.toHaveClass(/Filters__isFilterShow/);
    await expect(page, 'Verify the URL retains the 100–250 price filter after Apply')
      .toHaveURL(/#price_from=100&price_to=250$/);
  });
});
