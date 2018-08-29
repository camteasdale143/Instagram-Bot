const typeElement = require('./typeElement');
const log = require('./log');

function getAsterisks(password) {
  let asterisks = '';
  for (let i = 0; i < password.length; i += 1) {
    asterisks += '*';
  }
  return asterisks;
}

module.exports = async function enterCredentials({ page, frame }, { username, password }) {
  try {
    log(`typing username - ${username}`);
    await typeElement({ page, frame }, '[name=username]', username);
    log(`typing password - ${getAsterisks(password)}`);
    await typeElement({ page, frame }, '[name=password]', password);
    log('logging in');
    const logInButtonHandler = await page.$x('//button[contains(text(), "Log in")]');
    await logInButtonHandler[0].click();
    await page.waitForNavigation({ timeout: 10000 });
    if (await frame.$('#slfErrorAlert')) {
      throw new Error('incorrect login credentials');
    }
  } catch (err) {
    return false;
  }

  await page.keyboard.press('Escape');
  if (await frame.$('[role=dialog]')) {
    const stopNotifications = await page.$x('//button[contains(text(), "Not Now")]');
    if (stopNotifications[0]) {
      await stopNotifications[0].click();
    }
  }

  return true;
};
