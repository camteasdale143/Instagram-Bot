const fs = require('fs');

const loginInfo = require('./loginInfo');
const flaggedAccounts = require('./clientList');
const launch = require('./src/launch');
const login = require('./src/login');
const findUserPage = require('./src/findUserPage');
const typeElement = require('./src/typeElement');
var Writable = require('stream').Writable;


const readline = require('readline');
var followsRemaining = 50
var browserInfo = {};
var loggedIn = true;


async function headless() {
  browserInfo = await launch();
  browserInfo.frame = browserInfo.page.mainFrame();
  if (browserInfo.needToLogin) {
    loggedIn = await login(browserInfo, loginInfo)
  }
  if (loggedIn){
    // THINGS TO DO WHEN LOGGED IN
    // - follow new followers back
    // await followBackAllFollowers(browserInfo.page)
    // - analyse and follow accounts of other businesses
    // - check comments and send to nlp to understand their priority in responding
    // - try to respond to some comments
    // - like some of things on feed
    // - if one account is really liked, super like and like the accounts last 3 posts
    // await followAllFlaggedAccountFollowers();
    await followIndividual('beyonce')
  }
  else {
    console.log('failed to login, closing program for credential revision')
    await browserInfo.browser.close();
  }
}

async function followAllFlaggedAccountFollowers() {
  for (var i = 0; i < flaggedAccounts.length - 1; i++) {
    await findAccountAndFollowAllFollowers(i)
  }
  browserInfo.page.click('[href="/"]')
}

async function findAccountAndFollowAllFollowers(i) {
  await findUserPage(browserInfo, flaggedAccounts[i]);
  await followNewUsers(browserInfo);
}

async function closeBrowser() {
  await browserInfo.browser.close();
}

async function followBackAllFollowers(page){
  page.click('[href="/accounts/activity/"]')
  await page.waitFor(2000)
  await page.evaluate(() => {
    var numberOfPeopleFollowed = 0;
    const elements = document.querySelectorAll('button.L3NKy');
    elements.forEach(button => {
      if (button.innerText === 'Follow'){
        button.click();
        numberOfPeopleFollowed += 1;
      }
    });
    console.log(`followed back ${numberOfPeopleFollowed} people`)
  });
}


async function followNewUsers({page, frame}) {
  console.log('clicking the followers button');
  await frame.click('a.-nal3 :first-child');
  await page.waitFor(2000);

  await page.evaluate(() => {
    var numberOfPeopleFollowed = 0;
    const elements = document.querySelectorAll('button.L3NKy:not(._8A5w5)');
    elements.forEach(button => {
      if (button.innerText === 'Follow'){
        button.click();
        numberOfPeopleFollowed += 1;
      }
    });
    console.log(`followed ${numberOfPeopleFollowed} people`)
  })
  await page.waitFor(2000);
  await page.keyboard.press('Escape');
}

async function followIndividual(name) {
  findUserPage(browserInfo, name);
  browserInfo.page.waitFor(2000);
  browserInfo.page.evaluate(() => {
    console.log(document.querySelector('button'))
    if (document.querySelector('button.yZn4P')) {
      document.querySelector('button.yZn4P').click();
    }
    else {
      console.log('something went wrong')
    }
  })
}


async function sc(page) {
  try{
    await fs.writeFile('sc.png', await page.screenshot());
  } catch(err) {
    throw(err)
  }
}

headless();
