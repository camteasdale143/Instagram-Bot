const fs = require('fs');
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

  await page.click('div > ul > div > li');
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Space');
    await page.waitFor(1000);

    console.log(i);
  }

  const accountsToFollow = await page.evaluate(() => {
    const numberOfPeopleFollowed = 0;
    const accountsToFollow = [];
    const accountsInList = document
      .querySelector('[role="presentation"]')
      .querySelector('ul')
      .querySelectorAll('li');
    accountsInList.forEach((li) => {
      const button = li.querySelector('button');
      if (button && button.innerText === 'Follow') {
        if (li.querySelector('div > div > div > div > a')) accountsToFollow.push(` '${li.querySelector('div > div > div > div > a').innerText}'`);
      }
    });
    return accountsToFollow;
    console.log(`followed ${numberOfPeopleFollowed} people`);
  });
  await page.waitFor(1000);
  await page.keyboard.press('Escape');

  await fs.writeFile(
    `./followerLists/${pageName}.js`,
    `module.exports = [${accountsToFollow}]`,
    (err) => {
      if (err) {
        return console.log(err);
      }

      console.log('The file was saved!');
    },
  );
}

module.exports = async function findAndFollowAllFlaggedAccountFollowers(browserInfo) {
  for (let i = 0; i < flaggedAccounts.length - 1; i += 1) {
    await findUserPage(browserInfo, flaggedAccounts[i]); // eslint-disable-line no-await-in-loop
    await followAllAccountFollowers(browserInfo, flaggedAccounts[i]); // eslint-disable-line
  }
  browserInfo.page.click('[href="/"]');
};
