import { test, expect } from '@playwright/test';
import { App } from '../page-objects/App';
import utils from '../utils/utils';

test.describe('Spanish Cards - all test coupled in 1 browser', {tag: ['@coupled', '@regression']}, () => {

    test.describe.configure({ mode: 'default' });
    let app: App;
    let page: any;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        app = new App(page);
        await page.goto('/')
        await page.waitForLoadState('networkidle')
    })

    test.afterAll(async () => {
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

    test('Parse some json data and random generation data', async()=>{
        //parse json data generation
        let userData = require('../test-data/test-data.json');
        console.log(`json data: ${userData.Details.accounts.account1}`);
        console.log(`json data: ${userData.Details.accounts.multipleAccount3[0]}`);
        console.log(`json data: ${userData.Details.accounts.multipleObjects[1].test3}`);

        //handling complex json
        console.log('handling complex json:', userData.Details.accounts.multipleObjects[1]);

        // using find()
        const foundObject = userData.Details.accounts.multipleObjects.find((item:any) => item.test3 !== undefined);
        
        // Output: Found Object: { test3: 'test 3' }
        console.log('Found Object:', foundObject);
        
        // Output: The value is: test 3
        console.log('The value is:', foundObject.test3);
        
        //random data generation
        console.log(`random data using in util file: ${utils.generateRandomCharacters(5)}`);
    })
})
