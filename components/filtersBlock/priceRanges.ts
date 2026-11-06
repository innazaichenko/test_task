import { defaultLocale, type Locale } from '../../utils/locales';

export const PriceRanges = defaultLocale.priceRanges;

export type PriceRange = string;

export function priceRanges(locale: Locale = defaultLocale): Locale['priceRanges'] {
  return locale.priceRanges;
}
