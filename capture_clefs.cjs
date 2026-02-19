const { chromium } = require('/home/john/.npm-global/lib/node_modules/playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    
    // Factory presets extracted from pitchgrid-plugin
    const presets = [
        // Top row
        { name: 'bohlen-pierce', depth: 4, mode: 5, stretch: 1.58, label: 'Bohlen-Pierce (5L+4s)' },
        { name: 'mavila-7L2s', depth: 4, mode: 1, stretch: 1.0, label: 'Mavila 7L2s' },
        { name: 'dicoid-7L3s', depth: 4, mode: 4, stretch: 1.0, label: 'Dicoid 7L3s' },
        { name: 'orwell-9', depth: 4, mode: 5, stretch: 1.0, label: 'Orwell[9] (5L+4s)' },
        // Bottom row
        { name: 'porcupine8', depth: 6, mode: 2, stretch: 1.0, label: 'Porcupine8 (1L+7s)' },
        { name: 'machine6', depth: 4, mode: 1, stretch: 1.0, label: 'Machine6 (1L+5s)' },
        { name: 'magic7', depth: 3, mode: 6, stretch: 1.0, label: 'Magic7 (4L+3s)' },
        // Western with 8 clefs
        { name: 'western-8clefs', depth: 8, mode: 1, stretch: 1.0, label: 'Western (8 clefs)' },
    ];
    
    for (const p of presets) {
        const url = `http://localhost:5173/piano?depth=${Math.round(p.depth)}&mode=${p.mode}`;
        console.log(`Capturing ${p.name}: ${url}`);
        await page.goto(url);
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `/home/john/clawd/artifacts/clef-${p.name}.png` });
        console.log(`Done: ${p.label}`);
    }
    
    await browser.close();
    console.log('All clefs captured!');
})();
