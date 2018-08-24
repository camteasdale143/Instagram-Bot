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
    await clickButton({page, frame}, 'button')
    await page.waitForNavigation({timeout: 10000});
    if (await frame.$(`#slfErrorAlert`)){
       throw 'incorrect login credentials'
    }
  }
  catch(err) {
    return false
  }



  await page.keyboard.press('Escape');
  return true
}

async function clickButton({page, frame}, selector) {
  await frame.click(selector);
}
