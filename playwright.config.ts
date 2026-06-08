import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['playwright-self-healing/reporter'],
  ],
  use: {
    headless: process.env.HEADLESS === 'true',
    // @ts-ignore — healingConfig is a custom worker-scoped fixture option from playwright-self-healing
    healingConfig: {
      verbose: true,
      confidenceThreshold: 0.75,
      maxHealsPerTest: 3,
      maxHealsPerRun: 15,
    },
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  outputDir: 'test-results',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
