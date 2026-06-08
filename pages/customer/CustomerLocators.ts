import { Page, Locator } from '@playwright/test';
import { BaseLocators } from '../base/BaseLocators';

export class CustomerLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  get userSelectDropdown(): Locator {
    return this.page.locator('#userSelect');
  }

  get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login' });
  }

  get yourNameLabel(): Locator {
    return this.page.getByText('Your Name :');
  }

  get logoutButton(): Locator {
    return this.page.getByRole('button', { name: 'Logout' });
  }

  get welcomeMessage(): Locator {
    return this.page.locator('span.fontBig');
  }

  get accountNumber(): Locator {
    return this.page.locator('strong.ng-binding').first();
  }

  get balance(): Locator {
    return this.page.locator('strong.ng-binding').nth(1);
  }

  get currency(): Locator {
    return this.page.locator('strong.ng-binding').nth(2);
  }

  get transactionsButton(): Locator {
    return this.page.getByRole('button', { name: 'Transactions' });
  }

  get depositButton(): Locator {
    return this.page.locator("button.btn-lg.tab:has-text('Deposit')");
  }

  get withdrawlButton(): Locator {
    return this.page.getByRole('button', { name: 'Withdrawl' });
  }

  get amountInput(): Locator {
    return this.page.getByPlaceholder('amount');
  }

  get depositLabel(): Locator {
    return this.page.getByText('Amount to be Deposited :');
  }

  get withdrawalLabel(): Locator {
    return this.page.getByText('Amount to be Withdrawn :');
  }

  get depositConfirmButton(): Locator {
    return this.page.locator("form[ng-submit='deposit()'] button[type='submit']");
  }

  get withdrawConfirmButton(): Locator {
    return this.page.getByRole('button', { name: 'Withdraw', exact: false }).last();
  }

  get successMessage(): Locator {
    return this.page.locator("span[ng-show='message']");
  }

  get accountSelectDropdown(): Locator {
    return this.page.locator('#accountSelect');
  }
}
