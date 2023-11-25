const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = require('jsdom');

const htmlCode = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Sample Title</title>
    <meta http-equiv="refresh" content="0; URL=https://planet-express.example.com">
  </head>
  <body>
  <img src='someurlhere.com' alt='a cute photo' />
    <header aria-hidden="true">This is the header!</header>
    <div class="link container">
      <a href="https://www.example.com">Click me</a>
      <a aria-label="tag-2" href="https://www.example.com">Click me</a>
      <a aria-label="Click me" href="https://www.example.com">Click me</a>
    </div>
    <div id="duplicate">Something</div>
    <input id="duplicate" type="button">
    <div>GorbleGorble</div>
    <button name='button' text ="Hello There"></button>
  </body>
</html>
`;

const { window } = new JSDOM(htmlCode);
const document = window.document;
const ludwig = document.body;

// default message with specific aria-fail found and link to docs
const defaultMsg = {};

// <meta http-equiv=”refresh”> is not used for delayed refresh
function checkMetaHttpRefresh() {
  const meta = document.querySelectorAll('meta');
  console.log(meta);
  
  // check if each el has alt text
  meta.forEach((el, i) => {
    const httpEquiv = el.getAttribute('http-equiv');
    console.log('http-equiv', httpEquiv);

    // each content attr must have a value that has a number that is 0
    const content = el.getAttribute('content');
    console.log('content', content);

    if (httpEquiv === 'refresh') {
      // if content does not exist, does not begin with the number 0 or is not followed by "URL="
      if (!content || content[0] !== '0' || !content.includes('URL=')) {
        console.log(`Http-equiv ${i + 1} does not have the correct content`);
      }
    };

  });

}

// checkMetaHttpRefresh();