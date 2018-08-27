const flaggedAccounts = require('../clientList');
const findUserPage = require('./findUserPage');
const log = require('./log');

async function followAllAccountFollowers({ page, frame }) {
  log('clicking the followers button');
  await frame.click('a.-nal3 :first-child');
  await page.waitFor(2000); // bad practice

  await page.evaluate(() => {
    let numberOfPeopleFollowed = 0;
    const elements = document.querySelectorAll('button.L3NKy:not(._8A5w5)');
    elements.forEach((button) => {
      if (button.innerText === 'Follow') {
        button.click();
        numberOfPeopleFollowed += 1;
      }
    });
    log(`followed ${numberOfPeopleFollowed} people`);
  });
  await page.waitFor(2000);
  await page.keyboard.press('Escape');
}

module.exports = async function findAndFollowAllFlaggedAccountFollowers(browserInfo) {
  for (let i = 0; i < flaggedAccounts.length - 1; i += 1) {
    await findUserPage(browserInfo, flaggedAccounts[i]); // eslint-disable-line no-await-in-loop
    await followAllAccountFollowers(browserInfo); // eslint-disable-line no-await-in-loop
  }
  browserInfo.page.click('[href="/"]');
};
