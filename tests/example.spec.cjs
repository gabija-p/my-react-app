// @ts-check
const { test, expect } = require('@playwright/test');

test('sort by first name', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  page.on('console', msg => {})

  await page.waitForSelector('#table tbody tr td');
  const names = await page.$$eval('#table tbody tr', rows => 
    rows.map(row => row.querySelector('td:first-child')?.textContent?.trim())
  );
  names.sort();

  await page.selectOption('#sort', 'first-name');
  const sortedNames = await page.$$eval('#table tbody tr', rows => 
    rows.map(row => row.querySelector('td:first-child')?.textContent?.trim())
  );
  await page.waitForSelector('#table tbody tr td');

  await expect(names).toEqual(sortedNames);
});
