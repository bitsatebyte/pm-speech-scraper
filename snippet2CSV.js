const fs = require('fs');
const csv = require('fast-csv');
const snippet = require('./snippets');
const ws = fs.createWriteStream('snippets.csv');
const a = () => {
    const ttArray = []
    const startTime = new Date().getTime();
    for(let i=0;i<snippet.length;i++) {
        const tntArray = [];
        console.log(i);
        tntArray.push(snippet[i])
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
