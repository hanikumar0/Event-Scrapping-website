const puppeteer = require('puppeteer');

async function debug() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    try {
        console.log('Navigating to Sydney...');
        await page.goto('https://whatson.cityofsydney.nsw.gov.au/search/advanced', { waitUntil: 'networkidle2' });
        const html = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('/events/'));
            return {
                linkCount: links.length,
                sampleLinks: links.slice(0, 5),
                bodyPreview: document.body.innerText.substring(0, 500)
            };
        });
        console.log('DEBUG SYDNEY:', JSON.stringify(html, null, 2));

        console.log('Navigating to Eventbrite...');
        await page.goto('https://www.eventbrite.com.au/d/australia--sydney/events/', { waitUntil: 'networkidle2' });
        const ebHtml = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('/e/'));
            return {
                linkCount: links.length,
                sampleLinks: links.slice(0, 5),
                bodyPreview: document.body.innerText.substring(0, 500)
            };
        });
        console.log('DEBUG EB:', JSON.stringify(ebHtml, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}

debug();
