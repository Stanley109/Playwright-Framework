import { test, expect, Page } from '@playwright/test';
import { App } from '../page-objects/App';

test.describe('Spanish Cards standalone tests', {tag: ['@standalone', '@regression']}, () => {

    test.describe.configure({ mode: 'default' });
    let app: App;
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        app = new App(page);
        await page.goto('/')
        await page.waitForLoadState('networkidle')
    })

    test.afterEach(async () =>{
        page.close();
    })

    test('Next button is visible', async () => {
        await app.spanishCardsClassStyle.verifyNextButtonisVisible();
        await page.waitForTimeout(3000);
    })

    test('Previous button is visible', async () => {
        await app.spanishCardsClassStyle.verifyPreviousButtonisVisible();
        await page.waitForTimeout(3000);
    })

    test('Random Card button is visible after 3 iterations', async () => {
        await app.spanishCardsClassStyle.verifyRandomCardButtonisVisibleafterThreeIterations();
        await page.waitForTimeout(3000);
    })

    test('Card counter increases or decreases accordingly', async () => {
        await app.spanishCardsClassStyle.verifyCardCounterIncreaseOrDescreaseAccordingly();
        await page.waitForTimeout(3000);
    })
})
