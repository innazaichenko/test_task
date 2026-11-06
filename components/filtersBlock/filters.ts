import type { Page } from '@playwright/test';
import { FiltersBlock } from './filtersBlock';
import { PriceFilter } from './priceFilter';
import { defaultLocale, type Locale } from '../../utils/locales';

export class Filters {
  readonly block: FiltersBlock;
  readonly price: PriceFilter;

  constructor(page: Page, locale: Locale = defaultLocale) {
    this.block = new FiltersBlock(page, locale);
    this.price = new PriceFilter(this.block);
  }
}
