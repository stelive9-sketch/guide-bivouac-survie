const targetUrl = process.argv[2] || 'https://guide-bivouac-survie.vercel.app/';

async function main() {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const collectRequests = [];
  const consoleMessages = [];
  const pageErrors = [];

  page.on('request', (request) => {
    const url = request.url();
    if (/google-analytics\.com\/g\/collect|google-analytics\.com\/collect|analytics\.google\.com/i.test(url)) {
      collectRequests.push({
        method: request.method(),
        url,
      });
    }
  });

  page.on('console', (message) => {
    consoleMessages.push({
      type: message.type(),
      text: message.text(),
    });
  });

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  await page.goto(targetUrl, { waitUntil: 'networkidle' });

  const initialState = await page.evaluate(() => ({
    gtagType: typeof window.gtag,
    dataLayerType: Array.isArray(window.dataLayer) ? 'array' : typeof window.dataLayer,
    dataLayerLength: Array.isArray(window.dataLayer) ? window.dataLayer.length : null,
    hasGtagScript: Boolean(document.querySelector('script[src*="googletagmanager.com/gtag/js"]')),
  }));

  await page.evaluate(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'test_event_manual', {
        debug_mode: true,
        source: 'playwright_check',
      });
    }
  });

  await page.waitForTimeout(3000);

  const afterManualEvent = {
    collectRequests,
    consoleMessages,
    pageErrors,
  };

  console.log(JSON.stringify({ targetUrl, initialState, afterManualEvent }, null, 2));

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

