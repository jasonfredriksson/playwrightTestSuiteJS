import { Page } from '@playwright/test';
import { HealablePage } from 'playwright-self-healing';
import { ManagerLocators } from './ManagerLocators';
import { ManagerActions } from './ManagerActions';

export class ManagerPage {
  readonly page: Page;
  readonly locators: ManagerLocators;
  readonly actions: ManagerActions;

  constructor(healablePage: HealablePage) {
    this.page = healablePage.page;
    this.locators = new ManagerLocators(this.page);
    this.actions = new ManagerActions(healablePage);
  }
}
