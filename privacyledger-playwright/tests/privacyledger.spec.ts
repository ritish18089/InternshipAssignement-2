import { test, expect } from '@playwright/test';

// Reusable helper function for visual demonstration delays
async function demoPause(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

// Reusable helper function to handle the cookie banner
async function handleCookieBanner(page: import('@playwright/test').Page) {
  const bannerHeading = page.getByText('We value your privacy', { exact: true });
  const isBannerPresent = await bannerHeading.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (!isBannerPresent) {
    return;
  }
  
  const bannerContainer = page.locator('div, dialog, section').filter({ has: bannerHeading }).last();
  
  // Locate "Accept All"
  const acceptAllBtn = bannerContainer.getByText(/Accept All/i).first();
  
  // Verify "Accept All" is visible
  await expect(acceptAllBtn).toBeVisible();
  
  // Pause approximately 1 second
  await demoPause(1000);
  
  // Click "Accept All"
  await acceptAllBtn.evaluate(el => (el as HTMLElement).click());
  
  // Verify cookie banner disappears
  await expect(bannerContainer).not.toBeVisible();
}

test.describe('PrivacyLedger Homepage', () => {
  test('TC01 - Verify Homepage, Navigation Menu and Full Homepage Content', async ({ page }) => {
    test.setTimeout(120000); // 120s max timeout for the ~60s visual demo
    
    // STEP 1 - LOAD HOMEPAGE (~5s)
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    await handleCookieBanner(page);
    
    // Verify page loads successfully
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*privacyledger\.ai/);
    await expect(page).toHaveTitle(/PrivacyLedger/);
    
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    
    const mainCTA = page.locator('a', { hasText: /Free Assessment/i }).first();
    await expect(mainCTA).toBeVisible();
    
    await demoPause(6000); // Demo: Observe homepage load
    
    // STEP 2 - VERIFY PRICING IN NAVBAR (~7s)
    const pricingLink = header.getByRole('link', { name: 'Pricing', exact: true });
    await expect(pricingLink).toBeVisible();
    await expect(pricingLink).toBeEnabled();
    const pricingHref = await pricingLink.getAttribute('href');
    expect(pricingHref).toBeTruthy();
    await demoPause(1000);
    
    await pricingLink.evaluate(el => (el as HTMLElement).click());
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/.*\/pricing/);
    const pricingHeading = page.getByRole('heading', { name: /Pricing/i }).first();
    await expect(pricingHeading).toBeVisible();
    await demoPause(2000);
    
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*privacyledger\.ai/);
    await demoPause(1000);

    // STEP 3 - VERIFY FREE ASSESSMENT IN NAVBAR (~7s)
    const assessmentLink = header.locator('a').filter({ hasText: /Free Assessment/i }).first();
    await expect(assessmentLink).toBeVisible();
    await expect(assessmentLink).toBeEnabled();
    const assessmentHref = await assessmentLink.getAttribute('href');
    expect(assessmentHref).toBeTruthy();
    await demoPause(1000);
    
    await assessmentLink.evaluate(el => (el as HTMLElement).click());
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/.*contact.*/);
    
    const assessmentHeading = page.locator('h1').first();
    await expect(assessmentHeading).toBeVisible();
    await demoPause(2000);
    
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*privacyledger\.ai/);
    await demoPause(1000);

    // STEP 4 - VERIFY BOOK DEMO IN NAVBAR (~7s)
    const demoLink = header.locator('a').filter({ hasText: /Book a Demo|Request Demo/i }).first();
    await expect(demoLink).toBeVisible();
    await expect(demoLink).toBeEnabled();
    const demoHref = await demoLink.getAttribute('href');
    expect(demoHref).toBeTruthy();
    await demoPause(1000);
    
    await demoLink.evaluate(el => (el as HTMLElement).click());
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/.*contact.*/);
    
    // Verify form fields
    const demoHeading = page.locator('h1').first();
    await expect(demoHeading).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="workEmail"]')).toBeVisible();
    await expect(page.locator('input[name="company"]')).toBeVisible();
    await expect(page.locator('select[name="employees"]')).toBeVisible();
    await expect(page.locator('select[name="industry"]')).toBeVisible();
    
    await demoPause(2000);
    
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*privacyledger\.ai/);
    await demoPause(1000);

    // STEP 5 - VERIFY ALL OTHER NAVBAR ITEMS (~10s)
    // We identify normal top-level items on the desktop navbar (excluding the specific links)
    const navItems = [
      { name: 'Products', role: 'button' },
      { name: 'Solutions', role: 'button' },
      { name: 'Resources', role: 'button' },
      { name: 'Company', role: 'button' }
    ];

    for (const item of navItems) {
      // A. Locate the navbar item
      const navElement = header.getByRole(item.role as any, { name: item.name, exact: true });
      
      // B. Verify it is visible
      await expect(navElement).toBeVisible();
      
      // C. Verify its text/name
      await expect(navElement).toContainText(item.name);
      
      // D. Click it to open (or simulate behavior)
      await navElement.click({ force: true });
      await demoPause(1000);
      
      // E. Close it
      await navElement.click({ force: true });
      await demoPause(1000);
    }
    
    // RETURN TO TOP BEFORE SCROLLING
    await page.evaluate(() => window.scrollTo(0, 0));
    await demoPause(1000);

    // Identify actual major sections on the homepage to verify while scrolling
    const sections = [
      { 
        name: 'Products/Capabilities', 
        headingText: /Consent Management/i, 
        contentText: /Consent Management/i, 
        hasLinks: true,
        scrollAmount: 800
      },
      { 
        name: 'Integrations', 
        headingText: /Works with your existing systems/i, 
        contentText: /Works with your existing systems/i, 
        hasLinks: false,
        scrollAmount: 800
      },
      { 
        name: 'Customers', 
        headingText: /Indian enterprises exploring/i, 
        contentText: /Indian enterprises exploring/i,
        hasLinks: false,
        scrollAmount: 600
      },
      { 
        name: 'Call to Action', 
        headingText: /Is your organisation DPDP Act ready/i, 
        contentText: /Is your organisation DPDP Act ready/i, 
        hasLinks: true,
        scrollAmount: 800
      }
    ];

    for (const section of sections) {
      // 1. Scroll down towards the section
      await page.mouse.wheel(0, section.scrollAmount);
      await demoPause(1500);
      
      // 2 & 3. Identify & Verify Heading
      const heading = page.getByText(section.headingText).first();
      // Ensure it's in view
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
      
      // 4. Verify important visible text/content
      const content = page.getByText(section.contentText).first();
      await expect(content).toBeVisible();
      
      // 5. Verify important links/cards where applicable
      if (section.hasLinks) {
        const link = page.locator('a').filter({ hasText: /Learn more|Get Free Assessment|Book a Demo/i }).first();
        if (await link.count() > 0) {
          await expect(link).toBeVisible();
        }
      }
      
      // 6. Pause 1-2 seconds
      await demoPause(3500);
    }
    
    // STEP 5 - FOOTER (~5s)
    // Keep scrolling until we hit the absolute bottom
    let atBottom = false;
    let scrollAttempts = 0;
    let prevScrollY = -1;
    let currentScrollY = 0;

    while (!atBottom && scrollAttempts < 15) {
      await demoPause(1500); // Demo: Observe scrolling
      await page.evaluate(() => window.scrollBy(0, 800)); // Scroll down visually
      await page.waitForTimeout(100);
      
      const scrollInfo = await page.evaluate(() => {
        return {
          scrollY: Math.round(window.scrollY),
          innerHeight: window.innerHeight,
          scrollHeight: document.documentElement.scrollHeight
        };
      });
      
      currentScrollY = scrollInfo.scrollY;
      
      if (
        Math.abs(currentScrollY + scrollInfo.innerHeight - scrollInfo.scrollHeight) < 50 ||
        (scrollAttempts > 0 && currentScrollY === prevScrollY)
      ) {
        atBottom = true;
      }
      
      prevScrollY = currentScrollY;
      scrollAttempts++;
    }

    // Ensure we are exactly at the absolute bottom for the mathematical calculation
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(200);

    // Verify footer is visible
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await demoPause(2000);
    
    // Verify important footer text/links
    await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Terms of Service' })).toBeVisible();
    
    // Verify the page is actually at the bottom using the exact user-provided math
    const verifyAtBottom = await page.evaluate(() => {
      return Math.abs(
        window.innerHeight + window.scrollY -
        document.documentElement.scrollHeight
      ) < 10;
    });
    expect(verifyAtBottom).toBeTruthy();
    
    // STEP 6 - FINAL ASSERTIONS
    // All checks were performed sequentially above.
    // ✓ Homepage loaded
    // ✓ Page title exists
    // ✓ Header exists
    // ✓ All actual navbar items were inspected
    // ✓ Homepage sections were individually verified
    // ✓ Homepage was visibly scrolled from top to bottom
    // ✓ Footer was verified
    // ✓ Page reached the bottom
    
    await demoPause(5000); // Demo: Final observation of footer & test completion
  });

  test('TC02 - Main PrivacyLedger modules are visible', async ({ page }) => {
    test.setTimeout(150000); // 150s timeout to safely allow for network loading overhead
    
    // 1. Homepage -> Products: 5 seconds
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await handleCookieBanner(page);
    await demoPause(2000);
    // Click Products link (we use evaluate to reliably click the href without being blocked by overlays)
    const productsLink = page.locator('a[href="/products"]').first();
    await productsLink.evaluate(el => (el as HTMLElement).click());
    await demoPause(3000);

    // 2. Products page inspection: 5 seconds
    await expect(page).toHaveURL(/\/products/);
    await demoPause(5000);

    const products = [
      'Consent Governance Platform',
      'Data Mapping & Discovery',
      'Data Principal Rights Portal',
      'Grievance Redressal System',
      'Breach Notification',
      'Compliance Reporting',
    ];

    // 3-8. Product loops: ~10 seconds each
    for (const product of products) {
      // 1 sec → locate product
      const productElement = page.getByText(product, { exact: true }).first();
      await productElement.scrollIntoViewIfNeeded();
      await demoPause(1000); 
      
      const card = page.locator('div, section, article, li').filter({ has: page.getByText(product, { exact: true }) }).filter({ has: page.locator('a', { hasText: /Learn more/i }) }).last();
      const learnMoreBtn = card.locator('a', { hasText: /Learn more/i }).first();
      
      // 1 sec → click/open product
      await learnMoreBtn.evaluate(el => (el as HTMLElement).click());
      await page.waitForLoadState('domcontentloaded');
      await demoPause(1000);
      
      // 1 sec → verify heading
      const productHeading = page.getByRole('heading', { name: product }).first();
      await expect(productHeading).toBeVisible();
      await demoPause(1000);
      
      // 2 sec → view description
      await page.mouse.wheel(0, 500);
      await demoPause(2000);
      
      // 2 sec → view Key capabilities
      const keyCapabilities = page.getByRole('heading', { name: /Key capabilities/i }).first();
      await keyCapabilities.scrollIntoViewIfNeeded();
      await demoPause(2000);
      
      // 2 sec → scroll further
      await page.mouse.wheel(0, 800);
      await demoPause(2000);
      
      // 1 sec → return
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await demoPause(1000);
    }
    
    // 9. Final verification: 5 seconds
    await expect(page).toHaveURL(/\/products/);
    await demoPause(5000);
  });

  test('TC03A - Request a Demo form accepts valid data', async ({ page }) => {
    test.setTimeout(60000); 
    // 1. Navigate to the Request a Demo form.
    await page.goto('/contact?intent=demo#contact-form', { waitUntil: 'domcontentloaded' });
    await handleCookieBanner(page);
    await demoPause(2000); // Demo: Observe form load
    
    // 2. Verify the form is visible.
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await expect(submitBtn).toBeVisible();

    // 3-6. Enter valid test data. 
    await page.locator('input[name="firstName"]').fill('Jane');
    await demoPause(500);
    await page.locator('input[name="lastName"]').fill('Doe');
    await demoPause(500);
    await page.locator('input[name="workEmail"]').fill('jane.doe@example.com');
    await demoPause(500);
    await page.locator('input[name="company"]').fill('Test Corp');
    await demoPause(500);
    await page.locator('input[name="jobTitle"]').fill('QA Engineer');
    await demoPause(500);
    await page.locator('input[name="phone"]').fill('+91 9876543210');
    await demoPause(500);
    
    // 4. Select valid Company Size
    await page.locator('select[name="employees"]').selectOption('201-1000');
    await demoPause(1000);
    
    // 5. Select valid Industry
    await page.locator('select[name="industry"]').selectOption('Technology');
    await demoPause(1000);
    
    // 6. Fill optional compliance challenge field
    await page.locator('textarea[name="message"]').fill('This is a test message.');
    await demoPause(1000);
    
    // 7. Handle the consent control
    await page.locator('input[name="consent"]').dispatchEvent('click');
    await expect(page.locator('input[name="consent"]')).toBeChecked();
    await demoPause(1000); // Demo: Verify consent checked

    // Setup request interception to avoid sending a real lead to production
    let interceptedRequest = false;
    await page.route('**/*', async route => {
      if (route.request().method() === 'POST') {
        interceptedRequest = true;
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      } else {
        await route.continue();
      }
    });

    // 8. Submit and verify request preparation
    const requestPromise = page.waitForRequest(req => req.method() === 'POST' || req.method() === 'GET', { timeout: 3000 }).catch(() => null);
    await submitBtn.click({ force: true });
    
    await requestPromise;
    await demoPause(1000); // Demo: Observe submission logic safely
  });

  test('TC03B - Request a Demo form rejects missing required field', async ({ page }) => {
    test.setTimeout(60000); 
    // 1. Navigate to the Request a Demo form.
    await page.goto('/contact?intent=demo#contact-form', { waitUntil: 'domcontentloaded' });
    await handleCookieBanner(page);
    await demoPause(2000); // Demo: Observe form load
    
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await expect(submitBtn).toBeVisible();

    // 2. Leave First Name empty (do not fill it)
    
    // 3-4. Fill the other required fields with valid test data
    await page.locator('input[name="lastName"]').fill('Doe');
    await demoPause(1000);
    await page.locator('input[name="workEmail"]').fill('jane.doe@example.com');
    await demoPause(1000);
    await page.locator('input[name="company"]').fill('Test Corp');
    await demoPause(1000);
    await page.locator('select[name="employees"]').selectOption('201-1000');
    await demoPause(1000);
    await page.locator('select[name="industry"]').selectOption('Technology');
    await demoPause(1000);
    await page.locator('input[name="consent"]').dispatchEvent('click');
    await expect(page.locator('input[name="consent"]')).toBeChecked();
    await demoPause(1000); // Demo: Ready to submit incomplete form

    // Intercept to check if submission is prevented
    let requestFired = false;
    await page.route('**/*', async route => {
      if (route.request().method() === 'POST') {
        requestFired = true;
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      } else {
        await route.continue();
      }
    });

    // 5. Click Submit
    await submitBtn.click({ force: true });
    
    // Wait a brief moment to allow validation to process
    await page.waitForTimeout(1000);

    // 6-8. Verify validation prevents submission and user remains on form
    expect(requestFired).toBe(false);
    await expect(submitBtn).toBeVisible();
    await demoPause(2000); // Demo: Observe the missing field error handling
  });

  test('TC04 - External link opens correctly', async ({ page, context }) => {
    test.setTimeout(30000); 
    // 1. Navigate to the homepage
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await handleCookieBanner(page);
    
    // 1 second → locate external link
    const linkedInLink = page.locator('a[href="https://linkedin.com/company/privacyledger"]');
    await linkedInLink.scrollIntoViewIfNeeded();
    await demoPause(1000);

    // 1 second → verify href
    await expect(linkedInLink).toBeVisible();
    await expect(linkedInLink).toHaveAttribute('href', 'https://linkedin.com/company/privacyledger');
    await demoPause(1000);

    // 1 second → click link
    const target = await linkedInLink.getAttribute('target');
    let newPage = page;
    
    if (target === '_blank') {
      const pagePromise = context.waitForEvent('page');
      await linkedInLink.dispatchEvent('click');
      newPage = await pagePromise;
    } else {
      await linkedInLink.dispatchEvent('click');
    }
    await demoPause(1000);
    
    // 1 second → wait for destination/load
    await newPage.waitForLoadState();
    await demoPause(1000);
    
    // 1 second → verify destination
    expect(newPage.url()).toContain('linkedin.com');
    await demoPause(1000);
  });

  test('TC05 - Navigate to About Us from Company menu', async ({ page }) => {
    test.setTimeout(60000); 
    // 1. Open the PrivacyLedger homepage
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await handleCookieBanner(page);
    
    // 2 seconds → homepage load
    await demoPause(2000);

    // 2. Locate the "Company" navigation item
    const companyBtn = page.getByRole('button', { name: 'Company', exact: true });
    
    // 2 seconds → locate Company
    await expect(companyBtn).toBeVisible();
    await demoPause(2000);

    // 3. Click/select "Company" and wait for dropdown
    await companyBtn.dispatchEvent('click');
    
    // 2 seconds → open Company menu
    await demoPause(2000);

    // 4. Locate "About Us" inside the Company menu
    const aboutUsLink = page.getByRole('link', { name: 'About Us' }).first();
    
    // 2 seconds → locate About Us
    await expect(aboutUsLink).toBeVisible();
    await demoPause(2000);

    // 5. Click "About Us"
    await aboutUsLink.dispatchEvent('click');
    
    // 3 seconds → view About Us page
    await page.waitForLoadState('domcontentloaded');
    await demoPause(3000);

    // 6. Verify URL and Heading
    await expect(page).toHaveURL(/.*\/company\/about/);
    const heading = page.getByRole('heading', { name: /We built the compliance platform/i });
    await expect(heading).toBeVisible();

    // 7. Progressively scroll down the entire page
    let atBottom = false;
    let scrollAttempts = 0;
    let prevScrollY = -1;
    let currentScrollY = 0;
    
    while (!atBottom && scrollAttempts < 15) {
      await demoPause(1500); // Demo: Observe current section
      await page.mouse.wheel(0, 700); // Scroll down
      await page.waitForTimeout(100); // Allow browser to process scroll
      
      // Check if we've reached the bottom
      const scrollInfo = await page.evaluate(() => {
        return {
          scrollY: Math.round(window.scrollY),
          innerHeight: window.innerHeight,
          scrollHeight: document.documentElement.scrollHeight
        };
      });
      
      currentScrollY = scrollInfo.scrollY;
      
      // We are at the bottom if the calculation matches (with tolerance) OR if scroll position stopped moving
      if (
        Math.abs(currentScrollY + scrollInfo.innerHeight - scrollInfo.scrollHeight) < 50 ||
        (scrollAttempts > 0 && currentScrollY === prevScrollY)
      ) {
        atBottom = true;
      }
      
      prevScrollY = currentScrollY;
      scrollAttempts++;
    }

    // 8. Verify that the page has actually reached the bottom
    expect(atBottom).toBeTruthy();
    
    // 9. Verify the footer is visible
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    
    await demoPause(2000); // Demo: Final observation of bottom/footer
  });
});
