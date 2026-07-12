import {expect, Locator, Page} from "@playwright/test";

export class SpanishCardsClassStyle {
    
    private readonly nextButton: Locator;
    private readonly previousButton: Locator;
    private readonly cardCounter: Locator;
    private readonly randomCardButton: Locator;
    private readonly cardText: Locator;
    

    constructor(private page: Page) {
        
        this.nextButton = this.page.getByRole('button', { name: 'Next' });
       //this.nextButton = this.page.getByRole('button').filter({ hasText: 'Next' });  only use this if you want to narrow down an existing locator. This is for complex locators only.
        this.previousButton = this.page.getByText('Previous', { exact: true });
        this.cardCounter = this.page.getByTestId('counter');
        this.randomCardButton = this.page.locator('button:has-text("Random Card")');
        this.cardText = this.page.locator('//div[@data-testid="card-inner"]');
    }
    
    public async verifyNextButtonisVisible() {
        expect(await this.nextButton.isVisible()).toBeTruthy();
    }

    public async verifyPreviousButtonisVisible() {
        expect(await this.previousButton.isVisible()).toBeTruthy();
    }

    public async verifyRandomCardButtonisVisible() {
        expect(await this.randomCardButton.isVisible()).toBeTruthy(); 
    }

    public async verifyRandomCardButtonisVisibleafterThreeIterations() {
        for (let i = 0; i < 3; i++) {
            await this.randomCardButton.click();
        }
        expect(await this.randomCardButton.isVisible()).toBeTruthy(); 
    }

    public async verifyCardCounterIncreaseOrDescreaseAccordingly() {
        expect(await this.cardCounter.isVisible()).toBeTruthy();
        await this.randomCardButton.click();
        let cardText = await this.cardCounter.textContent() || '';
        let currentCard = parseInt((cardText.match(/^\d+/) || [])[0] || '0', 10);
        console.log(`text is: ${cardText}`);
        console.log(`parsed text is: ${currentCard}`);

        
    }

    public async iterateThroughCards() {

    }
}