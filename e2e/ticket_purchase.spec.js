// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  const seedRes = await request.post('http://localhost:7001/register', {
    data: { user_name: 'testuser', password: 'testpass' }
  });

  if (seedRes.status() !== 200 && seedRes.status() !== 400) {
    throw new Error(
      `Failed to seed user. Status: ${seedRes.status()}  Body: ${await seedRes.text()}`
    );
  }
});

test('user can log in and complete a ticket purchase end-to-end', async ({ page }) => {
  // 1. Start at login page (App shows Login when user === null)
  await page.goto('/');

  // Fill the login form (your actual selectors)
  await page.getByLabel('username').fill('testuser');
  await page.getByLabel('password').fill('testpass');

  // Press login button (Login.js: <button>Login</button>)
  await page.getByRole('button', { name: /^login$/i }).click();

  await expect(
    page.getByRole('heading', { name: /Clemson Campus Events/i })
  ).toBeVisible();

  // 2. Events load (App fetches them with Authorization: Bearer <token>)
  await expect(page.getByText(/tickets/i).first()).toBeVisible();

  // 3. Grab Buy Ticket button (App uses aria-label="Buy ticket for NAME")
  const buyButton = page.getByRole('button', { name: /buy ticket for/i }).first();

  // Click purchase
  await buyButton.click();

  // 4. Status message appears (aria-live region)
  await expect(page.locator('.status')).toHaveText(/Ticket purchased/i);

  // 5. Reload to verify change persisted
  await page.reload();
  await expect(page.getByText(/ticket/).first()).toBeVisible();
});
