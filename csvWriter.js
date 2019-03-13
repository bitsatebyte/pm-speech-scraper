const fs = require('fs');
const csv = require('fast-csv');
const tag = require('./extractedTags');
const ws = fs.createWriteStream('tags.csv');
const a = () => {
    const ttArray = []
    const startTime = new Date().getTime();
    for(let i=0;i<tag.length;i++) {
        const tntArray = [];
        console.log(i);
        tntArray.push(tag[i].title);
        tntArray.push(tag[i].tags);
        tntArray.push(tag[i].id);
        tntArray.push(i+1);
        ttArray.push(tntArray);
    };
    const endTime = new Date().getTime();
    const timeTaken = (endTime-startTime)/1000;
    console.log(`Time taken = ${timeTaken} seconds`);
return ttArray;
}
const b = a();

csv.write(b, {headers:true})
    .pipe(ws);
