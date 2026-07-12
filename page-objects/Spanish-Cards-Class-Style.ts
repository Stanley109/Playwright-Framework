import {expect, Locator, Page} from "@playwright/test";

export class SpanishCardsClassStyle {

    private readonly nextButton: Locator;
    private readonly previousButton: Locator;
    private readonly cardCounter: Locator;
    private readonly randomCardButton: Locator;
    private readonly cardText: Locator;
    
    constructor(private page: Page) {
        
        this.nextButton = this.page.getByRole('button', { name: 'Next' });
       //this.nextButton = page.getByRole('button').filter({ hasText: 'Next' });  only use this if you want to narrow down an existing locator. This is for complex locators only.
        this.previousButton = this.page.getByText('Previous', { exact: true });
        this.cardCounter = this.page.getByTestId('counter');
        this.randomCardButton = this.page.locator('button:has-text("Random Card")');
        this.cardText = this.page.locator('//div[@data-testid="card-inner"]');
    }
    
    public async verifyNextButtonIsVisible() {
        //this is a better approach vs  isVisible().tobetruthy because built in assertions have retries
        expect(this.nextButton).toBeVisible();           
    }

    public async verifyPreviousButtonIsVisible() {
        //this is ok but isVisible() only checks once
        expect(await this.previousButton.isVisible()).toBeTruthy();   
    }

    public async verifyRandomCardButtonIsVisible() {
        expect(this.randomCardButton).toBeVisible(); 
    }

    public async verifyRandomCardButtonIsVisibleafterThreeIterations() {
        for (let i = 0; i < 3; i++) {
            await this.page.waitForTimeout(500);
            await this.randomCardButton.click();
        }
        expect(this.randomCardButton).toBeVisible();
    }

    public async verifyCardCounterIncreaseOrDescreaseAccordingly() {
        expect(await this.cardCounter.isVisible()).toBeTruthy();

        //click the random button
        await this.randomCardButton.click();

        //parse the card counter
        let cardText = await this.cardCounter.textContent() || '';
        let initialCardNum = parseInt((cardText.match(/^\d+/) || [])[0] || '0', 10);
        
        console.log(`text is: ${cardText}`);
        console.log(`initial num is: ${initialCardNum}`);
        
        let currentCardNum = initialCardNum;

        // click the next button 3 times and check if the card counter is correct each time
        for(let i = 1; i <= 3; i++){
            await this.page.waitForTimeout(500);
            await this.nextButton.click()
            currentCardNum++;
            if(currentCardNum > 15){
                currentCardNum = 1;         
                console.log(`current num after clicking next is: ${currentCardNum} / 15`);
                expect(this.cardCounter).toHaveText(`${currentCardNum} / 15`);
            }
            else {
                console.log(`current num after clicking next is: ${currentCardNum} / 15`);
                expect(this.cardCounter).toHaveText(`${currentCardNum} / 15`);           
            }
        }

        //click the random button again
        await this.page.waitForTimeout(500);
        await this.randomCardButton.click();


        //parse the card counter
        cardText = await this.cardCounter.textContent() || '';
        initialCardNum = parseInt((cardText.match(/^\d+/) || [])[0] || '0', 10);
        
        console.log(`text is: ${cardText}`);
        console.log(`initial num is: ${initialCardNum}`);

        currentCardNum = initialCardNum;

        // click the prev button 3 times and check if the card counter is correct each time
        for(let i = 1; i <= 3; i++){
            await this.page.waitForTimeout(500);
            await this.previousButton.click()
            currentCardNum--;
            if(currentCardNum < 1){
                currentCardNum = 15;
                console.log(`current num after clicking prev is: ${currentCardNum} / 15`);
                expect(this.cardCounter).toHaveText(`${currentCardNum} / 15`);        
            }
            else {
                console.log(`current num after clicking prev is: ${currentCardNum} / 15`);
                expect(this.cardCounter).toHaveText(`${currentCardNum} / 15`);
            }
        }

    }

    public async iterateAndFlipCards() {

    }
}