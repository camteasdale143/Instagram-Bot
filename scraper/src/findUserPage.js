const typeElement = require('./typeElement');


module.exports = async function findUserPage({page, frame}, pageName) {
  console.log(`Searching for the account named ${pageName}`);
  await typeElement({page, frame}, '[placeholder=Search]', pageName)
  console.log('clicking on first search result of the search results')
  await page.waitForSelector(`.Ap253:first-child`);
  await page.waitFor(2000);
  await frame.click('.Ap253:first-child');
  console.log('waiting for navigation');
  await page.waitForNavigation();
}
