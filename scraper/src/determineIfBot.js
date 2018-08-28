const axios = require('axios');
const findUserPage = require('./findUserPage');

module.exports = async function determineIfBot({ page, frame }, pageName) {
  await page.waitForSelector('header > section > div > h1');
  accountInfo = await parsePageInformation(page, pageName);
  let nameData = await axios({
    method: 'get',
    url: `http://www.behindthename.com/api/lookup.json?name=%20${
      accountInfo.firstName
    }&key=ca964262848`,
  });
  nameData = nameData.data;

  let isBot = 4; // scale of 1 - 10, 0 is a human, 10 is a bot
  let isBusiness = 4;

  accountInfo.posts === 0 ? isBot + 2 : null;
  accountInfo.followers / accountInfo.following < 0.65 ? (isBusiness += 2) : null;
  accountInfo.followers / accountInfo.following < 0.3 ? (isBot += 2) : null;
  nameData.error_code === 50 ? (isBusiness += 2) : null;
  accountInfo.verified ? (isBot = 0) : null;
  accountInfo.isPrivate ? (isBot = 0) : null;

  return {
    isBot: isBot > 5,
    isBusiness: isBusiness > 5,
  };
};

async function parsePageInformation(page, pageName) {
  return page.evaluate((pageName) => {
    const accountInfo = {
      posts: null,
      followers: null,
      following: null,
      pageName,
    };

    let isPrivate = document.querySelector('main').querySelector('h2');
    isPrivate
      ? isPrivate.innerText === 'This Account is Private'
        ? (isPrivate = true)
        : (isPrivate = false)
      : (isPrivate = false);

    const accountInfoList = document
      .querySelector(`h1[title="${pageName}"]`)
      .parentNode.parentNode.querySelector('ul')
      .querySelectorAll('li');
    posts = accountInfoList[0].querySelector('span > span');
    posts ? (posts = posts.innerText) : null;

    isPrivate
      ? (followers = accountInfoList[1].querySelector('span > span'))
      : (followers = accountInfoList[1].querySelector('a > span'));
    followers ? (followers = followers.innerText) : null;

    isPrivate
      ? (following = accountInfoList[2].querySelector('span > span'))
      : (following = accountInfoList[2].querySelector('a > span'));
    following ? (following = following.innerText) : null;

    let verified = document.querySelector('[title="Verified"]');
    verified ? (verified = true) : (verified = false);

    const fullName = document.querySelector('section').querySelectorAll('h1');
    const splitName = fullName[1].innerText.split(' ');
    const firstName = splitName[0];
    return {
      posts,
      followers,
      following,
      pageName,
      verified,
      isPrivate,
      firstName,
    };
  }, pageName);
}
