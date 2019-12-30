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
      const jsonLDs = $(`script[type="application/ld+json"]`);

      if(jsonLDs.length > 0) {
        const dir = outputPath.replace('index.html', '');

        fs.ensureDir(dir, async err => {
          if (err) {
            console.error(`Could not create dir ${dir}.`);
          } else {
            let nquads = '';

            for (let i = 0; i < jsonLDs.length; i  ++) {
              let $jsonLD = $(jsonLDs[i]);

              try {
                $jsonLD = JSON.parse($jsonLD.html());
                nquads += '\n' + await jsonld.toRDF($jsonLD, {format: 'application/n-quads'});
              } catch (e) {
                console.error(`Invalid JSON-LD at ${outputPath}`);
              }
            }

            if (nquads !== '') {
              // NQuads file
              const nquadsPath = outputPath.replace('index.html', 'index.nq');
              fs.writeFile(nquadsPath, nquads, 'utf-8', err => {
                if (err) {
                  console.log(__dirname);
                  console.error(`Error when writing ${nquadsPath}`);
                  console.error(err);
                }
              });

              // JSON-LD file
              const jsonLDPath = outputPath.replace('index.html', 'index.jsonld');

              fs.writeFile(jsonLDPath, JSON.stringify(await jsonld.fromRDF(nquads, {format: 'application/n-quads'})), 'utf-8', err => {
                if (err) {
                  console.log(__dirname);
                  console.error(`Error when writing ${jsonLDPath}`);
                  console.error(err);
                }
              });
            }
          }
        });
      }
    }

    return content;
  });

  return {
    dir: {
      input: "..",
      output: "../_site"
    }
  };
};