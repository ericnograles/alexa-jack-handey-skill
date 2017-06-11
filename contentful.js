const Promise = require('bluebird');
const request = require('request');

module.exports = {
  deepThoughts
};

function deepThoughts() {
  return new Promise(
    (resolve, reject) => {
      let url = `${process.env.CONTENTFUL_BASE_URL}/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries?access_token=${process.env.CONTENTFUL_CDN_TOKEN}&content_type=deepThought&select=fields.quote,fields.category&limit=1000`;
      console.log(`Accessing Contentful using ${url}`);
      request.get({url: url}, (error, httpResponse, body) => {
        console.log(error);
        console.log(httpResponse);
        console.log(body);
        if (error || httpResponse.statusCode !== 200) {
          return reject(error);
        }
        let deepThoughts = {};
        let entries = JSON.parse(body).items;
        console.log(`Entries ${JSON.stringify(entries)}`);
        entries.forEach(entry => {
          if (!deepThoughts[entry.fields.category]) {
            deepThoughts[entry.fields.category] = []
          };

          deepThoughts[entry.fields.category].push(entry.fields.quote);
        });
        console.log(JSON.stringify(deepThoughts));
        return resolve(deepThoughts);
      });
    }
  );
}