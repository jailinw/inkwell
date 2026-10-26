// @ts-check
import {
  defineConfig,
  devices
} from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from "dotenv";
// import path from "path";
// dotenv.config({
//   path: path.resolve(__dirname, ".env")
// });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI
    ? 2
    : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI
    ? 1
    : undefined,

  /* Reporter to use. */
  reporter: "html",

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL can be added later if desired. */
    // baseURL: "http://localhost:5173",

    /* Collect trace when retrying failed tests. */
    trace: "on-first-retry"
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"]
      }
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"]
      }
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"]
      }
    }

    /*
     * The mobile/tablet/desktop viewport testing
     * for Workshop 14 is handled directly inside
     * e2e/publish-flow.spec.js.
     */
  ],

  /* Start both local dev servers before running tests */
  webServer: [
    {
      command: "npm run dev",
      cwd: "./server",
      port: 4000,
      reuseExistingServer:
        !process.env.CI
    },

    {
      command: "npm run dev",
      cwd: "./client",
      url: "http://localhost:5173",
      reuseExistingServer:
        !process.env.CI
    }
  ]
});