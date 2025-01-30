/* eslint-disable no-console */
// https://playwright.dev/docs/test-reporters#custom-reporters
import { Reporter, TestResult, TestCase } from '@playwright/test/reporter'

class CustomReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Test "${test.title}" ended with status "${result.status}" and ${result.retry} retries.`)
    if (result.status === 'passed' && result.retry > 0) {
      // Suppress errors if the test passed after retries
      result.errors = []
      console.log(`Test "${test.title}" passed after ${result.retry} retries. Suppressing errors.`)
    }
  }
}

export default CustomReporter
