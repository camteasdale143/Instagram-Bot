const flaggedAccounts = require('../clientList');
const followIndividual = require('./followIndividual');
const findUserPage = require('./findUserPage');
const determineIfBot = require('./determineIfBot');

module.exports = async function followAllFlaggedAccountFollowers(browserInfo) {
  let followCount = 0;
  for (let x = 0; x < flaggedAccounts.length - 1; x += 1) {
    const listOfFollowers = await require(`../followerLists/${flaggedAccounts[x]}.js`);
    for (let y = 0; y < listOfFollowers.length - 1; y += 1) {
      try {
        await findUserPage(browserInfo, listOfFollowers[y]);
        const pageInfo = await determineIfBot(browserInfo, listOfFollowers[y]);
        console.log(pageInfo);
        if (pageInfo.isBot === false && pageInfo.isBusiness === false) {
          await followIndividual(browserInfo, listOfFollowers[y]);
          followCount += 1;
        }
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
