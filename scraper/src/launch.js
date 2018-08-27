const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const rng = require('./rng');

var url = 'https://www.instagram.com/accounts/login/?hl=en';


var needToLogin = true;
let sessionCookies;

function getRandFileName() {
  return './jsonData/' + String.fromCharCode(97 + rng(26)) + String.fromCharCode(97 + rng(26)) + String.fromCharCode(97 + rng(26)) + String.fromCharCode(97 + rng(26)) + String.fromCharCode(97 + rng(26)) + String.fromCharCode(97 + rng(26)) + '.json'
}
module.exports = async (sessionCookies) => {
  console.log('launching browser');
  const browser = await puppeteer.launch({headless: false, defaultViewport:{width: 1920, height: 1080}});
  console.log('opening page');
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  await page.on('request', async interceptedRequest => {
    if (interceptedRequest.method() === 'GET' && interceptedRequest.url().endsWith('%7D')){
      //console.log(interceptedRequest.url())
      // const jsonData = await fetch(interceptedRequest.url());
      // console.log(jsonData)


      interceptedRequest.continue();
    }
    else
      interceptedRequest.continue();
  });

  console.log('going to instagram');
  if (sessionCookies) {
    await page.setCookie(...sessionCookies)
    url = 'https://www.instagram.com'
    needToLogin = false;
  }

  await page.goto(url);
  console.log('waiting for dynamic content to load');
  await page.waitFor(1000)
  return {browser: browser, page: page, needToLogin };
}
