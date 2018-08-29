const axios = require('axios');

async function parsePageInformation(page, pageName) {
  return page.evaluate((pageName) => {
    function parseIsAccountPrivate() {
      let isPrivate;
      const isPrivateTag = document.querySelector('main').querySelector('h2');
      if (isPrivateTag) {
        if (isPrivateTag.innerText === 'This Account is Private') {
          isPrivate = true;
        } else {
          isPrivate = false;
        }
      } else {
        isPrivate = false;
      }
      return isPrivate;
    }

    function parseAccountInfo(accountInfoSection, isPrivate, accountInfoEnum) {
      let firstSelector = isPrivate ? 'span' : 'a';
      if (accountInfoEnum === 0) {
        firstSelector = 'span';
      }
      const data = accountInfoSection[accountInfoEnum].querySelector(`${firstSelector} > span`);
      if (data) {
        return data.innerText;
      }
      return null;
    }

    function parseAccountInfoSection(pageName) {
      return document
        .querySelector(`h1[title="${pageName}"]`)
        .parentNode.parentNode.querySelector('ul')
        .querySelectorAll('li');
    }

    function parseIsVerified() {
      const verifiedElement = document.querySelector('[title="Verified"]');
      if (verifiedElement) {
        return true;
      }
      return false;
    }

    function parseFirstName() {
      const fullName = document.querySelector('section').querySelectorAll('h1');
      if (fullName.length > 1 && fullName[1].innerText) {
        const splitName = fullName[1].innerText.split(' ');
        return splitName[0];
      }
      return null;
    }

    const accountInfoTitle = {
      posts: 0,
      followers: 1,
      following: 2,
    };
    const isPrivate = parseIsAccountPrivate();
    const accountInfoSection = parseAccountInfoSection(pageName);
    const posts = parseAccountInfo(accountInfoSection, isPrivate, accountInfoTitle.posts);
    const followers = parseAccountInfo(accountInfoSection, isPrivate, accountInfoTitle.followers);
    const following = parseAccountInfo(accountInfoSection, isPrivate, accountInfoTitle.following);
    const isVerified = parseIsVerified();
    const firstName = parseFirstName();

    return {
      isPrivate,
      posts,
      followers,
      following,
      pageName,
      isVerified,
      firstName,
    };
  }, pageName);
}

function removeUnrecognizedCharCodes(name) {
  return name
    .split('')
    .filter(char => char.charCodeAt() < 176)
    .join('');
}

async function fetchNameData(name) {
  const nameData = await axios({
    method: 'get',
    url: `http://www.behindthename.com/api/lookup.json?name=%20${name}&key=ca964262848`,
  });
  return nameData.data;
}
module.exports = async function determineIfBot({ page }, pageName) {
  await page.waitForSelector('header > section > div > h1');
  await page.waitFor(1000);
  const pageInfo = await parsePageInformation(page, pageName);
  const {
    isPrivate, posts, followers, following, isVerified,
  } = pageInfo;
  let { firstName } = pageInfo;

  if (firstName) {
    firstName = removeUnrecognizedCharCodes(firstName);
  }
  const nameData = await fetchNameData(firstName);
  let isBot = 4;
  let isBusiness = 4;

  if (posts === 0) {
    isBot += 2;
  }
  if (followers / following < 0.5) {
    isBusiness += 2;
  }
  if (followers / following < 0.3) {
    isBot += 2;
  }
  if (nameData.error_code === 50) {
    isBusiness += 2;
  }
  if (isVerified) {
    isBot = 0;
  }
  if (isPrivate) {
    isBot = 0;
    isBusiness = 0;
  }

  return {
    isBot: isBot > 5,
    isBusiness: isBusiness > 5,
  };
};
