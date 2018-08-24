import puppeteer from 'puppeteer';

export default async (url) => {
  console.log('launching browser');
  const browser = await puppeteer.launch({defaultViewport:{width: 1920, height: 1080}});
  console.log('opening page');
  const page = await browser.newPage();
  console.log('going to instagram');
  await page.goto(url);
  console.log('waiting for dynamic content to load');
  await page.waitFor(1000)
  return page;
}
