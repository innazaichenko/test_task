import { mergeTests } from '@playwright/test';
import { test as pages } from './pages';
import { test as services } from './services';

export const test = mergeTests(pages, services);
export { expect } from '@playwright/test';
