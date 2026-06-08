import { Page } from '@playwright/test';
import { HealablePage } from 'playwright-self-healing';
import { CustomerLocators } from './CustomerLocators';
import { CustomerActions } from './CustomerActions';

export class CustomerPage {
  readonly page: Page;
  readonly locators: CustomerLocators;
  readonly actions: CustomerActions;

  constructor(healablePage: HealablePage) {
    this.page = healablePage.page;
    this.locators = new CustomerLocators(this.page);
    this.actions = new CustomerActions(healablePage);
  }
}
