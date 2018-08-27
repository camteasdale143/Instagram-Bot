// const log = require('./log');

module.exports = async function followBackAllFollowers(page) {
  await page.evaluate(() => document.querySelector('[href="/accounts/activity/"]').click());
  await page.waitFor(2000);
  await page.waitFor(
    () => document
      .querySelector('[href="/accounts/activity/"]')
      .parentNode.querySelector('[role=dialog]')
      .parentNode.querySelectorAll('[role=button]').length,
  );
  await page.evaluate(() => {
    let numberOfPeopleFollowed = 0;
    const targetedNodes = document
      .querySelector('[href="/accounts/activity/"]')
      .parentNode.querySelector('[role=dialog]')
      .parentNode.querySelectorAll('[role=button]');

    targetedNodes.forEach((el, index) => {
      if (!targetedNodes[index].querySelector('button')) {
        return;
      }
      const btnText = targetedNodes[index].querySelector('button').innerText;
      if (btnText && btnText === 'Follow') {
        targetedNodes[index].querySelector('button').click();
        numberOfPeopleFollowed += 1;
      }
    });
    console.log(`followed back ${numberOfPeopleFollowed} people`);
  });
};
