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
    <meta name="viewport" content="width=500, user-scalable=0" />
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

// <meta name=”viewport”> does not disable text scaling and zooming
function checkMetaViewportTextResize() {
  const meta = document.querySelectorAll('meta[name="viewport"]');
  console.log('meta tag' , meta);
  
  // check if each el has the attribute name with the value "viewport"
  meta.forEach((el, i) => {
    const name = el.getAttribute('name');
    console.log('name', name);

    // extract content string using get attribute
    const content = el.getAttribute('content');
    console.log('content', content, typeof content);

    // get attr of maximum-scale, any value less than 3 fails accessibility
    let maxScale;
    if (content.includes('maximum-scale')) {
      const i = content.indexOf('maximum');
      maxScale = content.slice(i, i+16).trimEnd();
      maxScale = Number(maxScale.split('=')[1].trim());
    }

    // controls whether zoom in or zoom out is allowed on page; value 0 or no is NOT accessible
    let userScale;
    if (content.includes('user-scalable')) {
      const i = content.indexOf('user-');
      userScale = content.slice(i, i+17).trimEnd();
      userScale = userScale.split('=')[1].trim();
    }

    if (name === 'viewport') {
      // make sure that text zooming/scaling has not been disabled
      if (maxScale < 3 || userScale === 'no' || userScale === '0') {
        console.log(`Meta with attribute name="viewport" ${i + 1} should not disable text resizing`);
      }
    };
  });
}

// checkMetaViewportTextResize();