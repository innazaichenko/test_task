# Price filter: exploratory specification

## Scope and source of truth

- Site: <https://makeup.com.ua/ua/categorys/20272/> (Ukrainian hair category).
- Goal: test the price filter available within a product category's filter group on desktop Chrome and emulated mobile Chrome.
- No formal product requirements were supplied. Items marked **Observed** describe a browser inspection on 2026-11-04. Items marked **Assumed** are proposed expectations to verify before treating them as defects.
- A category ID is test data, not part of the filter implementation. The same price controls were also found on the makeup category (`2419`); this supports reusing the helper across at least these two categories.

## Observed behavior

1. A guest can open the category without signing in. A cookie banner offers a `Погоджуюсь` (Agree) button.
2. The `Вартість` (Price) filter contains preset bands: below 50 ₴; 50–100 ₴; 100–250 ₴; 250–500 ₴; 500–750 ₴; 750–1000 ₴; 1000–5000 ₴; above 5000 ₴. It also has `Від` (From) and `До` (To) text inputs.
3. Selecting the 100–250 ₴ preset populated the inputs with `100` and `250` and changed the URL to `#price_from=100&price_to=250`.
4. The open-ended presets use one bound: `Менше 50 ₴` sets `#price_to=50` and leaves From blank; `Більше 5000 ₴` sets `#price_from=5000` and leaves To blank.
5. Editing a custom bound changes the input immediately; moving focus away with Tab committed the new value to the URL hash. For example, From `120` produced `#price_from=120&price_to=250`.
6. Reloading a filtered URL restored the bound inputs and filtered products after the page finished rendering. The inputs were briefly blank during initial render, so tests should wait for the expected state.
7. In a narrow viewport, a `Фільтр` (Filter) button opens filter controls with `Очистити` (Clear) and `Застосувати` (Apply) actions. Selecting a preset changed the URL and listing while the panel was open; Apply closed the panel. Clear removed the price hash, closed the panel, and eventually emptied the bound inputs. This was observed with the browser viewport narrowed; confirm in the configured mobile Chrome project.
8. The result grid contains both product cards and promotional action cards. Product cards expose a current price and sometimes an old price. In the 100–250 ₴ result sample, current prices were within the band while some old prices exceeded 250 ₴. Price assertions should use the current price on product cards, excluding action cards.
9. The site exposes two relevant GET endpoints for this category: `/shop/v1/categories/20272/products/filters/?priceFrom=100&priceTo=250` and `/shop/v1/categories/20272/products/?priceFrom=100&priceTo=250&offset=0`. The filters response has a `price` object with preset `options`, selected `from`/`to`, and `min`/`max`. The products response has `products`, `total`, `offset`, and `perPage`; each item has a `type`. Actual products have `type: "product"` and `price.current`; promotional cards have `type: "action"`.
10. API boundary probes showed current-price products at exactly 100 ₴ in both the 50–100 ₴ and 100–250 ₴ responses. This is evidence that both endpoints are inclusive. A 100–100 ₴ query returned only 100 ₴ products in the first page; a 250–250 ₴ query returned only 250 ₴ products in the first page. Open-ended queries (`priceTo=50`, `priceFrom=5000`) returned products at or within the respective bound.
11. A reversed API range (`priceFrom=300&priceTo=250`) returned 200 OK and first-page products priced exactly 300 ₴. The filters endpoint preserved `from: 300` and `to: 250` while reporting `min: 0`, `max: 0`. This behavior may reflect normalization or a defect; it is not a reliable requirement for an automated acceptance test without clarification.
12. Enter alone did not immediately commit an edited bound; blur did. Clearing only From and blurring removed `price_from` from the hash while preserving `price_to` and its input value.
13. On desktop, an active price range appears as a removable tag above the products, alongside `Зняти фільтри` (Remove filters). Activating that clear control removed the price hash. The mobile filter panel uses `Очистити` instead.
14. A very high From value (`9999999`) produced `0 товарів` (0 products) and no product cards. This is an observed empty-result state, not a fixed input limit.
15. In the first 100–250 ₴ API result page, all 36 `type: "product"` items had `price.current` within the bounds. All 36 had a default variant whose current price matched the card price; 28 also had an old price. This supports using the displayed/current card price as the assertion target for this scenario.

## Proposed functional expectations

| ID | Expectation | Status |
| --- | --- | --- |
| P1 | A selected preset sets the corresponding lower and/or upper bound. | Partly observed for 100–250 ₴. |
| P2 | A user can enter a custom lower bound, upper bound, or both. | Partly observed: editing From and blurring committed its value. |
| P3 | The filter affects the product listing, and relevant product-card current prices meet the active bound, inclusively. | Observed in the UI samples and supported by adjacent-range API probes at 100 ₴. |
| P4 | The active bounds remain visible after page reload. | Observed after the page finished rendering. |
| P5 | Clearing the filter removes the bounds and restores the unfiltered listing. | Observed on the narrow layout. |
| P6 | On mobile, selecting a preset updates the URL/listing while the panel is open; Apply closes the panel. | Observed in narrow viewport; verify in actual mobile Chrome emulation. |
| P7 | Invalid and reversed input behavior is documented, then covered only if its intended result is clear. | Exploration only: From `300` with To `250` was accepted into the URL hash and returned 300 ₴ products. |

