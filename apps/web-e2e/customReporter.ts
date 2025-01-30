// https://playwright.dev/docs/test-reporters#custom-reporters
import { Reporter, TestResult, TestCase } from '@playwright/test/reporter'

class CustomReporter implements Reporter {
  onTestEnd(_test: TestCase, result: TestResult) {
    if (result.status === 'passed' && result.retry > 0) {
      // Suppress errors if the test passed after retries
      result.errors = []
    }
  }
}

export default CustomReporter
