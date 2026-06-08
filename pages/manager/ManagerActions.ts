import { HealablePage } from 'playwright-self-healing';
import { BaseActions } from '../base/BaseActions';
import { ManagerLocators } from './ManagerLocators';

export class ManagerActions extends BaseActions {
  private readonly managerLocators: ManagerLocators;

  constructor(healablePage: HealablePage) {
    super(healablePage);
    this.managerLocators = new ManagerLocators(this.page);
  }

  async clickAddCustomer(): Promise<void> {
    // .first() requires a plain Locator — use page directly
    await this.page.getByRole('button', { name: 'Add Customer' }).first().click();
  }

  async clickOpenAccount(): Promise<void> {
    await this.healablePage.getByRole('button', { name: 'Open Account' }).click();
  }

  async clickCustomers(): Promise<void> {
    await this.healablePage.getByRole('button', { name: 'Customers' }).click();
  }

  async deleteCustomer(firstName: string, lastName: string, postcode: string): Promise<void> {
    // Complex chained selector — use page directly
    const customerRow = this.page.locator(
      `tbody tr:has-text('${firstName}'):has-text('${lastName}'):has-text('${postcode}')`
    );
    await customerRow.locator("button:has-text('Delete')").click();
  }
}
