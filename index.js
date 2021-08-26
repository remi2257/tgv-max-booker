// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from 'puppeteer-extra';

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

async function takeScreenshot() {
    // Create browser
    const browser = await puppeteer.launch(
        { headless: false }
    );
    const page = await browser.newPage()

    // Go to page
    await page.goto('https://www.oui.sncf/');

    // Accept conditions
    await page.click('didomi-notice-agree-button');

    // Fill gares
    await page.fill('#vsb-origin-train-launch', "Paris (toutes gares intramuros)")
    await page.keyboard.press('Enter');
    await page.fill('#vsb-destination-train-launch', "Lille (toutes gares)");
    await page.keyboard.press('Enter');
    
    // Fill Date
    await page.click('#vsb-dates-dialog-train-launch-aller-retour-1');
    await page.fill('#vsb-datepicker-departure-date-input', "28/08/21")
    // await page.fill('#schedule-select-startDate', "08h")
    
    // Submit
    await page.click('#vsb-datepicker-train-launch-aller-retour-submit');
    await page.screenshot({ path: `filled-form.png` });
    await page.click("#vsb-booking-train-launch-submit");
    await page.screenshot({ path: `post-form.png` });
    await browser.close();
};

takeScreenshot();