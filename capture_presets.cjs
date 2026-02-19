const { chromium } = require('/home/john/.npm-global/lib/node_modules/playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    
    const configs = [
        // Mode 1 presets
        { depth: 3, mode: 1, name: 'mode1-depth3-7note' },
        { depth: 8, mode: 1, name: 'mode1-depth8-clefs' },
        // Mode 3 presets  
        { depth: 3, mode: 3, name: 'mode3-depth3-7note' },
        { depth: 8, mode: 3, name: 'mode3-depth8-clefs' },
    ];
    
    for (const cfg of configs) {
        const url = `http://localhost:5173/piano?depth=${cfg.depth}&mode=${cfg.mode}`;
        console.log(`Loading ${url}`);
        await page.goto(url);
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `/home/john/clawd/artifacts/mos-piano-${cfg.name}.png` });
        console.log(`Captured ${cfg.name}`);
    }
    
    await browser.close();
    console.log('Done!');
})();
