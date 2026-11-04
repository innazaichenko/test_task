import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { test } from '@playwright/test';
import { CookieBanner } from '../components/CookieBanner';
import { guestStorageState } from '../support/storageState';

test('accept cookies for guest projects', async ({ page, context }) => {
  await page.goto('/ua/categorys/20272/');
  await new CookieBanner(page).accept();

  await mkdir(dirname(guestStorageState), { recursive: true });
  await context.storageState({ path: guestStorageState });
});
