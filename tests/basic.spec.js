import { test, expect } from '@playwright/test'

test('index loads', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()
})
