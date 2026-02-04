const puppeteer = require('puppeteer');
const Event = require('../models/Event');
const cron = require('node-cron');

const SCRAPE_URLS = [
    {
        name: 'City of Sydney',
        url: 'https://whatson.cityofsydney.nsw.gov.au/search/advanced?q=&categories=&date_from=&date_to=&location=',
        city: 'Sydney'
    },
    {
        name: 'Eventbrite Sydney',
        url: 'https://www.eventbrite.com.au/d/australia--sydney/events/',
        city: 'Sydney'
    }
];

async function scrapeCityOfSydney() {
    console.log('Starting scrape for City of Sydney...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    try {
        // Use the configured URL from SCRAPE_URLS[0]
        await page.goto(SCRAPE_URLS[0].url, {
            waitUntil: 'networkidle2',
            timeout: 90000
        });

        // Give it a few seconds to run JS
        await new Promise(r => setTimeout(r, 5000));

        // Use a more generic wait or check for content
        await page.waitForSelector('article, a[href*="/events/"]', { timeout: 30000 });

        const scrapedEvents = await page.evaluate(() => {
            const posters = document.querySelectorAll('a[href*="/events/"]');
            const uniqueEvents = new Map();

            posters.forEach(link => {
                const title = link.innerText.trim();
                const url = link.href;

                // Filter out non-event links and duplicates
                if (title && url && url.includes('/events/') && !uniqueEvents.has(url)) {
                    const card = link.closest('article') || link.parentElement.parentElement;
                    const img = card.querySelector('img');

                    uniqueEvents.set(url, {
                        title,
                        url,
                        venue: 'Sydney',
                        imageUrl: img ? img.src : '',
                        description: '',
                        source: 'City of Sydney'
                    });
                }
            });

            return Array.from(uniqueEvents.values());
        });

        console.log(`Found ${scrapedEvents.length} potential events on Sydney homepage.`);
        // ... rest of the saving logic

        for (const data of scrapedEvents) {
            if (!data.url) continue;

            // Check for existing event
            const existing = await Event.findOne({ originalUrl: data.url });

            if (existing) {
                // Simple change detection (can be more robust)
                if (existing.title !== data.title || existing.venueName !== data.venue) {
                    existing.title = data.title;
                    existing.venueName = data.venue;
                    existing.description = data.description;
                    existing.imageUrl = data.imageUrl;
                    existing.status = 'updated';
                    existing.lastScrapedAt = new Date();
                    await existing.save();
                } else {
                    existing.lastScrapedAt = new Date();
                    await existing.save();
                }
            } else {
                // Create new
                const newEvent = new Event({
                    title: data.title,
                    venueName: data.venue,
                    description: data.description,
                    imageUrl: data.imageUrl,
                    originalUrl: data.url,
                    sourceName: data.source,
                    city: 'Sydney',
                    status: 'new',
                    lastScrapedAt: new Date()
                });
                await newEvent.save();
            }
        }

        // Mark inactive events
        // If an event wasn't updated in the last hour and isn't imported/inactive already
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        await Event.updateMany(
            {
                lastScrapedAt: { $lt: oneHourAgo },
                status: { $ne: 'inactive' },
                sourceName: 'City of Sydney'
            },
            { status: 'inactive' }
        );

    } catch (err) {
        console.error('CRITICAL SCRAPE ERROR (Sydney):', err.message);
        console.error(err.stack);
    } finally {
        await browser.close();
    }
}

async function scrapeEventbrite() {
    console.log('Starting scrape for Eventbrite Sydney...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    try {
        await page.goto(SCRAPE_URLS[1].url, {
            waitUntil: 'networkidle2',
            timeout: 90000
        });

        // Eventbrite is often slow and heavy on JS
        await new Promise(r => setTimeout(r, 8000));

        // Wait for potential event containers or links
        await page.waitForSelector('a[href*="/e/"], .event-card', { timeout: 30000 });

        const scrapedEvents = await page.evaluate(() => {
            const links = document.querySelectorAll('a[href*="/e/"]');
            const uniqueEvents = new Map();

            links.forEach(link => {
                const title = link.innerText.trim();
                const url = link.href;

                if (title && title.length > 5 && url && !uniqueEvents.has(url)) {
                    // Try to find an image in the parent structure
                    const container = link.closest('section') || link.parentElement.parentElement;
                    const img = container.querySelector('img');

                    uniqueEvents.set(url, {
                        title,
                        url,
                        venue: 'Sydney',
                        imageUrl: img ? img.src : '',
                        source: 'Eventbrite'
                    });
                }
            });

            return Array.from(uniqueEvents.values());
        });

        console.log(`Scraped ${scrapedEvents.length} potential events from Eventbrite.`);

        for (const data of scrapedEvents) {
            const existing = await Event.findOne({ originalUrl: data.url });
            if (existing) {
                existing.lastScrapedAt = new Date();
                await existing.save();
            } else {
                await new Event({
                    title: data.title,
                    venueName: data.venue,
                    imageUrl: data.imageUrl,
                    originalUrl: data.url,
                    sourceName: data.source,
                    city: 'Sydney',
                    status: 'new',
                    lastScrapedAt: new Date()
                }).save();
            }
        }

        // Mark inactive events for Eventbrite
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        await Event.updateMany(
            {
                lastScrapedAt: { $lt: oneHourAgo },
                status: { $ne: 'inactive' },
                sourceName: 'Eventbrite'
            },
            { status: 'inactive' }
        );
    } catch (err) {
        console.error('Eventbrite scrape error:', err);
    } finally {
        await browser.close();
    }
}

async function startScrapingJob() {
    const runAllScrapers = async () => {
        console.log('--- STARTING SEQUENTIAL SCRAPE CYCLE ---');
        try {
            await scrapeCityOfSydney();
            // Wait 10 seconds between scrapers to let memory settle
            await new Promise(r => setTimeout(r, 10000));
            await scrapeEventbrite();
        } catch (err) {
            console.error('Master scraper error:', err);
        }
    };

    // Schedule for every 24 hours (Railway free tier has limited compute hours)
    cron.schedule('0 0 * * *', runAllScrapers);

    // Initial run
    runAllScrapers();
}

module.exports = { startScrapingJob, scrapeCityOfSydney };
