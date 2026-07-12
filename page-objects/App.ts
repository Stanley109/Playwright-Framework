import {Page} from "@playwright/test";
import { SpanishCardsClassStyle } from "./Spanish-Cards-Class-Style";


export class App {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public get spanishCardsClassStyle(): SpanishCardsClassStyle {
        return new SpanishCardsClassStyle(this.page);
    }
}