const fs = require('fs');
const puppeteer = require('puppeteer');
const uris = require('./uris');


// Extracts speech and date
const extractSpeechAndDate = () => {
    const speechDate = document.querySelector('.captionDate').innerText;
    const speech = document.getElementsByClassName('main_article_content')[0].innerText;
    const speechObj = {
        date: speechDate,
        speech,
    }
    return speechObj;
};

// scraper scrapes from each url and loads the next url to scrape
async function scraper(page, extractSpeechAndDate){
    let items = [];
    const a = new Date().getTime();
    /* uris.forEach((z, index) => {
        await page.goto(`${z}`, {"waitUntil" : "load"});
        console.log(index);
        try {
            const actSpeech = await page.evaluate(extractSpeechAndDate);
            items.push(actSpeech);
        } catch (error) {
            console.log(error);
        };
    }); */

    for (let i = 0; i < uris.length; i++) {
        const url = uris[i];
        console.log(i); 
        await page.goto(`${url}`, {"waitUntil" : "load"});
        try {
            const actSpeech = await page.evaluate(extractSpeechAndDate);
            items.push(actSpeech);
        } catch(e) { console.log(e) };
    }
    const b = new Date().getTime();
    const timeTaken = (b-a)/1000;
    console.log(timeTaken)
    return items;
};

// Puppeteer instance

(async () => {
    // Set up browser and page.
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });


  // Scroll and extract items from the page.
  const items3 = await scraper(page, extractSpeechAndDate);
    // Write the speech to a file
    const speech = fs.createWriteStream('speech.js');
    speech.on('error', (err) =>  console.log(err));
    speech.write(`const speeches = [`+'\n');
    items3.forEach((v) =>  speech.write(`${JSON.stringify(v)}, `+'\n'));
    speech.write(`]`);
    speech.end();

    // Close the browser
    await browser.close();
})();