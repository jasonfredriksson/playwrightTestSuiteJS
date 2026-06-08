import { test, expect } from './fixtures';
import { LoginPage } from '../pages/login/LoginPage';
import { CustomerPage } from '../pages/customer/CustomerPage';

test.describe('Negative Scenarios', () => {
  test('withdrawal exceeds balance (overdraft)', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Withdrawal exceeds balance (overdraft)');
    const loginPage = new LoginPage(healablePage);
    const customerPage = new CustomerPage(healablePage);

    const customerName = testData.customers.hermoine_granger;

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickCustomerLogin();

    console.log(`[INFO] Selecting user: ${customerName}`);
    await customerPage.actions.selectUserByName(customerName);
    await customerPage.actions.clickLogin();

    console.log('[INFO] Getting current balance');
    const balanceText = await customerPage.actions.getBalanceText();
    const currentBalance = parseInt(balanceText);
    console.log(`[INFO] Current balance: ${currentBalance}`);

    const overdraftAmount = String(currentBalance + 10000);
    console.log(`[INFO] Attempting to withdraw ${overdraftAmount} (exceeds balance)`);

    await customerPage.actions.clickWithdrawal();
    await customerPage.actions.fillWithdrawalAmount(overdraftAmount);
    await customerPage.actions.confirmWithdrawal();

    console.log('[INFO] Verifying overdraft error message appears');
    const errorMessage = healablePage.page.locator("span[ng-show='message']");
    await errorMessage.waitFor({ state: 'visible', timeout: 5000 });

    const messageText = (await errorMessage.textContent()) ?? '';
    expect(messageText.toLowerCase()).toMatch(/fail|insufficient/);

    console.log('[INFO] Verified overdraft is prevented');
    console.log('[INFO] Test completed successfully');
  });

  test('deposit with empty amount', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Deposit with empty amount');
    const loginPage = new LoginPage(healablePage);
    const customerPage = new CustomerPage(healablePage);

    const customerName = testData.customers.harry_potter;

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickCustomerLogin();

    console.log(`[INFO] Selecting user: ${customerName}`);
    await customerPage.actions.selectUserByName(customerName);
    await customerPage.actions.clickLogin();

    console.log('[INFO] Attempting deposit with empty amount');
    await customerPage.actions.clickDeposit();
    await customerPage.actions.confirmDeposit();

    console.log('[INFO] Verifying deposit button behavior with empty input');
    expect(healablePage.url()).toContain('#/account');

    console.log('[INFO] Verified empty amount is handled correctly');
    console.log('[INFO] Test completed successfully');
  });

  test('withdrawal with zero amount', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Withdrawal with zero amount');
    const loginPage = new LoginPage(healablePage);
    const customerPage = new CustomerPage(healablePage);

    const customerName = testData.customers.ron_weasly;

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickCustomerLogin();

    console.log(`[INFO] Selecting user: ${customerName}`);
    await customerPage.actions.selectUserByName(customerName);
    await customerPage.actions.clickLogin();

    console.log('[INFO] Getting initial balance');
    const initialBalance = parseInt(await customerPage.actions.getBalanceText());

    console.log('[INFO] Attempting withdrawal with zero amount');
    await customerPage.actions.clickWithdrawal();
    await customerPage.actions.fillWithdrawalAmount('0');
    await customerPage.actions.confirmWithdrawal();

    await healablePage.page.waitForTimeout(1000);

    console.log('[INFO] Verifying balance unchanged');
    const finalBalance = parseInt(await customerPage.actions.getBalanceText());
    expect(finalBalance).toBe(initialBalance);

    console.log('[INFO] Verified zero amount withdrawal is handled correctly');
    console.log('[INFO] Test completed successfully');
  });

  test('deposit with negative amount', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Deposit with negative amount');
    const loginPage = new LoginPage(healablePage);
    const customerPage = new CustomerPage(healablePage);

    const customerName = testData.customers.harry_potter;

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickCustomerLogin();

    console.log(`[INFO] Selecting user: ${customerName}`);
    await customerPage.actions.selectUserByName(customerName);
    await customerPage.actions.clickLogin();

    console.log('[INFO] Getting initial balance');
    const initialBalance = parseInt(await customerPage.actions.getBalanceText());

    console.log('[INFO] Attempting deposit with negative amount');
    await customerPage.actions.clickDeposit();
    await customerPage.actions.fillDepositAmount('-1000');
    await customerPage.actions.confirmDeposit();

    await healablePage.page.waitForTimeout(1000);

    console.log('[INFO] Verifying balance unchanged or error shown');
    const finalBalance = parseInt(await customerPage.actions.getBalanceText());
    expect(finalBalance).toBe(initialBalance);

    console.log('[INFO] Verified negative amount deposit is handled correctly');
    console.log('[INFO] Test completed successfully');
  });

  test('deposit with invalid characters (HTML5 input validation)', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Deposit with invalid characters (HTML5 validation)');
    const loginPage = new LoginPage(healablePage);
    const customerPage = new CustomerPage(healablePage);

    const customerName = testData.customers.hermoine_granger;

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickCustomerLogin();

    console.log(`[INFO] Selecting user: ${customerName}`);
    await customerPage.actions.selectUserByName(customerName);
    await customerPage.actions.clickLogin();

    console.log('[INFO] Clicking deposit button');
    await customerPage.actions.clickDeposit();

    console.log("[INFO] Verifying input field type is 'number'");
    const inputType = await customerPage.locators.amountInput.getAttribute('type');
    expect(inputType).toBe('number');

    console.log('[INFO] Verified HTML5 input validation is in place');
    console.log('[INFO] Test completed successfully');
  });

  test('very large deposit boundary', async ({ healablePage, testData }) => {
    console.log('\n[INFO] Starting test: Very large deposit (boundary)');
    const loginPage = new LoginPage(healablePage);
    const customerPage = new CustomerPage(healablePage);

    const customerName = testData.customers.ron_weasly;

    console.log('[INFO] Navigating to application');
    await loginPage.actions.navigate();
    await loginPage.actions.clickCustomerLogin();

    console.log(`[INFO] Selecting user: ${customerName}`);
    await customerPage.actions.selectUserByName(customerName);
    await customerPage.actions.clickLogin();

    console.log('[INFO] Getting initial balance');
    const initialBalance = parseInt(await customerPage.actions.getBalanceText());

    const largeAmount = '999999999';
    console.log(`[INFO] Attempting deposit with large amount: ${largeAmount}`);

    await customerPage.actions.clickDeposit();
    await customerPage.actions.fillDepositAmount(largeAmount);
    await customerPage.actions.confirmDeposit();

    await healablePage.page.waitForTimeout(2000);

    console.log('[INFO] Verifying transaction result');
    const finalBalance = parseInt(await customerPage.actions.getBalanceText());

    if (finalBalance > initialBalance) {
      expect(finalBalance).toBe(initialBalance + parseInt(largeAmount));
      console.log(`[INFO] Large deposit succeeded. New balance: ${finalBalance}`);
    } else {
      expect(finalBalance).toBe(initialBalance);
      console.log('[INFO] Large deposit was rejected (acceptable behavior)');
    }

    console.log('[INFO] Test completed successfully');
  });
});
