const puppeteer = require('puppeteer');
const log = require('./log');
// const fs = require('fs');
// const axios = require('axios');
// const rng = require('./rng');

const url = 'https://www.instagram.com/accounts/login/?hl=en';

const needToLogin = true;

module.exports = async () => {
  log('launching browser');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });
  log('opening page');
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  await page.on('request', async (interceptedRequest) => {
    if (interceptedRequest.method() === 'GET' && interceptedRequest.url().endsWith('%7D')) {
      // console.log(interceptedRequest.url())
      // const jsonData = await fetch(interceptedRequest.url());
      // console.log(jsonData)

      interceptedRequest.continue();
    } else interceptedRequest.continue();
  });

  log('going to instagram');

  await page.goto(url);
  log('waiting for dynamic content to load');
  await page.waitFor(1000);
  return { browser, page, needToLogin };
};
