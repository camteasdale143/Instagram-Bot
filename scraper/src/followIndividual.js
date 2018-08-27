const findUserPage = require('./findUserPage');

module.exports = async function followIndividual(browserInfo, name) {
  await findUserPage(browserInfo, name);
  await browserInfo.page.waitFor(2000); // bad form
  await browserInfo.page.evaluate(() => {
    const targetedButtons = document
      .querySelector('header')
      .querySelector('section')
      .querySelectorAll('button');

    targetedButtons.forEach((button) => {
      if (button.innerText === 'Follow') {
        button.click();
      }
    });
  });
};
