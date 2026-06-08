import { Page, Locator } from '@playwright/test';
import { BaseLocators } from '../base/BaseLocators';

export class ManagerLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  get addCustomerButton(): Locator {
    return this.page.getByRole('button', { name: 'Add Customer' }).first();
  }

  get openAccountButton(): Locator {
    return this.page.getByRole('button', { name: 'Open Account' });
  }

  get customersButton(): Locator {
    return this.page.getByRole('button', { name: 'Customers' });
  }

  get homeButton(): Locator {
    return this.page.getByRole('button', { name: 'Home' });
  }

  get firstNameInput(): Locator {
    return this.page.getByPlaceholder('First Name');
  }

  get lastNameInput(): Locator {
    return this.page.getByPlaceholder('Last Name');
  }

  get postCodeInput(): Locator {
    return this.page.getByPlaceholder('Post Code');
  }

  get addCustomerSubmitButton(): Locator {
    return this.page.getByRole('button', { name: 'Add Customer' }).nth(1);
  }

  get customerSelectDropdown(): Locator {
    return this.page.locator('#userSelect');
  }

  get currencySelectDropdown(): Locator {
    return this.page.locator('#currency');
  }

  get processButton(): Locator {
    return this.page.getByRole('button', { name: 'Process' });
  }
}
