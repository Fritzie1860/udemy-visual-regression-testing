const puppeteer = require('puppeteer')
const percySnapshot = require('@percy/puppeteer')

describe('Integration test with visual testing', () => {
    test('Loads the homepage', async () => {
        const browser = await puppeteer.launch({
            headless: "new"
        })
        const page = await browser.newPage()
        await page.goto('https://www.example.com')
        await page.waitForSelector('h1')
        await percySnapshot(page, 'Example Page')
    })
})
