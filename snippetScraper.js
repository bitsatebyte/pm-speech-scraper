const fs = require('fs');
const puppeteer = require('puppeteer');

const snippetScraper = () => {
    const getSnippet = Array(document.getElementsByClassName('speechesItem'));
    const snippets = [];
    for(let i=0;i<getSnippet[0].length;i++){
        snippets.push(getSnippet[0][i].innerText);
    };
    return snippets;
};

async function scrapeInfiniteScrollItems(
    page,
    snippetScraper,
    itemTargetCount,
    scrollDelay = 500,
  ) {
    let items = [];
    try {
      let previousHeight;
      while (items.length < itemTargetCount) {
        items = await page.evaluate(snippetScraper);
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
  
    // Navigate to the demo page.
    await page.goto('https://www.narendramodi.in/category/text-speeches');
  
    // Scroll and extract items from the page.
    const items = await scrapeInfiniteScrollItems(page, snippetScraper, 350);
  
    // Save extracted items to a file.
    const file = fs.createWriteStream('snippets.js');
    file.on('error', (err) =>  console.log(err));
    file.write(`module.exports = [`)
    items.forEach((v) =>  file.write(`'${v}', `+'\n'));
    file.write(`]`);
    file.end();
  
    // Close the browser.
    await browser.close();
  })();