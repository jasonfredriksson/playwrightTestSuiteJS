import { Page } from '@playwright/test';
import { HealablePage } from 'playwright-self-healing';
import { BaseActions } from '../base/BaseActions';
import { LoginLocators } from './LoginLocators';

export class LoginActions extends BaseActions {
  private readonly loginLocators: LoginLocators;

  constructor(healablePage: HealablePage) {
    super(healablePage);
    this.loginLocators = new LoginLocators(this.page);
  }

  async navigate(): Promise<void> {
    await this.navigateTo();
  }

  async clickCustomerLogin(): Promise<void> {
    await this.healablePage.getByRole('button', { name: 'Customer Login' }).click();
    await this.page.waitForURL('**/customer');
  }

  async clickBankManagerLogin(): Promise<void> {
    await this.healablePage.getByRole('button', { name: 'Bank Manager Login' }).click();
    await this.page.waitForURL('**/manager');
  }
}
