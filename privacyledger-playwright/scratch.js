const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.privacyledger.ai/');
  
  // Accept cookies
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.waitForTimeout(1000);
  
  const btn = page.getByRole('button', { name: 'Products', exact: true });
  await btn.click({ force: true });
  await page.waitForTimeout(1000);
  
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log(html.substring(html.length - 2000));

  await browser.close();
})();
