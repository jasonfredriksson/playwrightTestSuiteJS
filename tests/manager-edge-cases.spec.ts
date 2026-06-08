import { test, expect } from './fixtures';
import { HealablePage } from 'playwright-self-healing';
import { ManagerPage } from '../pages/manager/ManagerPage';
import { LoginPage } from '../pages/login/LoginPage';
import { ManagerCustomer } from '../types/test-data.types';

async function managerLogin(
  healablePage: HealablePage
): Promise<{ loginPage: LoginPage; managerPage: ManagerPage }> {
  const loginPage = new LoginPage(healablePage);
  const managerPage = new ManagerPage(healablePage);
  await loginPage.actions.navigate();
  await loginPage.actions.clickBankManagerLogin();
  await expect(healablePage.page).toHaveURL(/#\/manager/);
  return { loginPage, managerPage };
}

async function addCustomer(
  healablePage: HealablePage,
  managerPage: ManagerPage,
  customer: ManagerCustomer
): Promise<void> {
  await managerPage.actions.clickAddCustomer();
  await managerPage.locators.firstNameInput.fill(customer.first_name);
  await managerPage.locators.lastNameInput.fill(customer.last_name);
  await managerPage.locators.postCodeInput.fill(customer.postcode);
  healablePage.page.once('dialog', (d) => d.accept());
  await managerPage.locators.addCustomerSubmitButton.click();
}

async function openAccount(
  healablePage: HealablePage,
  managerPage: ManagerPage,
  customer: ManagerCustomer,
  currency: string
): Promise<void> {
  await managerPage.actions.clickOpenAccount();
  const fullName = `${customer.first_name} ${customer.last_name}`;
  await managerPage.locators.customerSelectDropdown.selectOption({ label: fullName });
  await managerPage.locators.currencySelectDropdown.selectOption({ label: currency });
  healablePage.page.once('dialog', (d) => d.accept());
  await managerPage.locators.processButton.click();
}

test.describe('Manager Edge Cases', () => {
  // ── Navigation ──────────────────────────────────────────────────────────────

  test('home button returns to login page', async ({ healablePage }) => {
    console.log('\n[INFO] Starting test: Home button returns to login');
    const { managerPage } = await managerLogin(healablePage);

    console.log('[INFO] Clicking Home');
    await managerPage.locators.homeButton.click();

    await expect(healablePage.page).toHaveURL(/#\/login/);
    const loginPage = new LoginPage(healablePage);
    await expect(loginPage.locators.customerLoginButton).toBeVisible();
    await expect(loginPage.locators.bankManagerLoginButton).toBeVisible();

    console.log('[INFO] Test completed successfully');
  });

  // ── Customer table ──────────────────────────────────────────────────────────

  test('customer table has correct column headers', async ({ healablePage }) => {
    console.log('\n[INFO] Starting test: Customer table column headers');
    const { managerPage } = await managerLogin(healablePage);

    await managerPage.actions.clickCustomers();
    // Wait for the first table row (header or data — the table renders before thead th)
    await healablePage.page.locator('table tr').first().waitFor({ state: 'visible', timeout: 10000 });

    // The Banking Project uses td elements for column headers (not th), so check
    // that all expected header strings are present in the first row.
    const expectedHeaders = ['First Name', 'Last Name', 'Post Code', 'Account Number', 'Delete'];
    const headerRow = healablePage.page.locator('table tr').first();
    for (const header of expectedHeaders) {
      await expect(headerRow).toContainText(header, { timeout: 10000 });
      console.log(`[INFO] Found column: ${header}`);
    }

    console.log('[INFO] Test completed successfully');
  });

  test('customer row count increases after add', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Row count increases after adding customer');
    const { managerPage } = await managerLogin(healablePage);
    const customer = testData.manager_customers.count_test;

    await managerPage.actions.clickCustomers();
    await healablePage.page.waitForSelector('tbody tr');
    const rowsBefore = await healablePage.page.locator('tbody tr').count();
    console.log(`[INFO] Rows before add: ${rowsBefore}`);

    await addCustomer(healablePage, managerPage, customer);

    await managerPage.actions.clickCustomers();
    await healablePage.page.waitForSelector('tbody tr');
    const rowsAfter = await healablePage.page.locator('tbody tr').count();
    console.log(`[INFO] Rows after add: ${rowsAfter}`);

    expect(rowsAfter).toBe(rowsBefore + 1);

    console.log('[INFO] Test completed successfully');
  });

  test('customer search filters table results', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Customer search filters results');
    const { managerPage } = await managerLogin(healablePage);
    const customer = testData.manager_customers.search_test;

    await addCustomer(healablePage, managerPage, customer);
    await managerPage.actions.clickCustomers();
    await healablePage.page.waitForSelector('tbody tr');
    const totalRows = await healablePage.page.locator('tbody tr').count();
    console.log(`[INFO] Total rows before filtering: ${totalRows}`);

    console.log(`[INFO] Searching for: ${customer.first_name}`);
    const searchInput = healablePage.page.getByPlaceholder('Search Customer');
    await searchInput.fill(customer.first_name);
    await healablePage.page.waitForTimeout(500);

    const filteredRows = await healablePage.page.locator('tbody tr').count();
    console.log(`[INFO] Rows after filtering: ${filteredRows}`);

    expect(filteredRows).toBeLessThan(totalRows);
    const matchingRow = healablePage.page.locator(
      `tbody tr:has-text('${customer.first_name}'):has-text('${customer.last_name}')`
    );
    await expect(matchingRow).toBeVisible();

    console.log('[INFO] Test completed successfully');
  });

  test('duplicate customer add does not crash', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Duplicate customer add handled gracefully');
    const { managerPage } = await managerLogin(healablePage);
    const customer = testData.manager_customers.duplicate_test;

    console.log('[INFO] Adding customer for the first time');
    await addCustomer(healablePage, managerPage, customer);

    console.log('[INFO] Adding same customer again');
    await addCustomer(healablePage, managerPage, customer);

    await managerPage.actions.clickCustomers();
    await healablePage.page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 10000 });

    const rows = healablePage.page.locator(
      `tbody tr:has-text('${customer.first_name}'):has-text('${customer.last_name}')`
    );
    const count = await rows.count();
    console.log(`[INFO] Found ${count} row(s) for duplicate customer — app handled gracefully`);
    expect(count).toBeGreaterThanOrEqual(1);

    console.log('[INFO] Test completed successfully');
  });

  // ── Account management ──────────────────────────────────────────────────────

  test('open accounts in all three currencies', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Open accounts in all three currencies');
    const { managerPage } = await managerLogin(healablePage);
    const customer = testData.manager_customers.all_currencies_test;

    await addCustomer(healablePage, managerPage, customer);

    const currencies = [testData.currencies.dollar, testData.currencies.pound, testData.currencies.rupee];
    for (const currency of currencies) {
      console.log(`[INFO] Opening ${currency} account`);
      await openAccount(healablePage, managerPage, customer, currency);
    }

    await managerPage.actions.clickCustomers();
    const customerRow = healablePage.page
      .locator(`tbody tr:has-text('${customer.first_name}'):has-text('${customer.last_name}')`)
      .last();
    const accountCell = customerRow.locator('td').nth(3);
    await expect(accountCell).not.toBeEmpty();

    console.log('[INFO] Test completed successfully');
  });

  const currencyKeys = ['dollar', 'pound', 'rupee'] as const;

  for (const currencyKey of currencyKeys) {
    test(`open account sets non-empty account number - ${currencyKey}`, async ({ healablePage, testData }) => {
      console.log(`\n[INFO] Starting test: Open account — currency: ${currencyKey}`);
      const { managerPage } = await managerLogin(healablePage);

      const currency = testData.currencies[currencyKey];
      const customer: ManagerCustomer = {
        first_name: `AC${currencyKey.charAt(0).toUpperCase() + currencyKey.slice(1)}`,
        last_name: 'Edge',
        postcode: '00100',
      };

      await addCustomer(healablePage, managerPage, customer);
      await openAccount(healablePage, managerPage, customer, currency);

      await managerPage.actions.clickCustomers();
      const customerRow = healablePage.page
        .locator(`tbody tr:has-text('${customer.first_name}'):has-text('${customer.last_name}')`)
        .last();
      const accountCell = customerRow.locator('td').nth(3);
      await expect(accountCell).not.toBeEmpty();

      console.log(`[INFO] Account number assigned for ${currency} account`);
      console.log('[INFO] Test completed successfully');
    });
  }

  // ── Form validation ─────────────────────────────────────────────────────────

  const missingFieldCases = [
    { missingField: 'first_name', fillFirst: '', fillLast: 'Validation', fillPost: '10000' },
    { missingField: 'last_name', fillFirst: 'Val', fillLast: '', fillPost: '10001' },
    { missingField: 'postcode', fillFirst: 'Val', fillLast: 'Validation', fillPost: '' },
  ] as const;

  for (const { missingField, fillFirst, fillLast, fillPost } of missingFieldCases) {
    test(`add customer with missing ${missingField} does not add row`, async ({ healablePage }) => {
      console.log(`\n[INFO] Starting test: Add customer — missing field: ${missingField}`);
      const { managerPage } = await managerLogin(healablePage);

      await managerPage.actions.clickCustomers();
      await healablePage.page.waitForSelector('tbody tr');
      const rowsBefore = await healablePage.page.locator('tbody tr').count();
      console.log(`[INFO] Rows before attempt: ${rowsBefore}`);

      await managerPage.actions.clickAddCustomer();
      if (fillFirst) await managerPage.locators.firstNameInput.fill(fillFirst);
      if (fillLast) await managerPage.locators.lastNameInput.fill(fillLast);
      if (fillPost) await managerPage.locators.postCodeInput.fill(fillPost);

      await managerPage.locators.addCustomerSubmitButton.click();
      await healablePage.page.waitForTimeout(800);

      await managerPage.actions.clickCustomers();
      await healablePage.page.waitForSelector('tbody tr');
      const rowsAfter = await healablePage.page.locator('tbody tr').count();
      console.log(`[INFO] Rows after attempt: ${rowsAfter}`);

      expect(rowsAfter).toBe(rowsBefore);

      console.log('[INFO] Test completed successfully');
    });
  }
});
