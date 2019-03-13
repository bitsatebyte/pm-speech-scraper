const fs = require('fs');
const puppeteer = require('puppeteer');

// Extracts links
function extractItems() {
  const extractedElements = document.querySelectorAll('.speechesItemLink.left_class .left_class');
  const items = [];
  for (let element of extractedElements) {
    items.push(element.href);
  }
  return items;
}
// Infinite scroll to get dynamically loaded content 
async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 3000,
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch(e) { }
  return items;
}

(async () => {
  // Set up browser and page.
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to the speech page
  await page.goto('https://www.narendramodi.in/category/text-speeches');

  // Scroll and extract items from the page.
  const items = await scrapeInfiniteScrollItems(page, extractItems, 600);

  // Save extracted items to a file.
    const file = fs.createWriteStream('uris.js');
    file.on('error', (err) =>  console.log(err));
    items.forEach((v) =>  file.write(`'${v}', `+'\n'));
    file.end();

  // Close the browser.
  await browser.close();
})();