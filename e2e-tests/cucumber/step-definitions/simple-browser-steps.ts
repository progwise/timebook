import {AfterAll, BeforeAll, Given, When} from "@cucumber/cucumber";
import {Browser, launch, Page} from 'puppeteer'
import { expect } from 'chai';
import 'chai/register-should';

let browser: Browser
let page: Page

BeforeAll(async () => {
  browser = await launch({headless: false})
  page = (await browser.pages())[0]
})

AfterAll(async () => {
  // await page.close()
  // await browser.close()
})

Given('I navigate to {string}', async (url: string) => {
   if (!url.startsWith('http'))
     url = 'http://' + url
  await page.goto(url)
});

Given(/^Press the \{string} button$/, async  (label: string) => {
  const [button] = await page.$x(`//button[contains(., \'${label}\')]`)
  expect(button).to.be.not.equal(null, `button ${label} was not found`)
  await button.click()
});

Given(/^Press the \'(.*)\' button if it exists$/, async  (label: string) => {
  const [button] = await page.$x(`//button[contains(., \'${label}\')]`)
  if (!button)
    return;
  await button.click()
});

When('I type the term {string} into the {string} box',  async (term: string, box: string) => {
  const [input] = await page.$x(`//input[@title='${box}']`)
  expect(input).to.be.not.equal(null, `input ${box} was not found`)
  await input.click({clickCount: 3})
  await input.type(term, {delay: 30})
});



