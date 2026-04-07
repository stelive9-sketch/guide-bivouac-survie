import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const port = 3210;
const baseUrl = `http://127.0.0.1:${port}`;
const articleSlug = 'tente-trekking-2-places-ultra-legere-et-impermeable-quel-modele-choisir-pour-la-pluie';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server not ready yet.
    }

    await delay(500);
  }

  throw new Error(`Server did not start within ${timeoutMs}ms`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function read(relativePath) {
  return fs.readFile(path.join(rootDir, relativePath), 'utf8');
}

async function checkHttpPage(url, expectations) {
  const response = await fetch(url);
  assert(response.ok, `Expected ${url} to respond with 200, got ${response.status}`);
  const html = await response.text();

  for (const expectation of expectations) {
    assert(html.includes(expectation), `Expected ${url} to contain "${expectation}"`);
  }
}

async function run() {
  const server = spawn(
    process.env.ComSpec || 'cmd.exe',
    ['/d', '/s', '/c', `npm.cmd run start -- --hostname 127.0.0.1 --port ${port}`],
    {
      cwd: rootDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    },
  );

  let output = '';
  server.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });

  try {
    await waitForServer(baseUrl);

    await checkHttpPage(`${baseUrl}/`, [
      'Choix rapides',
      'Voir les meilleurs achats',
      `/articles/${articleSlug}`,
    ]);

    await checkHttpPage(`${baseUrl}/articles/${articleSlug}`, [
      'Survie & Bivouac',
      'GUIDE TERRAIN',
      'Retour a tous les guides',
    ]);

    await checkHttpPage(`${baseUrl}/reporting`, [
      'Reporting CRO',
      'Les clics qui comptent vraiment',
    ]);

    const layoutSource = await read('src/app/layout.tsx');
    const homeSource = await read('src/app/page.tsx');
    const articleSource = await read('src/app/articles/[slug]/page.tsx');
    const analyticsSource = await read('src/lib/analytics.ts');
    const htmlTrackerSource = await read('src/components/TrackedHtmlContent.tsx');

    assert(
      layoutSource.includes('NEXT_PUBLIC_GA_MEASUREMENT_ID'),
      'Expected layout.tsx to reference NEXT_PUBLIC_GA_MEASUREMENT_ID',
    );
    assert(
      homeSource.includes('guide_navigation_click'),
      'Expected home page to track guide_navigation_click',
    );
    assert(
      articleSource.includes('affiliate_click'),
      'Expected article page to track affiliate_click',
    );
    assert(
      articleSource.includes('article_money_route'),
      'Expected article page to track article_money_route navigation',
    );
    assert(
      htmlTrackerSource.includes("placement: 'article_body'"),
      'Expected TrackedHtmlContent to tag article_body clicks',
    );
    assert(
      analyticsSource.includes('autoniche-analytics-events'),
      'Expected analytics.ts to persist local analytics events',
    );

    console.log('Analytics smoke test passed.');
    console.log(`Checked pages: /, /articles/${articleSlug}, /reporting`);
    console.log('Verified tracking wiring for GA4, affiliate clicks, guide navigation, and local event storage.');
  } finally {
    if (server.pid) {
      spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], {
        stdio: 'ignore',
        windowsHide: true,
      });
    }

    if (server.exitCode && server.exitCode !== 0) {
      console.error(output);
    }
  }
}

run().catch((error) => {
  console.error('Analytics smoke test failed.');
  console.error(error.message);
  process.exitCode = 1;
});
