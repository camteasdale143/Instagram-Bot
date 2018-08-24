const puppeteer = require('puppeteer');

module.exports = async (url) => {
  console.log('launching browser');
  const browser = await puppeteer.launch({defaultViewport:{width: 1920, height: 1080}});
  console.log('opening page');
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (interceptedRequest.method() === 'GET'){
      console.log(interceptedRequest.url())
      interceptedRequest.continue();
    }
    else
      interceptedRequest.continue();

  });
  console.log('going to instagram');
  await page.goto(url);
  console.log('waiting for dynamic content to load');
  await page.waitFor(1000)
  return {browser: browser, page: page};
}
