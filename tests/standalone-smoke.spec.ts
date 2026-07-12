import { test, expect, Page } from '@playwright/test';
import { App } from '../page-objects/App';

test.describe('Spanish Cards standalone tests', {tag: ['@standalone', '@regression']}, () => {

    test.describe.configure({ mode: 'default' });
    let app: App;
    let page: any;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        app = new App(page);
        await page.goto('/')
        await page.waitForLoadState('networkidle')
    })

    test.afterEach(async () => {
        page.close()
    })

    test('Next button is visible', async () => {
        await app.spanishCardsClassStyle.verifyNextButtonIsVisible();
        test.setTimeout(5000);              //set the timeout of the test duration
        await page.waitForTimeout(2000);    //literally pause the playwright for x seconds
    })

    test('Previous button is visible', async () => {
        await app.spanishCardsClassStyle.verifyPreviousButtonIsVisible();
        await page.waitForTimeout(2000);
    })

    test('Random Card button is visible after 3 iterations', async () => {
        
        await test.step("check if random card button is visible", async () =>{
            await app.spanishCardsClassStyle.verifyRandomCardButtonIsVisible();
        })

        await test.step("iterate through the cards", async () => {
            await app.spanishCardsClassStyle.verifyRandomCardButtonIsVisibleafterThreeIterations();
        })

        await page.waitForTimeout(2000);
    })

    test('Card counter increases or decreases accordingly', async () => {

        await test.step("check if random card button is visible", async () =>{
            await app.spanishCardsClassStyle.verifyRandomCardButtonIsVisible();
        })

        await test.step("randomize cards then iterate 3x next then 3x previous", async () =>{
            await app.spanishCardsClassStyle.verifyCardCounterIncreaseOrDescreaseAccordingly();
            await page.waitForTimeout(2000);
        })
    })
})
