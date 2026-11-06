export type PriceRangeKey =
  | 'BELOW_50'
  | 'FROM_50_TO_100'
  | 'FROM_100_TO_250'
  | 'FROM_250_TO_500'
  | 'FROM_500_TO_750'
  | 'FROM_750_TO_1000'
  | 'FROM_1000_TO_5000'
  | 'ABOVE_5000';

export type Locale = {
  cookieBanner: { agreeButton: string };
  filters: {
    mobileOpen: string;
    mobileApply: string;
    mobileClear: string;
    desktopClear: string;
  };
  priceRanges: Record<PriceRangeKey, string>;
};

export const uaLocale: Locale = {
  cookieBanner: { agreeButton: 'Погоджуюсь' },
  filters: {
    mobileOpen: 'Фільтр',
    mobileApply: 'Застосувати',
    mobileClear: 'Очистити',
    desktopClear: 'Зняти фільтри',
  },
  priceRanges: {
    BELOW_50: 'Менше 50 ₴',
    FROM_50_TO_100: '50 ₴ - 100 ₴',
    FROM_100_TO_250: '100 ₴ - 250 ₴',
    FROM_250_TO_500: '250 ₴ - 500 ₴',
    FROM_500_TO_750: '500 ₴ - 750 ₴',
    FROM_750_TO_1000: '750 ₴ - 1000 ₴',
    FROM_1000_TO_5000: '1000 ₴ - 5000 ₴',
    ABOVE_5000: 'Більше 5000 ₴',
  },
};

export const defaultLocale = uaLocale;
