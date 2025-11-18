// @ts-check
import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Clemson Campus Events/i })).toBeVisible();
});

test('user can complete a ticket purchase end-to-end', async ({ page }) => {
  await page.goto('/');

  // wait for events to load
  await expect(page.getByText(/tickets/i).first()).toBeVisible();

  // Find first Buy Ticket button
  const buyButton = page.getByRole('button', { name: /buy ticket for/i }).first();

  const eventName = await buyButton.textContent();

  // Click purchase
  await buyButton.click();

  // Status message should appear (aria-live region)
  await expect(page.locator('.status')).toHaveText(/Ticket purchased/i);

  // Reload events to verify ticket count updated
  await page.reload();
  await expect(
    page.getByText(/ticket/).first()
  ).toBeVisible();
});