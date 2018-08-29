const typeElement = require('./typeElement');
const log = require('./log');

module.exports = async function findUserPage({ browser }, pageName) {
  const page = await browser.newPage();
  log('going to instagram');

  await page.goto(`https://www.instagram.com/${pageName}/`);
  log('waiting for dynamic content to load');
  await page.waitForSelector('main > div > header > section > div > h1');
  return { browser, page, frame: page.mainFrame() };
};
