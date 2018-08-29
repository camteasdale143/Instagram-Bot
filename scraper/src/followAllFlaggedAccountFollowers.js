const flaggedAccounts = require('../clientList');
const followIndividual = require('./followIndividual');
const findUserPage = require('./findUserPage');
const determineIfBot = require('./determineIfBot');
const newTabToUserpage = require('./newTabToUserpage');

module.exports = async function followAllFlaggedAccountFollowers(browserInfo) {
  let followCount = 0;
  for (let x = 0; x < flaggedAccounts.length - 1; x += 1) {
    const listOfFollowers = await require(`../followerLists/${flaggedAccounts[x]}.js`);
    for (let y = 58; y < listOfFollowers.length - 1; y += 1) {
      console.log(`looking at follower ${y} of the account ${flaggedAccounts[x]}`);
      try {
        const userPage = await newTabToUserpage(browserInfo, listOfFollowers[y]);
        const userInfo = await determineIfBot(userPage, listOfFollowers[y]);
        console.log(userInfo);
        if (userInfo.isBot === false && userInfo.isBusiness === false) {
          await followIndividual(userPage, listOfFollowers[y]);
          followCount += 1;
        }
        await userPage.page.close();
        if (followCount >= 25) {
          break;
        }
      } catch (err) {
        throw new Error(err);
      }
    }
    if (followCount >= 25) {
      break;
    }
  }
};
