module.exports = async function closeBrowser(browserInfo) {
  await browserInfo.browser.close();
};
