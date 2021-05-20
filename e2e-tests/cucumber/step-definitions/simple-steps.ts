import { Given, When, Then } from '@cucumber/cucumber'
import * as assert from 'assert'

Given("a variable set to {int}", function (number) {
  console.log(`variable set to ${number}`)
  this.setTo(number);
});

When("I increment the variable by {int}", function (number) {
  console.log(`variable increment by ${number}`)
  this.incrementBy(number);
});

Then("the variable should contain {int}", function (number) {
  assert.strictEqual(this.variable, number);
});
