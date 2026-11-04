import type { Page } from '@playwright/test';
import { FiltersBlock } from './filtersBlock';
import { PriceFilter } from './priceFilter';

export class Filters {
  readonly block: FiltersBlock;
  readonly price: PriceFilter;

  constructor(page: Page) {
    this.block = new FiltersBlock(page);
    this.price = new PriceFilter(this.block);
  }
}
