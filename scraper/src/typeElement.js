const rng = require('./rng');

module.exports = async function typeElement({ page, frame }, selector, text) {
  await frame.click(selector);
  await frame.click(selector);
  await page.evaluate((selector) => {
    document.querySelector(selector).value = '';
  }, selector);

  await page.keyboard.type(text, { delay: rng(70) + 10 });
};
