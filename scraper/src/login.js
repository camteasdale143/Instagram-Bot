const typeElement = require('./typeElement');

function getAsterisks(password) {
  var asterisks = '';
  for (var i = 0; i < password.length; i++) {
    asterisks = asterisks + '*'
  }
  return asterisks
}

module.exports = async function enterCredentials({page, frame}, {username, password}) {
  try{
    console.log(`typing username - ${username}`);
    await typeElement({page, frame}, '[name=username]', username)
    console.log(`typing password - ${getAsterisks(password)}`);
    await typeElement({page, frame}, '[name=password]',password )
    console.log('logging in');
    const logInButtonHandler = await page.$x('//button[contains(text(), "Log in")]');
    await logInButtonHandler[0].click();
    await page.waitForNavigation({timeout: 10000});
    if (await frame.$(`#slfErrorAlert`)){
       throw 'incorrect login credentials'
    }
  }
  catch(err) {
    return false
  }

  await page.keyboard.press('Escape');
  if (await frame.$('[role=dialog]')) {
    const stopNotifications = await page.$x('//button[contains(text(), "Not Now")]');
    await stopNotifications[0].click();
  }

  return true
}
