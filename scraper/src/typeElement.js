const rng = require('./rng');

module.exports = async function typeElement({page, frame}, selector, text) {
  await frame.click(selector),
  await page.keyboard.type(text, {delay: rng(300) + 30});
}