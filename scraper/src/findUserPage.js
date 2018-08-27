const typeElement = require('./typeElement');
const log = require('./log');

module.exports = async function findUserPage({ page, frame }, pageName) {
  log(`Searching for the account named ${pageName}`);
  await typeElement({ page, frame }, '[placeholder=Search]', pageName);

  await page.waitFor(
    name => document.querySelector('input[type=text]').parentNode.querySelector(`a[href="/${name}/"]`),
    {},
    pageName,
  );
  log('clicking on first search result of the search results');
  await page.evaluate((name) => {
    const targetedNode = document
      .querySelector('input[type=text]')
      .parentNode.querySelector(`a[href="/${name}/"]`);
    targetedNode.click();
  }, pageName);
  console.log('waiting for navigation');
  await page.waitForNavigation();
};
