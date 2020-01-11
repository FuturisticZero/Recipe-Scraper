var express = require('express');
var router = express.Router();
const https = require('https');
const cheerio = require('cheerio');

/* GET home page. */
router.get('/:url', function (req, res, next) {
  https.get(req.params.url, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    console.log(contentType)
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      //this is a json data scrape
      console.log('this is json data')
    }else if(!/^text\/html/.test(contentType)){
      console.log('this is html data')
    }

    res.setEncoding('utf8');
    let rawData = {};
    res.on('data', (chunk) => { rawData += [chunk];});
    res.on('end', () => {
      try {
        //const parsedData = JSON.parse(rawData);
        const $ = cheerio.load(rawData);
        console.log();
        scraperData=JSON.parse($('script[type="application/ld+json"]').html());
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
  res.render('scraper', { title: 'Page Scraper', url: `${req.params.url}`, pagedata: JSON.stringify(scraperData,undefined,2) });
  console.log('page render done')
});

module.exports = router;
