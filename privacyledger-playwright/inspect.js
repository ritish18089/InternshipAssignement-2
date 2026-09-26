const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.privacyledger.ai/');
  
  const title = await page.title();
  console.log('Title:', title);
  
  const navItems = await page.evaluate(() => {
    const nav = document.querySelector('header');
    if (!nav) return 'No header found';
    const items = Array.from(nav.querySelectorAll('a, button')).map(el => {
      let text = el.innerText ? el.innerText.trim() : el.textContent.trim();
      return {
        tag: el.tagName,
        text: text,
        href: el.getAttribute('href') || null,
      };
    }).filter(i => i.text !== '');
    return items;
  });
  console.log('Header items:', JSON.stringify(navItems, null, 2));
  
  const ctItems = await page.evaluate(() => {
    const hero = document.querySelector('section'); // maybe hero section
    const items = Array.from(hero.querySelectorAll('a, button')).map(el => {
      let text = el.innerText ? el.innerText.trim() : el.textContent.trim();
      return {
        tag: el.tagName,
        text: text,
        href: el.getAttribute('href') || null,
      };
    }).filter(i => i.text !== '');
    return items;
  });
  console.log('Hero items:', JSON.stringify(ctItems, null, 2));

  await browser.close();
})();
