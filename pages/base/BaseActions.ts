import 'dotenv/config';
import { Page } from '@playwright/test';
import { HealablePage } from 'playwright-self-healing';
import { BaseLocators } from './BaseLocators';

export class BaseActions {
  protected page: Page;
  protected healablePage: HealablePage;
  protected locators: BaseLocators;
  protected baseUrl: string;

  constructor(healablePage: HealablePage) {
    this.healablePage = healablePage;
    this.page = healablePage.page;
    this.locators = new BaseLocators(this.page);
    this.baseUrl = process.env.BASE_URL ?? 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/';
  }

  async navigateTo(path: string = ''): Promise<void> {
    await this.healablePage.goto(`${this.baseUrl}${path}`);
    await this.healablePage.waitForLoadState('networkidle');
  }

  async waitForUrl(urlPattern: string): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }

  async clickHome(): Promise<void> {
    await this.healablePage.getByRole('button', { name: 'Home' }).click();
    await this.waitForUrl('**/login');
  }

  async clickLogout(): Promise<void> {
    await this.healablePage.getByRole('button', { name: 'Logout' }).click();
    await this.waitForUrl('**/login');
  }
}
