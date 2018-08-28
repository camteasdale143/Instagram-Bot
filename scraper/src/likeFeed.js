module.exports = async function likeFeed({ page, frame }) {
  console.log('keydown');
  await page.click('[href="/"]');
  await page.waitForNavigation();
  for (let i = 0; i < 21; i += 1) {
    await page.keyboard.press('Space');
    await page.waitFor(500);
    if (i % 3 === 0) {
      await page.evaluate(() => {
        const posts = document.querySelectorAll('article');
        posts.forEach(async (post) => {
          const heartButton = post.querySelector('[aria-label="Like"]');
          await heartButton.click();
        });
      });
    }
    console.log(i);
  }

  console.log('done');
};
