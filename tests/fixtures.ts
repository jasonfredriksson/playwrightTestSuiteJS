import { test as shTest } from 'playwright-self-healing';
import { expect } from '@playwright/test';
import { TestData } from '../types/test-data.types';
import rawTestData from './test-data.json';

type CustomFixtures = {
  testData: TestData;
};

export const test = shTest.extend<CustomFixtures>({
  testData: async ({}, use) => {
    await use(rawTestData as TestData);
  },
});

export { expect };
