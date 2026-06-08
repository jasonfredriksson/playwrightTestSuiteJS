import { HealablePage } from 'playwright-self-healing';
import { BaseActions } from '../base/BaseActions';
import { CustomerLocators } from './CustomerLocators';

export class CustomerActions extends BaseActions {
  private readonly customerLocators: CustomerLocators;

  constructor(healablePage: HealablePage) {
    super(healablePage);
    this.customerLocators = new CustomerLocators(this.page);
  }

  async selectUserByName(name: string): Promise<void> {
    await this.healablePage.locator('#userSelect').selectOption({ label: name });
  }

  async clickLogin(): Promise<void> {
    await this.healablePage.getByRole('button', { name: 'Login' }).click();
    await this.page.waitForURL('**/account');
  }

  async clickDeposit(): Promise<void> {
    await this.healablePage.locator("button.btn-lg.tab:has-text('Deposit')").click();
    await this.page.waitForSelector('text=Amount to be Deposited :', { state: 'visible', timeout: 3000 });
  }

  async fillDepositAmount(amount: string): Promise<void> {
    await this.healablePage.getByPlaceholder('amount').fill(amount);
  }

  async confirmDeposit(): Promise<void> {
    await this.healablePage.locator("form[ng-submit='deposit()'] button[type='submit']").click();
  }

  async clickWithdrawal(): Promise<void> {
    await this.healablePage.getByRole('button', { name: 'Withdrawl' }).click();
    await this.page.waitForSelector('text=Amount to be Withdrawn :', { state: 'visible', timeout: 3000 });
  }

  async fillWithdrawalAmount(amount: string): Promise<void> {
    // HealableLocator has no .clear() — fill('') clears the field
    await this.healablePage.getByPlaceholder('amount').fill('');
    await this.healablePage.getByPlaceholder('amount').fill(amount);
  }

  async confirmWithdrawal(): Promise<void> {
    // .last() requires a plain Locator — use page directly
    await this.page.getByRole('button', { name: 'Withdraw', exact: false }).last().click();
  }

  async getBalanceText(): Promise<string> {
    // .nth() requires a plain Locator — use page directly
    return (await this.page.locator('strong.ng-binding').nth(1).textContent()) ?? '0';
  }
}
