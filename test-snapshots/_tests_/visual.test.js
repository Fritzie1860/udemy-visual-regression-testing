const puppeteer = require('puppeteer')
const {toMatchImageSnapshot} = require('jest-image-snapshot')

// need to extend the export function
expect.extend({toMatchImageSnapshot})

describe('Visual Regression Testing',()=>{
    let browser
    let page

    beforeAll(async function(){
        browser = await puppeteer.launch({
            headless: "new"
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
    })

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
    })
})