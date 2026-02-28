const puppeteer = require('puppeteer');

(async () => {
    console.log("Starting Puppeteer...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => {
        console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
    });

    console.log("Navigating to localhost:3000...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 15000 }).catch(e => console.log(e));

    console.log("Waiting 5 seconds to let scripts run...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("Done.");
    await browser.close();
})();
