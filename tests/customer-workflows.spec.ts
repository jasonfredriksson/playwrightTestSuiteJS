import { test, expect } from './fixtures';
import { LoginPage } from '../pages/login/LoginPage';
import { CustomerPage } from '../pages/customer/CustomerPage';

test.describe('Customer Workflows', () => {
  test('login and verify welcome message', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Login and verify welcome message');
    const loginPage = new LoginPage(healablePage);
    const customerPage = new CustomerPage(healablePage);

    const customerName = testData.customers.harry_potter;

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();

    console.log('[INFO] Clicking customer login button');
    await loginPage.actions.clickCustomerLogin();

    console.log(`[INFO] Selecting user: ${customerName}`);
    await customerPage.actions.selectUserByName(customerName);

    console.log('[INFO] Clicking login button');
    await customerPage.actions.clickLogin();

    console.log('[INFO] Verifying account page loaded');
    await expect(healablePage.page).toHaveURL(/#\/account/);
    await expect(customerPage.locators.welcomeMessage).toBeVisible();

    console.log(`[INFO] Verifying welcome message contains: ${customerName}`);
    await expect(customerPage.locators.welcomeMessage).toContainText(customerName);

    console.log('[INFO] Test completed successfully');
  });

  test('deposit with success message', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Deposit with success message');
    const loginPage = new LoginPage(healablePage);
    const customerPage = new CustomerPage(healablePage);

    const customerName = testData.customers.hermoine_granger;
    const depositAmount = testData.amounts.deposit_small;

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickCustomerLogin();

    console.log(`[INFO] Selecting user: ${customerName}`);
    await customerPage.actions.selectUserByName(customerName);
    await customerPage.actions.clickLogin();

    console.log(`[INFO] Initiating deposit of ${depositAmount}`);
    await customerPage.actions.clickDeposit();
    await customerPage.actions.fillDepositAmount(depositAmount);
    await customerPage.actions.confirmDeposit();

    console.log('[INFO] Verifying deposit success message');
    await customerPage.locators.successMessage.waitFor({ state: 'visible', timeout: 5000 });
    await expect(customerPage.locators.successMessage).toHaveText('Deposit Successful');

    console.log('[INFO] Test completed successfully');
  });

  test('withdrawal with success message', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Withdrawal with success message');
    const loginPage = new LoginPage(healablePage);
    const customerPage = new CustomerPage(healablePage);

    const customerName = testData.customers.hermoine_granger;
    const depositAmount = testData.amounts.deposit_xlarge;
    const withdrawalAmount = testData.amounts.withdrawal_large;

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickCustomerLogin();

    console.log(`[INFO] Selecting user: ${customerName}`);
    await customerPage.actions.selectUserByName(customerName);
    await customerPage.actions.clickLogin();

    console.log(`[INFO] Depositing ${depositAmount} first`);
    await customerPage.actions.clickDeposit();
    await customerPage.actions.fillDepositAmount(depositAmount);
    await customerPage.actions.confirmDeposit();

    console.log(`[INFO] Withdrawing ${withdrawalAmount}`);
    await customerPage.actions.clickWithdrawal();
    await customerPage.actions.fillWithdrawalAmount(withdrawalAmount);
    await customerPage.actions.confirmWithdrawal();

    console.log('[INFO] Verifying withdrawal success message');
    await customerPage.locators.successMessage.waitFor({ state: 'visible', timeout: 5000 });
    await expect(customerPage.locators.successMessage).toHaveText('Transaction successful');

    console.log('[INFO] Test completed successfully');
  });

  test('multiple transactions validate balance', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Multiple transactions with balance validation');
    const loginPage = new LoginPage(healablePage);
    const customerPage = new CustomerPage(healablePage);

    const customerName = testData.customers.hermoine_granger;
    const amounts = testData.amounts;

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickCustomerLogin();

    console.log(`[INFO] Selecting user: ${customerName}`);
    await customerPage.actions.selectUserByName(customerName);
    await customerPage.actions.clickLogin();

    console.log('[INFO] Getting initial balance');
    const initialBalance = await customerPage.actions.getBalanceText();
    console.log(`[INFO] Initial balance: ${initialBalance}`);

    const deposits = [amounts.deposit_small, amounts.deposit_medium, amounts.deposit_large];
    for (const amount of deposits) {
      console.log(`[INFO] Performing deposit: ${amount}`);
      await customerPage.actions.clickDeposit();
      await customerPage.actions.fillDepositAmount(amount);
      await customerPage.actions.confirmDeposit();
      await customerPage.locators.successMessage.waitFor({ state: 'visible', timeout: 5000 });
      await expect(customerPage.locators.successMessage).toHaveText('Deposit Successful');
    }

    const withdrawals = [amounts.withdrawal_small, amounts.withdrawal_medium, amounts.withdrawal_large];
    for (const amount of withdrawals) {
      console.log(`[INFO] Performing withdrawal: ${amount}`);
      await customerPage.actions.clickWithdrawal();
      await customerPage.actions.fillWithdrawalAmount(amount);
      await customerPage.actions.confirmWithdrawal();
      await customerPage.locators.successMessage.waitFor({ state: 'visible', timeout: 5000 });
      await expect(customerPage.locators.successMessage).toHaveText('Transaction successful');
    }

    console.log('[INFO] Getting final balance');
    const finalBalance = await customerPage.actions.getBalanceText();
    console.log(`[INFO] Final balance: ${finalBalance}`);

    const expectedChange = 1000 + 2000 + 3000 - 500 - 750 - 1000;
    const actualChange = parseInt(finalBalance) - parseInt(initialBalance);
    console.log(`[INFO] Expected change: ${expectedChange}, Actual change: ${actualChange}`);
    expect(actualChange).toBe(expectedChange);

    console.log('[INFO] Test completed successfully');
  });
});
