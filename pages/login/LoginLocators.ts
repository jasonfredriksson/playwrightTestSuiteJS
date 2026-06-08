import { Page, Locator } from '@playwright/test';
import { BaseLocators } from '../base/BaseLocators';

export class LoginLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  get customerLoginButton(): Locator {
    return this.page.getByRole('button', { name: 'Customer Login' });
  }

  get bankManagerLoginButton(): Locator {
    return this.page.getByRole('button', { name: 'Bank Manager Login' });
  }
}