## Remaining questions and decisions

| Topic | What we know | Action / priority |
| --- | --- | --- |
| Mobile Chrome | Narrow-viewport behavior was observed, but the current Playwright mobile project uses an iPhone profile. | **Required:** switch to a Chromium Android device profile and run the tests there. |
| Price boundaries | The API supports inclusive endpoints; the 100 ₴ value appeared in both adjacent ranges. | **Required:** confirm a visible exact-bound product in one UI test. Avoid fixed product IDs. |
| Custom entry | Blur commits a bound; Enter alone did not immediately commit; clearing one bound preserves the other. | **Required:** cover valid custom entry and one-bound removal. Delay-based commit is not needed unless seen in normal use. |
| Clearing | Desktop has a removable price tag and `Зняти фільтри`; mobile has `Очистити`. Both cleared the price hash when price was the only active filter. | **Required:** test clear in both layouts. **Optional:** combine price with another filter to see whether the price tag removes only price while the global clear removes all filters. |
| Price source | Current card prices match the range in sampled results; old prices may exceed it. Default variant prices matched current card prices in one API page. | **Required:** assert current card prices. **Optional:** inspect a product whose variant selection changes the card price if the listing supports it. |
| Empty results | An extreme lower bound gave 0 products and no product cards. | **Useful:** one empty-state test with a high bound; assert 0 results, not a particular message translation. |
| Invalid values | A reversed range was accepted and behaved unexpectedly. Nonnumeric and negative input remain unexplored. | **Defer from acceptance tests:** report observations as an open product question unless interview instructions require validation coverage. |
| Category reuse | Hair (`20272`) and makeup (`2419`) expose the same price controls. | **Required:** parameterize the category ID; one cross-category smoke test is enough for this exercise. |

## Test design

- Use a category page helper that accepts a category ID. `CategoryPage.filters` owns a reusable `FiltersBlock` and category-specific components such as `price`; `PriceRanges` names the stable preset labels. Keep desktop and mobile panel actions in `FiltersBlock`.
- Use a Playwright setup project to accept cookies through the visible `Погоджуюсь` control and save `storageState`. Both browser projects depend on setup and start with that state; the category fixture only navigates.
- Run the same core behavior tests in desktop Chrome and **mobile Chrome emulation**. Use a Chromium-based mobile device profile in Playwright; the current `iPhone 16 PRO Max` profile should be reviewed because iPhone profiles commonly target WebKit.
- Prioritize: preset range, inclusive boundary, open-ended preset, custom range, clear, reload persistence, and one mobile Apply flow. Keep exploratory invalid-input behavior outside the core acceptance suite.
- Assert user-visible filter state and relevant listing prices. Avoid fixed product counts or fixed product names because catalog data changes. Exclude unrelated banners and sponsored recommendation widgets from price assertions.
- DOM inspected: `.PriceSelector__priceButton` for presets, `.PriceSelector__fields input` for bounds, `.Products__cards .ProductCard__card` for products, and `.Price__priceCurrent` inside those cards for displayed prices. These are implementation classes, so scope them carefully and prefer accessible controls where practical. The `.Products__cards` container also includes `.ActionCard__card` promotions, which have no product price.

## Candidate test cases

1. **Preset band:** choose 750–1000 ₴; expect both inputs and URL bounds to match; wait for product results; check every visible product card's current price is between 750 and 1000 ₴, inclusively. Run on both browser projects.
2. **Open-ended range:** choose Below 50 ₴ or Above 5000 ₴; expect one input blank and the corresponding single hash bound; check returned product prices if products exist.
3. **Custom range:** enter two valid values and blur each field; expect the displayed bounds and result prices to match.
4. **Persistence:** apply a valid range, reload, and wait for the bounds and filtered results to reappear.
5. **Clear:** apply a range, use Clear, and expect the price hash and both bound inputs to clear. Verify that results are no longer constrained by the previous range without relying on an exact product count.
6. **Mobile panel:** open Filter, select a preset, confirm its state, press Apply, and expect the panel to close while the selected bounds remain.
7. **Boundary:** use a narrow valid range whose endpoint price exists (the API returned 100 ₴ products for 100–100 ₴ and 250 ₴ products for 250–250 ₴); verify exact-bound prices are displayed. Do not pin assertions to product IDs or counts.
8. **Cross-category smoke:** on makeup (`2419`), confirm the reusable filter component is available and a preset produces the expected bounds.
9. **Empty results:** apply an extreme lower bound and expect the result count to reach zero with no product cards.

## Implementation sequence

Follow the staged [implementation plan](./plan.md): configure Chrome projects, prepare guest cookie `storageState` through a setup dependency, and run the price tests after approval.

The API is useful for exploration and optional test diagnostics, but core acceptance assertions should check the browser's visible filter state and product cards. Avoid asserting exact `total` values because inventory changes.

## Evidence still needed

The live DOM and API responses have been inspected. Remaining evidence is needed for intended invalid-input behavior, clear behavior when another filter is active, and confirmation under the configured mobile Chrome browser project.
