const fs = require('fs');
const url = 'https://www.instagram.com/accounts/login/?hl=en';
const loginInfo = require('./loginInfo');
const flaggedAccounts = require('./clientList');
const launch = require('./src/launch');
const login = require('./src/login');
const findUser = require('./src/findUser');
const typeElement = require('./src/typeElement');
var Writable = require('stream').Writable;



const readline = require('readline');



var followsRemaining = 50
var browserInfo = {};

async function headless() {

  browserInfo = await launch(url);
  browserInfo.frame = browserInfo.page.mainFrame();
  if (await login(browserInfo, loginInfo) ){
    fs.writeFile('sc.png', await sc(browserInfo.page))

    for (var i = 0; i < flaggedAccounts.length - 1; i++) {
      await findUser(browserInfo, flaggedAccounts[i]);
      await followNewUsers(browserInfo);
    }

    await browserInfo.browser.close();
    console.log('done')
  }
  else {
    console.log('failed to login, closing program for credential revision')
    await browserInfo.browser.close();
  }


}



async function AskForloginCredentials(fieldName) {
  return new Promise((resolve, reject) => {
    var mutableStdout = new Writable({
      write: function(chunk, encoding, callback) {
        if (!this.muted)
          process.stdout.write(chunk, encoding);
        callback();
      }
    });

    mutableStdout.muted = false;

    var rl = readline.createInterface({
      input: process.stdin,
      output: mutableStdout,
      terminal: true
    });

    rl.question('Password: ', function(password) {
      console.log('\nPassword is ' + password);
      rl.close();
    });
    mutableStdout.muted = true;


  })




}



async function followNewUsers({page, frame}) {
  console.log('clicking the followers button');
  await sc(page);
  await frame.click('a.-nal3 :first-child');
  await sc(page);
  await page.waitFor(2000);
  var unfollowedNum = await frame.$$eval('button.L3NKy:not(._8A5w5)', buttons => buttons.length);
  while (unfollowedNum > 1 || followsRemaining > 0) {
    for (var i = 1; i<unfollowedNum; i++) {
      if (await frame.$(`button.L3NKy:not(._8A5w5):first-child`)) {
        console.log(`clicking ${i} of ${unfollowedNum}`)
        await frame.click(`button.L3NKy:not(._8A5w5):first-child`);
        await page.waitFor(500);
        followsRemaining -= 1;
      }
      console.log(followsRemaining)
      await sc(page);
    }
    unfollowedNum = await frame.$$eval('button.L3NKy:not(._8A5w5)', buttons => buttons.length)

  }
  await page.keyboard.press('Escape');
}



async function sc(page) {
  try{
    await fs.writeFile('sc.png', await page.screenshot());
  } catch(err) {
    throw(err)
  }
}

headless();
