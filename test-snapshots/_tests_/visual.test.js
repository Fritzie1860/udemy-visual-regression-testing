const puppeteer = require('puppeteer')
const {toMatchImageSnapshot} = require('jest-image-snapshot')

// need to extend the export function
expect.extend({toMatchImageSnapshot})

describe('Visual Regression Testing',()=>{
    let browser
    let page

    beforeAll(async function(){
        browser = await puppeteer.launch({
            headless: false
        })
        page = await browser.newPage()
    })

    afterAll(async function(){
        await browser.close()
    })

    test('Full Page Snapshot', async function(){
        await page.goto('https://www.example.com')
        await page.waitForSelector('h1')   
        // need to save it to the variable after take a screenshot
        const image = await page.screenshot()
        expect(image).toMatchImageSnapshot(
            // we can add some options
            // If the pict is different with less 500 pixels, it will still pass the test. If >500, it will be fail
            {
                failureThresholdType: 'pixel',
                failureThreshold: 500
            }

        )
    }) // go to web, wait for selector comes up, then take ss

    test('Single Element Snapshot', async function(){
        await page.goto('https://www.example.com')
        const h1 = await page.waitForSelector('h1') 
        // instead of targeting the page, we are now targeting the h1 and it will only screenshot the h1 area
        const image = await h1.screenshot()
        // if the percentage of the different pixels is more than 0.01% it will throw an error
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01
        })
    }) // go to web, wait for selector, targeting the selector or area using variable, then take ss

    test('Mobile Snapshot', async function(){
        await page.goto('https://www.example.com')
        await page.waitForSelector('h1') 
        // emulate any mobile device
        await page.emulate(puppeteer.KnownDevices['iPhone 13'])
        const image = await page.screenshot()
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01
        })
    }) // go to web, wait for selector, change device frame, then take ss

    test('Tablet Snapshot', async function(){
        await page.goto('https://www.example.com')
        await page.waitForSelector('h1') 
        // emulate any tablet device
        await page.emulate(puppeteer.KnownDevices['Galaxy Tab S4 landscape'])
        const image = await page.screenshot()
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01
        })
    }) 

    // hiding elemet on the web before take the ss
    test('Remove Element Before Snapshot', async function(){
        await page.goto('https://www.example.com')
        // evaluate func. If the element not found, just target an empty array or nothing 
        await page.evaluate(() => {
            ;(document.querySelectorAll('h1') || []).forEach(el => el.remove()) // only remove specific el (element)
        })
        const image = await page.screenshot()
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01
        })
    })
})