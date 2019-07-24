const cheerio = require('cheerio');
const fs = require('fs-extra');
const jsonld = require('jsonld');

module.exports = function(eleventyConfig) {
  eleventyConfig.templateFormats = [
    "html",
    "md",
    "xml",
    "jpg",
    "png",
    "js",
    "liquid",
    "json",
    "ico", // for favicon
    "css", // css is not yet a valid template extension
    "svg" // for the flags
  ];
  eleventyConfig.passthroughFileCopy = true;

  // Generate JSON-LD and NQuads files when JSON-LD present in HTML file.
  eleventyConfig.addTransform("generateJSONLD", function(content, outputPath) {
    if( outputPath.endsWith("index.html") ) {
      const $ = cheerio.load(content);
      const jsonLD = $(`script[type="application/ld+json"]`).html();

      if(jsonLD) {
        const dir = outputPath.replace('index.html', '');

        fs.ensureDir(dir, async err => {
          if (err) {
            console.error(`Could not create dir ${dir}.`);
          } else {
            // JSON-LD file
            const jsonLDPath = outputPath.replace('index.html', 'index.jsonld');

            fs.writeFile(jsonLDPath, jsonLD, 'utf-8', err => {
              if (err) {
                console.log(__dirname);
                console.error(`Error when writing ${jsonLDPath}`);
                console.error(err);
              }
            });

            // NQuads file
            const nquadsPath = outputPath.replace('index.html', 'index.nq');
            const nquads = await jsonld.toRDF(JSON.parse(jsonLD), {format: 'application/n-quads'});

            fs.writeFile(nquadsPath, nquads, 'utf-8', err => {
              if (err) {
                console.log(__dirname);
                console.error(`Error when writing ${nquadsPath}`);
                console.error(err);
              }
            });
          }
        });
      }
    }

    return content;
  });
};