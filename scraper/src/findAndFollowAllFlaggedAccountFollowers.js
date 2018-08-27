const flaggedAccounts = require('../clientList');
const findUserPage = require('./findUserPage');
const log = require('./log');

async function followAllAccountFollowers({ page, frame }, pageName) {
  log('clicking the followers button');
  await page.waitFor(`a[href="/${pageName}/followers/"]`);
  await frame.click(`a[href="/${pageName}/followers/"]`);
  log('followers button clicked');
  await page.waitForSelector('[role="dialog"] > div > ul > div > li > div > div > button');
  console.log('loaded');

  await page.evaluate(() => {
    let numberOfPeopleFollowed = 0;
    const followButtons = document
      .querySelector('[role="presentation"]')
      .querySelector('ul')
      .querySelectorAll('button');
    followButtons.forEach((button) => {
      if (button.innerText === 'Follow') {
        button.click();
        numberOfPeopleFollowed += 1;
      }
    });
    console.log(`followed ${numberOfPeopleFollowed} people`);
  });
  await page.waitFor(1000);
  await page.keyboard.press('Escape');
}

module.exports = async function findAndFollowAllFlaggedAccountFollowers(browserInfo) {
  for (let i = 0; i < flaggedAccounts.length - 1; i += 1) {
    await findUserPage(browserInfo, flaggedAccounts[i]); // eslint-disable-line no-await-in-loop
    await followAllAccountFollowers(browserInfo, flaggedAccounts[i]); // eslint-disable-line
  }
  browserInfo.page.click('[href="/"]');
};
