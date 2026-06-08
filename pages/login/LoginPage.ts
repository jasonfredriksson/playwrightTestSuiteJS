import { Page } from '@playwright/test';
import { HealablePage } from 'playwright-self-healing';
import { LoginLocators } from './LoginLocators';
import { LoginActions } from './LoginActions';

export class LoginPage {
  readonly page: Page;
  readonly locators: LoginLocators;
  readonly actions: LoginActions;

  constructor(healablePage: HealablePage) {
    this.page = healablePage.page;
    this.locators = new LoginLocators(this.page);
    this.actions = new LoginActions(healablePage);
  }
}
