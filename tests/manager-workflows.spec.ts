import { test, expect } from './fixtures';
import { LoginPage } from '../pages/login/LoginPage';
import { ManagerPage } from '../pages/manager/ManagerPage';

test.describe('Manager Workflows', () => {
  test('manager login and verify actions', async ({ healablePage }) => {
    console.log('\n[INFO] Starting test: Manager login and verify actions');
    const loginPage = new LoginPage(healablePage);
    const managerPage = new ManagerPage(healablePage);

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();

    console.log('[INFO] Clicking Bank Manager login button');
    await loginPage.actions.clickBankManagerLogin();

    console.log('[INFO] Verifying manager page loaded');
    await expect(healablePage.page).toHaveURL(/#\/manager/);
    await expect(managerPage.locators.addCustomerButton).toBeVisible();
    await expect(managerPage.locators.openAccountButton).toBeVisible();
    await expect(managerPage.locators.customersButton).toBeVisible();

    console.log('[INFO] Test completed successfully');
  });

  test('add customer and verify in table', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Add customer and verify in table');
    const loginPage = new LoginPage(healablePage);
    const managerPage = new ManagerPage(healablePage);

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickBankManagerLogin();

    const customer = testData.manager_customers.john_doe;
    console.log(`[INFO] Adding customer: ${customer.first_name} ${customer.last_name}`);

    await managerPage.actions.clickAddCustomer();
    await managerPage.locators.firstNameInput.fill(customer.first_name);
    await managerPage.locators.lastNameInput.fill(customer.last_name);
    await managerPage.locators.postCodeInput.fill(customer.postcode);

    console.log('[INFO] Submitting customer form');
    healablePage.page.once('dialog', (dialog) => dialog.accept());
    await managerPage.locators.addCustomerSubmitButton.click();

    console.log('[INFO] Navigating to customers page');
    await managerPage.actions.clickCustomers();

    console.log('[INFO] Verifying customer appears in table');
    const customerRow = healablePage.page
      .locator(`tbody tr:has-text('${customer.first_name}'):has-text('${customer.last_name}')`)
      .last();
    await expect(customerRow).toBeVisible();

    console.log('[INFO] Verifying account number field is empty');
    const accountNumberCell = customerRow.locator('td').nth(3);
    await expect(accountNumberCell).toBeEmpty();

    console.log('[INFO] Test completed successfully');
  });

  test('add account and verify account number', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Add account and verify account number');
    const loginPage = new LoginPage(healablePage);
    const managerPage = new ManagerPage(healablePage);

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickBankManagerLogin();

    const customer = testData.manager_customers.jane_smith;
    const currency = testData.currencies.dollar;

    console.log(`[INFO] Adding customer: ${customer.first_name} ${customer.last_name}`);
    await managerPage.actions.clickAddCustomer();
    await managerPage.locators.firstNameInput.fill(customer.first_name);
    await managerPage.locators.lastNameInput.fill(customer.last_name);
    await managerPage.locators.postCodeInput.fill(customer.postcode);

    console.log('[INFO] Submitting customer form');
    healablePage.page.once('dialog', (dialog) => dialog.accept());
    await managerPage.locators.addCustomerSubmitButton.click();

    console.log('[INFO] Opening account for customer');
    await managerPage.actions.clickOpenAccount();

    const customerName = `${customer.first_name} ${customer.last_name}`;
    await managerPage.locators.customerSelectDropdown.selectOption({ label: customerName });
    await managerPage.locators.currencySelectDropdown.selectOption({ label: currency });

    console.log(`[INFO] Processing account with currency: ${currency}`);
    healablePage.page.once('dialog', (dialog) => dialog.accept());
    await managerPage.locators.processButton.click();

    console.log('[INFO] Navigating to customers page');
    await managerPage.actions.clickCustomers();

    console.log('[INFO] Verifying customer appears in table with account number');
    const customerRow = healablePage.page
      .locator(`tbody tr:has-text('${customer.first_name}'):has-text('${customer.last_name}')`)
      .last();
    const accountNumberCell = customerRow.locator('td').nth(3);
    await expect(accountNumberCell).not.toBeEmpty();

    console.log('[INFO] Test completed successfully');
  });

  test('delete customer', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Delete customer');
    const loginPage = new LoginPage(healablePage);
    const managerPage = new ManagerPage(healablePage);

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickBankManagerLogin();

    const customer = testData.manager_customers.delete_test;
    console.log(`[INFO] Adding customer: ${customer.first_name} ${customer.last_name}`);

    await managerPage.actions.clickAddCustomer();
    await managerPage.locators.firstNameInput.fill(customer.first_name);
    await managerPage.locators.lastNameInput.fill(customer.last_name);
    await managerPage.locators.postCodeInput.fill(customer.postcode);

    console.log('[INFO] Submitting customer form');
    healablePage.page.once('dialog', (dialog) => dialog.accept());
    await managerPage.locators.addCustomerSubmitButton.click();

    console.log('[INFO] Navigating to customers page');
    await managerPage.actions.clickCustomers();

    console.log('[INFO] Verifying customer appears in table');
    const customerRow = healablePage.page
      .locator(`tbody tr:has-text('${customer.first_name}'):has-text('${customer.last_name}')`)
      .last();
    await expect(customerRow).toBeVisible();

    console.log('[INFO] Deleting customer');
    await managerPage.actions.deleteCustomer(customer.first_name, customer.last_name, customer.postcode);

    console.log('[INFO] Verifying customer is removed from table');
    const deletedRow = healablePage.page.locator(
      `tbody tr:has-text('${customer.first_name}'):has-text('${customer.last_name}'):has-text('${customer.postcode}')`
    );
    await expect(deletedRow).not.toBeVisible();

    console.log('[INFO] Test completed successfully');
  });
});
