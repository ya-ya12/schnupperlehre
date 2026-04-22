import { expect, test } from '@playwright/test'

test('main menu loads and starts a game', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Game Arcade' })).toBeVisible()
  await page.getByRole('link', { name: 'Play' }).first().click()
  await expect(page.getByRole('button', { name: 'Back to menu' })).toBeVisible()
})
