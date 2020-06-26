// Referred from https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically
const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const log = require('lighthouse-logger');

(async () => {
  log.setLevel('info');
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
  };
  const runnerResult = await lighthouse(
    'https://findingfalcone-dushyg.surge.sh/',
    options
  );

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  fs.writeFileSync('dist/findingFalcone/browser/lhreport.html', reportHtml);

  // `.lhr` is the Lighthouse Result as a JS object
  console.log('Report is done for', runnerResult.lhr.finalUrl);
  const perfScore = runnerResult.lhr.categories.performance.score * 100;
  console.log('Performance score was', perfScore);

  await chrome.kill().then(() => {
    if (perfScore < 70) {
      const message =
        'Need a Lighthouse score > 70 for build to succeed. Current score ' +
        perfScore +
        ' build failed!';
      process.exit(1);
    } else {
      return 'Build Suceeded!';
    }
  });
})();
