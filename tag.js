const fs = require('fs');
const puppeteer = require('puppeteer');
const uris = require('./uris');
// Extracts tags 
const tagExtractor = () => {
    const tagSelector = Array(document.getElementsByClassName('tg'));
    const titleExtractor = document.getElementById('article_title').innerText;
    const z = [];
    for(let i = 0; i<tagSelector[0].length;i++){
        z.push(tagSelector[0][i].innerText)
    }
    const titleAndTag = {
        title: titleExtractor,
        tags: z,
    }
    return titleAndTag;
};

// Goes to each url and scrapes
async function eachScraper (page, tagExtractor){
    let items = [];
    const startTime = new Date().getTime();
    for (let i = 0; i < uris.length; i++) {
        const url = uris[i];
        console.log(i); 
        await page.goto(`${url}`, {"waitUntil" : "load"});
        try {
            const finalObj = await page.evaluate(tagExtractor);
            finalObj.id = url;
            items.push(finalObj);
        } catch(e) { console.log(e) };
    }
    const endTime = new Date().getTime();
    const timeTaken = (endTime-startTime)/1000;
    console.log(`Time taken = ${timeTaken} seconds`);
    return items;
};

(async () => {
    // Set up browser and page.
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Scroll and extract items from the page.
  const items3 = await eachScraper(page, tagExtractor);
    // Write the speech to a file
    const tags = fs.createWriteStream('extractedTags.js');
    tags.on('error', (err) =>  console.log(err));
    tags.write(`const tagged = [`+'\n');
    items3.forEach((v) =>  tags.write(`${JSON.stringify(v)}, `+'\n'));
    tags.write(`]`);
    tags.end();

    // Close the browser
    await browser.close();
})();
// Time taken = 2593.274 seconds or 43.2 minutes (SERIALLY)

