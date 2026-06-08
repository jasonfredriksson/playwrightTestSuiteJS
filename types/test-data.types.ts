export interface ManagerCustomer {
  first_name: string;
  last_name: string;
  postcode: string;
}

export interface TestData {
  customers: {
    harry_potter: string;
    hermoine_granger: string;
    ron_weasly: string;
  };
  manager_customers: {
    john_doe: ManagerCustomer;
    jane_smith: ManagerCustomer;
    delete_test: ManagerCustomer;
    all_currencies_test: ManagerCustomer;
    search_test: ManagerCustomer;
    count_test: ManagerCustomer;
    duplicate_test: ManagerCustomer;
    empty_fields_test: ManagerCustomer;
  };
  amounts: {
    deposit_small: string;
    deposit_medium: string;
    deposit_large: string;
    deposit_xlarge: string;
    withdrawal_small: string;
    withdrawal_medium: string;
    withdrawal_large: string;
    withdrawal_xlarge: string;
    deposit_decimal: string;
  };
  currencies: {
    dollar: string;
    pound: string;
    rupee: string;
  };
  validation_messages: {
    deposit_successful: string;
    withdrawal_successful: string;
    customer_added: string;
    account_created: string;
  };
}
