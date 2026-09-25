import { test, expect } from '@playwright/test';
for (const width of [375, 768, 1440]) {
  test(`landing page at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    const missingLocalResources = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith('http://127.0.0.1:5501/') && response.status() >= 400) missingLocalResources.push(response.url());
    });
    await page.goto('./index.html');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('#atendimento')).toHaveCount(0);
    await expect(page.getByText('SEU PRIMEIRO PASSO')).toHaveCount(0);
    expect(await page.locator('.eyebrow').evaluateAll(nodes => nodes.every(node => !/^\d{2}\s*\//.test(node.textContent.trim())))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.brand img')).toBeVisible();
    await expect(page.locator('.hero-portrait img')).toHaveAttribute('src', './public/images/retrato-hero.webp');
    await expect(page.locator('.about-image img')).toHaveAttribute('src', './public/images/retrato-sobre.webp');
    await expect(page.locator('.map-wrap iframe')).toHaveAttribute('src', /Edif%C3%ADcio%20Costa%20Rangel/);
    expect(await page.locator('.map-wrap iframe').evaluate(element => getComputedStyle(element).filter)).toBe('none');
    await expect(page.getByText(/CEP 35500-900/)).toBeVisible();
    expect(await page.locator('.hero-title > span').first().evaluate(element => getComputedStyle(element).animationName)).not.toBe('none');
    expect(await page.locator('.hero-portrait img').evaluate(element => getComputedStyle(element).animationName)).not.toBe('none');
    const portraitSpacing = await page.locator('.hero-portrait').evaluate(slot => {
      const image = slot.querySelector('img').getBoundingClientRect();
      const bounds = slot.getBoundingClientRect();
      return image.top - bounds.top;
    });
    expect(portraitSpacing).toBeGreaterThanOrEqual(8);
    if (width === 1440) {
      await page.waitForTimeout(1200);
      expect(await page.locator('.experience-number').textContent()).not.toBe('+10');
      await page.waitForTimeout(2200);
      await expect(page.locator('.experience-number')).toHaveText('+10');
    }
    expect(await page.locator('.brand img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await page.locator('.brand img').evaluate(async image => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, 1, 1).data[3] === 0;
    })).toBe(true);
    const links = await page.locator('[data-whatsapp]').evaluateAll(nodes => nodes.map(node => node.href));
    expect(links.every(link => link.startsWith('https://wa.me/5537998373799?text='))).toBe(true);
    if (width < 1101) {
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await expect(page.locator('#navigation')).toBeVisible();
      await page.locator('#navigation').getByRole('link', { name: 'Sobre', exact: true }).click();
      await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('#navigation')).not.toBeVisible();
    }
    await page.locator('#escritorio').scrollIntoViewIfNeeded();
    await expect(page.locator('.header')).toHaveClass(/scrolled/);
    const firstFaq = page.locator('.faq-item').first();
    await firstFaq.getByRole('button').click();
    await expect(firstFaq.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    await expect(firstFaq).toHaveClass(/open/);
    expect(errors).toEqual([]);
    expect(missingLocalResources).toEqual([]);
    await expect(page.locator('#i-chat path')).toHaveAttribute('fill', 'currentColor');
    await expect(page.locator('#i-chat path')).toHaveAttribute('stroke', 'none');
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `test-results/landing-${width}.png`, fullPage: true });
  });
}
