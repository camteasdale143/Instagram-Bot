const findAllFlaggedAccountFollowers = require('./src/findAndFollowAllFlaggedAccountFollowers');
const followAllFlaggedAccountFollowers = require('./src/followAllFlaggedAccountFollowers');
const followBackAllFollowers = require('./src/followBackAllFollowers');
const followIndividual = require('./src/followIndividual');
const determineIfBot = require('./src/determineIfBot');
const findUserPage = require('./src/findUserPage');
const likeFeed = require('./src/likeFeed');
const loginInfo = require('./loginInfo');
const launch = require('./src/launch');
const login = require('./src/login');
const log = require('./src/log');

let browserInfo = {};
let loggedIn = true;

async function headless() {
  browserInfo = await launch();
  browserInfo.frame = browserInfo.page.mainFrame();
  if (browserInfo.needToLogin) {
    loggedIn = await login(browserInfo, loginInfo);
  }
  if (loggedIn) {
    // THINGS TO DO WHEN LOGGED IN
    // - follow new followers back
    await browserInfo.page.keyboard.press('Escape');

    // await followBackAllFollowers(browserInfo.page);
    await likeFeed(browserInfo);

    // await findAllFlaggedAccountFollowers(browserInfo);
    // await followAllFlaggedAccountFollowers(browserInfo);

    // await findUserPage(browserInfo, 'beyonce');
    // await followIndividual(browserInfo, 'beyonce');

    // log(await determineIfBot(browserInfo, 'beyonce'));
  } else {
    log('failed to login, closing program for credential revision');
    await browserInfo.browser.close();
  }
}

headless();
