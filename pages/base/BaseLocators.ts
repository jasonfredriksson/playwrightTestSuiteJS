import { Page, Locator } from '@playwright/test';

export class BaseLocators {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get homeButton(): Locator {
    return this.page.getByRole('button', { name: 'Home' });
  }

  get logoutButton(): Locator {
    return this.page.getByRole('button', { name: 'Logout' });
  }
}
