const findAndFollowAllFlaggedAccountFollowers = require('./src/findAndFollowAllFlaggedAccountFollowers');
const followBackAllFollowers = require('./src/followBackAllFollowers');
const followIndividual = require('./src/followIndividual');
const determineIfBot = require('./src/determineIfBot');
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
    // - intercept outgoing json requests to analyse data for account names...
    // - detect spam accounts and don't follow them
    // - analyse and follow accounts of other businesses
    // - check comments and send to nlp to understand their priority in responding
    // - try to respond to some comments
    // - like some of things on feed
    // - if one account is really liked, super like and like the accounts last 3 posts
    // await followBackAllFollowers(browserInfo.page);
    //  await findAndFollowAllFlaggedAccountFollowers(browserInfo);
    // await followIndividual(browserInfo, 'beyonce');
    // await likeFeed(browserInfo);
    await determineIfBot();
  } else {
    log('failed to login, closing program for credential revision');
    await browserInfo.browser.close();
  }
}

headless();
