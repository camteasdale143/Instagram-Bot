const findUserPage = require('./findUserPage');

module.exports = async function followIndividual(browserInfo, name) {
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
  await browserInfo.page.waitFor(
    (pageName) => {
      let indicatedFollow = false;
      const buttons = document
        .querySelector(`h1[title="${pageName}"]`)
        .parentNode.querySelectorAll('button');
      buttons.forEach((button) => {
        if ((button && button.innerText === 'Following') || button.innerText === 'Requested') {
          indicatedFollow = true;
        }
      });
      if (indicatedFollow) {
        return true;
      }
      return false;
    },
    {},
    name,
  );
};
